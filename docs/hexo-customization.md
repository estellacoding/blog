# Hexo Blog 客製化與依賴

這份文件記錄主題和外掛做過哪些客製化、每個 npm 套件的用途，以及升級 NexT 時要注意什麼。

相關文件：

- 寫作與部署流程：[hexo-workflow.md](hexo-workflow.md)
- 備份與還原：[hexo-backup-and-restore.md](hexo-backup-and-restore.md)

## 主題：NexT 8.20.0

`_config.yml` 設定 `theme: next`。主題直接放在 `themes/next/`，是一般資料夾，不是 submodule，也不是 npm 套件。

`themes/next/` 只保留執行時需要的檔案，依照 NexT `package.json` 的 `files` 欄位：

- `languages/`、`layout/`、`scripts/`、`source/`
- `_config.yml`、`_vendors.yml`
- `package.json`：`scripts/` 會從這裡讀取版本號；開發用的 `scripts`、`devDependencies` 已移除
- `LICENSE.md`、`README.md`、`docs/`（授權相關）

NexT 原本給主題開發用的檔案已經移除，網站輸出不受影響，包括：

- `.github/`、`.githooks/`、`test/`
- eslint / stylelint 設定、crowdin、renovate
- 翻譯版 README

### 客製化清單

| 項目 | 檔案 | 說明 |
|---|---|---|
| 主題設定 | `themes/next/_config.yml` | 所有 NexT 設定都直接改在這裡 |
| 自訂樣式 | `source/_data/styles.styl` | 由 `custom_file_path.style` 載入。內容包括：<br>• markdown-it-container 的 `.tip`、`.fact` 區塊<br>• 標題與內文的間距<br>• 訂閱區塊樣式（目前註解掉） |
| `question` note 類型 | `themes/next/scripts/tags/note.js`<br>`themes/next/source/css/_variables/base.styl` | 新增 `{% note question %}`，青綠色，使用 `fa-question-circle` 圖示，classic 和 modern 兩種樣式都支援 |
| 訂閱區塊（停用中） | `themes/next/layout/_partials/sidebar/subscribe.njk`<br>`themes/next/layout/_macro/sidebar.njk` | 連到 Substack 週報。sidebar 的 include 目前註解掉了，要啟用時把註解拿掉，並一起把 `styles.styl` 裡的對應樣式恢復 |

### 升級 NexT 時

新版主題會整個覆蓋 `themes/next/`。升級前先用 `git diff` 或上面的清單，確認以下內容都有搬過去：

1. `themes/next/_config.yml` 的設定
2. `question` note 類型的修改
3. 訂閱區塊的兩個檔案

`source/_data/styles.styl` 不在主題資料夾內，升級時不會被覆蓋。

## npm 套件

| 套件 | 用途 |
|---|---|
| `hexo` | 核心 |
| `hexo-server` | `hexo s` 本地預覽 |
| `hexo-deployer-git` | `hexo deploy` 推到 `master` |
| `hexo-generator-*`（archive / category / index / tag / sitemap） | 產生列表頁和 sitemap |
| `hexo-renderer-markdown-it` + `markdown-it-*` | Markdown 渲染。外掛清單在 `_config.yml` 的 `markdown.plugins` |
| `hexo-renderer-stylus` | 編譯 NexT 和 `styles.styl` 的 stylus |
| `hexo-filter-mermaid-diagrams` | 把 ` ```mermaid ` 區塊轉成 `<pre class="mermaid">`，mermaid.js 由 NexT 載入（`_config.yml` 的 `mermaid.loadScript: false`）。**這個套件是必要的**：實測移除後，mermaid 圖會變成一般程式碼區塊 |

已移除的套件：

- `hexo-theme-landscape`、`hexo-renderer-ejs`：Hexo 預設主題用的，NexT 用不到。已移除，連同 `_config.landscape.yml`，實測網站輸出沒有變化。
- `fsevents`：原本手動加在 devDependencies，但它只能在 macOS 安裝，在其他平台會讓 `npm install` 失敗。macOS 上 `chokidar` 本來就會自動以 optional dependency 的方式裝它，不需要手動列出。

### 套件更新

`.github/dependabot.yml` 每天檢查 npm 套件更新，並對 `source` branch 開 PR。因為 repo 的預設 branch 是 `master`，所以設定裡要寫 `target-branch: source`。

## 文章範本（scaffolds）

| 指令 | 範本 | 產出位置 |
|---|---|---|
| `hexo new "slug"` | `scaffolds/post.md` | `source/_posts/` |
| `hexo new draft "slug"` | `scaffolds/draft.md` | `source/_drafts/` |
| `hexo publish "slug"` | — | 把草稿移到 `_posts/`，並補上 `date` / `updated` |

範本已經包含 `updated`、`categories`、`comments: true` 和 `<!-- more -->`，跟現有文章的 front matter 格式一致。
