# Hexo Blog 的 .gitignore 與還原指南

## .gitignore 完整內容

```gitignore
.DS_Store
Thumbs.db
db.json
*.log
node_modules/
public/
.deploy*/
_multiconfig.yml
```

## 為什麼這些不推?

| 排除項目 | 是什麼 | 為什麼不推 |
|---|---|---|
| `node_modules/` | npm 套件 | 體積大(數百 MB),可用 `npm install` 從 `package.json` 重建 |
| `public/` | `hexo g` 產生的 HTML 編譯檔 | 那是 `master` branch 在管的,不該推到 source |
| `.deploy_git/` | `hexo d` 用的部署 workspace | 內部使用,推上去會打架 |
| `db.json` | hexo 的本地快取資料庫 | 每次 build 會重生,推上去沒意義 |
| `.DS_Store` | macOS 自動產生的目錄縮圖快取 | 系統檔噪音 |
| `Thumbs.db` | Windows 自動產生的縮圖快取 | 系統檔噪音 |
| `*.log` | 所有 log 檔案 | 執行時產生的,沒必要追蹤 |
| `_multiconfig.yml` | hexo 多環境設定檔 | 通常包含本地敏感設定,不推 |

## 推 vs 不推:一張圖

```
blog/
├── .git/                  ← 追 source branch
├── .gitignore             ✅ 推
├── _config.yml            ✅ 推 (hexo 全域設定)
├── _config.landscape.yml  ✅ 推
├── package.json           ✅ 推 (記錄 npm 依賴版本,還原必備!)
├── package-lock.json      ✅ 推 (鎖定精確版本)
├── scaffolds/             ✅ 推 (新文章範本)
├── source/                ✅ 推 (你寫的所有 markdown)
├── themes/next/           ✅ 推 (主題客製化設定都在這)
├── docs/                  ✅ 推 (這份說明文件本身)
├── node_modules/          ❌ 不推 (npm install 重建)
├── public/                ❌ 不推 (hexo g 重建)
├── .deploy_git/           ❌ 不推 (hexo d 自動管理)
└── db.json                ❌ 不推 (hexo g 自動產生)
```

## 換電腦 / 重灌時怎麼還原

只需要 3 步驟,所有東西都從 `source` branch + npm 還原。

### Step 1: clone 下來
```bash
# clone source branch (預設應該就是 source)
git clone -b source https://github.com/estellacoding/blog.git
cd blog
```

### Step 2: 安裝套件 (重建 node_modules/)
先確認 Node.js 已安裝(`node -v` 應該至少 18+)。

```bash
npm install
```

這會根據 `package.json` 和 `package-lock.json` 把所有 hexo 相關套件裝回 `node_modules/`,通常幾分鐘搞定。

### Step 3: 開始用
```bash
# 本地預覽
hexo s
# → 開 http://localhost:4000 看

# 部署上線
hexo c && hexo g && hexo d
```

`db.json` 和 `public/` 會在第一次 `hexo g` 或 `hexo s` 自動產生,**完全不用手動備份**。

## 部署相關設定要不要還原?

`hexo d` 第一次執行時:
- 會去讀 `_config.yml` 的 `deploy.repo` 設定
- 自動 `git clone` 那個 repo 到 `.deploy_git/`
- 之後就用 `.deploy_git/` 當部署 workspace

所以 **`.deploy_git/` 是自動建立的,不需要備份**。前提是你 `_config.yml` 的 deploy 設定正確:

```yaml
deploy:
  type: git
  repo: https://github.com/estellacoding/blog
  branch: master
```

## 如果要備份的東西不只這些?

如果你之後有檔案不想推上 GitHub(例如 API key、私密筆記),記得加進 `.gitignore`:

```gitignore
# 自訂排除
.env
secrets/
private-notes/
*.local.yml
```

但這些檔案就**真的會掉**(因為沒推到 GitHub),所以要自己用其他方式備份(例如雲端硬碟、密碼管理器)。

## 注意事項

1. **`themes/next/` 是推上去的**(330 個檔案),因為你客製化過裡面的 `_config.yml`。不要誤把它加進 `.gitignore`,不然換電腦會掉主題設定。
2. **絕對不要 commit `node_modules/`**,即使 `.gitignore` 漏掉也別推,因為:
   - 體積動輒上百 MB
   - 不同作業系統的 binary 不相容(例如 macOS 推上去,Windows clone 下來會壞)
3. **`package-lock.json` 一定要推**,它鎖定了每個套件的精確版本,確保不同電腦裝出來的環境一致。
