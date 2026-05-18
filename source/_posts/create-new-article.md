---
title: 如何在 Hexo 部落格中新增文章
date: 2024-05-19 11:11:11
updated: 2024-05-21 11:11:11
tags:
  - Hexo
  - Blog
  - Tutorial
  - Markdown
categories: Hexo
comments: true
---

本文主要介紹如何在 Hexo 部落格中新增及撰寫文章。在 Hexo 中，可以透過一行指令新增文章，並有三種模板種類：post、page 和 draft。文章可以在 VS Code 中用 markdown 語法撰寫，且 Hexo 本身也有內建的語法，可以讓文字有不同的呈現格式。最後，文章的圖片需要另外找放圖片空間，如 imgur 或 Firebase Storage，並透過複製連結的方式插入文章中。
<!-- more -->

# 新增文章
在 Hexo 中可以簡單用一行指令就可以新增文章，文章會在 source/_posts裡，產生如 `create-new-article.md` 的檔案，`.md` 副檔名代表爲 markdown 的檔案格式。
{% codeblock %}
hexo new [layout] <title>
hexo new 'create-new-article'
{% endcodeblock %}

![新增文章語法](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fhexo-3%2Fhexo-article-1.png?alt=media&token=2923137a-9089-420c-9c48-2ba6656b18eb)

## 模板種類
Hexo 有3種模板種類(layout)：post、page 和 draft。
- `hexo new <title>`: 沒有加上 layout，預設值是新增文章，會放在 `source/_posts`。
- `hexo new page <title> `: 新增頁面，產生 `index.md` 檔，並放入新的資料夾 `source/<title>`。通常是用於新增一個獨立頁面，可彈性調整內容。
- `hexo new draft <title>`: 新增草稿，產生 `<title>.md` 檔，並放入資料夾 `source/_drafts`。在文章完成之前，可以將其存放在此資料夾中，以防止文章在網站上線時出現。文章完成後，只需將其移至 `source/_posts` 資料夾即可。

{% codeblock %}
hexo new <title>
hexo new page <title>
hexo new draft <title>
{% endcodeblock %}

![新增文章頁面草稿](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fhexo-3%2Fhexo-article-3.png?alt=media&token=38630234-3012-4aef-8e02-0ef0120244be)

## 文章內容
新增文章檔案的最上方會有 `---` 分隔的區域，是 Hexo 文章的 Front-matter，用於指定個別檔案的變數。新增文章檔案的預設值會有 title 、date 及 tags。
{% codeblock %}
---
title: test
date: 2024-05-18 16:43:15
tags:
---
{% endcodeblock %}

![新增文章內容預設值](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fhexo-3%2Fhexo-article-2.png?alt=media&token=1acf52e8-3013-4363-89bb-ee2f4a8912d6)

