# Installation and use

**English** · [简体中文](usage.zh-CN.md) · [Repository overview](../README.md)

Install the complete [website-design-build/](../website-design-build/) directory, including references, templates and `LICENSE.txt`. Repository screenshots and example sites are not runtime dependencies.

## Installer

```bash
npx skills add edward-skills/website-design-build --skill website-design-build
```

Choose your host when prompted. To explicitly select project-level targets:

```bash
npx skills add edward-skills/website-design-build \
  --skill website-design-build \
  --agent codex claude-code cursor opencode
```

Add `--global` for global installation. The optional CLI is [vercel-labs/skills](https://github.com/vercel-labs/skills); follow its Node.js requirements. The Skill itself does not require a fixed Node/Python runtime. Generated websites use the dependencies appropriate to their projects.

## Manual installation

```bash
git clone https://github.com/edward-skills/website-design-build.git
```

Copy the repository's inner `website-design-build/` directory into your host's Skill directory:

| Host | Directory | Invocation example |
| --- | --- | --- |
| Codex | `~/.agents/skills/website-design-build/` or project `.agents/skills/website-design-build/` | `$website-design-build Build a website from the attachments` |
| Claude Code | `~/.claude/skills/website-design-build/` or project `.claude/skills/website-design-build/` | `/website-design-build Build a website from the attachments` |
| Cursor / OpenCode | Use a supported installer or the directory in the host's current documentation | Select the Skill using host conventions, or explicitly request the entrypoint |
| File-capable Agent without Skill discovery | Keep the complete directory somewhere the Agent can read | `Read website-design-build/SKILL.md and its relative references as needed; build from my attachments` |

Compare and back up an existing directory before replacing it. Refresh discovery or check in a new session after installation. Pasting the main prompt without access to its references is incomplete loading.

References: [Agent Skills format](https://agentskills.io/specification), [Codex Skill directories](https://learn.chatgpt.com/docs/build-skills), [Claude Code directories and invocation](https://code.claude.com/docs/en/skills). Host discovery paths and invocation symbols differ; the workflow does not need a separate rewrite for each host.

## Minimal user inputs

### Brand website

```text
Use website-design-build. We make portable ambient lights for people who care
about their living spaces. Here are our introduction and three product images.
Build an English brand website that explains the products and helps people
choose a light for their room. Give me a preview I can open.
```

### B2B inquiry site

```text
Use website-design-build. We supply lighting to hotels and design studios.
Here are product photos and available specifications. Build an English B2B
website for comparing products and starting inquiries. The existing inquiry
interface and field definitions are attached; preserve them.
```

If a receiving interface or channel is missing, the Agent identifies that gap and completes the remaining pages. A local shortlist must not be described as a submitted inquiry.

### SaaS

```text
Use website-design-build. Here are our introduction, product screenshots and
plan details. Make a concise homepage, pricing page and sign-in page using our
brand. Preserve existing authentication and billing logic. List any resources
that need connecting separately.
```

### Targeted feedback

```text
The pricing page still shows the old total when the seat count is invalid.
Fix that state and check the sign-in summary, change-plan links and other return
paths. Preserve the overall visual design.
```

## Host capabilities and delivery

| Capability | Purpose | If unavailable |
| --- | --- | --- |
| File / image reading | Understand supplied content and materials | Identify unread items; do not infer their contents from filenames |
| File editing | Produce and update the website | Report the delivery limitation; do not claim a website was built |
| Command execution | Run the project and relevant checks | Use available host mechanisms and state which checks were not run |
| Browser / visual inspection | Inspect layout, inputs and return paths | Complete available source checks; disclose untested UI and interactions |
| Auth / data / hosting connections | Implement requested real business flows | Identify gaps; do not fabricate sending, login, payment or persistence success |

Figma, external image generation and a particular deployment platform are optional choices. The Agent maintains internal templates; the user does not need to fill them in.

**Instruction language: Chinese. Output language: your requested language.** Invocation permission does not grant access to external services or third-party assets.

## Meta Muse AI and Grok Bot

Checked on 2026-10-17. These are documentation-based capability notes, **not completed production runs in these products**.

| Product | Official basis | How to use it and what remains unverified |
| --- | --- | --- |
| [Meta Muse AI](https://ai.meta.com/muse/), the personal Agent | Describes an independent Linux computer, browser, tool building and multi-step work | Supply the complete package as task materials. Native multi-file import and automatic activation have not been tested; a repository link alone is not a verified installation |
| [Grok Bot](https://x.ai/bot) | [Official Skill documentation](https://docs.x.ai/grok-bot/skills-routines-and-automations) describes custom workflows, a private Skill library shared with your Bots and `/` invocation | First retrieve and execute the complete package, then save it privately using supported features. Import of all referenced resources still needs verification in the actual account |
| Muse Code, distinct from the personal Muse AI | [Developer documentation](https://meta-models.github.io/muse-code-sdk/next/guides/extend/skills/) describes `SKILL.md`, directory discovery and validation | Install the complete package following its documentation; this repository has not run the Muse Code model |
| Grok Build, distinct from Grok Bot | [Official documentation](https://docs.x.ai/build/features/skills-plugins-marketplaces) describes `.grok/skills/` and named invocation | Install following its documentation; this repository has not run the Grok Build model |

Give a personal Agent this request, followed by your introduction, copy and assets:

```text
Retrieve the complete website-design-build/ directory from
https://github.com/edward-skills/website-design-build.
Read SKILL.md and load relative references/ and assets/templates/ as needed.
Do not replace the workflow with a summary. agents/openai.yaml is optional UI
metadata.

Use this workflow in my environment to build from my brand and product materials.
Choose the page structure and visual direction, deliver source and a preview
I can open, and inspect the mobile layout and key interactions.
Identify missing authentication, payment or receiving capabilities honestly.
If you cannot read references, execute code or inspect a browser, name that gap
and complete the stages you can actually perform.

Respect the invocation-only license. Do not republish the package or share it
through a public Skill library.
```

Results depend on tools, file permissions and the account's runtime. Retrieving source, executing a task and saving a private Skill are separate stages. A custom-Skill feature does not by itself establish complete multi-file package import.
