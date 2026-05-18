---
title: 我只剩一萬天了?!
date: 2024-11-01 11:11:11
updated: 2024-11-01 11:11:11
tags:
  - Life
  - Python
categories: Life
comments: true
---

受到 [Andrew Ng - How to Build Your Career in AI](https://info.deeplearning.ai/how-to-build-a-career-in-ai-book) 啟發，完成一個 Python 小工具，想知道我的可用天數還有多少，才發現原來只剩1萬天了?!(~~這本電子書不是講AI職涯的嗎XD~~)

<!-- more -->

# 人類壽命有幾天

在這本電子書的最後一段 Final Thoughts 中提問到：「人類壽命有多少天?」

你可以先依直覺選擇這題的答案:
==(先停在這想想，不要滑太快~~)==

<style>
  .box {
      border: 2px solid #ccc; /* 灰色邊框 */
      padding: 20px 20px 40px 20px; /* 上右下左 */
      margin: 20px; /* 外部留白 */
      border-radius: 10px; /* 圓角邊框 */
  }
  .button {
      background-color: #f1f1f1; /* 按鈕背景色為淺灰色 */
      color: #808080; /* 文字顏色設為淺灰色 */
      border-radius: 20px; /* 圓角邊框 */
      border: 1px solid #ccc; /* 邊框顏色 */
      padding: 10px 20px; /* 內邊距 */
      cursor: pointer; /* 鼠標懸停時顯示指針 */
      margin: 5px; /* 增加外邊距 */
      flex: 1 1 auto; /* 靈活布局，讓按鈕具有自適應的寬度 */
      transition: background-color 0.3s; /* 鼠標懸停時背景色變化的過渡效果 */
  }
  .button:hover {
      background-color: #e1e1e1; /* 鼠標懸停時的背景色 */
  }
  /* 針對按鈕容器使用彈性盒模型布局 */
  .container {
      display: flex; /* 設置為彈性盒模型 */
      flex-wrap: wrap; /* 允許換行 */
      justify-content: space-between; /* 按鈕間距均等分布 */
  }

  #result {
    font-size: 14px;
    margin-top: 20px;
    color: black;
  }
</style>

<script>
function showResult(message) {
  document.getElementById('result').innerHTML = message;
}
</script>

<div class="box">
    <p style="font-size: 24px; font-weight: bold;">How many days is a typical human lifespan?</p>
<div class="container">
    <button class="button" onclick="showResult('答對了！人生短暫，想吃什麼就吃吧。')">20,000 days</button>
    <button class="button" onclick="showResult('ㄜ！你快點回火星吧，地球是很危險的。')">100,000 days</button>
    <button class="button" onclick="showResult('ㄜ！2千多年了，你已是大乘期強者了。')">1 million days</button>
    <button class="button" onclick="showResult('ㄜ！活了1萬多年，你其實是吸血鬼？！')">5 million days</button>
</div>
<div id="result"></div>
</div>

![human-lifespan](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fhow-many-days-left%2Fhuman-lifespan.png?alt=media&token=1ddcaaf8-8302-4660-9aed-4e825e542340)

# 天數比你想像短
其實這很有趣，因為大多數人會選擇數十萬的數字(~~用系統一思考就是爽~~)。

那麼，一般人類的壽命究竟有多少天呢? 若以平均壽命 80 年來算，`80 年 x 365 天 = 29,200 天`，但如果再扣除掉每天 8 小時的睡眠時間，其實我們真正可用的天數僅有 `19,466 天`。

想知道你還有多少可用天數嗎? 用我完成一個 Python 小工具 [How Many Days Left?](https://days-left.streamlit.app/) 試算一下吧。
- 輸入平均人類預期壽命 (預設 80 歲)。
- 輸入您的目前年齡 (預設 30 歲)。
- 輸入您的每日平均睡眠時數 (預設 8 小時)。
- 點擊「Start Calculation」按鈕。
- 就會開始計算並顯示可用天數 (結果是 12166 days)。

# 總結
「人生的意義是什麼？」這是一個我時常深思的問題。直到現在，我仍在尋找答案。不過，我想如果每天都能提醒自己有意識地生活，那麼每一天都會充滿意義，即便最後答案還是沒找到也沒關係了。