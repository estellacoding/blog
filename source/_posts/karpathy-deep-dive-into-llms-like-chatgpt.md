---
title: 深入理解 LLM 是如何訓練出來的(Karpathy 3.5 小時神課筆記)
date: 2026-05-18 11:11:11
updated: 2026-05-18 11:11:11
tags:
  - LLM
  - ChatGPT
  - Pre-training
  - SFT
  - RLHF
categories:
  - LLM
comments: true
---

每次有人問我「ChatGPT 到底是怎麼學會講話的?」我都很想直接把這支影片丟給他~~然後叫他看完再來聊~~。Stanford CS146S(The Modern Software Developer, Fall 2025)的指定教材裡，有一支由 Andrej Karpathy 親自講解的 [Deep Dive into LLMs like ChatGPT](https://www.youtube.com/watch?v=7xTGNNLPyMI)，整整 3 小時 31 分鐘，從零開始把 LLM 的完整訓練流程講透。這篇是我整理的學習筆記，幫自己(也幫你)用 30 分鐘把這支神課的精華快速吸收一遍。

<!-- more -->

# LLM 訓練的三大階段
Karpathy 在影片裡把 LLM 的訓練拆成三個主要階段，用念書來比喻會非常好懂:

| 階段 | 對應到學習過程 | 目的 |
|---|---|---|
| 預訓練 (Pre-training) | 讀教科書、背景知識 | 把整個網路的知識壓縮進神經網路 |
| 監督式微調 (SFT) | 模仿教科書範例解答 | 把基礎模型訓練成會回答問題的助理 |
| 強化學習 (RL) | 自己做練習題、試錯 | 讓模型自己摸索出最佳解題策略 |

{% note info %}
這個比喻是 Karpathy 在影片中段提到的，我覺得是整支影片最好用的心智模型，後面看到任何 LLM 的新聞或論文，幾乎都能套進這三個階段去理解。
{% endnote %}

# 預訓練 (Pre-training)
## 資料從哪來?
所有 LLM 的起點都是「網路上的所有文字」。Hugging Face 釋出的 [🍷 FineWeb](https://huggingface.co/spaces/HuggingFaceFW/blogpost-fineweb-v1) 是個很好的觀察對象:
- 來源是 Common Crawl(從 2007 年開始爬整個網路的非營利組織)。
- 處理後約 **15 兆(15 trillion)個 token**，磁碟空間 **44TB**。
- 經過層層過濾: URL 黑名單(成人/惡意網站)、語言篩選(只留英文)、去重複、移除個資 (PII)。

聽起來很大，但 Karpathy 提醒一個很重要的觀念:

> 預訓練不是讓模型「記住」網路的所有東西，而是把網路做一個**有損壓縮 (lossy compression)**，把知識以機率的形式儲存在神經網路的參數裡。

## 分詞 (Tokenization)
神經網路看不懂文字，只看得懂數字。所以要把文字切成一塊一塊的 token，這個過程叫做分詞，目前主流演算法是 **Byte Pair Encoding (BPE)**。

- GPT-4 大約用了 **100,277 個 token** 來表示所有可能的文字片段。
- 一個 token 不一定等於一個字，可能是半個字、一個常見的字根、或是一個完整的單字。
- 推薦工具: [Tiktokenizer](https://tiktokenizer.vercel.app/) 可以直接看一段文字會被切成哪些 token。

{% note info %}
這就是為什麼 LLM 算 strawberry 裡有幾個 r 老是算錯，因為它看到的不是 s-t-r-a-w-b-e-r-r-y 9 個字母，而是 [str, aw, berry] 這樣的 token，根本沒辦法逐字母數。
{% endnote %}

## 神經網路怎麼學?
預訓練的核心任務超簡單，只有一句話: **預測下一個 token 是什麼**。

- 輸入: 一段 token 序列(context window，現在動輒 8K~128K)。
- 輸出: 下一個 token 的機率分佈。
- 訓練: 用反向傳播 (backpropagation) 不斷調整數十億個參數，讓預測越來越準。

而硬體成本則是天文數字級的:
- **GPT-2 (2019)**: 16 億參數、1024 token context、訓練 ~1000 億 tokens，當年成本約 4 萬美金。
- **Karpathy 用 llm.c 重現 GPT-2**: 只花了 **672 美金**(優化後可能降到 100 美金)，6 年硬體+軟體進步真的很猛。
- 現代前沿模型如 Llama 3.1、GPT-4: 數千張 H100 GPU 連續訓練數個月。

## 基礎模型 (Base Model)
預訓練完的產物叫做「基礎模型」，但它**不是 ChatGPT**。

- 它本質上是一個「超強大的字詞自動補完工具」。
- 你問它「巴黎在哪?」它可能不會回答，反而會接「東京在哪? 倫敦在哪? 紐約在哪?」，因為網路上常出現這種列表。
- 它是網路文件的「隨機模擬器」，不是助理。

要把基礎模型變成你會在 ChatGPT 裡跟它對話的那種助理，還需要下一個階段。

# 監督式微調 (SFT)
## 從網路文字 → 對話資料
SFT 階段的核心就是把訓練資料從「網路文字」換成「人類對話範例」。

- 預訓練要花好幾個月，**SFT 通常只要幾小時到幾天**。
- 資料由「人類標註員」依照詳細指南(像是 OpenAI 的 InstructGPT paper)撰寫理想對話。
- 早期: 純人工製作(如 OASST1 dataset)。
- 現在: 大量使用 LLM 自己生成對話 (synthetic data，如 UltraChat)，再由人類審核。

對話資料會用特殊 token 包起來，告訴模型「這段是 user 在說話、這段是 assistant 在回應」:

```
<|im_start|>user
台灣最高的山是哪一座?<|im_end|>
<|im_start|>assistant
玉山，海拔 3,952 公尺。<|im_end|>
```

## LLM 心理學 (LLM Psychology)
這段是整支影片我最喜歡的部分，Karpathy 列出了一堆基礎模型「奇怪的行為」，並解釋背後原因。

### 幻覺 (Hallucination)
- 模型學到的模式是「使用者問問題 → 助理一定要回答」，所以即使不知道，它也會編一個聽起來很像真的的答案。
- **解法 1 - 教模型說不知道**: Meta 的做法是抽訓練資料 → 對它出題 → 看模型答對嗎 → 答錯的就訓練它回答「我不知道」。
- **解法 2 - 教模型使用工具**: 訓練模型在不確定時輸出 `<SEARCH_START>查詢字串<SEARCH_END>`，由外部系統去搜尋並把結果塞回 context window。

### 兩種記憶
- **參數記憶 (parameters)**: 像「模糊的記憶」，是預訓練時壓縮進去的知識，容易出錯。
- **工作記憶 (context window)**: 像「眼前清楚看到的東西」，從 context 裡讀到的東西最準。
- 這就是為什麼 RAG (Retrieval-Augmented Generation) 有效，把資料直接塞進 context 比叫模型「靠記憶回答」可靠太多。

### 模型不知道自己是誰
- 你問基礎模型「你是誰?」它很可能會說「我是 ChatGPT，由 OpenAI 開發」，**就算它根本是 Llama**。
- 原因: 網路上太多文章在講 ChatGPT，模型只是在統計上「猜你想聽的答案」。
- 解法: 在 SFT 資料裡硬塞「你是 XXX 助理」的對話，或在 system prompt 裡明確指定。

### 模型需要 token 來思考
- LLM 是「一個 token 接著一個 token」生成的，每個 token 對應到固定的計算量。
- 直接要求模型「答案是多少?」→ 它只能用一次 forward pass 猜答案，常常出錯。
- 要求模型「step by step 算出來」→ 它能在生成過程中分散計算量，準確率大增。
- 這就是 **Chain of Thought (CoT)** prompting 為什麼有用的底層原因。

### 鋸齒狀智能 (Jagged Intelligence)
- LLM 在某些任務超強(寫程式、翻譯)，但在某些簡單任務卻意外地笨(算 9.11 vs 9.9 誰大、數草莓的 r)。
- 它的能力曲線不是平滑的，而是參差不齊。**不要假設 AI 在 A 領域很強，B 領域就一定也很強**。

# 強化學習 (RL)
SFT 是讓模型「模仿人類的答案」，RL 則是讓模型「自己摸索答案」。這也是 Karpathy 說目前研究最活躍、各家公司藏得最深的階段。

## 核心機制
RL 的流程其實很直觀:
1. 給模型一個問題(如數學題)。
2. 讓它**生成上百萬種不同解法**。
3. 檢查哪些解法答案正確。
4. 把正確的解法當作新的訓練資料，強化這些路徑。
5. 重複很多次。

關鍵在於: 在「可驗證」的領域(數學、寫程式)，這個迴圈可以自動跑、不需要人類介入。

## DeepSeek-R1 帶來的震撼
DeepSeek 在 2025 年初公開的 R1 論文，把這套方法的細節公開了出來:
- 隨著 RL 訓練進行，模型會**自己學會用更多 token 來思考**(reasoning trace 越來越長)。
- 模型會出現「Aha moment」: 主動回頭檢查、重試、換策略，**這些行為都不是被明確教導的**。
- 這就是 OpenAI o1、o3 系列「會思考」的祕密配方，DeepSeek 把它免費送給全世界。

## AlphaGo 的啟示: Move 37
Karpathy 用 AlphaGo 的傳奇一手「Move 37」來比喻 RL 的潛力:
- 研究人員估計，**人類棋手下這一手的機率是 1/10000**。
- AlphaGo 卻透過純粹的自我對弈，獨立發現了這一手，並用它贏了李世乭。
- 啟示: RL 不只是模仿人類，**它有潛力發明出人類想不到的策略**(比如某天 LLM 可能會發明一種比英文更有效率的「思考語言」)。

## RLHF 的兩面性
但碰到「無法自動驗證對錯」的任務(寫詩、講笑話、做摘要)就麻煩了，這時候就要用 **RLHF (Reinforcement Learning from Human Feedback)**。

- **流程**: 讓人類對模型輸出排序 → 訓練一個「獎勵模型 (Reward Model)」模擬人類偏好 → 用獎勵模型對 LLM 做 RL。
- **背後原理**: 判別比生成容易(discriminator-generator gap)，人類比較容易說「A 比 B 好」而不是「寫一首好詩」。

| 優點 | 缺點 |
|---|---|
| 能在無法驗證的領域做 RL | 獎勵模型只是「模擬」人類偏好，不是真正的人類 |
| 通常能讓模型更像人在說話 | 跑太多 iteration 會被模型「鑽漏洞 (gaming)」 |
| 可大幅減少幻覺 | 訓練後期反而會崩壞(生出高分但無意義的廢話) |

> RLHF 不是真正的 RL，它比較像是一種微調，沒有 AlphaGo 那種「無限自我提升」的魔法潛力。 — Andrej Karpathy

# 未來展望
Karpathy 在影片最後分享了幾個值得關注的方向:
1. **多模態 (Multimodal)**: 把音訊、圖像、影片都轉成 token 一起訓練，未來會是原生多模態。
2. **Agent**: 能長時間自主執行任務的 AI，從「秒級回應」走向「分鐘、小時級任務」。
3. **Test-time Training**: 模型在推論階段也能持續學習，目前的 LLM 推論時權重是凍結的，這是個巨大的限制。
4. **Pervasive & Invisible**: AI 會像電力一樣無所不在，融入每個軟體中。

# 實用追蹤資源
影片裡 Karpathy 推薦了幾個追蹤 LLM 進展的方式，我自己也都有在用:

- **[LMSYS Chatbot Arena](https://lmarena.ai/)**: 各家模型 PK 排行榜(~~不過最近有被某些公司針對性刷榜的疑慮~~，看排名要保留一些懷疑)。
- **[AI News by smol.ai](https://news.smol.ai/)**: 每日 AI 新聞電子報，Karpathy 大推。
- **Hugging Face**: 各種開源模型和資料集。
- **X / Twitter**: 追蹤 Karpathy 本人、Jim Fan、Sebastian Raschka 等專家。

# 總結
Karpathy 的這支影片我看了兩遍，第一遍是被資訊量轟炸~~只想睡覺~~，第二遍才真的把「預訓練 → SFT → RL」這條主線串起來。整理完筆記後最大的收穫有三個:

1. **LLM 的「能力」和「個性」是分階段訓練出來的**: 知識來自預訓練、助理行為來自 SFT、推理能力來自 RL，理解這點之後看新模型發表會清楚很多。
2. **幻覺、不會數 r、會編造身分這些「bug」其實都不是 bug**: 而是訓練流程的必然產物，理解原因後也就知道怎麼用 prompt、RAG、tool use 來繞過去。
3. **RL 才是真正的天花板**: SFT 是模仿、RL 是超越，未來幾年所有突破應該都會發生在 RL 的研究上。

如果你對 LLM 有興趣、又能撥出 3 小時，這支影片我真心推薦從頭看到尾。完整內容請看:

<iframe width="560" height="315" src="https://www.youtube.com/embed/7xTGNNLPyMI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

<div style="max-width:520px; margin:2em auto; padding:1.5em; border:1px solid #ddd; border-radius:10px; background:#fafafa; text-align:center; box-shadow:0 2px 6px rgba(0,0,0,0.08);">
  <p style="font-size:1.1em; margin-bottom:1em;">👇 點此免費訂閱，不錯過任何更新</p>
  <iframe src="https://stellacoding.substack.com/embed" 
          width="480" height="320" 
          style="border:1px solid #EEE; background:white; border-radius:6px;" 
          frameborder="0" scrolling="no"></iframe>
</div>
