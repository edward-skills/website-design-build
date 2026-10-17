# Website Design Build

Turn a brand introduction, website copy and product materials into a designed, runnable website. Covers brand sites, B2B inquiry sites and SaaS marketing sites, including pricing, sign-in and lightweight administration when requested.

[中文与完整图库](README.md) · [Skill](website-design-build/SKILL.md) · [Usage](docs/usage.md) · [Validation](docs/validation.md) · [License](LICENSE)

![Gather: an actual SaaS homepage produced from a short brief and product materials](docs/images/gather-home.png)

## Start

```bash
npx skills add Edward-J-create/website-design-build --skill website-design-build
```

Choose your host in the installer. Copy the complete Skill folder for manual installation; `SKILL.md` alone is insufficient. The detailed instructions are in Chinese, so the host must be able to follow Chinese instructions; website output follows the requested language.

```text
Use website-design-build. We make feedback collaboration software for small
product teams. Attached are our introduction, product screenshots and plans.
Build a concise homepage, pricing page and sign-in page with an accessible
preview. Make routine design and implementation choices yourself; do not
invent missing business facts.
```

Use `$website-design-build` in Codex or `/website-design-build` in Claude Code. Other capable agents can read the entrypoint and supporting files explicitly. Host-specific discovery and invocation syntax vary.

## What happens

The agent extracts the audience and primary action, maps supplied assets, chooses an appropriate visual direction, builds the requested pages and states, checks relevant viewports and paths, then delivers source and a usable preview. Templates are internal aids, not mandatory user questionnaires.

The workflow separates display assets from real controls, preserves business meaning and existing code, and verifies related pages when feedback changes shared details. It does not require one framework or hosting vendor. Real authentication, checkout and persistence require actual integrations.

The [examples](examples/README.md) contain runnable fictional brand and SaaS sites. Screenshots are captured from those pages. See [validation](docs/validation.md) for what has actually been checked; installation compatibility is not a claim that every model produces identical quality.

## Rights

This is a public, invocation-only package under a custom license, **not an open-source license**. You may install and invoke it for your own or client projects and use, modify, publish and sell resulting websites. Redistribution, resale, repackaging, publishing modified Skill packages and hosting the Skill itself for third parties are not authorized. See [LICENSE](LICENSE) and [NOTICE](NOTICE.md).
