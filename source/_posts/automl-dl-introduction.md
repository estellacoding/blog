---
title: 【AutoML】自動化機器學習 - 深度學習介紹
date: 2024-06-26 11:11:11
updated: 2024-06-26 11:11:11
tags:
  - AutoML
  - Machine Learning
  - Deep Learning
categories: AutoML
comments: true
---

本系列是這本書「[AutoML 自動化機器學習：用 AutoKeras 超輕鬆打造高效能 AI 模型](https://www.books.com.tw/products/0010911296)」的學習筆記，並融入了我所補充整理的額外資料。

這篇文章介紹了深度學習(Deep Learning, DL)的基本概念，及神經網路的結構和工作方式。以辨識手寫數字的神經網路為例，說明神經網路如何在不同層生成各種特徵，並最終結合這些特徵來進行預測。
<!-- more -->

# 什麼是深度學習？
深度學習(Deep Learning, DL)是受人類大腦神經元結構啟發的技術，是機器學習(Machine Learning, ML)中的一個子領域。
![aimldl-relationship](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fautoml-introduction%2Faimldl-relationship.png?alt=media&token=5bc1db22-7e1e-4a66-94af-838d093c0e19)

在傳統的機器學習中，特徵通常是透過人類編寫的演算法產生的，需要各領域專家對資料進行大量分析和研究，了解資料特性後，才能產生有用且效果良好的特徵。這個過程被稱為特徵工程(Feature Engineering)。而深度學習則具備自動提取特徵的能力，可以取代專家的特徵工程所花費的時間。

深度學習透過建立一系列相互疊加的網路層(Layers)來從資料中提取相關特徵，從而在資料中尋找模式(Patterns)。這種模型被稱為神經網路(Neural Networks)或類神經網路(Artificial Neural Networks)。

{% note info %}
人類的大腦重約一公斤，估計包含約 850-1200 億個神經元，以及超過 100 兆條神經連接。
{% endnote %}

# 什麼是網路層？
一個層由一組稱為神經元(cells)的節點構成，它們各自會接收輸入的資料、並在處理過後輸出結果。

- 這個處理過程可以是無狀態的(stateless)。
- 但通常情況下，神經元會有狀態，也就是以一系列浮點數(floating number)來代表的權重(weights)。透過訓練，模型可以找到合適的權重，從而決定神經元如何篩選特徵，並從資料中提取出真正有用的部分。

{% note info %}
無狀態的(stateless)的是指每次運算都是獨立的，不受之前運算的影響。
{% endnote %}

# 神經網路如何學習？

神經網路可以從一個由眾多像素構成的圖片抽取特徵，藉此判斷(預測)圖片內容究竟是哪個數字。
![4-layer-neural-network-for-recognizing-handwritten-digits-1](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fautoml-dl-introduction%2F4-layer-neural-network-for-recognizing-handwritten-digits-1v1.png?alt=media&token=a450fe65-94ba-4e57-8964-f3d6a4d4fdbe)
<div style="margin-top: -15px; font-size: 14px; color: #555; text-align: center; font-style: normal; font-family: 'Arial', sans-serif;">辨識手寫數字的4層神經網路</div>


神經網路是由彼此相連的層所構成。每層都包含一組節點，而每一個節點會有對應的權重。神經網路的學習過程就是根據輸出結果不斷修改權重，好讓讓模型的預測越來越準確。

![double-layer-neural-network-diagram](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fautoml-dl-introduction%2Fdouble-layer-neural-network-diagramv1.png?alt=media&token=f8f4d274-c5e4-4b2f-9e0e-f5d08fdbfef2)
<div style="margin-top: -15px; font-size: 14px; color: #555; text-align: center; font-style: normal; font-family: 'Arial', sans-serif;">簡單的雙層網路</div>

- 每一個圓圈代表一個人工神經元，它們其實就是個數學函數，用來模擬生物神經元的功能。
- 人工神經元的運作方式即接收一個或多個輸入值(特徵值，也是數值形式)，將之乘上對應的權重因子，然後把加權後的結果輸出給下一層。權重若越大，對預測結果的影響力便越強。
- 神經元在輸出之前，通常還會再做一個非線性或基於其他方式的轉換，稱為啟動函數(activation function)，好強化神經元的學習能力。常見的啟用函數包括 Sigmoid、ReLU(Rectified Linear Unit)、Tanh 和 Softmax。

只要給予一組事先定義好的輸入與輸出資料(即訓練集內的資料和答案)，神經網路就可以從中學習和找出模式，特別是人類自己無法辨認出的模式，接著便能替還不知道結果的新資料進行預測。


{% note default %}
突然發現 Matplotlib 的強大功能！想了解如何用 Matplotlib 畫出一個簡單的雙層網路嗎？請看 [用 Matplotlib 畫出簡單的雙層神經網路](https://estellacoding.github.io/blog/matplotlib-draw-double-neural-network-diagram)。
{% endnote %}


# 深度學習如何學習？

![4-layer-neural-network-for-recognizing-handwritten-digits-2](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fautoml-dl-introduction%2F4-layer-neural-network-for-recognizing-handwritten-digits-2.png?alt=media&token=5c7ff87a-17fc-421d-ab2c-20ae2e78b73b)
<div style="margin-top: -15px; font-size: 14px; color: #555; text-align: center; font-style: normal; font-family: 'Arial', sans-serif;">辨識手寫數字的4層神經網路</div>

在上圖中，神經網路會從數字圖像中提取出模式。神經網路在每一層中會對圖片產生不同的表徵(representation)，而每一層著重不同表徵，最終結合這些表徵以預測結果。

{% note info %}
表徵即為一層神經元接收特徵值後，乘上權重而得到的結果，好強調或忽略資料中的某些部份。
{% endnote %}


