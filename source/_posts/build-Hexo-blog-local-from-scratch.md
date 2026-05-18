---
title: 從零開始在本地端架設 Hexo 部落格
date: 2024-05-17 11:11:11
updated: 2024-05-20 11:11:11
tags: 
  - Hexo
  - Blog
  - Tutorial
categories: Hexo
comments: true
---

主要說明如何從零開始在本地端架設 Hexo 部落格。本文詳細說明安裝工具、初始化、更改部落格基本資訊和本地端啟動 Hexo 部落格的步驟。
<!-- more -->

# 安裝工具
## 安裝 Node.js 及 Git

先安裝 Node.js 及 Git
- [Node.js](https://nodejs.org/en)
- [Git](https://git-scm.com/)

檢查 Node.js 及 Git 是否安裝成功，有出現版本號應該就沒問題。
{% codeblock %}
daistella@DaiMacAirM2 ~ % node -v
v20.13.1
daistella@DaiMacAirM2 ~ % npm -v
10.5.2
daistella@DaiMacAirM2 ~ % git -v
git version 2.43.0
{% endcodeblock %}

其他 Hexo 語法請看 [Hexo官方文件](https://hexo.io/zh-tw/docs/)。

## 安裝 Hexo 的指令工具
{% codeblock %}
npm install -g hexo-cli
{% endcodeblock %}

如果出現 `Error: EACCES: permission denied` 錯誤，可加入 sudo 安裝 Hexo 的指令工具。
{% codeblock %}
`Error: EACCES: permission denied, mkdir '/usr/local/lib/node_modules/hexo-cli'
{% endcodeblock %}

{% img [class names] https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fhexo-1%2Fhexo-install-2.png?alt=media&token=465d42db-474c-4bc7-a54a-48a36699386b [80%] [80%] '"title text" "alt text"' %}

以超級使用者的權限，全局安裝 Hexo CLI 工具，可以在系統的任何地方使用 `hexo` 指令來管理 Hexo 所架設的部落格。
- sudo: 以超級使用者（root）權限執行命令。
- npm: Node.js 的包管理器，用於安裝、更新和管理 JavaScript 程式包。
- install hexo-cli: 安裝 Hexo CLI。安裝 Hexo CLI 之後，你可以使用 `hexo` 指令來初始化、生成、部署等指令來管理 Hexo 部落格。
- g: 全局安裝，即把模組安裝在全局範圍，而不是當前專案的 node_modules 目錄中。全局安裝後，可以在系統的任何地方使用這個模組提供的指令。

{% codeblock %}
sudo npm install -g hexo-cli
{% endcodeblock %}

{% img [class names] https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fhexo-1%2Fhexo-install-3.png?alt=media&token=93dfef60-2dd8-4225-aae4-d8f2753031a2 [80%] [80%] '"title text" "alt text"' %}

檢查Hexo的指令工具是否安裝成功
{% codeblock %}
hexo -v
{% endcodeblock %}

{% img [class names] https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fhexo-1%2Fhexo-install-4.png?alt=media&token=6af8f292-1253-447f-9fe0-7a5ae926d01c [80%] [80%] '"title text" "alt text"' %}

# 創建 Hexo

在指定資料夾中初始化一個新的 Hexo 專案。
{% codeblock %}
hexo init <folder>
{% endcodeblock %}

{% img [class names] https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fhexo-1%2Fhexo-build-1.png?alt=media&token=eb110cdc-3dd5-4a58-b183-3209c0258d88 [80%] [80%] '"title text" "alt text"' %}

切換到該專案資料夾中，安裝所有必需的 npm 套件，`npm install` 會根據 package.json 檔案中的所列套件(dependencies)下載並安裝，以確保 Hexo 專案可以正常運行。
{% codeblock %}
cd <folder>
npm install
{% endcodeblock %}

{% img [class names] https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fhexo-1%2Fhexo-build-2.png?alt=media&token=1b63478d-6b5d-4ad9-a946-4fe1cef58bf3 [80%] [80%] '"title text" "alt text"' %}

安裝完成後，專案資料夾就會有以下檔案。
{% img [class names] https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fhexo-1%2Fhexo-build-3.png?alt=media&token=921609c7-5eb2-4e5d-bcb6-ee2c08a9b652 [80%] [80%] '"title text" "alt text"' %}

# 更改部落格基本資訊
進入專案資料夾下的 _config.yml，可以修改部落格的基本資訊，以下是我先修改的地方，`permalink` 的預設值是 `:year/:month/:day/:title/`，不過我只想保留 `title/` 就好。
- title: 網站標題
- subtitle: 網站副標題
- author: 作者名字
- timezone: 時區
- permalink: 文章永久連結的格式

{% codeblock %}
title: Stella Coding
subtitle: 'Nothing is impossible.'
author: Stella
timezone: 'Asia/Taipei'

permalink: :title/
{% endcodeblock %}

其他 Hexo 配置語法請看 [Hexo官方文件-配置](https://hexo.io/zh-tw/docs/configuration)。

# 本地端啟動部落格
{% codeblock %}
hexo server
{% endcodeblock %}

如果出現 `Error: ERROR Cannot find module 'hexo'` 的錯誤，可加入 sudo 更改權限並重新安裝。

{% codeblock %}
Error: ERROR Cannot find module 'hexo' from '/Users/daistella/Documents/github_repo/stellacoding'
{% endcodeblock %}

將 .npm 目錄及其所有子目錄和文件的所有權，更改用戶和群組，以解決因權限導致的 npm 安裝錯誤。
- sudo: 以超級使用者（root）權限執行命令。
- chown：更改文件或目錄的所有者。
- R：遞歸地更改目錄下所有文件和子目錄的所有者。
- 501:20：指定新的所有者和群組。501 是用戶 ID（UID），20 是用戶群組 ID（GID）。
  - 可以使用 `id` 指令來查找這些 ID。
{% codeblock %}
uid=501(daistella) gid=20(staff) groups=20(staff),12(everyone),61(localaccounts),79(_appserverusr),80(admin),81(_appserveradm),98(_lpadmin),701(com.apple.sharepoint.group.1),33(_appstore),100(_lpoperator),204(_developer),250(_analyticsusers),395(com.apple.access_ftp),398(com.apple.access_screensharing),399(com.apple.access_ssh),400(com.apple.access_remote_ae)
{% endcodeblock %}
- `/Users/daistella/.npm`：要更改所有者的目錄。這個目錄是 npm 在主目錄中儲存其全局配置和緩存的地方。

{% codeblock %}
sudo chown -R 501:20 "/Users/daistella/.npm"
{% endcodeblock %}

先強制刪除當前的 node_modules 目錄，以確保沒有殘留的舊文件或損壞的套件，然後強制重新安裝所有 package.json 檔案中的所列套件。
{% codeblock %}
rm -rf node_modules && npm install --force
{% endcodeblock %}

出現 `Hexo is running at http://localhost:4000/blog` 表示成功。

{% img [class names] https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fhexo-1%2Fhexo-local-activate-1.png?alt=media&token=41e3418a-97cb-4c5a-b1c3-aae3f6fbd4d6 [80%] [80%] '"title text" "alt text"' %}

點擊該連結 http://localhost:4000/blog 即可連至本地端 Hexo 部落格。

{% img [class names] https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fhexo-1%2Fhexo-local-activate-2.png?alt=media&token=06e87360-24bc-485d-b8e0-61a2fe44acb9 [80%] [80%] '"title text" "alt text"' %}

其他 Hexo 架站說明請看 [架設部落格第一次就上手 Hexo + Github + 自訂網域](https://chanchandev.com/note/Hexo/hexo-introduction/2335841689/)。