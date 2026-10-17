# 可运行示例

两个示例都使用虚构品牌和测试数据。源码是已运行网页的静态 HTML/CSS/JS，无 npm 安装或构建步骤。

在仓库根目录运行：

```bash
# SaaS 首页、价格、登录
python3 -m http.server 4188 --bind 127.0.0.1 --directory examples/gather/dist

# 另一个终端：灯具品牌单页
python3 -m http.server 4187 --bind 127.0.0.1 --directory examples/evenform/dist
```

打开 `http://127.0.0.1:4188/`、`http://127.0.0.1:4188/pricing/`、`http://127.0.0.1:4188/login/` 或 `http://127.0.0.1:4187/`。端口被占用时替换为空闲端口。必须通过 HTTP 服务运行，不直接双击 HTML。

- [Gather 输入](gather/brief.md)：品牌介绍、产品 UI 和套餐资料。产品素材与共享数据见 [product-materials.json](gather/product-materials.json) 及 dist/assets。
- [EVENFORM 输入](evenform/brief.md)：品牌介绍和产品素材。截图照片原始大图不重复打包；网页使用的导出素材已包含在 dist/assets。

输入 brief 中提到的原始素材是案例执行时的输入；本目录分发的是可运行网页与网页用导出资源，不是原始素材档案。

Gather 的邮箱仅做 UI 校验，不发送邮件或创建账号。示例反馈投票只存在当前页面内存。EVENFORM 的保存是当前 origin 下的浏览器本地搭配记录，并非订单或已提交询盘。业务能力边界见 [NOTICE](../NOTICE.md)。
