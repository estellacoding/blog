---
title: Hexo 撰寫文章的進階語法
date: 2024-05-22 11:11:11
updated: 2024-05-22 11:11:11
tags:
  - Hexo
  - Blog
  - Tutorial
  - Markdown
categories: Hexo
comments: true
---

要使用部分進階語法，需要先將 Hexo 的 Markdown 渲染器從 marked 更換為 markdown-it。若尚未完成此步驟，請看 [Markdown 渲染器從 marked 換成 markdown-it](https://estellacoding.github.io/blog/marked2markdown-it/) 這篇文章。

本文在成功更換渲染器後，將詳細介紹更多 Hexo 撰寫文章的進階語法。這些語法包含了 Markdown 和 Hexo 的應用，如插入 emoji、代辦事項、數學公式、螢光筆效果、自定義提示區塊、Mermaid 圖表視覺化，以及 NexT 預設提示區塊。
<!-- more -->

# 進階 Markdown 用法 (<i class="fa-solid fa-fire fa-bounce" style="color: #0091ff;"></i>持續更新)


## 螢光筆效果
{% codeblock %}
==highlight==
{% endcodeblock %}

:::tip
網頁呈現樣子:
==highlight==
:::

### 安裝 markdown-it-mark
安裝 `markdown-it-mark` 前，需先確定已完成安裝 `hexo-renderer-markdown-it`。

{% codeblock %}
npm i markdown-it-mark
{% endcodeblock %}
{% codeblock %}
daistella@DaiMacAirM2 blog % npm list markdown-it-mark
hexo-site@0.0.0 /Users/daistella/Documents/github_repo/blog
├─┬ hexo-renderer-markdown-it@7.1.1
│ └── markdown-it-mark@3.0.1
└── markdown-it-mark@4.0
{% endcodeblock %}

### 修改 Hexo config
進入專案根目錄資料夾底下的 `_config.yml`，找到 `# Markdown` 區域的 `plugins:` 加上 `- markdown-it-mark`。如果你這段本來就有其他套件，那可以直接加在其他套件下方就好。

{% codeblock %}
# Markdown
markdown:
  plugins:
    - markdown-it-mark
{% endcodeblock %}


<!-- ---------------------------------------------------------------------------------------------- -->

## 底線
{% codeblock %}
<ins>underline</ins>
++underline++
{% endcodeblock %}

:::tip
網頁呈現樣子:
<ins>underline</ins>
++underline++
:::

### 安裝 markdown-it-ins
安裝 `markdown-it-ins` 前，需先確定已完成安裝 `hexo-renderer-markdown-it`。

{% codeblock %}
npm i markdown-it-ins
{% endcodeblock %}
{% codeblock %}
daistella@DaiMacAirM2 blog % npm list markdown-it-ins
hexo-site@0.0.0 /Users/daistella/Documents/github_repo/blog
├─┬ hexo-renderer-markdown-it@7.1.1
│ └── markdown-it-ins@3.0.1
└── markdown-it-ins@4.0.0
{% endcodeblock %}

### 修改 Hexo config
進入專案根目錄資料夾底下的 `_config.yml`，找到 `# Markdown` 區域的 `plugins:` 加上 `- markdown-it-ins`。如果你這段本來就有其他套件，那可以直接加在其他套件下方就好。

{% codeblock %}
# Markdown
markdown:
  plugins:
    - markdown-it-ins
{% endcodeblock %}

<!-- ---------------------------------------------------------------------------------------------- -->

## 上標
{% codeblock %}
X^2^
{% endcodeblock %}

:::tip
網頁呈現樣子:
X^2^
:::

### 安裝 markdown-it-sup
安裝 `markdown-it-sup` 前，需先確定已完成安裝 `hexo-renderer-markdown-it`。

{% codeblock %}
npm i markdown-it-sup
{% endcodeblock %}
{% codeblock %}
daistella@DaiMacAirM2 blog % npm list markdown-it-sup
hexo-site@0.0.0 /Users/daistella/Documents/github_repo/blog
├─┬ hexo-renderer-markdown-it@7.1.1
│ └── markdown-it-sup@1.0.0
└── markdown-it-sup@2.0.0
{% endcodeblock %}

### 修改 Hexo config
進入專案根目錄資料夾底下的 `_config.yml`，找到 `# Markdown` 區域的 `plugins:` 加上 `- markdown-it-sup`。如果你這段本來就有其他套件，那可以直接加在其他套件下方就好。

{% codeblock %}
# Markdown
markdown:
  plugins:
    - markdown-it-sup
{% endcodeblock %}

<!-- ---------------------------------------------------------------------------------------------- -->

## 下標
{% codeblock %}
H~2~O
{% endcodeblock %}

:::tip
網頁呈現樣子:
H~2~O
:::

### 安裝 markdown-it-sub
安裝 `markdown-it-sub` 前，需先確定已完成安裝 `hexo-renderer-markdown-it`。

{% codeblock %}
npm i markdown-it-sub
{% endcodeblock %}
{% codeblock %}
daistella@DaiMacAirM2 blog % npm list markdown-it-sub
hexo-site@0.0.0 /Users/daistella/Documents/github_repo/blog
├─┬ hexo-renderer-markdown-it@7.1.1
│ └── markdown-it-sub@1.0.0
└── markdown-it-sub@2.0.0
{% endcodeblock %}

### 修改 Hexo config
進入專案根目錄資料夾底下的 `_config.yml`，找到 `# Markdown` 區域的 `plugins:` 加上 `- markdown-it-sub`。如果你這段本來就有其他套件，那可以直接加在其他套件下方就好。

{% codeblock %}
# Markdown
markdown:
  plugins:
    - markdown-it-sub
{% endcodeblock %}

<!-- ---------------------------------------------------------------------------------------------- -->

## 代辦事項
{% codeblock %}
- [ ] Write the press release
- [x] Update the website
- [ ] Contact the media
{% endcodeblock %}

:::tip
網頁呈現樣子:
- [ ] Write the press release
- [x] Update the website
- [ ] Contact the media
:::

### 安裝 markdown-it-checkbox
安裝 `markdown-it-checkbox` 前，需先確定已完成安裝 `hexo-renderer-markdown-it`。

{% codeblock %}
npm i markdown-it-checkbox
{% endcodeblock %}
{% codeblock %}
daistella@DaiMacAirM2 blog % npm list markdown-it-checkbox
hexo-site@0.0.0 /Users/daistella/Documents/github_repo/blog
└── markdown-it-checkbox@1.1.0
{% endcodeblock %}

### 修改 Hexo config
進入專案根目錄資料夾底下的 `_config.yml`，找到 `# Markdown` 區域的 `plugins:` 加上 `- markdown-it-checkbox`。如果你這段本來就有其他套件，那可以直接加在其他套件下方就好。

{% codeblock %}
# Markdown
markdown:
  plugins:
    - markdown-it-checkbox
{% endcodeblock %}


<!-- ---------------------------------------------------------------------------------------------- -->

## emoji
{% codeblock %}
:thumbsup:
{% endcodeblock %}

:::tip
網頁呈現樣子:
:thumbsup:
:::

### 安裝 markdown-it-emoji
安裝 `markdown-it-emoji` 前，需先確定已完成安裝 `hexo-renderer-markdown-it`。

{% codeblock %}
npm i markdown-it-emoji
{% endcodeblock %}
{% codeblock %}
daistella@DaiMacAirM2 blog % npm list markdown-it-emoji
hexo-site@0.0.0 /Users/daistella/Documents/github_repo/blog
├─┬ hexo-renderer-markdown-it@7.1.1
│ └── markdown-it-emoji@2.0.2
└── markdown-it-emoji@3.0.0
{% endcodeblock %}

### 修改 Hexo config
進入專案根目錄資料夾底下的 `_config.yml`，找到 `# Markdown` 區域的 `plugins:` 加上 `- markdown-it-emoji`。如果你這段本來就有其他套件，那可以直接加在其他套件下方就好。
{% codeblock %}
# Markdown
markdown:
  plugins:
    - markdown-it-emoji
{% endcodeblock %}

更多 emoji 的編碼請看 [Emoji Cheat Sheet](https://www.webfx.com/tools/emoji-cheat-sheet/)。


<!-- ---------------------------------------------------------------------------------------------- -->

## 自定義提示區塊
[markdown-it-container](https://github.com/markdown-it/markdown-it-container) 可以讓你自定義文字的提示區塊。
{% codeblock %}
:::tip
tip
:::

:::fact
fact
:::
{% endcodeblock %}

:::tip
網頁呈現樣子:
:::tip
tip
:::

:::tip
網頁呈現樣子:
:::fact
fact
:::

### 安裝 markdown-it-container
安裝 `markdown-it-container` 前，需先確定已完成安裝 `hexo-renderer-markdown-it`。

{% codeblock %}
npm i markdown-it-container
{% endcodeblock %}
{% codeblock %}
daistella@DaiMacAirM2 blog % npm list markdown-it-container
hexo-site@0.0.0 /Users/daistella/Documents/github_repo/blog
├─┬ hexo-renderer-markdown-it@7.1.1
│ └── markdown-it-container@3.0.0
└── markdown-it-container@4.0.0
{% endcodeblock %}

### 修改 Hexo config
進入專案根目錄資料夾底下的 `_config.yml`，找到 `# Markdown` 區域的 `plugins:`。如果你這段本來就有其他套件，那可以直接加在其他套件下方就好。我這邊自定義了 2 個提示區塊，`tip` 和 `fact`。
{% codeblock %}
# Markdown
  plugins:
    - markdown-it-sub
    - markdown-it-sup
    - markdown-it-ins
    - markdown-it-checkbox
    - markdown-it-emoji
    - markdown-it-mark
    - name: markdown-it-container
      options: tip
    - name: markdown-it-container
      options: fact
{% endcodeblock %}

### 自定義CSS樣式

📍 啟用 styles.styl

進入 `themes/next/_config.yml` 中，找到 `custom_file_path:`，啟用 `style: source/_data/styles.styl`，位置在 32 行。
{% codeblock %}
# Define custom file paths.
# Create your custom files in site directory `source/_data` and uncomment needed files below.
custom_file_path:
  #head: source/_data/head.njk
  #header: source/_data/header.njk
  #sidebar: source/_data/sidebar.njk
  #postMeta: source/_data/post-meta.njk
  #postBodyStart: source/_data/post-body-start.njk
  #postBodyEnd: source/_data/post-body-end.njk
  #footer: source/_data/footer.njk
  #bodyEnd: source/_data/body-end.njk
  #variable: source/_data/variables.styl
  #mixin: source/_data/mixins.styl
  style: source/_data/styles.styl
{% endcodeblock %}

📍 新增並編輯 `source/_data/styles.styl` 檔案

{% note info %}
是專案根目錄資料夾底下的 source 資料夾
(不是 themes/next 資料夾底下的 source 資料夾)
{% endnote %}

{% codeblock %}
// markdown-it-container
.tip {
    padding: 1px 0px 0px 20px; /*上右下左*/
    background-color: #f7f7f7;
    border-left: 4px solid #777;
    color: #777;
}

.fact {
    padding: 1px 0px 0px 20px; /*上右下左*/
    background-color #eef7fa;
    border-left 4px solid #428bca;
    color: #428bca;
}
{% endcodeblock %}


更多 markdown-it 所支援的外掛請看 [hexo-renderer-markdown-it-Plugins](https://github.com/hexojs/hexo-renderer-markdown-it?tab=readme-ov-file#plugins)。



<!-- ---------------------------------------------------------------------------------------------- -->




# 進階 Hexo 用法 (<i class="fa-solid fa-fire fa-bounce" style="color: #0091ff;"></i>持續更新)

## 數學公式
MathJax 是 JavaScript 函式庫，可以用來以 Latex 文法來寫數學公式。
{% codeblock %}
$$ e^{ \pm i\theta } = \cos \theta \pm i\sin \theta $$
{% endcodeblock %}

:::tip
$$ e^{ \pm i\theta } = \cos \theta \pm i\sin \theta $$
:::

### 確認已安裝 markdown-it
啟用 MathJax 前，需先確定已完成安裝 `hexo-renderer-markdown-it`。
{% codeblock %}
daistella@DaiMacAirM2 blog % npm list hexo-renderer-markdown-it
hexo-site@0.0.0 /Users/daistella/Documents/github_repo/blog
└── hexo-renderer-markdown-it@7.1.1
{% endcodeblock %}

### 啟用 MathJax
進入 `themes/next/_config.yml` 中，找到 `math:`，啟用 mathjax。
{% codeblock %}
math:
  # Default (false) will load mathjax / katex script on demand.
  # That is it only render those page which has `mathjax: true` in front-matter.
  # If you set it to true, it will load mathjax / katex script EVERY PAGE.
  every_page: true

  mathjax:
    enable: true
    # Available values: none | ams | all
    tags: ams
{% endcodeblock %}

更多 NexT 主題中所支援的數學公式說明請看 [NexT 主題官方文件-Math Equations](https://github.com/theme-next/hexo-theme-next/blob/master/docs/MATH.md)。

<!-- ---------------------------------------------------------------------------------------------- -->

## NexT 預設提示區塊
NexT 主題有預設 6 種提示區塊。
```
{% note default %}
default 提示區塊
{% endnote %}

{% note primary %}
primary 提示區塊
{% endnote %}

{% note success %}
success 提示區塊
{% endnote %}

{% note info %}
info 提示區塊
{% endnote %}

{% note warning %}
warning 提示區塊
{% endnote %}

{% note danger %}
danger 提示區塊
{% endnote %}
```

:::tip
網頁呈現樣子:
{% note default %}
default 提示區塊
{% endnote %}

{% note primary %}
primary 提示區塊
{% endnote %}

{% note success %}
success 提示區塊
{% endnote %}

{% note info %}
info 提示區塊
{% endnote %}

{% note warning %}
warning 提示區塊
{% endnote %}

{% note danger %}
danger 提示區塊
{% endnote %}
:::

### 啟用 Note
進入 `themes/next/_config.yml` 中，找到 `note:`。
- `icons`: 改為 `true`。
- `style`: 改為 `flat`。

{% codeblock %}
# Note tag (bootstrap callout)
note:
  # Note tag style values:
  #  - simple    bootstrap callout old alert style. Default.
  #  - modern    bootstrap callout new (v2-v3) alert style.
  #  - flat      flat callout style with background, like on Mozilla or StackOverflow.
  #  - disabled  disable all CSS styles import of note tag.
  style: flat
  icons: true
  # Offset lighter of background in % for modern and flat styles (modern: -12 | 12; flat: -18 | 6).
  # Offset also applied to label tag variables. This option can work with disabled note tag.
  light_bg_offset: 0
{% endcodeblock %}

其他提示區塊說明請看 [在hexo-NexT中插入note提示块](https://jinnsjj.github.io/uncategorized/hexo-next-note/)。


<!-- ---------------------------------------------------------------------------------------------- -->

## Mermaid 圖表
Mermaid 是一種用於描述圖表的文本語言，支持多種圖表類型如流程圖、時序圖、甘特圖、類別圖(UML)、Git版控圖、使用者旅程圖、象限圖、XY 圖表、圓餅圖等。

```
{% mermaid sequenceDiagram %}
participant Alice
participant Bob
Alice->>Bob: Hi Bob
Bob->>Alice: Hi Alice
{% endmermaid %}
```

:::tip
網頁呈現樣子:
{% mermaid sequenceDiagram %}
participant Alice
participant Bob
Alice->>Bob: Hi Bob
Bob->>Alice: Hi Alice
{% endmermaid %}
:::

```
{% mermaid pie %}
"Apples": 1050
"Bananas": 890
"Oranges": 740
{% endmermaid %}
```

:::tip
網頁呈現樣子:
{% mermaid pie %}
"Apples": 1050
"Bananas": 890
"Oranges": 740
{% endmermaid %}
:::

### 安裝 hexo-filter-mermaid-diagrams

{% codeblock %}
npm i hexo-filter-mermaid-diagrams
{% endcodeblock %}
{% codeblock %}
daistella@DaiMacAirM2 blog % npm list hexo-filter-mermaid-diagrams
hexo-site@0.0.0 /Users/daistella/Documents/github_repo/blog
└── hexo-filter-mermaid-diagrams@1.0.5
{% endcodeblock %}

### 啟用 mermaid

進入 `themes/next/_config.yml` 中，找到 `mermaid:`，並啟用。
{% codeblock %}
# Mermaid tag
mermaid:
  enable: true
  # Available themes: default | dark | forest | neutral
  theme:
    light: default
    dark: dark
{% endcodeblock %}

更多 Mermaid 所支援的圖表請看 [Mermaid 官方文件](https://mermaid.js.org/intro/)。
