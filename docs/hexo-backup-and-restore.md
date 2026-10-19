# Hexo Blog 備份與還原

這份文件說明哪些檔案有推上 GitHub、哪些沒有，以及換電腦、重灌或刪掉本地資料夾後怎麼完整還原。

相關文件：

- 寫作與部署流程：[hexo-workflow.md](hexo-workflow.md)
- 主題與套件說明：[hexo-customization.md](hexo-customization.md)

## 結論

`source` branch 加上 `npm install` 就能還原所有原稿、主題和設定。本地資料夾刪掉後重新 clone，**文章發佈和網站功能都不會受影響**。

唯一要注意的是 `.deploy_git/`，詳見[還原步驟](#還原步驟)的第 3 步。

## 推與不推

```
blog/
├── .github/dependabot.yml  ✅ 推（npm 套件更新，見 hexo-customization.md）
├── .gitignore              ✅ 推
├── _config.yml             ✅ 推（hexo 全域設定，含 deploy 設定）
├── package.json            ✅ 推（依賴清單與 deploy script）
├── package-lock.json       ✅ 推（鎖定精確版本，不同電腦才會裝出一樣的環境）
├── scaffolds/              ✅ 推（新文章範本）
├── source/                 ✅ 推（_posts、_drafts、頁面、_data）
├── themes/next/            ✅ 推（主題與客製化，一定要推）
├── docs/                   ✅ 推（這些說明文件）
├── node_modules/           ❌ 不推，npm install 重建
├── public/                 ❌ 不推，hexo g 重建；線上版本在 master branch
├── db.json                 ❌ 不推，hexo 快取，自動產生
├── .deploy_git/            ❌ 不推，部署 workspace，見下方說明
└── _multiconfig.yml        ❌ 不推，用 --config a.yml,b.yml 時 hexo 產生的暫存檔
```

`.gitignore` 也排除了 `.DS_Store`、`Thumbs.db`、`*.log` 這些系統檔和 log。

如果之後有 API key、私密筆記這類不想推的檔案，也可以加進 `.gitignore`。但這些檔案**只存在本地**，刪掉資料夾或換電腦就會消失，要自己另外備份。

## 還原步驟

可以自己照著做，也可以在要放 blog 的上層資料夾開啟 Claude Code，請它「依照 docs/hexo-backup-and-restore.md 還原 blog」。

**刪掉本地資料夾前**，先確認東西都已經推上 GitHub：

```bash
git status --short && git log origin/source..HEAD --oneline   # 兩者都沒有輸出才安全
```

### 1. 環境

```bash
node -v          # 建議 18 以上（目前使用 v22）
git --version
hexo version || npm install -g hexo-cli   # 也可以不裝，改用 npx hexo ...
```

新電腦需要先能 push 到 GitHub，例如用 `gh auth login` 或 credential helper，否則部署會失敗。

### 2. clone 原稿並安裝套件

```bash
git clone -b source https://github.com/estellacoding/blog.git blog
cd blog
npm install
```

### 3. 還原 .deploy_git（保留 master 部署歷史）

```bash
git clone -b master https://github.com/estellacoding/blog.git .deploy_git
```

`hexo-deployer-git` 發現沒有 `.deploy_git/` 時，**不會**從遠端 clone，而是會：

1. `git init` 一個全新的空 repo，然後 commit `First commit`
2. 把 `public/` 複製進去，再 commit
3. 用 `git push --force` 推到 `master`

這樣網站內容一樣正常，但 `master` 原本的部署歷史會被覆蓋，只剩兩筆。如果不在意部署歷史，這一步可以跳過。

### 4. 驗證

```bash
git status -sb                         # 應該是 ## source...origin/source，沒有變更
git -C .deploy_git log --oneline -1    # 應該是最近一次部署（Site updated / Deploy <hash>）
hexo cl && hexo g                      # 不應該有 ERROR
hexo s                                 # http://localhost:4000/blog/ 可以正常瀏覽
```

**還原時不要部署。** 等使用者確認之後，再依照 [hexo-workflow.md](hexo-workflow.md#寫文章到上線的流程) 部署。

## 為什麼不直接把 .deploy_git commit 進 source？

- **推不上去**：`.deploy_git/` 本身是 git repo。`git add` 只會記一個 gitlink（指向某個 commit 的指標），裡面的檔案和歷史都不會被收進去，clone 下來只會拿到空資料夾。
- **只複製檔案也沒用**：等於把 `public/` 再存一份到 `source`。repo 會變大，每次部署都會多出大量 diff，而且還是沒有 `master` 的歷史。
- **改用 submodule 更麻煩**：每次部署後 submodule 指向的 commit 都會變，`source` 會一直出現待 commit 的變更。

`master` 的內容和歷史本來就完整存在 GitHub 上，還原時多跑第 3 步那一行就能拿回來。
