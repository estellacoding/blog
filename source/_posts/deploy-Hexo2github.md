---
title: 如何部署 Hexo 部落格到 GitHub Pages
date: 2024-05-20 11:11:11
updated: 2024-05-27 11:11:11
tags:
  - Hexo
  - Blog
  - Tutorial
  - GitHub
  - GitHub Pages
categories: Hexo
comments: true
---

當設定好 Hexo 基本設定及完成文章撰寫後，就可以公開發佈了 <i class="fa-solid fa-face-laugh-squint" style="color: #0091ff;"></i>。本文主要說明如何部署 Hexo 部落格網站到 GitHub Pages。從建立 GitHub Repo 的命名注意事項、安裝 Hexo 一鍵佈署工具、修改 Hexo config 檔案，到最後部署時 GitHub Pages 的相關設定。
<!-- more -->

# 建立 GitHub Repo
要先完成 Git 安裝及 GitHub 帳號申請。在 [這篇](https://estellacoding.github.io/blog/build-Hexo-blog-local-from-scratch/#%E5%AE%89%E8%A3%9D-Node-js-%E5%8F%8A-Git) 文章中有提到，Git 安裝方式及檢查 Git 是否安裝成功。另外，也需完成 [申請 Github 帳號](https://github.com/)。

{% note info %}
注意 repo 名稱會決定部落格網址!
{% endnote %}

1. `<你的 GitHub 使用者名稱>.github.io/<repository 的名字>`
    - 如果你希望部落格網址是 `<你的 GitHub 使用者名稱>.github.io/<repository 的名字>`
    - repo 的名字可以任意，如 blog or hexo。
    - 最後呈現的網址就會像我一樣，如 estellacoding.github.io/blog。

2. `<你的 GitHub 使用者名稱>.github.io/`
    - 如果你希望部落格網址是 `<你的 GitHub 使用者名稱>.github.io`
    - repo 的名字請直接輸入 `<你的 GitHub 使用者名稱>.github.io`，如 estellacoding.github.io。
    - <你的 GitHub 使用者名稱>是 GitHub 上的 username。
    - 最後呈現的網址就如 estellacoding.github.io。

我選擇用 `estellacoding.github.io/blog` 呈現部落格的原因是，為了以後可能會將 `estellacoding.github.io` 當成我的主頁，所以目前就想先空下這個地方，設計我的網站主頁。~~需要強大的時間管理，希望不會一直都空著。~~

![cute as me, why need to work](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/meme%2Fcute-as-me%2Cwhy-need-to-work.jpg?alt=media&token=05035a68-c532-40b5-b2c7-f96936bc5d78)

# 安裝 Hexo 部署工具
Hexo 提供了快速方便的<mark>一鍵佈署</mark>功能，讓您只需一個指令就能將網站佈署到伺服器上。

## 安裝 [hexo-deployer-git](https://github.com/hexojs/hexo-deployer-git)
{% codeblock %}
npm install hexo-deployer-git --save
npm list hexo-deployer-git
{% endcodeblock %}

![安裝hexo-deployer-git](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fhexo-4%2Fhexo-deploy2github-1.png?alt=media&token=d4ecc720-ddd5-495e-bedb-b8d4c41bb6a5)

## 修改 Hexo config
### Deployment
進入專案根目錄資料夾底下的 _config.yml，找到 `# Deployment` 區域，通常在最下面。
{% note info %}
是專案根目錄資料夾底下的 config 檔
(不是 themes/next 資料夾底下的 config 檔)
{% endnote %}

{% codeblock %}
# Deployment
## Docs: https://hexo.io/docs/one-command-deployment
deploy:
  type: git
  repo: https://github.com/estellacoding/blog
  branch: master
{% endcodeblock %}

| 選項 | 描述 | 預設 |
| - | - | - |
| repo   | 儲存庫（Repository）網址| |
| branch | 分支名稱 | gh-pages (GitHub)<br>coding-pages (Coding.net)<br>master (其他) |
| message| 自訂提交訊息 | `Site updated: {{ now('YYYY-MM-DD HH:mm:ss') }}`|

其他 Hexo 部署語法請看 [Hexo官方文件-佈署](https://hexo.io/zh-tw/docs/one-command-deployment)。

### URL
進入專案根目錄資料夾底下的 _config.yml，找到 `# URL` 區域，位置在 14 行。在第 16 行的 `url`，<mark>將剛才第一步所建立好的部落格網址放進 url 中</mark>。
{% note info %}
url 後面不要加「/」喔!
{% endnote %}
{% codeblock %}
# URL
## Set your site url here. For example, if you use GitHub Page, set url as 'https://username.github.io/project'
url: https://estellacoding.github.io/blog
{% endcodeblock %}

# 部屬
正式進入部署前，可以先在本機啟動部落格。
{% codeblock %}
hexo clean && hexo generate && hexo server
hexo c && hexo g && hexo s
{% endcodeblock %}

## 一鍵部署指令
修改好 _config.yml 後，終於可以準備部署了。~~從架設+寫文+部署花了我5天R~~。
{% codeblock %}
hexo clean # 清除快取檔案 (db.json) 和已產生的靜態檔案 (public)
hexo generate # 產生靜態檔案
hexo deploy # 部署網站
{% endcodeblock %}
感謝這位 Robert 大神提供的懶人打法 [使用hexo在github上建立個人網頁website](https://poyu-liao.github.io/blog/2022/02/10/%E4%BD%BF%E7%94%A8hexo%E5%9C%A8github%E4%B8%8A%E5%BB%BA%E7%AB%8B%E5%80%8B%E4%BA%BA%E7%B6%B2%E9%A0%81website/#%E9%83%A8%E7%BD%B2%E5%88%B0-github)
{% codeblock %}
hexo clean && hexo generate && hexo deploy
hexo c && hexo g && hexo d
{% endcodeblock %}

![Hexo deploy 2 github-1](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fhexo-4%2Fhexo-deploy2github-2.png?alt=media&token=4fda6c3e-0b51-482d-9131-e999eafc93bb)

![Hexo deploy 2 github-2](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fhexo-4%2Fhexo-deploy2github-3.png?alt=media&token=a9f92fa0-93f6-4c02-ae79-e9d062ba70f9)

## 開啟 GitHub Pages
進入該 Repo (如我的是blog) 的 Settings，點擊左側功能欄中的 Pages，將 `Branch` 改成 `master` 後，點擊右方的 `save`。
![更改GitHub Pages的Branch設定](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fhexo-4%2Fhexo-deploy2github-4.png?alt=media&token=9a8f31dc-5fee-4a61-a1ec-9adb53710521)

重新整理本頁面，就會出現 `Your site is live at https://estellacoding.github.io/blog`。
![重新整理GitHub Pages頁面](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fhexo-4%2Fhexo-deploy2github-5.png?alt=media&token=18cc1e1e-9b51-4542-8815-87f4973c8946)

點擊該連結 `https://estellacoding.github.io/blog`，有出現網站就成功囉。
![重新整理GitHub Pages頁面](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fhexo-4%2Fhexo-deploy2github-6.png?alt=media&token=a061664b-c728-4cdc-94b0-d86410495e94)

其他 Hexo 部署語法請看 [Hexo官方文件-佈署](https://hexo.io/zh-tw/docs/one-command-deployment)。
其他 Hexo 部署說明請看 [(11) 試著學 Hexo - 部署你的第一個部落格](https://ithelp.ithome.com.tw/articles/10242893)。

