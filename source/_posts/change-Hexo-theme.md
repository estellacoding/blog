---
title:  如何替換 Hexo 部落格主題
date: 2024-05-18 11:11:11
updated: 2024-05-21 11:11:11
tags: 
  - Hexo
  - Theme
  - Blog
  - Tutorial
categories: Hexo
comments: true
---

本文主要介紹如何替換 Hexo 部落格主題。介紹如何在 Hexo 中使用 NexT 主題，首先下載 NexT 主題以及如何在 Hexo 配置文件中更改主題為 NexT。也將會使用 NexT 主題的配置文件，更改程式碼區塊樣式、導覽列樣式，以及新增導覽列頁面。
<!-- more -->

# 挑選主題
Hexo 官方有 [主題](https://hexo.io/themes/) 可供使用(有著很多往下滑不完的數量)。我使用各方大神都推的 NexT，主要原因是 NexT 主題是有在維護的，Github上一直到上週都有更新。
- [NexT官方網站](https://theme-next.js.org/)
- [NexT GitHub](https://github.com/next-theme/hexo-theme-next)

# 下載 NexT 主題
{% codeblock %}
cd <folder>
git clone https://github.com/next-theme/hexo-theme-next themes/next
{% endcodeblock %}

下載完成會在 themes 資料夾下出現 next 的資料夾。
{% img [hexo-theme-1.png] https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fhexo-2%2Fhexo-theme-1.png?alt=media&token=efb26864-ad9c-4561-b6b2-4c989fb17d75 [80%] [80%] '"title text" "alt text"' %}

# 更改成使用 NexT 主題

完成 NexT 安裝後，進入 Hexo config 檔中，Hexo 預設是使用 landscape，我們要更改成 next。
{% note info %}
是專案根目錄資料夾底下的 config 檔
(不是 themes/next 資料夾底下的 config 檔)
{% endnote %}

進入專案根目錄資料夾底下的 _config.yml
{% codeblock %}
theme: next
{% endcodeblock %}

# 更改外觀樣式
NexT 有4種不同樣式可供選擇。
- Muse
- Mist
- Pisces
- Gemini

<div class="image-row-2">
  <div class="image-column-2">
    <figure class="figure-2">
      <a href="https://theme-next.js.org/muse/" target="_blank">
        <img class="img-2" src="https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fhexo-2%2Fhexo-theme-muse.png?alt=media&token=8dd6d676-0714-4952-b23e-e1df05677479" alt="NexT-Muse">
      </a>
      <figcaption class="figcaption-2">Muse</figcaption>
    </figure>
    <figure class="figure-2">
      <a href="https://theme-next.js.org/mist/" target="_blank">
        <img class="img-2" src="https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fhexo-2%2Fhexo-theme-mist.png?alt=media&token=659e224b-c6d4-4458-8d36-2ec84bf7303c" alt="NexT-Mist">
      </a>
      <figcaption class="figcaption-2">Mist</figcaption>
    </figure>
  </div>
  <div class="image-column-2">
    <figure class="figure-2">
      <a href="https://theme-next.js.org/pisces/" target="_blank">
        <img class="img-2" src="https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fhexo-2%2Fhexo-theme-pisces.png?alt=media&token=f1a9298a-fa7d-4b3b-aa0e-1711cd75a43f" alt="NexT-Pisces">
      </a>
      <figcaption class="figcaption-2">Pisces</figcaption>
    </figure>
    <figure class="figure-2">
      <a href="https://theme-next.js.org/" target="_blank">
        <img class="img-2" src="https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fhexo-2%2Fhexo-theme-gemini.png?alt=media&token=c6e2209e-555d-43f9-b403-c672c9605bef" alt="NexT-Gemini">
      </a>
      <figcaption class="figcaption-2">Gemini</figcaption>
    </figure>
  </div>
</div>

<style>
.image-row-2 {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.image-column-2 {
  flex: 0 0 48%; /* Adjust percentage to control the spacing */
}

.figure-2 {
  margin: 0;
  padding: 0;
}

.img-2 {
  width: 100%;
  height: 200px; /* Set a fixed height, adjust as needed */
  object-fit: cover; /* Maintain aspect ratio and cover the entire area */
  display: block;
}

.figcaption-2 {
  text-align: center;
  font-size: 0.9em;
  color: #888;
  margin-top: -20px;
  margin-bottom: 30px;
  padding-top: 0;
}
</style>

進入 themes/next 資料夾底下的 _config.yml

{% note info %}
進入 themes/next 資料夾底下的 config 檔
(不是專案根目錄資料夾底下的 config 檔)
{% endnote %}

{% codeblock %}
#scheme: Muse
#scheme: Mist
#scheme: Pisces
scheme: Gemini
{% endcodeblock %}

# 更改程式碼區塊樣式
如果要撰寫技術文章的話，我覺得程式碼區塊呈現的樣式就蠻重要的，因為每篇基本上都會有這個內容，而右上角的複製的小圖標就是很貼心的小功能。(原設定是關閉的我找了好久~)
- 將 `copy_button` 的 `enable` 改成 `true`，讓程式碼區塊的右上角會有一個可以複製的小圖標。
- `style`則有`default`, `flat`, `mac` 可以選擇。

進入 themes/next 資料夾底下的 _config.yml
{% codeblock %}
codeblock:
  ...
  copy_button:
    enable: true
    # Available values: default | flat | mac
    style: mac
{% endcodeblock %}

# 更改導覽列樣式
我這邊是打開首頁、關於、標籤、分類、歸檔的導覽列。

{% img [hexo-theme-1.png] https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fhexo-2%2Fhexo-theme-2.png?alt=media&token=3ed99fd8-9387-4eec-9109-800a611dd9ff [80%] [80%] '"title text" "alt text"' %}

進入 themes/next 資料夾底下的 _config.yml，將 menu 底下的 home、about、tags、categories、archives 打開，即將 `#` 刪除。
{% codeblock %}
menu:
  home: / || fa fa-home
  about: /about/ || fa fa-user
  tags: /tags/ || fa fa-tags
  categories: /categories/ || fa fa-th
  archives: /archives/ || fa fa-archive
{% endcodeblock %}

# 新增導覽列頁面
上一步打開導覽列的首頁、關於、標籤、分類、歸檔後，你會發現關於、標籤、分類這3頁找不到，這時我們需要手動新增這些頁面。
>Cannot GET /blog/about/
Cannot GET /blog/tags/
Cannot GET /blog/categories/

新增 tags、categories、about 這3個頁面。
{% codeblock %}
hexo new page tags
hexo new page categories
hexo new page about
{% endcodeblock %}

修改 source/tags 資料夾中的 index.md 檔案，需手動加上 `type: "about"`。
{% codeblock %}
---
title: About
date: 2024-05-17 11:11:11
type: "about"
---
{% endcodeblock %}

修改 source/categories 資料夾中的 index.md 檔案，需手動加上 `type: "categories"`。
{% codeblock %}
---
title: Categories
date: 2024-05-17 11:11:11
type: "categories"
---
{% endcodeblock %}

修改 source/about 資料夾中的 index.md 檔案，需手動加上 `type: "tags"`。
{% codeblock %}
---
title: Tags
date: 2024-05-17 11:11:11
type: "tags"
---
{% endcodeblock %}

調整完後，導覽列的關於、標籤、分類、歸檔頁面呈現如下:

<div class="image-row-2">
  <div class="image-column-2">
    <figure class="figure-2">
      <a href="https://estellacoding.github.io/blog/about" target="_blank">
        <img class="img-2" src="https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fhexo-2%2Fhexo-theme-about.png?alt=media&token=a34fde7b-5f59-498c-a7d9-e08fcb290cd7" alt="NexT-About">
      </a>
      <figcaption class="figcaption-2">About</figcaption>
    </figure>
    <figure class="figure-2">
      <a href="https://estellacoding.github.io/blog/tags" target="_blank">
        <img class="img-2" src="https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fhexo-2%2Fhexo-theme-tags.png?alt=media&token=d5ef93eb-76af-4af7-8c9e-1903a12417f1" alt="NexT-Tags">
      </a>
      <figcaption class="figcaption-2">Tags</figcaption>
    </figure>
  </div>
  <div class="image-column-2">
    <figure class="figure-2">
      <a href="https://estellacoding.github.io/blog/categories/" target="_blank">
        <img class="img-2" src="https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fhexo-2%2Fhexo-theme-categories.png?alt=media&token=38dbc2b4-0914-4f92-a945-54d8d7d5519a" alt="NexT-Categories">
      </a>
      <figcaption class="figcaption-2">Categories</figcaption>
    </figure>
    <figure class="figure-2">
      <a href="https://estellacoding.github.io/blog/archives" target="_blank">
        <img class="img-2" src="https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fhexo-2%2Fhexo-theme-archives.png?alt=media&token=8df1d96a-6206-4b06-8260-63106ebe00af" alt="NexT-Archives">
      </a>
      <figcaption class="figcaption-2">Archives</figcaption>
    </figure>
  </div>
</div>

# 新增文章的標籤及分類
之後新增文章時，都要記得加上標籤、分類，這樣導覽列的標籤、分類頁面，就會自動分組進入該標籤、分類，並計算各別標籤、分類的文章數量。

比如我們進入 source/_posts 資料夾中的 hello-world.md 這篇文章的內容，在 `---` 中可以修改 title、date、tags、categories 等資訊。

{% codeblock %}
---
title: Hello Hexo
date: 2024-05-17 00:00:00
tags: 
  - Hexo
  - Tutorial
categories: Hexo
---
{% endcodeblock %}

而關於如何新增文章的細節，請看 [如何新增文章](https://estellacoding.github.io/blog/create-new-article/) 這篇文章。

