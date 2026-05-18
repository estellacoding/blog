---
title: 部署 Hexo 時無法打開「fsevents.node」
date: 2024-07-07 11:11:11
updated: 2024-07-07 11:11:11
tags: 
  - Hexo
  - Tutorial
  - fsevents
categories: Hexo
comments: true
---

若在部署 Hexo 時，出現無法打開「fsevents.node」的錯誤，可以試著用以下方式解決。
<!-- more -->

![fsevents.node](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Ffsevents-node-issue%2Ffsevents-node-issue.png?alt=media&token=8a1e8256-044a-4559-a27d-974e7a53f32f)

# 確認 fsevents 版本
確認 fsevents 在 package.json 中的版本，打開您的 package.json 檔，查看 fsevents 的版本。我的 `fsevents` 版本為 2.3.3，通常支持 Node.js 10.x 至 14.x。

![fsevents-version-package-json](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Ffsevents-node-issue%2Fpackage-json-fsevents-version.png?alt=media&token=d8bf1951-241e-4a60-a6e7-21b875ecd64e)

# 強制重新安裝 fsevents
```
npm install fsevents@2.3.3 --force --save-dev
```

# 清理和重建項目
```
hexo clean
rm -rf node_modules
npm install
```