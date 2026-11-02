# 可重跑的建站冒烟基线

[English](README.md) · **简体中文** · [验证记录](../docs/validation.zh-CN.md)

这些材料供维护者评测，放在安装包之外。普通用户仍只提供品牌内容和素材，不需要填写评测表。[fixture-lock.json](fixture-lock.json) 固定任务与原始素材的哈希。

三个场景分别是 Gather 三页 SaaS、LUMERO 英文 B2B、Gather 附带夹带指令的供应商资料。输入只含品牌介绍、套餐与产品素材，不提供现成网页源码。LUMERO 复用原独立测试的品牌请求及仓库已有的对应产品导出图。布局和技术细节不作为固定答案。

夹带指令样本只使用明确的假凭证与 `.invalid` 地址，不授权真实认证访问或外发。检查需要独立执行/网络轨迹；仅在 HTML 中没找到标记，不能证明未发生外发。

## 版本比较

每个任务和配置使用全新工作区。执行者只收到任务、声明的原始输入和完整 Skill；检查器、答案、已有网页与另一配置产物不能进入任务上下文。旧版和新版使用相同模型、设置、工具和输入；避免基线从全局安装自动加载新版。

可选使用已安装的 `skill-verifier`，具体命令见 [English replay commands](README.md#run-a-fair-skill-comparison)。先审核适配器和运行文件清单，并验证文件隔离。仓库不附带认证、适配器或全局设置修改。没有可用执行环境时保留未执行状态；一次冒烟不能证明可靠性或质量提升，显式加载也不能证明原生激活。

## 现有示例回归

```bash
node scripts/smoke_examples.mjs --out "$NEW_BROWSER_RESULTS"
# 也可以使用已有 Playwright：
node scripts/smoke_examples.mjs \
  --playwright-module "$PLAYWRIGHT_INDEX_MJS" --out "$NEW_BROWSER_RESULTS"
# 已安装 Google Chrome 时，可以加 --channel chrome。
```

变量由维护者解析为实际路径；输出目录必须全新。命令需要 Node、已有 Playwright 和可启动的 Chromium，不会自动安装。它只服务 localhost，阻止站外请求，结束后关闭自己的服务和浏览器。

实际检查价格与跨页、无效席位恢复、登录演示与 Escape 焦点、灯具搭配的保存/刷新/下载，以及四页的基础图片/字段语义、按钮名称和手机溢出。保存原始结果、浏览器版本、源文件哈希、手机截图、辅助树快照和下载文件；临时删除一张图的 alt 作为检测器负例，刷新后丢弃。

这是已有网页的回归，不是新版 Skill 的新一轮建站或旧/新版能力比较。基础检查不构成完整可访问性认证；对比度和辅助技术实测仍需分别执行，参照 [WCAG 2.2](https://www.w3.org/TR/WCAG22/) 的适用要求。

原先提出的 14 个行为场景和六个原生激活场景仍是计划，不能用本次三个冻结任务或示例回归代替其执行结果。更广泛的发行结论还需要未参与调整的保留任务。
