---
title: 如何使用 Local + GitHub + Zeabur 實現 WordPress 外掛的 CI/CD 自動部署
date: 2025-08-07 11:11:11
updated: 2025-08-07 11:11:11
tags:
  - WordPress
  - GitHub
  - Zeabur
  - CI/CD
categories: WordPress
comments: true
---

最近在開發 WordPress 外掛時，遇到一個經常重複的流程:

> 本地開發 → 手動打包 → 上傳到WordPress → 測試 → 修bug → 再打包...

每次修改都要花 3-5 分鐘手動打包、上傳、測試，一天重複 10 次，就是將近 1 小時。不是在寫程式，而只是在搬檔案。這些時間累積起來...是什麼?是再也回不來的青春歲月!(你說這時間拿來盯著bug看體悟無常也不錯)。而這就是為什麼需要 CI/CD，一個持續整合與部署的自動化流程。

<!-- more -->

# 為什麼需要CI/CD?
透過自動化部署流程，我們可以:

- 大幅提升開發效率: `git push` 之後，雲端自動更新，省下重複操作的時間。
- 完整的版本控制: 每一次提交都有記錄，改了什麼、何時改的，一目了然。
- 回復前版本能力: 一旦出問題，立刻切換到上一個穩定版本，不再手忙腳亂。
- 專注在開發而不是部署: 讓工具處理重複性工作，只需要專注在功能開發。

本篇分享我是怎麼實現這個流程，一步一步帶你實作每次 WordPress 外掛部署時自動更新至雲端主機:

> Local 開發 → GitHub 版本控制 → Zeabur 自動部署 → 雲端 WordPress 外掛自動更新

# 使用的工具

