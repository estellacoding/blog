# Hexo Blog 日常工作流程

這份文件說明 branch 架構、寫文章到部署的流程、部署訊息、常用指令，以及改主題後沒有生效時的排查方式。

相關文件：

- 備份與換電腦還原：[hexo-backup-and-restore.md](hexo-backup-and-restore.md)
- 主題客製化、npm 套件、文章範本：[hexo-customization.md](hexo-customization.md)

## Branch 架構

GitHub repo `estellacoding/blog` 有兩個 branch，各自存放不同的內容，彼此不會干擾。

| Branch | 內容 | 用途 | commit 由誰建立 |
|---|---|---|---|
| `source` | `source/`、`themes/`、`_config.yml`、`scaffolds/`、`docs/` 等原始檔 | 版本控制自己寫的東西，本地 working tree 平常就在這個 branch | **自己**手動 commit |
| `master` | `public/` 編譯後的 HTML/CSS/JS | GitHub Pages 從這裡讀取網站內容 | `hexo deploy` **自動**產生 |

為什麼要分成兩個 branch：

- `master` 放的是給瀏覽器讀的成品。每次部署都會把整個內容換掉，而且是用 `--force` push。
- `source` 放的是原稿，也就是 markdown、設定檔和主題客製化，這才是真正需要版本控制的地方。
- 如果兩種東西放在同一個 branch，diff 會被編譯產物淹沒，部署時也可能把自己的 commit 蓋掉。

相關設定：

- 本地 `origin` 指向 `https://github.com/estellacoding/blog.git`，working tree 追蹤 `origin/source`。
- `_config.yml` 設定部署到 `master`：

  ```yaml
  deploy:
    type: git
    repo: https://github.com/estellacoding/blog
    branch: master
  ```

- GitHub Pages 在 repo 設定中指定從 `master` 讀取網站內容，網址是 `https://estellacoding.github.io/blog`。

## 寫文章到上線的流程

```bash
# 1. 建立文章（套用 scaffolds/post.md），然後開始寫
hexo new "my-new-post"
code source/_posts/my-new-post.md

# 2. 本地預覽（不會動到 git）
hexo s
# 打開 http://localhost:4000/blog/

# 3a. 原始檔 commit 到 source branch
git add source/_posts/my-new-post.md
git commit -m "post: add my-new-post"
git push

# 3b. 部署網站（自動 commit + push 到 master）
npm run deploy
```

**一定要先完成 3a，再做 3b。** `npm run deploy` 執行前會自動檢查：只要 `source` 有未 commit 或未 push 的變更，就會拒絕部署。這樣可以確保網站上線的版本都能在 GitHub 的 `source` 找到對應的原稿。

## 部署 commit 訊息

`npm run deploy` 會把 `source` 最新 commit 的 hash 和標題當成部署訊息（取代 hexo-deployer-git 預設的 `Site updated: <時間>`）：

```
Deploy 8694ee03: post: move unfinished Karpathy draft out of source
```

看到 `master` 的任何一筆部署，都能用 hash 對回 `source`，例如 `git show 8694ee03`，找出網站上線時的原稿狀態。

`package.json` 裡的設定：

| script | 作用 |
|---|---|
| `predeploy` | 執行 `npm run deploy` 前，npm 會自動先跑這個：<br>• `git status --porcelain` 不是空的（有未 commit 的變更）→ 擋下<br>• `HEAD` 不在 `origin/source` 上（有未 push 的 commit）→ 擋下 |
| `deploy` | `hexo clean && hexo deploy -g -m "Deploy <hash>: <subject>"` |

部署訊息不另外寫 conventional commit（`post:`、`feat:` 等），因為有意義的紀錄已經在 `source` 的 commit 上，而且一次部署常包含好幾個 commit。

需要自訂訊息時可以直接執行 `hexo clean && hexo deploy -g -m "訊息"`，但這樣**不會**經過 `predeploy` 的檢查。

## 指令備忘

| 指令 | 縮寫 | 動作 | 會動到 git 嗎？ |
|---|---|---|---|
| `hexo clean` | `hexo cl` | 刪除 `db.json` 和 `public/` | 不會 |
| `hexo generate` | `hexo g` | 把 markdown 編譯成 HTML，輸出到 `public/` | 不會 |
| `hexo server` | `hexo s` | 在本地 http://localhost:4000/blog/ 預覽 | 不會 |
| `hexo deploy` | `hexo d` | 把 `public/` push 到 `master` | **會自動 commit + push** |
| `hexo deploy -g` | `hexo d -g` | 先 generate，再 deploy | 會 |

> ⚠️ **不要用 `hexo c`**。`c` 同時符合 `clean` 和 `config`，Hexo 無法判斷是哪一個，只會印出說明而不會清除任何東西。clean 的縮寫要寫成 `hexo cl`。

常用組合：

- 本地預覽：`hexo cl && hexo s`
- 部署上線：`npm run deploy`（先檢查 source 狀態，再執行 clean + generate + deploy，自動帶入部署訊息）

`package.json` 另外定義了 `npm run build`、`clean`、`server`，作用和對應的 hexo 指令一樣。

## 改了沒生效：強制重建

### 關鍵原則

**先停掉正在跑的 `hexo s`，再執行 clean。** 如果 server 還在跑，clean 之後 server 可能還在送舊的產出。

| 情境 | 做法 |
|---|---|
| 改文章內容 | `hexo s` 通常會自動 reload，不用重來 |
| 改主題 stylus / css | `hexo cl && hexo s` |
| 改主題 `.js`、`_config.yml`、tag plugin | 先 Ctrl+C 停掉 server，再執行 `hexo cl && hexo g && hexo s` |

### 確認真的有重新產生

```bash
ls -la public/index.html   # 看 mtime 是不是剛剛的時間
```

### Ctrl+C 沒停乾淨時的強制做法

如果有好幾個 terminal 都開過 `hexo s`，或是 Ctrl+C 沒有真的停掉 server：

```bash
pkill -f hexo            # 結束所有 hexo 行程
hexo clean && hexo generate && hexo server
```

### 確認 server 送出的是新內容

```bash
diff <(curl -s http://localhost:4000/blog/your-post/) public/your-post/index.html
```

沒有輸出代表兩邊一致。如果有差異，代表 server 還在送舊版，需要重啟。
