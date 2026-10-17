# Runnable examples

**English** · [简体中文](README.zh-CN.md)

Both examples use fictional brands and test data. The source is runnable static HTML/CSS/JS; no npm installation or build is required.

From the repository root:

```bash
# SaaS homepage, pricing and sign-in
python3 -m http.server 4188 --bind 127.0.0.1 --directory examples/gather/dist

# In a second terminal: lighting brand site
python3 -m http.server 4187 --bind 127.0.0.1 --directory examples/evenform/dist
```

Open `http://127.0.0.1:4188/`, `http://127.0.0.1:4188/pricing/`, `http://127.0.0.1:4188/login/` or `http://127.0.0.1:4187/`. Choose a free port if occupied. Serve over HTTP rather than double-clicking HTML files.

- [Gather input brief](gather/brief.md): brand introduction, product UI and plan details. See [product-materials.json](gather/product-materials.json) and dist/assets for shared data and exported product materials.
- [EVENFORM input brief](evenform/brief.md): brand introduction and product materials. Original full-resolution photos are not duplicated; exported assets needed by the website are included in dist/assets.

The briefs describe inputs used during production. This distribution contains runnable pages and their exported assets, not an archive of every original input file. The example websites and original briefs are in Chinese; request your preferred language when generating a new site.

Gather validates email format in the UI without sending mail or creating accounts. Sample voting lives in current-page memory. EVENFORM saves local selections in the browser for the current origin; these are not orders or submitted inquiries. See the [asset and capability notice](../NOTICE.md).