1. [Local](https://localwp.com/) — 最佳本地 WordPress 開發工具
   - 一鍵建立本地 WordPress 環境
   - 支援 SSL、SSH、WP-CLI、資料庫管理
   - 開發體驗極佳，適合外掛與主題開發

2. [GitHub](https://github.com/) — 版本控制中心
   - 免費程式碼存放倉庫
   - Git 的版本控制，還有分支、合併、回復前版本

3. [Zeabur](https://zeabur.com/referral?referralCode=stelladai1028) — 無伺服器雲平台
   - 提供 WordPress 模板可一鍵安裝
   - 支援 GitHub 專案自動部署
   - 可搭配 Docker 自定義啟動邏輯
   - 按用量計費，用多少付多少

# 第一步: 建立Repo
1. 前往 [GitHub](https://github.com/)
2. 建立新的 repo
3. 命名 repo，例如我的是: `haoyangder-notification`
4. 可見性: 公開或私人皆可
5. 建議選項
   - 勾選「Add README」(非必要)
   - `.gitignore` 可先不選，稍後我們手動建立
   - License: 可選「GNU General Public License v2.0」
6. 建立後你會取得一組遠端 Repo 連結:
   - `https://github.com/yourusername/haoyangder-notification.git`

# 第二步: 使用Local

## 安裝Local
1. 安裝 [Local](https://localwp.com/)
2. 建立新的 WordPress 專案
3. 建立新的外掛資料夾及程式碼
4. 專案結構說明: 
   Local 建立的 WordPress 專案結構通常是這樣:
```
your-local-site/
├── app/
│   ├── public/ ← WordPress 檔案都在這裡
│   │   ├── wp-admin/
│   │   ├── wp-includes/
│   │   ├── wp-content/
│   │   │   ├── themes/
│   │   │   └── plugins/
│   │   │       └── haoyangder-notification/ ← 外掛在這裡(範例外掛名稱)
│   │   ├── wp-config.php
│   │   └── ...
│   └── sql/
├── conf/
└── logs/
```

## 設定Git版本控制
在 Local 專案根目錄下設定 Git 版控。
```
# 進入專案資料夾(Local專案根目錄)
cd haoyangder-notification
# 初始化Git
git init
```

## 創建.gitignore
這段 `.gitignore` 的目的是:「只追蹤我正在開發的那個外掛，其餘整包 WordPress 與 Local 產生的檔案都排除」，所以 GitHub repo 裡面只會出現我的外掛內容、.gitignore、Dockerfile、README.md等，整包 WordPress 都不會上傳，也不會同步 Local 的環境設定相關檔案。
```
# 忽略所有檔案
*

# 但保留我們需要的
!.gitignore
!Dockerfile
!README.md

# 只保留我們的外掛
!app/
!app/public/
!app/public/wp-content/
!app/public/wp-content/plugins/
!app/public/wp-content/plugins/haoyangder-notification/
!app/public/wp-content/plugins/haoyangder-notification/**

# 忽略系統檔案
.DS_Store
Thumbs.db
*.log

# 忽略Local相關檔案
conf/
logs/
```

## 創建Dockerfile
這個 `Dockerfile` 的目的是:「為了部署到 Zeabur 的 WordPress 環境時，自動把正在開發的外掛複製到容器內的 wp-content/plugins 裡面」。

每次 Zeabur 重新部署時，Docker 都會做以下事情:
1. 啟動一個全新的 WordPress 容器
2. 將外掛自動複製到正確位置
3. 其他 WordPress 檔案完全不變

這就是為什麼我們可以做到 「只更新外掛」而不更動整個 WordPress 系統的關鍵。
```
FROM wordpress:latest

# 建立一個自定義啟動腳本
RUN echo '#!/bin/bash' > /custom-entrypoint.sh && \
    echo 'echo "Copying plugin files..."' >> /custom-entrypoint.sh && \
    echo 'mkdir -p /var/www/html/wp-content/plugins/haoyangder-notification/' >> /custom-entrypoint.sh && \
    echo 'cp -r /tmp/plugin/* /var/www/html/wp-content/plugins/haoyangder-notification/ 2>/dev/null || true' >> /custom-entrypoint.sh && \
    echo 'chown -R www-data:www-data /var/www/html/wp-content/plugins/haoyangder-notification/' >> /custom-entrypoint.sh && \
    echo 'chmod -R 755 /var/www/html/wp-content/plugins/haoyangder-notification/' >> /custom-entrypoint.sh && \
    echo 'exec docker-entrypoint.sh "$@"' >> /custom-entrypoint.sh && \
    chmod +x /custom-entrypoint.sh

# 將外掛原始碼複製進容器的暫存區
COPY app/public/wp-content/plugins/haoyangder-notification/ /tmp/plugin/

ENTRYPOINT ["/custom-entrypoint.sh"]
CMD ["apache2-foreground"]
```

![local-github-zeabur-wp-plugin-cicd-1](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Flocal-github-zeabur-wp-plugin-cicd%2Flocal-github-zeabur-wp-plugin-cicd-1.png?alt=media&token=d28e5ee9-ce41-422d-aec7-ce15590f9f11)


## 推送到GitHub
完成 .gitignore 和 Dockerfile 的設定之後，下一步就是將外掛專案推送到 GitHub。
```
# 進入專案資料夾
cd haoyangder-notification
# 加入檔案
git add .
# 檢查會被加入的檔案
git status
```
應該只會看到:
- app/public/wp-content/plugins/haoyangder-notification/ 下的檔案
- .gitignore
- Dockerfile

```
# 提交
git commit -m "Initial commit: haoyangder-notification plugin from Local"

# 連接到GitHub(替換成你的repo網址)
git remote add origin https://github.com/yourusername/haoyangder-notification.git

# 推送到GitHub
git branch -M main
git push -u origin main
```

# 第三步: 部署到Zeabur
現在，我們要把前面準備好的 GitHub 專案部署到 Zeabur，讓每次更新外掛時都能自動同步到雲端 WordPress 網站。

## 註冊Zeabur並獲得獎勵

如果你還沒有帳號，可使用 [我的推薦連結](https://zeabur.com/referral?referralCode=stelladai1028) 註冊 (若為首次升級我們可以各獲得 $5 使用金喔 🎁)。

## 使用Zeabur WP部署模板

前往 [Zeabur Templates](https://zeabur.com/zh-TW/templates/CV344X)。點選「部署」，Zeabur 會快速建立一個 WordPress 專案，等待服務初始化完成，即可進入 WordPress 設定畫面。

## 雲端WP網站正式上線

服務初始化完成後，Zeabur 會分配一組免費子網域，例如: `https://your-site.zeabur.app`。可以進入這個網址後台，先處理 WordPress 基本設定。

## 綁定GitHub部署來源

讓 Zeabur 在你每次 `git push` 時，自動重新部署外掛。操作步驟如下:

1. 進入 Zeabur 控制台 → 點選你的專案 → 點選「服務: wordpress」
2. 切換到上方的「設定」分頁
3. 找到「來源」→「GitHub 儲存庫」→ 點選「綁定 GitHub 儲存庫」
4. 選擇你第一步所建立的 GitHub 專案，例如我的是: `haoyangder-notification`
5. 選擇分支 main
6. 啟動指令: 留空即可，Zeabur 會自動使用 Docker 預設啟動方式
7. 儲存設定

![local-github-zeabur-wp-plugin-cicd-2](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Flocal-github-zeabur-wp-plugin-cicd%2Flocal-github-zeabur-wp-plugin-cicd-2.png?alt=media&token=fbd332e9-6a66-4c61-a1a7-8b9242c1def9)


# 第四步: 更新外掛
自動化流程已經準備好囉 🤤。現在，每次你在外掛中完成新功能或修復 Bug後，只需要以下指令，剩下的就交給 CI/CD 自動處理了。
```
git add .
git commit -m "fix: resolve encoding issue in notification message"
git push
```
接下來，Zeabur 會自動偵測到 GitHub 儲存庫的變更，並觸發建置流程。

## Zeabur會怎麼處理?
1. 自動偵測 Dockerfile: Zeabur 發現專案根目錄有 `Dockerfile`，便會啟動容器建置流程。如果一切正常，會看到建置日誌開始執行。
2. 開始建置映像檔
   - 拉取 `wordpress:latest` 基礎映像
   - 執行 `custom-entrypoint.sh` 腳本
   - 將最新版的 `haoyangder-notification` 外掛複製進容器
   - 完成建置後，部署到雲端環境
3. 即時更新雲端 WordPress 外掛
4. 若有錯誤，可進入「記錄」查看詳細錯誤訊息

部署成功後，雲端 WordPress 就會是新外掛版本，不需手動上傳囉！

![local-github-zeabur-wp-plugin-cicd-3](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Flocal-github-zeabur-wp-plugin-cicd%2Flocal-github-zeabur-wp-plugin-cicd-3.png?alt=media&token=28dcadcc-6120-4c1f-81a1-6c5b7de2b1d2)

![local-github-zeabur-wp-plugin-cicd-4](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Flocal-github-zeabur-wp-plugin-cicd%2Flocal-github-zeabur-wp-plugin-cicd-4.png?alt=media&token=ef778603-dea5-4359-b851-c4ccfb7e85d2)

![local-github-zeabur-wp-plugin-cicd-5](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Flocal-github-zeabur-wp-plugin-cicd%2Flocal-github-zeabur-wp-plugin-cicd-5.png?alt=media&token=6078458a-37e2-4339-b04e-f608f7a50760)

# 重點回顧

透過打造「Local + GitHub + Zeabur 實現 WordPress 外掛的 CI/CD 自動部署」工作流，我們實現了真正高效、穩定的 WordPress 外掛開發流程。

- 開發體驗佳: 繼續使用熟悉的 Local 開發環境。
- 版本控制: 每一次修改都清楚記錄在 GitHub。
- 真正的自動化部署: `git push` 後，Zeabur 自動更新雲端外掛，不用手動上傳。
- 精準更新範圍: 只同步外掛檔案，WordPress 核心、主題、其他外掛不受影響。
- 可回復前版本: 一旦發現問題，可快速切回到上一版本，穩定性大幅提升。

希望這篇文章能幫助你建立屬於自己的 WordPress 開發工作流程！