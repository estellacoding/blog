# Hexo Blog 的兩個 Branch 架構

## 結論先看

GitHub `estellacoding/blog` repo 同時有兩個 branch,各自管不同的東西,**互不干擾**。

| Branch | 內容 | 用途 | commit 由誰建立 |
|---|---|---|---|
| `master` | `public/` 編譯後的 HTML/CSS/JS | 給 GitHub Pages 顯示網站 | `hexo d` **自動產生** |
| `source` | `source/`、`themes/`、`_config.yml`、`scaffolds/` 等原始檔 | 版本控制你寫的東西,VS Code 預設追這個 | **你手動** commit |

## 為什麼要分兩個 branch?

- **master branch**: 給瀏覽器讀的「成品」,長得像一堆 `index.html`。每次 `hexo d` 都會被整個 overwrite,訊息固定是 `Site updated: yyyy-mm-dd`,**無法修改**(hexo-deployer-git 寫死的)。
- **source branch**: 給你寫東西的「原稿」,markdown、設定檔、主題客製化都在這。這才是真正需要版本控制的地方。

如果只有一個 branch 同時放兩種東西,你會發生:
- VS Code Changes 永遠跳出一堆編譯產物的 diff(根本看不出你改了什麼文章)
- 每次 `hexo d` 把你的 commit 蓋掉
- 想 rollback 文章 = 連網站一起 rollback

所以分兩個 branch 是 Hexo 官方推薦的做法。

## 每次寫文章的流程

```bash
# 1. 寫文章 / 改設定
code source/_posts/my-new-post.md

# 2. 本地預覽 (不會碰 git)
hexo c && hexo g && hexo s
# 開瀏覽器看 http://localhost:4000

# 3. 確認 OK 後,分兩步提交

# (a) 把原始檔提交到 source branch (VS Code GUI 或指令)
git add source/_posts/my-new-post.md
git commit -m "Add my-new-post article"
git push

# (b) 部署到網站
hexo c && hexo g && hexo d
# → 自動 push 編譯結果到 master branch
```

## hexo 指令備忘

| 指令 | 動作 | 會碰 git 嗎? |
|---|---|---|
| `hexo c` | clean,刪掉 `db.json` 和 `public/` | 不會 |
| `hexo g` | generate,把 markdown 編譯成 HTML 到 `public/` | 不會 |
| `hexo s` | serve,本地 http://localhost:4000 預覽 | 不會 |
| `hexo d` | deploy,把 `public/` push 到 `master` branch | **會自動 commit + push** |

純本地預覽:`hexo c && hexo g && hexo s`
真正部署上線:`hexo c && hexo g && hexo d`

## VS Code 看到什麼?

- Source Control 面板顯示 `source` branch
- 改 `source/_posts/xxx.md` 時,**Changes 區會即時顯示變更**,可以一行一行 diff
- 自己寫 commit message(例如 `Update karpathy notes`),不會是 `Site updated:`
- Graph 會看到兩條獨立的線

## Branch 設定怎麼來的?

- 本地 `.git/config` 的 `origin` 指向 `https://github.com/estellacoding/blog.git`
- 本地 working tree 在 `source` branch 上,追蹤 `origin/source`
- Hexo 的 `_config.yml` 設定 `hexo d` 推到 `master` branch:

```yaml
deploy:
  type: git
  repo: https://github.com/estellacoding/blog
  branch: master
```

- GitHub Pages 在 repo 設定中指定從 `master` branch 讀取網站內容