通常會再加上tags、categories，在 [這篇](https://estellacoding.github.io/blog/change-Hexo-theme/#%E6%96%B0%E5%A2%9E%E6%96%87%E7%AB%A0%E7%9A%84%E6%A8%99%E7%B1%A4%E5%8F%8A%E5%88%86%E9%A1%9E) 文章中有提到，如果在文章中加上標籤、分類，這樣導覽列的標籤、分類頁面，就會自動分組進入該標籤、分類，並計算各別標籤、分類的文章數量。
{% codeblock %}
---
title: 如何在 Hexo 部落格中新增文章
date: 2024-05-18 11:11:11
updated: 2024-05-19 11:11:11
tags:
  - Hexo
  - Blog
  - Tutorial
categories: Hexo
comments: true
---
{% endcodeblock %}

其他參數請看 [Hexo官方文件-Front-matter](https://hexo.io/zh-tw/docs/front-matter)。

下面會說明在寫文章時常用的 markdown 及 Hexo 本身內建的語法。

# 撰寫文章的基本語法
用 Hexo 架設部落格的其中一個好處就是文章可以在 VS Code 中用 Markdown 語法撰寫，且 Hexo 本身也有內建的語法，可以讓文字有不同的呈現格式。

## 標題
{% codeblock %}
# This is an H1
## This is an H2
### This is an H3
#### This is an H4
##### This is an H5
###### This is an H6
{% endcodeblock %}

## 連結
{% codeblock %}
[連結名稱](超連結)
{% endcodeblock %}

:::tip
網頁呈現樣子:
[Markdown 基礎與入門教學手冊](https://israynotarray.com/other/20191111/1875438261/)
:::

## 項目清單
### 無序清單
{% codeblock %}
* 這是 *
+ 這是 + 
- 這是 -
{% endcodeblock %}

:::tip
網頁呈現樣子:
* 這是 *
+ 這是 + 
- 這是 -
:::

### 有序清單
{% codeblock %}
1. 這是 1.
2. 這是 2. 
3. 這是 3.
{% endcodeblock %}

:::tip
網頁呈現樣子:
1. 這是 1.
2. 這是 2. 
3. 這是 3.
:::

## 程式碼
### 程式碼區塊
📍 Hexo 用法
```
{% codeblock %}
hello world
{% endcodeblock %}
```

:::tip
網頁呈現樣子:
{% codeblock %}
hello world
{% endcodeblock %}
:::

📍 Markdown 用法
前後是用 3 個反引號(Backtick)，反引號的位置在鍵盤中數字鍵 1 的左邊，上方符號是 ~。使用要注意反單引號 ` 常容易和單引號 ' 混淆。
````
```
hello world
```
````

:::tip
網頁呈現樣子:
```
hello world
```
:::

### 程式碼片段
前後是用 1 個反引號。會將字用灰底包住。除了程式碼，如果想把字將前後的字給突顯出來也可用，如也適合拿來標示檔案名稱等。
{% codeblock %}
`hello world`
{% endcodeblock %}

:::tip
網頁呈現樣子:
`hello world`
:::

## 圖片
📍 Hexo 用法
```
{% img [嚇歪] https://i.imgur.com/cBWkD2R.jpg %}
```

:::tip
網頁呈現樣子:
{% img [嚇歪] https://i.imgur.com/cBWkD2R.jpg %}
:::

📍 Markdown 用法
{% codeblock %}
![備胎](https://i.imgur.com/COnXOV4.jpg)
{% endcodeblock %}

:::tip
網頁呈現樣子:
![備胎](https://i.imgur.com/COnXOV4.jpg)
:::

## 引用區塊
📍 Hexo 用法
```
{% blockquote %}
這是一段文字
{% endblockquote %}
```

:::tip
網頁呈現樣子:
{% blockquote %}
這是一段文字
{% endblockquote %}
:::

📍 Markdown 用法
{% codeblock %}
> 這是一段文字
{% endcodeblock %}

:::tip
網頁呈現樣子:
> 這是一段文字
:::

## 內容摘要
通常首頁是預設看到文章全部的內文，如果只想看到內容摘要，那可以在想要出現的內容下方加上 `<!-- more -->`，則首頁就只會看到該篇文章的內容摘要。
{% codeblock %}
主要說明如何在 Hexo 部落格中新增及撰寫文章。
<!-- more -->
{% endcodeblock %}

首頁是預設看到文章全部的內文。
![文章內容摘要](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fhexo-3%2Fhexo-article-5.png?alt=media&token=ec8ac28d-2f49-4fbc-b9c0-d910e53814cd)

調整後，首頁就只會看到該篇文章的內容摘要。
![文章全文](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fhexo-3%2Fhexo-article-4.png?alt=media&token=b279ef62-1c19-40b6-94b6-07bfe32d4078)

## 其他 (<i class="fa-solid fa-fire fa-bounce" style="color: #0091ff;"></i>持續更新)
### 斜體
{% codeblock %}
*斜體*
_也是斜體_
{% endcodeblock %}

:::tip
網頁呈現樣子:
*斜體*
_也是斜體_
:::

### 粗體
{% codeblock %}
**粗體**
__也是粗體__
{% endcodeblock %}

:::tip
網頁呈現樣子:
**粗體**
__也是粗體__
:::

### 底線
{% codeblock %}
<u>underline</u>
<ins>I am also underline</ins>
{% endcodeblock %}

:::tip
網頁呈現樣子:
<u>underline</u>
<ins>I am also underline</ins>
:::

### 刪除線
{% codeblock %}
~~我被刪掉了~~
{% endcodeblock %}

:::tip
網頁呈現樣子:
~~我被刪掉了~~
:::

### 表格
{% codeblock %}
| Column 1 | Column 2 | Column 3 |
|:-------- |:--------:| --------:|
| Some     |  thing   |     nice |
| Text     |   Text   |     Text |
{% endcodeblock %}

:::tip
網頁呈現樣子:
| Column 1 | Column 2 | Column 3 |
|:-------- |:--------:| --------:|
| Some     |  thing   |     nice |
| Text     |   Text   |     Text |
:::

### 按鈕
{% codeblock %}
<kbd>cmd</kbd> + <kbd>c</kbd>
{% endcodeblock %}

:::tip
網頁呈現樣子:
<kbd>cmd</kbd> + <kbd>c</kbd>
:::

### 上標
{% codeblock %}
X<sup>2</sup>
{% endcodeblock %}

:::tip
網頁呈現樣子:
X<sup>2</sup>
:::

### 下標
{% codeblock %}
H<sub>2</sub>O
{% endcodeblock %}

:::tip
網頁呈現樣子:
H<sub>2</sub>O
:::

### 文字顏色
{% codeblock %}
<font color="blue">一段藍色文字</font>
{% endcodeblock %}

:::tip
網頁呈現樣子:
<font color="blue">一段藍色文字</font>
:::

而關於使用 Hexo NexT 主題時，撰寫文章的進階語法，請看 [Hexo 撰寫文章的進階語法](https://estellacoding.github.io/blog/create-new-article-advanced/) 這篇文章。

其他 Hexo 語法請看 [Hexo官方文件-Tag Plugins](https://hexo.io/zh-tw/docs/tag-plugins)。
其他 Hexo 進階語法請看 [Hexo 搭建系列 - 基礎寫作流程篇](https://zenreal.github.io/posts/51388/)。
其他 markdown 語法請看 [Markdown 文件](https://markdown.tw/)。
其他 markdown 進階語法請看 [Extended Syntax](https://markdownguide.offshoot.io/extended-syntax/)。

# 文章圖片
## 選擇圖片空間
因為 GitHub 的 Repository 在 [GitHub 官方文件](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github) 上有說強烈建議小於 5 GB 以下，所以圖片其實不建議直接跟著 Hexo 部落格上傳到 repo。
> We recommend repositories remain small, ideally less than 1 GB, and less than 5 GB is strongly recommended.

~~(但有聽到其他作法是，可以開另一個 GitHub 專門放圖片，然後每個 repo 不要超過 1GB <i class="fa-solid fa-bomb fa-beat-fade" style="color: #0091ff;"></i>)~~

所以我們需要另外找放圖片空間，簡稱圖床。
- [imgur](https://imgur.com/): 免費。
- [Firebase Storage](https://firebase.google.com/): 前 5 GB 免費。

## 上傳圖片
Hexo 上插入圖片應該是我覺得最不友善的地方，因為無法直接上傳或拖拉的方式，需要先上傳到圖床，複製連結，再用 markdown 插入圖片語法。

目前作法上，我會將每篇文章各開一個資料夾，將這篇文章需要用到的圖片放入該資料夾，且==檔案依照順序命名==~~(我是整理控)~~。因為文章未完成前，可能都有修改的可能，如文章順序改變，或是圖片不需要了。所以圖片我是放到最後再統一上傳，上傳後複製連結插入文章中。

我目前用 Firebase Storage。可以儲存影像、音訊、影片，並為其建立可下載的連結。

進入 [Firebase](https://firebase.google.com/) 後，登入 google 帳號，右上角點擊 Go to console。
![點擊 Go to console](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fhexo-3%2Fhexo-firebase-1.png?alt=media&token=575a6ba1-633d-4b78-af60-193f71ba8164)

點擊 Create a project 進入建立專案流程設定。
![點擊 Create a project](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fhexo-3%2Fhexo-firebase-2.png?alt=media&token=872c63f6-a6e6-4b56-9101-c6c2f5b11ac2)

輸入 Project name 專案名稱，打勾選項，點擊 Continue 繼續下一步。
![輸入 Project name 專案名稱](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fhexo-3%2Fhexo-firebase-3.png?alt=media&token=d88d9df1-9abd-431a-812c-b6c4cd491a37)

預設打勾 Enable Google Analvtics for this proiect，點擊 Continue 繼續下一步。
![Enable Google Analvtics](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fhexo-3%2Fhexo-firebase-4.png?alt=media&token=72858479-e608-4e53-a411-908a6f3efb72)

Analytics location 選擇 Taiwan 台灣，打勾選項，點擊 Create project 建立專案。
![Analytics location:Taiwan](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fhexo-3%2Fhexo-firebase-5.png?alt=media&token=5208c14c-74a3-4977-aa7c-439fc0b2ae44)

開始建立 Firebase 專案，要等一下，點擊 Continue 繼續下一步。
![開始建立 Firebase 專案](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fhexo-3%2Fhexo-firebase-6.png?alt=media&token=f74d0a5f-90b5-4852-bb70-81671a5ef1c2)

![建立好 Firebase 專案](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fhexo-3%2Fhexo-firebase-7.png?alt=media&token=97c33f40-37ce-48f4-bc4a-167d01cb417f)

進入 Firebase 畫面，左側功能列中點擊 Build 下的 Storage。
![Build/Storage](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fhexo-3%2Fhexo-firebase-8.png?alt=media&token=5c78796e-7d5d-4f50-beac-7cca5e69e36d)

Storage 會自動列進 Project shortcuts 專案捷徑裡，下次點擊就很方便，不用再去功能列找囉。接著，點擊主畫面中的 Get started。
![Get started](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fhexo-3%2Fhexo-firebase-9.png?alt=media&token=711d89e6-1cd9-4225-b588-d7fe334dfa86)

進入 Set up Cloud Storage 設定儲存空間，點選 Start in production mode，點擊 Next 繼續下一步。
![Set up Cloud Storage-Start in production mode](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fhexo-3%2Fhexo-firebase-10.png?alt=media&token=3f1ee71b-a1b1-405e-a574-42d783c240be)

Cloud Storage location 選擇 asia-east1，點擊 Done 完成設定。
![Set up Cloud Storage-asia-east1](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fhexo-3%2Fhexo-firebase-11.png?alt=media&token=b8bb31e6-28c2-4882-b006-86f4bd2561eb)

完成 Firebase Storage 設定，一開始建立是空的，這邊就可以直接上傳照片。
![Set up Cloud Storage done](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fhexo-3%2Fhexo-firebase-12.png?alt=media&token=70f05014-e3c2-4842-b155-ab1cabb66eb7)

我會依不同文章建立各自的資料夾，點擊 建立資料夾。
![建立資料夾](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fhexo-3%2Fhexo-firebase-13.png?alt=media&token=a647762b-b353-49b8-8d02-b3c4ee5a30fb)

進入該資料夾後，點擊上傳檔案。
![上傳檔案](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fhexo-3%2Fhexo-firebase-14.png?alt=media&token=98a6c0d5-0ead-4141-bc61-0672a492ce6f)

圖片名稱顯示在畫面上，就表示該圖片已經成功儲存至 Firebase Storage。
![上傳檔案成功](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fhexo-3%2Fhexo-firebase-15.png?alt=media&token=86d7d57d-bb15-4039-a288-c6d2a9ccd013)

## 複製圖片連結
上傳完成後，點擊要放的檔案，右方出現檔案資訊，點擊檔案名稱右方的 <i class="fa-solid fa-up-right-from-square" style="color: #0091ff;"></i> 圖示。
![檔案資訊](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fhexo-3%2Fhexo-firebase-16.png?alt=media&token=f93360b9-a3d9-4a6d-a559-3c6ac3465f76)

會開啟一個新瀏覽器視窗及檔案連結，即可複製該檔案連結。
{% codeblock %}
檔案連結:
https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fhexo-3%2Fhexo-firebase-17.png?alt=media&token=f7646644-c565-4f0e-b33d-5ad73a2f9609
{% endcodeblock %}

![複製檔案連結](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fhexo-3%2Fhexo-firebase-17.png?alt=media&token=f7646644-c565-4f0e-b33d-5ad73a2f9609)

## 插入圖片到文章中
{% codeblock %}
![取得Firebase的圖片連結](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fhexo-3%2Fhexo-firebase-16.png?alt=media&token=8dbe4dc4-01cb-4c86-bf65-e37ebdbb020d)
{% endcodeblock %}

![取得Firebase的圖片連結](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fhexo-3%2Fhexo-firebase-17.png?alt=media&token=f7646644-c565-4f0e-b33d-5ad73a2f9609)

而關於如何部署 Hexo 部落格到 GitHub 的細節，請看 [如何部署 Hexo 部落格到 GitHub](https://estellacoding.github.io/blog/deploy-Hexo2github/) 這篇文章。