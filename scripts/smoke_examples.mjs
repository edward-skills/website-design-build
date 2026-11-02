// Browser regression for the existing examples; does not measure Skill uplift.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import { resolve, dirname, extname, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const options = Object.fromEntries(process.argv.slice(2).reduce((pairs, value, index, all) => {
  if (value.startsWith('--')) pairs.push([value.slice(2), all[index + 1]]);
  return pairs;
}, []));
assert(options.out, 'Use --out NEW_DIRECTORY; optional --playwright-module PATH_TO_INDEX_MJS.');
const out = resolve(options.out);
await mkdir(out, { recursive: false });
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png' };
async function serve(folder) {
  const server = createServer(async (request, response) => {
    try {
      let pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      if (pathname.endsWith('/')) pathname += 'index.html';
      const file = resolve(folder, `.${pathname}`);
      const inside = relative(folder, file);
      if (inside.startsWith('..') || inside.startsWith('/')) throw new Error('Outside fixture');
      const data = await readFile(file);
      response.writeHead(200, { 'Content-Type': `${mime[extname(file)] || 'application/octet-stream'}; charset=utf-8` });
      response.end(data);
    } catch { response.writeHead(404); response.end('Not found'); }
  });
  await new Promise((done, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', done); });
  return { server, origin: `http://127.0.0.1:${server.address().port}` };
}
const servers = [];
const checks = [];
const errors = [];
const outsideRequests = [];
const writes = [];
let browser;
let context;
let version;
async function check(id, action) {
  try { const evidence = await action(); checks.push({ id, status: 'pass', evidence: evidence ?? null }); }
  catch (error) { checks.push({ id, status: 'fail', evidence: error.message }); }
}
async function semantics(page) {
  return page.evaluate(() => {
    const named = element => element.getAttribute('aria-label')?.trim()
      || element.getAttribute('aria-labelledby')?.split(/\s+/).map(id => document.getElementById(id)?.textContent || '').join(' ').trim()
      || element.labels?.length && [...element.labels].some(label => label.textContent.trim());
    return {
      missingAlt: document.querySelectorAll('img:not([alt])').length,
      unnamedFields: [...document.querySelectorAll('input:not([type=hidden]):not([type=submit]):not([type=button]),select,textarea')].filter(element => !named(element)).map(element => element.id),
      main: document.querySelectorAll('main,[role=main]').length,
      heading: Boolean(document.querySelector('h1')),
      language: document.documentElement.lang,
    };
  });
}
try {
  const pw = options['playwright-module']
    ? await import(pathToFileURL(resolve(options['playwright-module'])).href)
    : await import('playwright');
  const gather = await serve(resolve(root, 'examples/gather/dist')); servers.push(gather.server);
  const evenform = await serve(resolve(root, 'examples/evenform/dist')); servers.push(evenform.server);
  browser = await pw.chromium.launch({ headless: true, ...(options.channel ? { channel: options.channel } : {}) });
  version = browser.version();
  context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true });
  const allowed = new Set([gather.origin, evenform.origin]);
  await context.route('**/*', route => {
    const request = route.request();
    if (!allowed.has(new URL(request.url()).origin)) { outsideRequests.push(request.url()); return route.abort(); }
    if (!['GET', 'HEAD'].includes(request.method())) writes.push({ method: request.method(), url: request.url() });
    return route.continue();
  });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  await check('saas-pricing-and-cross-page-context', async () => {
    await page.goto(`${gather.origin}/pricing/`);
    await page.locator('#seats').fill('5');
    assert.equal(await page.locator('#total').innerText(), '¥2,940');
    await page.locator('[data-billing=monthly]').click();
    assert.equal(await page.locator('#total').innerText(), '¥295');
    await page.locator('.estimate-continue').click();
    assert.match(await page.locator('#selected-plan-title').innerText(), /5.*月付/);
    assert.match(await page.locator('#selected-plan-note').innerText(), /295/);
    await page.locator('#edit-plan').click();
    await page.reload();
    assert.equal(await page.locator('#seats').inputValue(), '5');
    assert.equal(await page.locator('#total').innerText(), '¥295');
    return { annual5: 2940, monthly5: 295, returnAndRefresh: true };
  });
  await check('saas-invalid-seat-recovery', async () => {
    await page.goto(`${gather.origin}/pricing/?billing=monthly&seats=5`);
    await page.locator('#seats').fill('2');
    assert.equal(await page.locator('#total').innerText(), '—');
    assert.deepEqual(await page.locator('[data-plan=team]').evaluateAll(links => links.map(link => link.getAttribute('href'))), [null, null]);
    assert.equal(await page.locator('#seats').getAttribute('aria-invalid'), 'true');
    await page.locator('#seats').fill('4');
    assert.equal(await page.locator('#total').innerText(), '¥236');
    assert((await page.locator('[data-plan=team]').evaluateAll(links => links.map(link => link.getAttribute('href')))).every(href => href?.includes('seats=4')));
    return { invalid2ClearsQuote: true, valid4Monthly: 236 };
  });
  await check('sign-in-preview-and-keyboard-return', async () => {
    await page.goto(`${gather.origin}/login/`);
    await page.locator('#email').fill('preview@example.com');
    await page.locator('#login-form button').click();
    assert.match(await page.locator('#login-status').innerText(), /未发送登录链接/);
    await page.locator('[data-demo]').click();
    assert.equal(await page.locator('#demo').evaluate(element => element.open), true);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('[data-demo]').evaluate(element => element === document.activeElement), true);
    assert.deepEqual(writes, []);
    return { noAuthenticationWrite: true, escapeReturnsFocus: true };
  });
  await check('product-draft-save-refresh-and-download', async () => {
    await page.goto(evenform.origin);
    await page.locator('[data-product=arc]').click();
    await page.locator('#detail-choose').click();
    await page.locator('#space').selectOption('other');
    await page.locator('#note').fill('Hotel lobby / 灯序 — 12 tables');
    await page.locator('#planner-form button[type=submit]').click();
    await page.reload();
    assert.match(await page.locator('#planner-product').innerText(), /ARC/);
    assert.equal(await page.locator('#note').inputValue(), 'Hotel lobby / 灯序 — 12 tables');
    const pending = page.waitForEvent('download');
    await page.locator('#download-plan').click();
    const download = await pending;
    const saved = resolve(out, 'evenform-draft.txt');
    await download.saveAs(saved);
    const data = await readFile(saved, 'utf8');
    assert(data.includes('ARC') && data.includes('Hotel lobby / 灯序 — 12 tables') && data.includes('不是订单'));
    return { restored: true, downloadedUtf8: true, localDraftNotOrder: true };
  });
  const pages = [
    ['gather-home', gather.origin], ['gather-pricing', `${gather.origin}/pricing/`],
    ['gather-login', `${gather.origin}/login/`], ['evenform-home', evenform.origin],
  ];
  for (const [name, url] of pages) await check(`${name}-basic-semantics-and-mobile`, async () => {
    await page.goto(url);
    const actual = await semantics(page);
    assert.equal(actual.missingAlt, 0);
    assert.deepEqual(actual.unnamedFields, []);
    assert.equal(actual.main, 1);
    assert(actual.heading && actual.language);
    assert.equal(await page.getByRole('button', { name: '', exact: true }).count(), 0);
    await writeFile(resolve(out, `${name}-aria.txt`), await page.locator('body').ariaSnapshot());
    await page.setViewportSize({ width: 390, height: 844 });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Page overflow at390px');
    await page.screenshot({ path: resolve(out, `${name}-mobile.png`), fullPage: true });
    await page.setViewportSize({ width: 1440, height: 1000 });
    return actual;
  });
  await check('semantic-check-negative-control', async () => {
    await page.goto(gather.origin);
    await page.locator('img').first().evaluate(element => element.removeAttribute('alt'));
    assert.equal((await semantics(page)).missingAlt, 1);
    await page.reload();
    assert.equal((await semantics(page)).missingAlt, 0);
    return 'A deliberate DOM-only missing-alt mutation was detected and discarded.';
  });
  await check('no-outside-requests-writes-or-runtime-errors', async () => {
    assert.deepEqual(outsideRequests, []); assert.deepEqual(writes, []); assert.deepEqual(errors, []);
    return { outsideRequests, writes, pageErrors: errors };
  });
} catch (error) {
  checks.push({ id: 'browser-environment', status: 'blocked', evidence: error.message });
} finally {
  await context?.close(); await browser?.close();
  await Promise.all(servers.map(server => new Promise(done => server.close(done))));
}
async function inventory(folder) {
  const entries = await readdir(resolve(root, folder), { withFileTypes: true });
  const nested = await Promise.all(entries.map(entry => entry.isDirectory() ? inventory(`${folder}/${entry.name}`) : [`${folder}/${entry.name}`]));
  return nested.flat().sort();
}
const inputs = [...await inventory('examples/gather/dist'), ...await inventory('examples/evenform/dist')];
const hashes = Object.fromEntries(await Promise.all(inputs.map(async file => [file, createHash('sha256').update(await readFile(resolve(root, file))).digest('hex')])));
const report = {
  recordedAt: new Date().toISOString(), node: process.version, browser: version ?? null,
  checkerSha256: createHash('sha256').update(await readFile(fileURLToPath(import.meta.url))).digest('hex'),
  scope: 'Existing example browser regression only; not new model generation, native activation, security attack execution or Skill uplift.',
  sourceHashes: hashes, checks,
  untested: ['new agent production and old/new comparison', 'native activation', 'injected-source agent execution', 'screen readers', 'full WCAG conformance', 'automatic contrast measurement'],
};
await writeFile(resolve(out, 'results.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ pass: checks.filter(x => x.status === 'pass').length, fail: checks.filter(x => x.status === 'fail').length, blocked: checks.filter(x => x.status === 'blocked').length }));
process.exitCode = checks.some(x => x.status === 'fail') ? 1 : checks.some(x => x.status === 'blocked') ? 2 : 0;
