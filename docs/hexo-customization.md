# Hexo Blog 客製化與依賴

這份文件記錄整個專案相對於 Hexo 和 NexT 預設值改了哪些地方，以及每個 npm 套件的用途，供升級或排查時對照。

相關文件：

- 寫作與部署流程：[hexo-workflow.md](hexo-workflow.md)
- 備份與還原：[hexo-backup-and-restore.md](hexo-backup-and-restore.md)

> 目前版本：Hexo 8.1.2、NexT 8.29.0。升級方式見[升級 NexT](#升級-next)和[升級 Hexo 與 npm 套件](#升級-hexo-與-npm-套件)。

## Hexo 全域設定（`_config.yml`）

| 區塊 | 設定 | 說明 |
|---|---|---|
| Site | `title: 史戴拉寫扣`、`subtitle: 'Hands-on fuels my soul!'`、`author: 史戴拉` | |
| | `language: en` | NexT 介面文字用英文（`themes/next/languages/en.yml`），文章內容不受影響 |
| | `timezone: 'Asia/Taipei'` | |
| URL | `url: https://estellacoding.github.io/blog` | 網站放在 `/blog` 子路徑，本地預覽網址也是 `/blog/` |
| | `permalink: :title/` | 文章網址等於檔名，例如 `source/_posts/db-join.md` → `/blog/db-join/`。**改檔名就等於改網址** |
| Writing | `external_link.enable: true` | 外部連結開新分頁 |
| | `syntax_highlighter: highlight.js`，`auto_detect: true`、`wrap: true` | 程式碼高亮 |
| Date | `updated_option: 'mtime'` | 沒寫 `updated` 的頁面（about、tags 等）會用檔案修改時間。重新 clone 後這些頁面的 `updated` 和 sitemap 的 `lastmod` 會變成 clone 的時間，屬於正常現象 |
| Markdown | `markdown:` 整段 | markdown-it 渲染設定：<br>• `breaks: true`：單一換行就會換行<br>• 啟用 sub、sup、ins、checkbox、emoji、mark 外掛<br>• 兩個自訂容器 `::: tip`、`::: fact`，樣式寫在 `styles.styl`<br>• 標題錨點 |
| Mermaid | `mermaid.enable: true`、`loadScript: false` | 由 `hexo-filter-mermaid-diagrams` 轉成 HTML，mermaid.js 交給 NexT 載入 |
| Deploy | `deploy:` | 推到 `master`，見 [hexo-workflow.md](hexo-workflow.md#部署-commit-訊息) |
| Theme | `theme: next` | |

## 主題：NexT

主題直接放在 `themes/next/`，是一般資料夾，不是 submodule，也不是 npm 套件。

- **版本**：`8.29.0`，來自 npm 套件 `hexo-theme-next@8.29.0`，下次升級時以它為比對基準。
- **前端套件版本**：寫在 `_vendors.yml`，跟主題版本走。8.29.0 用的是 mermaid 11、MathJax 4。
- **保留的檔案**：只保留 NexT `package.json` 的 `files` 欄位列出的執行時檔案，再加上 `package.json`（版本號從這裡讀）、`README.md` 和授權文件。主題開發用的 CI、測試、lint 設定已經刪除，`package.json` 裡的 `scripts` 和 `devDependencies` 也一起移除。
- **`languages/default.yml`**：指向 `en.yml` 的 symlink，是 Hexo 的 fallback 語系檔，保留不動。

### 主題設定（`themes/next/_config.yml`）

| 區塊 | 設定 | 說明 |
|---|---|---|
| `custom_file_path.style` | `source/_data/styles.styl` | 載入自訂樣式，見下方 |
| `scheme` | `Gemini` | 預設是 Muse |
| `darkmode` | `false` | 從 8.29 開始預設改成 `true`（跟隨系統深色模式），這裡明確關閉，維持淺色 |
| `favicon` | small / medium / apple_touch_icon / safari_pinned_tab | 都指向 Firebase Storage 上的 logo 圖 |
| `menu` | home、about、tags、categories、archives | 對應 `source/about`、`tags`、`categories` 頁面 |
| `avatar` | `url`（Firebase Storage）、`rounded: true` | |
| `social` | GitHub、Substack | Instagram 已註解掉 |
| `footer.copyright` | `"史戴拉寫扣"` | |
| `text_align` | `desktop: left`、`mobile: left` | 預設是 justify |
| `codeblock.copy_button` | `enable: true`、`style: mac` | 程式碼區塊的複製按鈕 |
| `note` | `style: flat`、`icons: true` | `{% note %}` 的外觀 |
| `mermaid.enable` | `true` | |
| `math` | `every_page: true`、`mathjax.enable: true`、`tags: ams` | 每頁都會載入 MathJax，不用在 front matter 寫 `mathjax: true` |
| `gitalk` | `enable: true`，repo `estellacoding/blog`，`labels: gitalk` | 留言系統，存在 repo 的 GitHub Issues |
| `google_analytics.tracking_id` | `G-EG0CKC3093` | |

> **關於 Gitalk 的 `client_secret`**：Gitalk 是純前端元件，`client_secret` 一定會出現在部署出去的 HTML 裡，所以不管 source 有沒有推，它本來就是公開的。這是 Gitalk 架構上的限制。如果要更換，到 GitHub → Settings → Developer settings → OAuth Apps 重新產生，再更新設定檔。

### 主題程式碼修改

升級時要重新套用的只有下面這 3 項：

| 項目 | 檔案 | 修改內容 |
|---|---|---|
| `question` note 類型 | `scripts/tags/note.js`<br>`source/css/_variables/base.styl` | • `note.js` 的 `keywords` 加上 `'question'`<br>• `base.styl` 的 `$note-types` 和各色票表都加上 `question`，包括 border、bg、text、icon `\f059`，以及 modern 版的 border、bg、text、hover<br>• 用法：`{% note question %}...{% endnote %}` |
| mermaid 支援 `<pre class="mermaid">` | `source/js/third-party/tags/mermaid.js` | • 原版只抓 `pre > .mermaid`，但 `hexo-filter-mermaid-diagrams` 輸出的是 `<pre class="mermaid">`<br>• 改成也抓 `pre.mermaid`，替換時以 `<pre>` 本身為目標<br>• **少了這個修改，mermaid 圖不會被渲染** |
| 訂閱區塊（停用中） | `layout/_partials/sidebar/subscribe.njk`（新增）<br>`layout/_macro/sidebar.njk` | • 連到 Substack 週報<br>• `sidebar.njk` 裡的 include 目前註解掉了<br>• 要啟用時把註解拿掉，並一起恢復 `styles.styl` 裡註解掉的樣式 |

### 自訂樣式（`source/_data/styles.styl`）

這個檔案在主題資料夾外，升級時不會被覆蓋。內容包括：

- `.tip`、`.fact`：markdown-it-container 的兩種提示區塊
- `.post-header`、`.post-body`：調整標題和內文的間距
- 訂閱區塊樣式：目前註解掉，跟上面的訂閱區塊一起使用

## 頁面與特殊檔案（`source/`）

| 路徑 | 用途 |
|---|---|
| `_posts/` | 已發佈的文章 |
| `_drafts/` | 草稿，`render_drafts: false`，不會出現在網站上 |
| `_data/styles.styl` | 自訂樣式 |
| `about/index.md` | 關於頁（`type: "about"`） |
| `tags/index.md`、`categories/index.md` | 標籤頁和分類頁，給 NexT 產生列表用（`type: "tags"` / `"categories"`） |
| `404/index.md` | 自訂 404 頁，`permalink: /404.html`，GitHub Pages 找不到頁面時會顯示這頁 |
| `google3acc54eb417970a2.html` | Google Search Console 網站擁有權驗證檔（`layout: false`）。**不要刪**，刪掉會失去驗證 |

## 文章範本（`scaffolds/`）

| 指令 | 範本 | 產出位置 |
|---|---|---|
| `hexo new "slug"` | `post.md` | `source/_posts/` |
| `hexo new draft "slug"` | `draft.md` | `source/_drafts/` |
| `hexo publish "slug"` | — | 把草稿移到 `_posts/`，並補上 `date` / `updated` |

`post.md` 包含 `date`、`updated`、`categories`、`comments: true` 和 `<!-- more -->`，跟現有文章的 front matter 格式一致；`draft.md` 沒有日期，由 `hexo publish` 補上。因為 `permalink: :title/`，`slug` 就是文章網址，建議用英文小寫加 `-`。

## npm 套件

| 套件 | 用途 |
|---|---|
| `hexo` 8.x | 核心。需要 Node.js 20.19 以上 |
| `hexo-server` | `hexo s` 本地預覽 |
| `hexo-deployer-git` | `hexo deploy` 推到 `master` |
| `hexo-generator-*`（archive / category / index 4.x / tag / sitemap） | 產生列表頁和 sitemap |
| `hexo-renderer-markdown-it` + `markdown-it-*` | Markdown 渲染，外掛清單在 `_config.yml` 的 `markdown.plugins` |
| `hexo-renderer-stylus` | 編譯 NexT 和 `styles.styl` |
| `hexo-filter-mermaid-diagrams` | 把 ` ```mermaid ` 轉成 `<pre class="mermaid">`。**必要**，實測移除後 mermaid 圖會變成一般程式碼區塊 |

不要加回的套件：

- `hexo-theme-landscape`、`hexo-renderer-ejs`：Hexo 預設主題用的，NexT 用不到。
- `fsevents`：只能在 macOS 安裝，手動列出會讓其他平台 `npm install` 失敗；macOS 上 `chokidar` 會自動以 optional dependency 裝它。

套件更新由 `.github/dependabot.yml` 負責，每天檢查一次，對 `source` 開 PR。因為 repo 的預設 branch 是 `master`，所以設定裡要寫 `target-branch: source`。

## 升級 Hexo 與 npm 套件

1. 查 release notes 裡的 Breaking Changes。
2. 先 `hexo cl && hexo g`，把 `public/` 複製到暫存資料夾。
3. 執行 `npm install <套件>@<版本>`，再重新 `hexo cl && hexo g`。
4. 比對新舊 `public/` 的差異。要把每個檔案排序後再比，因為 NexT 每次產生時的隨機顏色和 tag 順序都不一樣。
5. 用 `hexo s` 打開受影響的頁面，實際檢查。

**已知的坑（Hexo 8）**：`{% img %}` 標籤會對網址再編碼一次。如果網址已經含有 `%2F`（例如 Firebase Storage 的圖片），會變成 `%252F`，圖片就壞了。

**插入圖片請用 Markdown 的 `![說明](網址)`**，不要用 `{% img %}`。

## 升級 NexT

把 `OLD` 換成目前版本、`NEW` 換成目標版本。

1. **下載基準版和新版**，放在 repo 外的暫存資料夾：

   ```bash
   OLD=8.29.0; NEW=8.30.0; W=/tmp/next-up; mkdir -p $W && cd $W
   for v in $OLD $NEW; do npm pack hexo-theme-next@$v && mkdir -p $v && tar xzf hexo-theme-next-$v.tgz -C $v; done
   ```

2. **確認現況**：執行 `diff -rqw $W/$OLD/package themes/next`，結果應該只剩上面列出的客製化。
3. **產生升級前的網站**：先 `hexo cl && hexo g`，把 `public/` 複製一份到暫存資料夾，等一下拿來比對。
4. **換上新版，用 three-way merge 套回客製化**：

   ```bash
   cp -R themes/next $W/ours && rm -rf themes/next && cp -R $W/$NEW/package themes/next
   for f in _config.yml scripts/tags/note.js source/css/_variables/base.styl \
            source/js/third-party/tags/mermaid.js layout/_macro/sidebar.njk; do
     cp $W/ours/$f $W/m.tmp
     git merge-file -p $W/m.tmp $W/$OLD/package/$f $W/$NEW/package/$f > themes/next/$f
   done
   cp $W/ours/layout/_partials/sidebar/subscribe.njk themes/next/layout/_partials/sidebar/
   ln -sf en.yml themes/next/languages/default.yml
   ```

   - 有衝突的檔案會出現 `<<<<<<<` 標記，要手動處理。
   - 再刪掉 `docs/` 裡的翻譯版，以及 `package.json` 的 `scripts`、`devDependencies`。
5. **檢查預設值的變更**：

   ```bash
   diff <(grep -v '^\s*#' $W/$OLD/package/_config.yml) <(grep -v '^\s*#' $W/$NEW/package/_config.yml)
   ```

   如果原本的設定剛好等於舊的預設值，merge 時就會被換成新的預設值，要手動改回來（例如 8.29 的 `darkmode`）。
6. **驗證**：
   - `hexo cl && hexo g` 不應該有錯誤。
   - 用 `hexo s` 實際打開頁面檢查：
     - 首頁
     - 有 mermaid 圖的文章，例如 `automl-introduction`
     - 有數學公式的文章，例如 `how-prompt-politeness-affects-llm-accuracy`
     - `::: fact` / `::: tip` 區塊
     - Gitalk 留言區
     - console 沒有錯誤
