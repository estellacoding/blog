---
title: 用 Tool 和 RAG 提升 LLM 準確度
date: 2025-01-06 11:11:11
updated: 2025-01-08 11:11:11
tags:
  - LLM
  - Hallucination
  - OpenAI
  - Tool
  - RAG
  - Embedding
  - Similarity Search
categories: LLM
comments: true
---

大型語言模型(Large Language Models, LLM)作為人工智慧技術的重要突破，正在以前所未有的速度改變著我們與資訊互動的方式，從內容創作、智能客服、撰寫程式碼、科學研究，到創造出逼真的影像等，無不展現其強大~~碾壓人類~~的能力(跪🙇🏻‍♀️)。

<img src="https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fllm-openai-tool-rag%2Freading-panda-by-sory.gif?alt=media&token=aff2fa97-ebf1-4373-b3fc-ab8db526c6f3" alt="reading-panda-by-sory" width="1080">
<div style="margin-top: -15px; margin-bottom: 10px; font-size: 14px; color: #555; text-align: center; font-style: normal; font-family: 'Arial', sans-serif;">(資料來源: <a href="https://sora.com/g/gen_01jgx8w07xf15ahaxsghef8vgx">Studious Panda Scene)</a></div>

然而，LLM 主要透過大量資料進行訓練，所以當面對新資料及特定領域時，就會受限於訓練數據，而容易出現所謂的「幻覺現象」(Hallucination)。

<!-- more -->

# LLM 的挑戰

