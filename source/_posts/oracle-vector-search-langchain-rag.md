---
title: 使用 Oracle 向量資料庫和 LangChain 開發 RAG 應用
date: 2024-10-7 11:11:11
updated: 2025-01-08 11:11:11
tags:
  - Oracle
  - Oracle Database 23ai
  - Vector
  - Vector Database
  - Vector Search
  - LangChain
  - RAG
categories: Oracle
comments: true
---

上一篇我們完成 Oracle Database 23ai Free 的開發環境，如果還沒設定好的話，請看 [Win 安裝 Oracle VM VirtualBox + Database 23ai](https://estellacoding.github.io/blog/oracle-vm-db23ai-win/)。

本篇會先帶大家了解向量搜尋基本概念後，再分享如何使用 Oracle 資料庫和 LangChain 建立一個 RAG 應用，是參照 Oracle LiveLabs 這篇 [AI Vector Search - 7 Easy Steps to Building a RAG Application using LangChain](https://apexapps.oracle.com/pls/apex/f?p=133:180:108165763619849::::wid:3927) 的教學來實現「使用 Oracle 向量資料庫和 LangChain 開發 RAG 應用」。

<!-- more -->

# 什麼是向量
向量(Vector)在數學和物理學中通常表示為一個有序的數值集合，能夠同時描述大小和方向。當我們將資料表示為向量時，每個向量都對應於高維空間中的一個點。

透過向量之間的距離，我們可以發現不同資料點之間的相似性或關聯性。舉個例子，如果我們將「蘋果」、「香蕉」和「貓」這些詞語嵌入到一個高維空間中，我們可能會發現「蘋果」和「香蕉」的向量會靠近，因為它們都是水果，有著相似的語義特徵，而「貓」則屬於完全不同的類別。

![vectors-banana-apple-cat](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-vector-search-langchain-rag%2Fvectors-banana-apple-cat.png?alt=media&token=645fe100-851b-4a84-8eac-56e2e23c8f6c)
<div style="margin-top: -15px; margin-bottom: 10px; font-size: 14px; color: #555; text-align: center; font-style: normal; font-family: 'Arial', sans-serif;">
    (資料來源: <a href="https://weaviate.io/blog/distance-metrics-in-vector-search" style="color: #555; text-decoration: none;">Distance Metrics in Vector Search)
    </a>
</div>

==在資料科學中，向量通常是用來表示一個樣本的多個特徵的組合==。

比如，以鳶尾花資料集為例子:
- 有 3 種種類
- 每種類有 50 個樣本，總共 150 個樣本
- 每個樣本有 4 個特徵
  - 花萼長度(sepal length), 花萼寬度(sepal width), 花瓣長度(petal length), 花瓣寬度(petal width)
  - 每個樣本的特徵可以表示為一個 4 維向量，例如：$\vec{v} = [\text{sepal_length}, \text{sepal_width}, \text{petal_length}, \text{petal_width}] = [5.1, 3.5, 1.4, 0.2]$
  - 每個樣本對應到特徵空間中的一個點，這個點的位置由這 4 個特徵值決定。
- 因此，整個資料集的形狀是 (150, 4)，這表示有 150 個樣本，每個樣本包含 4 個特徵。==在特徵空間中，這 150 個樣本就對應到 150 個不同的點，每個點的位置由該樣本的 4 個特徵值決定==。

![Iris-Dataset-3D-PCA-Representation](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-vector-search-langchain-rag%2FIris-Dataset-3D-PCA-Representation.png?alt=media&token=5b52eee3-0abd-41ea-9fcc-061d36b30f1b)

{% note info %}
向量(Vector)是一個數值集合，用來描述資料點的大小和方向。在資料科學中，我們可以用向量來表示樣本的多個特徵，透過計算向量之間的距離來評估它們的相似性。
{% endnote %}

# 什麼是向量搜尋
向量搜尋(Vector Search)是一種利用向量來進行相似度檢索的技術。
- 向量搜索是達成**語意(Semantic)搜尋**的關鍵技術。
- 通常用於文本、圖像、音訊、影片等非結構性資料。
- 核心概念是將資料轉換為多維空間中的向量，然後比較向量的距離來評估向量相似度。

## 資料轉向量
<u>**資料轉換為向量的過程稱為「特徵向量化」（Embedding）**</u>，而不同的資料類型（如文本、圖像、音訊、影片等）需要不同的技術來實現這個轉換。

### 文本

MiniLM-L6-v2 多語言模型
```
from sentence_transformers import SentenceTransformer

# 使用 MiniLM-L6-v2 多語言模型
model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')

# 輸入文本
texts = [
    "請到Github追蹤我", 
    "我的文章產出更快😎"
]

# 生成向量
embeddings = model.encode(texts)

# 輸出向量形狀
# (2, 384)表示有2個文本，每個文本的向量是384維
print(f"向量形狀: {embeddings.shape}")

# 顯示每個文本的向量
for i, text in enumerate(texts):
    print(f"文本: {text}")
    print(f"向量: {embeddings[i][:3]} ... {embeddings[i][-3:]}\n")
```
```
向量形狀: (2, 384)
文本: 請到Github追蹤我
向量: [-0.21761326 -0.22119161  0.12100245] ... [-0.02576047 -0.1395366  -0.22299667]

文本: 我的文章產出更快😎
向量: [ 0.0126495  -0.17077899 -0.15991284] ... [ 0.03999303  0.06574974 -0.02783584]
```

MiniLM-L6-v2 英文模型
```
from sentence_transformers import SentenceTransformer

# 使用 MiniLM-L6-v2 英文模型
model = SentenceTransformer('all-MiniLM-L6-v2')

# 輸入文本
texts = [
    "Follow me on GitHub!", 
    "My content is coming out faster😎"
]

# 生成向量
embeddings = model.encode(texts)

# 輸出向量形狀
# (2, 384)表示有2個文本，每個文本的向量是384維
print(f"向量形狀: {embeddings.shape}")

# 顯示每個文本的向量
for i, text in enumerate(texts):
    print(f"文本: {text}")
    print(f"向量: {embeddings[i][:3]} ... {embeddings[i][-3:]}\n")
```
```
向量形狀: (2, 384)
文本: Follow me on GitHub!
向量: [-0.04050694 -0.08719105 -0.03941791] ... [-0.06001     0.01527704 -0.01108771]

文本: My content is coming out faster😎
向量: [ 0.0213392  -0.064215    0.04405481] ... [-0.00864242 -0.00494845 -0.06258776]
```

### 圖像

```
# 函式庫
import torch
import torchvision.transforms as transforms
from PIL import Image
import requests
from io import BytesIO

# 使用 ResNet50 模型
model = torch.hub.load('pytorch/vision:v0.10.0', 'resnet50', pretrained=True)
model = torch.nn.Sequential(*(list(model.children())[:-1]))  # 移除最後的全連接層
model.eval()  # 設定模型為評估模式

# 如果 GPU 可用，將模型移至 GPU
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

# 圖像轉換(用於將圖像預處理成模型的輸入格式)
transform = transforms.Compose([
    transforms.Resize(256),  # 將圖像大小調整為256x256
    transforms.CenterCrop(224),  # 將圖像裁剪為224x224的中心區域
    transforms.ToTensor(),  # 將圖像轉換為張量
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),  # 標準的ImageNet正規化
])

# 向量函數(用於生成圖像向量)
def embed(image):
    image = transform(image).unsqueeze(0)  # 增加一個批次維度
    image = image.to(device)  # 將圖像移到正確的設備上（CPU或GPU）
    with torch.no_grad():  # 停用梯度計算，避免記憶體消耗
        output = model(image).squeeze()  # 去除不必要的維度
    return output.cpu().numpy()  # 將結果移回 CPU 並轉換為 NumPy 陣列

# 使用Kaggle提供的自然圖像進行測試
url = "https://storage.googleapis.com/kagglesdsdata/datasets/42780/75676/natural_images/airplane/airplane_0000.jpg?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=gcp-kaggle-com%40kaggle-161607.iam.gserviceaccount.com%2F20241006%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241006T073449Z&X-Goog-Expires=259200&X-Goog-SignedHeaders=host&X-Goog-Signature=4ebaca968963cb88271c1f13f037654c8f7318b590e079a1f0ecaf60c710297fb1bc18dc3a6ae00fbdfcaf00ff10f5e7d358d5be21c572bb6f5eabe8aa64f62b11f6b4d7e360037f56c3cfb270e478d299b1cf875e794360d7a2041bb982f693d8a799c6a687efc16dc9b78e5f826ace5e5e5498fca8edc6644306b94546bea7140f59c839bd6e27833b82e9ffea3448e0ed98e14a6e78762c5eaee7fc51e9076f78e0976e029590b23e22051ae8ac4ff211a3f4644e1c47092a2fc5bdeb1d27230bf27b9f83e244b72dc95d0d1b40aa88012f6c37f68d2b8c96e916c0e35355ed9352650664faa08ff4996ead8faf9d3a634781f2783ec3b472f37222089fd3"
response = requests.get(url)
img = Image.open(BytesIO(response.content))

# 為圖片生成向量
embedding = embed(img)
print("向量形狀:", embedding.shape)
print("向量:", embedding)
```
```
向量形狀: (2048,)
向量: [0.2375403  0.46847472 0.49034768 ... 0.20775649 0.33074814 0.27442572]
```

## 計算向量距離
向量搜尋的關鍵是如何衡量兩個向量之間的相似度。

以下是常見的幾種相似度度量方法:

### 內積
內積(Dot Product)衡量兩個向量之間的點積。
$$A \cdot B = \sum_{i=1}^{n} A_i B_i$$
```
import numpy as np

# 定義兩個向量
A = np.array([1, 2, 3])
B = np.array([4, 5, 6])

# 計算內積
dot_product = np.dot(A, B)
print(f"內積: {dot_product}") # 內積: 32
```
### 歐氏距離
歐氏距離(Euclidean Distance)衡量兩個向量之間的直線距離。
$$d(x, y) = \sqrt{\sum_{i=1}^{n} (x_i - y_i)^2}$$
```
import numpy as np

# 定義兩個向量
x = np.array([1, 2, 3])
y = np.array([4, 5, 6])

# 計算歐氏距離
euclidean_distance = np.linalg.norm(x - y)
print(f"歐氏距離: {euclidean_distance}") # 歐氏距離: 5.196152422706632
```

### 餘弦相似度
餘弦相似度(Cosine Similarity)衡量兩個向量之間的夾角餘弦值，而不考慮向量的大小。
$$\text{Cosine Similarity}(a, b) = \frac{\vec{a} \cdot \vec{b}}{\||\vec{a}\|| \cdot \||\vec{b}\||}$$
```
import numpy as np

# 定義兩個向量
a = np.array([1, 2, 3])
b = np.array([4, 5, 6])

# 計算餘弦相似度
cosine_similarity = np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))
print(f"餘弦相似度: {cosine_similarity}") # 餘弦相似度: 0.9746318461970762
```

### 曼哈頓距離
曼哈頓距離(Manhattan Distance)衡量兩個向量在每個維度上的絕對差值之和。
$$d(x, y) = \sum_{i=1}^{n} |x_i - y_i|$$
```
import numpy as np

# 定義兩個向量
x = np.array([1, 2, 3])
y = np.array([4, 5, 6])

# 計算曼哈頓距離
manhattan_distance = np.sum(np.abs(x - y))
print(f"曼哈頓距離: {manhattan_distance}") # 曼哈頓距離: 9
```

# 向量資料庫排名
是不是會好奇那目前向量資料庫排名呢?可以參考以下的向量資料庫排名，DB-Engines Ranking 是根據資料庫管理系統的受歡迎程度對向量資料庫進行排名，排名每個月更新一次。
![DB-Engines-Ranking-Vector DBMS](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-vector-search-langchain-rag%2FDB-Engines-Ranking-Vector%20DBMS.png?alt=media&token=13838f0c-d05e-4b6b-ab7c-764820ec76d0)
<div style="margin-top: -15px; font-size: 14px; color: #555; text-align: center; font-style: normal; font-family: 'Arial', sans-serif;">
    (資料來源: <a href="https://db-engines.com/en/ranking/vector+dbms" style="color: #555; text-decoration: none;">DB-Engines Ranking of Vector DBMS)
    </a>
</div>

# 什麼是 RAG
RAG(Retrieval Augmented Generation, 檢索增強生成)，是一種結合語言模型和向量資料庫的應用。利用「語言模型的生成能力」和「向量資料庫的檢索能力」來提高生成回應的相關性和準確性。

RAG 的主要原理是：當使用者提出問題時，系統首先從向量資料庫中檢索出與問題相關的資料，然後基於這些檢索結果，語言模型再進行答案生成。

![what-is-rag-from-oracle](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-vector-search-langchain-rag%2Fwhat-is-rag-from-oracle.png?alt=media&token=0abdd1b7-2ad4-41f8-a6c3-b515fefd5db0)

{% note info %}
RAG 是結合「語言模型」和「向量資料庫」，使用者用自然語言進行互動問答，結果會比僅依靠「語言模型」更精準且能即時更新資料，簡單來說，RAG 就像是一個特定領域的 AI 專家。
{% endnote %}

如果想更了解 RAG，這篇文章寫得非常好，可以參考 [RAG 解決方案規劃與實作](https://www.cio.com.tw/rag-solution-planning-and-implementation/)。

# 實作流程
這次專案是實作「使用 Oracle 向量資料庫的 RAG 應用」，主要會處理一份 PDF 文件，提取文本、向量化後，再存入 Oracle 資料庫中，讓使用者能夠用問答方式查詢 PDF 的資訊。PDF 文件是使用 202402_2330_AI1_20241003_160741.pdf，這是台積電的 2024 Q2 財報，你可以使用其他文件，或是也可以用這份文件來測試 RAG 的功能。

主要功能:
- PDF 處理：將 PDF 文件轉換為文本區塊。
- 向量化：使用 HuggingFace 的嵌入模型將文本轉換為向量。
- 整合 Oracle 資料庫：將向量化的文檔存入並從 Oracle 資料庫向量檢索。
- 問答功能：根據文檔內容及 gpt-4 生成用戶查詢的答案。

# 完整程式碼
<iframe src="https://nbviewer.jupyter.org/github/estellacoding/oracle-vector-search-langchain-rag/blob/main/oracle-vector-search-langchain-rag.ipynb" width="100%" height="400px"></iframe>

<div style="margin-top: -15px; font-size: 14px; color: #555; text-align: center; font-style: normal; font-family: 'Arial', sans-serif;">
    (<a href="https://github.com/estellacoding/oracle-vector-search-langchain-rag/blob/main/oracle-vector-search-langchain-rag.ipynb" style="color: #555; text-decoration: none;">到 Github 查看完整程式碼</a>)
</div>

# 總結
在資料科學中，向量通常是用來表示樣本的多個特徵的組合。利用這些向量，我們能更有效地處理非結構化數據，如文本、圖像和音訊等，並且進一步進行語意分析、相似度檢索、建模與預測等。

實作介紹如何使用 Oracle 向量資料庫結合 LangChain 構建 RAG 應用，打造出語意搜尋問答機器人。這種 RAG 技術能夠結合「生成」與「檢索」，顯著提高生成回應的準確性，從而應用在文件分類、搜尋最相近內容、智能客服、知識庫管理和企業資訊查詢等場景。