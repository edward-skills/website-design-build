(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const products = {
    pebble: { name: 'PEBBLE', cn: '卵石灯', color: '奶白', index: '01', image: 'assets/product-pebble.jpg', description: '圆润的轮廓，像一颗放在手边的卵石。适合想安静片刻的角落，让柔和的光离自己近一点。' },
    arc: { name: 'ARC', cn: '弧光灯', color: '砖红', index: '02', image: 'assets/product-arc.jpg', description: '用一条拱起的曲线，框住温暖的光。放在边桌或餐桌上，给日常留下一点鲜明的轮廓。' },
    stem: { name: 'STEM', cn: '枝灯', color: '墨绿', index: '03', image: 'assets/product-stem.jpg', description: '纤细的灯杆托起一片安静的光。墨绿色的轮廓，适合留在桌边，陪一杯咖啡和自在的聊天。' }
  };
  const scenes = {
    bedside: { product: 'pebble', label: '床头片刻', description: '关掉一天的忙碌。把圆润的光放在床边，陪一本书，或一段放空的时间。' },
    dining: { product: 'arc', label: '两人晚餐', description: '把餐桌的一角留给暖光。砖红色的曲线，让普通的一餐也多一点相聚的心情。' },
    cafe: { product: 'stem', label: '咖啡一角', description: '一杯咖啡，一张小桌。让安静的墨绿色留在身边，陪一段不赶时间的聊天。' }
  };
  const storageKey = 'evenform-plan-v1';
  let selectedProduct = 'pebble';
  let currentScene = 'bedside';
  let savedPlan = null;
  let opener = null;
  let toastTimer;
  const menuButton = $('.menu-toggle');
  const menu = $('#mobile-menu');
  const dialog = $('#product-dialog');

  function closeMenu(restore = false) {
    menu.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', '打开菜单');
    if (restore) menuButton.focus();
  }
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menu.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
  });
  $$('a', menu).forEach(a => a.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) closeMenu(true); });

  function setProduct(id) {
    const p = products[id];
    if (!p) return;
    selectedProduct = id;
    $('#planner-image').src = p.image;
    $('#planner-image').alt = `当前选择的 ${p.name} ${p.cn}`;
    $('#planner-product').textContent = `${p.name} ${p.cn}`;
    $('#save-result').hidden = true;
  }
  function toast(message) {
    clearTimeout(toastTimer);
    const el = $('#toast');
    el.textContent = message;
    el.hidden = false;
    toastTimer = setTimeout(() => { el.hidden = true; }, 2800);
  }
  function chooseProduct(id, space) {
    setProduct(id);
    if (space) $('#space').value = space;
    if (dialog.open) { opener = null; dialog.close(); }
    $('#planner').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    $('#space').focus({ preventScroll: true });
    toast(`已选择 ${products[id].name} ${products[id].cn}`);
  }
  function openProduct(id, trigger) {
    const p = products[id];
    if (!p) return;
    opener = trigger || document.activeElement;
    $('#detail-image').src = p.image;
    $('#detail-image').alt = `${p.name} ${p.cn}`;
    $('#detail-index').textContent = `${p.index} / THE COLLECTION`;
    const title = $('#detail-title');
    title.replaceChildren(document.createTextNode(p.name));
    const small = document.createElement('small'); small.textContent = p.cn; title.append(small);
    $('#detail-description').textContent = p.description;
    $('#detail-color').textContent = p.color;
    $('#detail-choose').dataset.product = id;
    document.body.classList.add('modal-open');
    dialog.showModal();
    $('.dialog-close').focus();
  }
  $$('[data-product]').forEach(b => b.addEventListener('click', () => openProduct(b.dataset.product, b)));
  $('.dialog-close').addEventListener('click', () => dialog.close());
  $('.detail-back').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } });
  dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); if (opener?.isConnected) opener.focus({ preventScroll: true }); });
  $('#detail-choose').addEventListener('click', e => chooseProduct(e.currentTarget.dataset.product));
  $('#change-product').addEventListener('click', () => { $('#collection').scrollIntoView({ behavior: 'smooth' }); });

  const tabs = $$('[data-scene]');
  function setScene(id, focus = false) {
    const scene = scenes[id]; if (!scene) return;
    currentScene = id;
    tabs.forEach(t => { const active = t.dataset.scene === id; t.setAttribute('aria-selected', String(active)); t.tabIndex = active ? 0 : -1; if (active && focus) t.focus(); });
    const p = products[scene.product];
    $('#scene-panel').setAttribute('aria-labelledby', `tab-${id}`);
    $('#scene-image').src = p.image;
    $('#scene-image').alt = `${p.name} ${p.cn}`;
    $('#scene-product').textContent = `${p.name} / ${p.cn}`;
    $('#scene-description').textContent = scene.description;
  }
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => setScene(t.dataset.scene));
    t.addEventListener('keydown', e => { let next; if (['ArrowDown', 'ArrowRight'].includes(e.key)) next = (i + 1) % tabs.length; if (['ArrowUp', 'ArrowLeft'].includes(e.key)) next = (i + tabs.length - 1) % tabs.length; if (e.key === 'Home') next = 0; if (e.key === 'End') next = tabs.length - 1; if (next !== undefined) { e.preventDefault(); setScene(tabs[next].dataset.scene, true); } });
  });
  $('#scene-choose').addEventListener('click', () => chooseProduct(scenes[currentScene].product, currentScene));
  $('#space').addEventListener('change', e => {
    const scene = scenes[e.target.value];
    if (scene) {
      setProduct(scene.product);
      const p = products[scene.product];
      $('#space-hint').textContent = `已为「${scene.label}」推荐 ${p.name} ${p.cn}，也可以从灯具系列另选。`;
    } else {
      $('#save-result').hidden = true;
      $('#space-hint').textContent = '保留你选的灯款，为这个角落记下自己的想法。';
    }
  });
  $('#note').addEventListener('input', () => { $('#save-result').hidden = true; });
  $$('.faq-list details').forEach(d => d.addEventListener('toggle', () => { if (d.open) $$('.faq-list details').forEach(other => { if (other !== d) other.open = false; }); }));

  $('#planner-form').addEventListener('submit', e => {
    e.preventDefault();
    const value = $('#space').value;
    savedPlan = { product: selectedProduct, space: value, note: $('#note').value.trim(), savedAt: new Date().toISOString() };
    let stored = true;
    try { localStorage.setItem(storageKey, JSON.stringify(savedPlan)); } catch { stored = false; }
    $('#save-message').textContent = stored ? '你的搭配已保存在这个浏览器。下次回来，还可以继续看看。' : '此浏览器暂时无法保存。你仍可以下载这份搭配清单。';
    $('#save-result').hidden = false;
  });
  $('#download-plan').addEventListener('click', () => {
    if (!savedPlan || !products[savedPlan.product]) return;
    const p = products[savedPlan.product];
    const space = scenes[savedPlan.space]?.label || '我的另一个角落';
    const content = ['晚间 EVENFORM · 我的灯光搭配', '', `灯具：${p.name} ${p.cn}`, `颜色：${p.color}`, `空间：${space}`, `想法：${savedPlan.note || '留一点光给自己。'}`, '', '本清单用于搭配参考，不是订单。价格与销售渠道尚未发布。'].join('\n');
    const url = URL.createObjectURL(new Blob(['\uFEFF', content], { type: 'text/plain;charset=utf-8' }));
    const a = document.createElement('a'); a.href = url; a.download = 'EVENFORM-我的搭配.txt'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  try {
    const previous = JSON.parse(localStorage.getItem(storageKey));
    if (previous && products[previous.product] && ['bedside', 'dining', 'cafe', 'other'].includes(previous.space)) {
      setProduct(previous.product);
      $('#space').value = previous.space;
      $('#note').value = typeof previous.note === 'string' ? previous.note.slice(0, 500) : '';
      savedPlan = previous;
      $('#save-message').textContent = '上次的搭配还在。可以继续修改，或下载留存。';
      $('#save-result').hidden = false;
    }
  } catch { /* Ignore unavailable or invalid browser-local data. */ }
})();
