---
title: Markdown 渲染器從 marked 換成 markdown-it
date: 2024-05-21 11:11:11
updated: 2024-05-21 11:11:11
tags:
  - Hexo
  - Blog
  - Tutorial
  - Markdown
categories: Hexo
comments: true
---

本文說明為何將 Hexo Markdown 預設的渲染器 marked，換成 markdown-it 的原因，並說明 markdown-it 的安裝過程。
<!-- more -->

# 更換成 markdown-it 原因
[hexo-renderer-marked](https://github.com/hexojs/hexo-renderer-marked) 是 Hexo 預設的 Markdown 的渲染器。而換成 [hexo-renderer-markdown-it](https://github.com/hexojs/hexo-renderer-markdown-it) 主要是他能支援更多 Markdown 格式，最重要的就是能用 LaTeX 語法呈現數學公式。

Markdown 渲染器從 marked 完成更換至 markdown-it 後，接下來關於撰寫文章的進階語法，請看 [Hexo 撰寫文章的進階語法](https://estellacoding.github.io/blog/create-new-article-advanced/) 這篇文章。

# 安裝 markdown-it
在安裝 `hexo-renderer-markdown-it` 前，要先解除安裝 `hexo-renderer-marked`。
{% codeblock %}
npm un hexo-renderer-marked --save
npm i hexo-renderer-markdown-it --save
{% endcodeblock %}

{% codeblock %}
daistella@DaiMacAirM2 blog % npm list hexo-renderer-markdown-it
hexo-site@0.0.0 /Users/daistella/Documents/github_repo/blog
└── hexo-renderer-markdown-it@7.1.1
{% endcodeblock %}

# 修改 Hexo config
進入專案根目錄資料夾底下的 `_config.yml`，找到 `# Deployment` 區域，通常在最下面。
{% note info %}
是專案根目錄資料夾底下的 config 檔
(不是 themes/next 資料夾底下的 config 檔)
{% endnote %}

將 `# Markdown` 貼在 `# Deployment` 區域上方。

{% codeblock %}
# Markdown
markdown:
  preset: 'default'
  render:
    html: true
    xhtmlOut: false
    langPrefix: 'language-'
    breaks: true
    linkify: true
    typographer: true
    quotes: '“”‘’'
  enable_rules:
  disable_rules:
  plugins:
    - markdown-it-checkbox
    - markdown-it-emoji
    - markdown-it-mark
    - name: markdown-it-container
      options: tip
    - name: markdown-it-container
      options: fact
  anchors:
    level: 0
    collisionSuffix: 'v'
    permalink: true
    permalinkClass: 'header-anchor'
    permalinkSide: 'left'
    permalinkSymbol: ''
    case: 0
    separator: '-'
  images:
    lazyload: false
    prepend_root: false
    post_asset: false
  inline: false  # https://markdown-it.github.io/markdown-it/#MarkdownIt.renderInline
{% endcodeblock %}

在看網路很多資料時，發現 `hexo-renderer-markdown-it` 是可能會造成 TOC (Table of Contents) 壞掉的，我也有遇到這個問題，就是點擊文章目錄不會自動跳轉到該文章地方 <i class="fa-solid fa-face-sad-tear fa-shake" style="color: #0091ff;"></i> ~~(害得我一個晚上睡不好)~~。==我最後解決的方式是調整 `anchors:` 的參數就可以了==。

{% codeblock %}
# Markdown
markdown:
  anchors:
    level: 0
    collisionSuffix: 'v'
    permalink: true
    permalinkClass: 'header-anchor'
    permalinkSide: 'left'
    permalinkSymbol: ''
    case: 0
    separator: '-'
{% endcodeblock %}

Markdown 渲染器從 marked 完成更換至 markdown-it 後，接下來關於撰寫文章的進階語法，請看 [Hexo 撰寫文章的進階語法](https://estellacoding.github.io/blog/create-new-article-advanced/) 這篇文章。