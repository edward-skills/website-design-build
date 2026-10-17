# 安装与调用 / Installation and use

只安装 [website-design-build/](../website-design-build/) 这一完整目录。参考、模板和 LICENSE.txt 都随包保留；仓库截图和示例网站不是运行依赖。

## 安装器

```bash
npx skills add Edward-J-create/website-design-build --skill website-design-build
```

选择需要的宿主。明确指定项目级安装到几个 Agent：

```bash
npx skills add Edward-J-create/website-design-build \
  --skill website-design-build \
  --agent codex claude-code cursor opencode
```

需要全局安装时加 `--global`。CLI 来自 [vercel-labs/skills](https://github.com/vercel-labs/skills)，是可选安装方式；按其要求准备 Node.js。Skill 本体没有固定 Node/Python 运行依赖，生成网站的依赖由项目选择决定。

## 手动安装

```bash
git clone https://github.com/Edward-J-create/website-design-build.git
```

将仓库内的 `website-design-build/` 目录复制到宿主的 skill 目录。首次安装示例：

| 宿主 | 目录 | 调用示例 |
| --- | --- | --- |
| Codex | `~/.agents/skills/website-design-build/` 或项目的 `.agents/skills/website-design-build/` | `$website-design-build 根据附件搭建网站` |
| Claude Code | `~/.claude/skills/website-design-build/` 或项目的 `.claude/skills/website-design-build/` | `/website-design-build 根据附件搭建网站` |
| Cursor / OpenCode | 使用其支持的安装器或当前宿主文档指定的目录 | 按宿主规则选择 skill，或直接要求读取入口 |
| 可读文件但没有 skill 发现机制的 Agent | 保留本目录结构，放在 Agent 有权访问的位置 | `读取 website-design-build/SKILL.md，按需读取相对引用，并按附件制作网页` |

已有同名目录时比较并备份，不用一条覆盖命令抹掉本地修改。安装后让宿主刷新或在新会话确认发现。只粘贴主文件、却无法读取其引用，不算完整加载。

参考：[Agent Skills 格式](https://agentskills.io/specification)、[Codex 本地 skill 目录](https://learn.chatgpt.com/docs/build-skills)、[Claude Code skill 目录与调用](https://code.claude.com/docs/en/skills)。不同宿主发现目录和符号不同，工作流正文不需要复制改写为不同版本。

## 最小用户输入

### 品牌官网

```text
使用 website-design-build。
我们做便携氛围灯，面向注重居住体验的年轻人。
这里是品牌介绍和三款产品图片。
做一个中文官网，方便看懂产品和按空间选灯，给我网页预览。
```

### B2B

```text
使用 website-design-build。
我们为酒店和设计工作室供应灯具。这里有产品照片和已有规格。
做英文 B2B 官网，让客户比较并发起询盘。
已有询盘接口和字段说明也在附件里，请沿用。
```

未提供接收接口或渠道时，Agent 应说明缺口，完成其余页面；用户要求真实询盘时不能把本地清单当成已提交。

### SaaS

```text
使用 website-design-build。
这是产品介绍、截图和套餐资料。
请做首页、价格页和登录页，简洁清楚；沿用产品品牌。
已有登录与计费逻辑请保留。需要先接入的资源请单独列出。
```

### 局部反馈

```text
价格页人数填写无效时仍显示旧总额。
修正当前状态，同时核对登录摘要、修改套餐和其他返回入口；保留整体视觉。
```

## 宿主能力与输出

| 能力 | 用途 | 不可用时 |
| --- | --- | --- |
| 读文件 / 图像 | 理解材料与素材 | 明确未读取的部分，不凭文件名编造内容 |
| 写文件 | 生成、修改网站 | 如宿主无法交付文件，报告限制，不能声称已经搭建 |
| 命令执行 | 运行网站与必要检查 | 沿用宿主可用运行方式，记录没有执行的检查 |
| 浏览器 / 画面检查 | 目视验收、输入与返回路径 | 完成其余源码检查，明确 UI 与交互未实测 |
| 认证 / 数据 / 托管连接 | 用户要求的真实业务接入与交付 | 说明缺口，不伪造发送、登录、支付或保存成功 |

Figma、外部图像生成和特定部署平台均为按任务选择的能力，不是使用此 Skill 的前置要求。内部模板由 Agent 整理，用户不必填写。

Instruction language: Chinese. Output language: the user's requested language. Invocation permission does not grant access to external services or third-party assets.