大型語言模型主要透過海量的文本資料進行訓練，如根據 GPT-3 的論文資料，[Language Models are Few-Shot Learners](https://arxiv.org/abs/2005.14165) 中，GPT-3 的訓練資料量為 <u>4990 億(499 billion)tokens</u>，這賦予了 GPT 驚人的語言能力。然而，如同任何新興技術一樣，LLM 也存在著自身的局限性。

![gpt-3-datasets](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fllm-openai-tool-rag%2Fgpt-3-datasets.jpg?alt=media&token=1cacf648-7630-4add-815d-8dd87941b34f)
<div style="margin-top: -15px; font-size: 14px; color: #555; text-align: center; font-style: normal; font-family: 'Arial', sans-serif;">(資料來源: <a href="https://arxiv.org/abs/2005.14165">Language Models are Few-Shot Learners)</a></div>

- 知識的時效性: 訓練數據通常是過去的資料，這表示 LLM 對於最新的資訊可能一無所知。例如，詢問 LLM 關於今天發生的新聞事件，它應該無法給出正確的答案。
- 知識的領域性: 不同的 LLM 可能使用不同的訓練數據，這導致在某些特定領域的知識可能不足。例如，一個主要基於通用網路數據訓練的 LLM，可能在醫學或法律等專業領域上相對薄弱。

而當 LLM 知識的時效性及領域性受到訓練數據限制時，就容易出現「幻覺現象」(Hallucination)。

> **幻覺(Hallucination)是指 LLM 在缺乏足夠的知識或理解情況下，生成出看似合理，但實際上錯誤、不合邏輯，甚至虛構的內容**。

為了解決幻覺現象，我們會使用 Tool 和 RAG 的技術。
- Tool: 讓 LLM 使用外部工具，例如搜尋引擎。
- RAG: 讓 LLM 存取外部知識庫。

# LLM 的設計流程

{% mermaid %}
flowchart LR
    A[輸入問題] --> B[LLM 學過嗎？]
    B -->|Yes| C[直接回覆]
    B -->|No| D[可以查資料嗎？]
    D -->|No| F[生成幻覺]
    D -->|Yes| E[資料來源]
    E -->|網路資料| G[Tool]
    E -->|內部資料| H[RAG]
    G --> I[輸出回應]
    H --> I[輸出回應]
    C --> I
{% endmermaid %}


# 實作 Tool
## 什麼是 Tool?
Tool 是指賦予 LLM 與外部世界互動的能力。當 LLM 面對不確定問題或需要最新資訊時，可以選擇啟用預先定義好的工具，例如搜尋引擎。而這些工具能協助 LLM 擴展能力邊界，解決其原本無法處理的問題，從而生成更加精準及可靠的回應。

## Tool 實作
以下範例是使用 `gpt-4o-mini` 模型和 Google 搜尋工具，當模型無法直接回答問題時，可以通過 Google 搜尋相關資訊，並將其作為上下文提供給 LLM，進一步生成針對使用者查詢的回答。

```python
import googlesearch
from google.colab import userdata
from openai import OpenAI
from tabulate import tabulate

# 取得 OpenAI API 金鑰
OPENAI_API_KEY = userdata.get('OPENAI_API_KEY')
# 初始化 OpenAI 客戶端
client = OpenAI(api_key=OPENAI_API_KEY)

# 定義查詢問題
query = "請問2024年金鐘獎最佳男配角是誰？"

# 初始查詢 GPT
completion = client.chat.completions.create(
    model="gpt-4o-mini",  # 使用 gpt-4o-mini
    messages=[
        {"role": "system", "content": "當你不確定使用者的問題時，請回答『不知道』。"},
        {"role": "user", "content": query}
    ]
)

response_content = completion.choices[0].message.content

print("===== 初始回應 =====")
print(response_content)

# 如果 GPT 回應「不知道」，則進行 Google 搜尋
if "不知道" in response_content:
    print("===== 啟動 Google 搜尋 =====")

    try:
        # 使用 googlesearch 搜尋
        search_results = list(googlesearch.search(query, advanced=True, num_results=5))

        # 確認搜尋結果是否非空
        if not search_results:
            print("未找到相關搜尋結果。")
        else:
            # 搜尋結果過濾與結構化
            table_data = []
            content = "以下為從搜尋結果中整理的事實：\n"
            for item in search_results:
                table_data.append([item.title, item.description])
                content += f"標題: {item.title}\n內容: {item.description}\n\n"

            # 格式化輸出搜尋結果
            print(tabulate(table_data, headers=["標題", "內容"], tablefmt="grid"))
            content += "請依照上述事實回答以下問題。\n"

            # 加上搜尋結果查詢 GPT
            follow_up_completion = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": content},
                    {"role": "user", "content": query}
                ]
            )

            follow_up_content = follow_up_completion.choices[0].message.content

            print("===== 最終回應 =====")
            print(follow_up_content)
    except Exception as e:
        print(f"搜尋過程中出現錯誤：{e}")
else:
    print("初始回應已解答問題，無需搜尋。")
```
```cmd
===== 初始回應 =====
不知道。
===== 啟動 Google 搜尋 =====
+----------------------------------------------------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| 標題                                                     | 內容                                                                                                                                                                   |
+==========================================================+========================================================================================================================================================================+
| 【2024金鐘獎】金鐘59完整得獎名單                         | Oct 20, 2024 — 2024金鐘獎完整得獎名單線上看！金鐘59最大贏家是《八尺門的辯護人》，《有生之年》吳慷仁、楊貴媚則抱回2024金鐘獎最佳男主角、最佳女主角。                    |
+----------------------------------------------------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| 【2024 金鐘獎】金鐘59 完整得獎名單！吳慷仁、楊貴媚封視帝 | Oct 19, 2024 — 【2024金鐘獎】第59 屆金鐘獎入圍名單，吳慷仁、柯叔元、傅孟柏、曾敬驊和劉俊謙中生代與新生代演員共同角逐最佳男主角！ 2024年第59 屆金鐘獎入圍 ...           |
+----------------------------------------------------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| 金鐘獎2024》金鐘59完整得獎名單！吳慷仁、楊貴媚封視帝視后 | Oct 20, 2024 — 鄭元暢以《有生之年》獲得第59屆金鐘獎戲劇節目男配角獎。 (來源：三立電視提供) ... 鐘獎最佳導演。梁修身的作品常關注台灣土地和 ... 搭檔則是首次主持典禮 ... |
+----------------------------------------------------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| 【2024金鐘獎】金鐘59完整入圍名單公布！                   | Oct 19, 2024 — 2024金鐘獎「戲劇節目男配角獎」入圍名單 ... 李李仁，《華麗計程車行》。 彭千祐，《不良執念清除師》。 楊銘威，《此時此刻》。 鄭元暢（鄭綜騰），《 ...      |
+----------------------------------------------------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| 【2024金鐘獎】金鐘59完整得獎名單！《有生之年》成最大贏家 | Oct 19, 2024 — ... 獎項。 男配角獎由《不夠善良的我們》柯震東獲獎、女配角由《愛愛內含光》苗可麗獲獎，這是苗可麗在前一晚節目類金鐘獎奪下綜藝節目主持人獎後，再度 ...     |
+----------------------------------------------------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
===== 最終回應 =====
2024年金鐘獎最佳男配角是鄭元暢，作品為《有生之年》。
```

# 實作 RAG

## 什麼是 RAG?
檢索增強生成(Retrieval-Augmented Generation, RAG)是通過從外部知識庫中檢索相關文件資訊，並將其作為上下文提供給 LLM，從而增強 LLM 生成的準確性及可靠性。

核心技術:
- 嵌入(Embedding): 將文本轉換成向量表示的技術，透過數值化捕捉文本的語義特徵，使語義相似的文本在向量空間中更接近，從而便於進行語義檢索和比較。
- 向量資料庫(Vector Database): 專門用於儲存和高效檢索向量資料的資料庫。
- 相似度搜尋(Similarity Search): 在向量資料庫中尋找與目標向量最相似向量的演算法。

## RAG 實作
以下範例是使用 openai `text-embedding-3-small` 模型將本文轉換為向量後，利用餘弦相似度計算文本之間的相似性，將相似度最高的文本結合為上下文提供給 LLM，進一步生成針對使用者查詢的回答。

```python
from openai import OpenAI
from google.colab import userdata
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

# 取得 OpenAI 金鑰
OPENAI_API_KEY = userdata.get('OPENAI_API_KEY')
# 初始化 OpenAI
client = OpenAI(api_key=OPENAI_API_KEY)

# 範例資料庫文本
sample_texts = [
    "2024年S&P Global預測全球經濟成長率為2.73%，較7月的2.66%小幅上修。",
    "2024年臺灣經濟成長率預測為3.96%，較前次7月預測的3.81%上修0.15個百分點。",
    "臺灣2024年內需貢獻3.07個百分點，民間消費貢獻1.50個百分點，國內投資貢獻0.77個百分點。",
    "2024年臺灣外貿表現強勁，國外淨需求貢獻0.89個百分點，商品出口年增率約9.24%。",
    "2024年CPI年增率預估為2.17%，較2023年的2.49%下降0.32個百分點，但仍突破2%。",
    "2025年臺灣經濟成長率預測為3.03%，低於2024年的3.96%。",
    "2025年CPI年增率預測為1.96%，可望低於2%。",
    "美國2024年經濟成長率上修至2.73%，IMF預測值為2.77%。",
    "中國2024年經濟成長率預測約4.82%至4.87%，低於成長目標值5%。",
    "歐元區2024年經濟成長率預測為0.70%，德國等大國仍陷衰退。",
    "AI需求帶動臺灣經濟成長，2024年相關產品出口年增率達9.24%。",
    "臺灣對中國大陸出口比重由2020年的43.86%下降至2024年的31.22%。",
    "2024年全球供應鏈壓力指數（GSCPI）多為負值，供應鏈壓力低於正常水準。",
    "2024年新臺幣兌美元匯率平均價位為31.97元，較2023年的31.16元貶值2.54%。",
    "2024年臺灣失業率預測為3.38%，較2023年的3.48%改善0.10個百分點。",
]

# 將文本轉換為向量嵌入
def get_embedding(text, model="text-embedding-3-small"):
    response = client.embeddings.create(model=model, input=text.replace("\n", " "))
    return np.array(response.data[0].embedding)
embeddings = [get_embedding(txt) for txt in sample_texts]

# 使用者查詢
query = "2024年臺灣經濟成長"
query_embedding = get_embedding(query)

# 計算相似度
similarities = cosine_similarity([query_embedding], embeddings).flatten()
print(f'similarities: {similarities}')

# 找出相似度最高的 top_k 結果
top_k = 2
top_k_indices = similarities.argsort()[::-1][:top_k]
retrieved_texts = [sample_texts[idx] for idx in top_k_indices]

# 顯示檢索結果
print("使用者查詢問題:", query)
print("檢索到最相似的內容:")
for i, text in enumerate(retrieved_texts, start=1):
    print(f"top{i}：{text}")

# 將檢索到的文本合併成上下文
context = " ".join(retrieved_texts)
# 生成使用者查詢的回答
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": f"根據以下上文 {context} 回答使用者問題"},
        {"role": "user", "content": query}
    ]
)

# 輸出生成的回答
print("gpt生成的回答:", response.choices[0].message.content)
```
```cmd
similarities: [0.57526107 0.76560787 0.50292886 0.66100412 0.47962661 0.72655769
 0.46492747 0.60784161 0.61911964 0.5094147  0.70446309 0.52263135
 0.32264822 0.38957369 0.64404537]
使用者查詢問題: 2024年臺灣經濟成長
檢索到最相似的內容:
top1：2024年臺灣經濟成長率預測為3.96%，較前次7月預測的3.81%上修0.15個百分點。
top2：2025年臺灣經濟成長率預測為3.03%，低於2024年的3.96%。
gpt生成的回答: 根據最新的預測，2024年臺灣的經濟成長率預測為3.96%，較之前的預測上修了0.15個百分點。
```

關於 OpenAI embeddings 的詳細說明，請看 [OpenAI Vector embeddings 官方文檔](https://platform.openai.com/docs/guides/embeddings/?lang=python)。
關於 2024年第4季臺灣經濟預測 的更多內容，請看 [2024年第4季臺灣經濟預測](https://www.cier.edu.tw/TMF)。

# 總結
Tool 和 RAG 技術提升了 LLM 的準確性和實用性，是突破模型局限性的方法。
- Tool 技術賦予 LLM 調用外部工具的能力，就像為 LLM 配備了一名全能助手，幫助 LLM 擴展能力邊界，解決其原本無法處理的問題。我們透過 GPT-4o 模型和 Google 搜尋工具，實作了 Tool 如何幫助 LLM 回答最新消息。
- 而 RAG 技術則是讓 LLM 能夠存取外部知識庫，在生成答案時參考外部知識庫的相關資訊，以提高答案的準確性和可靠性。我們透過 OpenAI Embedding 模型和餘弦相似度，實作了 RAG 如何幫助 LLM 回答特定領域資訊。