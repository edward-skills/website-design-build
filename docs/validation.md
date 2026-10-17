# Validation records

**English** · [简体中文](validation.zh-CN.md) · [Repository overview](../README.md)

Checked on 2026-10-17. The goal was to check whether another executor could understand and produce websites using the Skill without the original conversation or a supplied implementation, and whether common installers discover the complete package. This is not an all-model benchmark or a human usability study.

## Completed checks

| Layer | Result | Evidence limits |
| --- | --- | --- |
| Structure and portability | Frontmatter, name, complete 16-file package, relative references and license checks passed | No private paths, original-chat dependency, fixed model or mandatory host; machine checks do not establish visual quality |
| Installation | `skills` CLI 1.7.2 installed project copies for Codex, Claude Code, Cursor and OpenCode; file hashes matched the source | Isolated directories; no existing global configuration changed. Four installation targets are not four completed model runs |
| Original examples | Fictional lighting brand EVENFORM and three-page SaaS Gather | Created and inspected by the same executor; source is in examples; not independent trials |
| Independent production A | Fresh-context Codex Agent received only a Skill snapshot and raw Gather brand/product materials; produced three pages and a static build | No previous implementation, known bugs or expected answers supplied; 10 calculation/state tests, static checks and build passed |
| Independent production B | Another fresh-context Codex Agent received only a Skill snapshot and raw English LUMERO B2B introduction/images; produced product selection and a project draft | Did not ask the user to choose a stack or layout; 6 data/export tests, static checks and build passed |
| Browser review by lead executor | Both independent outputs loaded and the paths below were checked | Bounded review; Node tests and overflow measurements are not described as complete functional acceptance |

Independent trials used a pre-release workflow snapshot. Cross-agent capability guidance and the owner's invocation-only terms were added afterwards; those additions did not rewrite the business workflow. Installation checks used the complete package with final rights and capability notes.

## Independent outputs

| Independent SaaS Agent | Independent B2B Agent |
| --- | --- |
| [![Homepage independently produced by the SaaS Agent](images/independent-saas.png)](images/independent-saas.png) | [![Homepage independently produced by the B2B Agent](images/independent-b2b.png)](images/independent-b2b.png) |

These are actual websites designed by the executors, not copies of the lead executor's website or text-only reviews of the Skill.

## Actual browser checks

| Output | Action / observation | Result |
| --- | --- | --- |
| Independent SaaS | Select Team, annual billing, 5 seats | ¥2,940/year |
| Independent SaaS | Enter sign-in, then change selection | Summary, billing period and seat count remain consistent |
| Independent SaaS | Change seat count to 2 | Explanation appears, total clears to a dash, continuation link has no target |
| Independent SaaS | Load all three pages at 390px | No page-level horizontal overflow; relevant images loaded; desktop homepage visually inspected |
| Independent B2B | Add PEBBLE and ARC, enter quantity 12 and English/Chinese project text, refresh | Both products, quantity and project text restored |
| Independent B2B | Desktop and 390px | First screen visually inspected; no mobile page overflow, product images loaded; comparison area scrolls within itself |
| Both outputs | Browser console during this review | No warnings/errors |

The original Gather example was also checked at 320, 390, 720, 768 and 1440px, with amount boundaries, sign-in preview and sample voting. It has no real authentication or payment. EVENFORM checks included product details, scene switching, browser storage and an actual download.

## Not claimed as passed

- Model production in Claude Code, Cursor, OpenCode, Meta Muse AI or Grok Bot. The first three received installation checks only. Muse AI and Grok Bot received official-capability/documentation review only; no signed-in generation run was completed.
- Quality across all models, browsers, physical keyboards, screen readers or arbitrary content lengths.
- Real accounts, OAuth, email delivery, payment, server-side inquiry persistence, backend permissions or multi-region business logic.
- Browser download/clipboard results for the independent B2B output. Its executor tested pure export rules; the lead's browser review covered selection, text entry and restoration after refresh.

The Skill supplies concrete methods and acceptance criteria. Final quality depends on materials, host tools and actual inspection. Verify real business flows using the relevant modules when connecting production services.

## Run repository checks

```bash
python3 scripts/validate_repository.py
node --check examples/gather/dist/app.js
node --check examples/gather/dist/assets/catalog.js
node --check examples/evenform/dist/app.js
```

GitHub Actions runs equivalent packaging checks. These do not call live services or certify a connected production site.
