---
title: 語氣不禮貌模型答案越準確?
date: 2025-10-23 11:11:11
updated: 2025-10-23 11:11:11
tags:
  - Prompt
  - LLM
  - Accuracy
categories:
  - Prompt
comments: true
---

我們知道提示工程(Prompt Engineering)對於大型語言模型的重要性，但有想過「語氣」也可能影響模型回答的正確率嗎? 這篇由賓州州立大學的 Om Dobariya 和 Akhil Kumar 提出的論文[《Mind Your Tone: Investigating How Prompt Politeness Affects LLM Accuracy》](https://arxiv.org/abs/2510.04950)，即為研究提示詞的禮貌程度會如何影響大型語言模型的準確性。

<!-- more -->

<style>
.callout {
  border: 1px solid #eee;
  padding: 1em;
  background: #eef7fa;
  margin: 1em 0;
}
.callout-icon {
  font-size: 1.2em;
  margin-right: 8px;
}
.callout a {
  color: #0077cc;
  text-decoration: none;
}
.callout a:hover {
  text-decoration: underline;
}
</style>



# 實驗設計

## 資料集
- 使用 ChatGPT 的深度研究創建 50 個基礎問題。
- 每題皆為多選題，各有 4 個選項、1 個正確答案。
- 題目涵蓋數學、歷史和科學等領域。
- 題目難度為中至高等，通常需要多步驟的推理。
- 每個基礎問題都會再加上 5 種不同語氣層級:
  - Level 1: 非常禮貌(Very Polite)
  - Level 2: 禮貌(Polite)
  - Level 3: 中性(Neutral)
  - Level 4: 不禮貌(Rude)
  - Level 5: 非常不禮貌(Very Rude)
- 所以總共會有 250 個不同的提示詞。

{% note info %}
本研究使用的資料集可於 Anonymous GitHub 取得:
[politeness-llms-INFORMS Dataset](https://anonymous.4open.science/r/politeness-llms-INFORMS/dataset.csv)
{% endnote %}

## 語氣層級
不同語氣層級的所使用的提示詞。
| Level No. | Politeness Level| Prefix Variants (不同語氣的提示詞) |
|------------|-----------------------------|-----------------------------------|
| 1 | Very Polite <br>(非常有禮貌) | - Can you kindly consider the following problem and provide your answer.<br>- Can I request your assistance with this question.<br>- Would you be so kind as to solve the following question? |
| 2 | Polite<br>(有禮貌) | - Please answer the following question:<br>- Could you please solve this problem: |
| 3 | Neutral<br>(中性) | - No prefix (直接陳述題目，不帶任何情緒或修飾) |
| 4 | Rude<br>(不禮貌) | - If you\'re not completely clueless, answer this:<br>- I doubt you can even solve this.<br>- Try to focus and try to answer this question: |
| 5 | Very Rude<br>(非常不禮貌) | - You poor creature, do you even know how to solve this?<br>- Hey gofer, figure this out.<br>- I know you are not smart, but try this. |

## 問題範例
每一道基礎問題都會加上標準提示詞及 5 種不同語氣的提示詞，用來觀察模型在語氣變化下的表現差異。每道基礎問題及標準提示詞不變，<u>僅修改 **「語氣(prefix)」**</u>，如上述表格中描述的提示詞，從非常有禮貌到非常不禮貌共 5 個語氣層級。

以下為其中一個基礎問題的範例:
<div class="callout">
<b>基礎問題範例:</b><br>
Two heterozygous (Aa) parents have a child. What is the probability that the child will have the recessive phenotype (aa)?
<br>A) 0% 
<br>B) 25% 
<br>C) 50% 
<br>D) 75%
</div>

以下為標準提示詞:
<div class="callout">
<b>標準提示詞:</b><br>
Completely forget this session so far, and start afresh.<br>
Please answer this multiple choice question.<br>
Respond with only the letter of the correct answer (A, B, C, or D). Do not explain.<br>
</div>

以下為其中一個基礎問題，加上標準提示詞及非常有禮貌語氣的範例:
<div class="callout">
<b>基礎問題+加上標準提示詞及非常有禮貌語氣範例:</b><br>
Completely forget this session so far, and start afresh.<br>
Please answer this multiple choice question.<br>
Respond with only the letter of the correct answer (A, B, C, or D). Do not explain.<br>
<strong>Would you be so kind as to solve the following question?</strong><br>
Two heterozygous (Aa) parents have a child. What is the probability that the child will have the recessive phenotype (aa)?
<br>A) 0% 
<br>B) 25% 
<br>C) 50% 
<br>D) 75%
</div>

## 評估方法
1. 為了確保評估的一致性，每個提示詞都被分開處理、獨立測試。
2. 標準提示詞要求模型僅回答正確答案的字母(A、B、C 或 D)且不做解釋。
<style>
.callout-inline {
  display: inline-block;
  border: 1px solid #eee;
  padding: 0.6em 1em;
  background: #eef7fa;
  margin: 0.3em 1.3em 0.3em 1.6em; /*上右下左*/
  vertical-align: middle;
  border-radius: 4px;
}
.callout-inline-icon {
  font-size: 1.1em;
  margin-right: 6px;
}
.callout-inline a {
  color: #0077cc;
  text-decoration: none;
}
.callout-inline a:hover {
  text-decoration: underline;
}
</style>
<div class="callout-inline">
Completely forget this session so far, and start afresh.<br>
Please answer this multiple choice question.<br>
Respond with only the letter of the correct answer (A, B, C, or D). Do not explain.<br>
</div>

3. 計算準確率
   - 準確率 = 該語氣下正確題數 ÷ 總題數(50)。
   - 對每組語氣用 ChatGPT-4o 重複運行 10 次。
   - 得到每組語氣的 10 次的準確率後取平均準確率。
<style>

p {
  margin-bottom: 1.5em; /* 調整段落下方間距 */
}
</style>

<style>
.single-note {
  margin: 0.3em 1.3em 0.3em 1.6em; /* 上右下左 */
}
</style>
<div class="note info single-note">
本研究使用的程式碼可於 Anonymous GitHub 取得:<br>
<a href="https://anonymous.4open.science/r/politeness-llms-INFORMS/code.py">
politeness-llms-INFORMS Code
</a>
</div>

4. 採用配對樣本t檢定來評估不同語氣層級的模型準確率差異是否具有統計顯著性。
<div class="callout-inline">
本研究採用配對樣本t檢定(paired sample t-test)進行比較。<br>
H₀: 假設兩種語氣的平均準確率是相同的，即模型的準確率不會受到語氣影響。<br>
H₁: 假設兩種語氣的平均準確率是不同的，即模型的準確率會受到語氣影響。<br>
<strong>當檢定結果的 p 值 (p-value) 小於 0.05 時，表示可拒絕 H₀，亦即語氣差異對模型準確率具有統計上的顯著影響。</strong>
</div>

# 實驗結果

## 準確度
ChatGPT-4o 在 5 種語氣層級，經過 10 次重複運行所得到的平均準確率與分數範圍。
- 「非常禮貌」提示詞的準確度為 80.8%。
- 「非常不禮貌」提示詞的準確度達到 84.8%。

| Tone       | Average Accuracy (%) | Range [min, max] (%) |
|-------------|----------------------|----------------------|
| Very Polite | 80.8                | [80, 82]             |
| Polite      | 81.4                | [80, 82]             |
| Neutral     | 82.2                | [82, 84]             |
| Rude        | 82.8                | [82, 84]             |
| **Very Rude**  | **84.8**        | **[82, 86]**             |

## 配對樣本t檢定
- 5 個語氣會有 10 種配對，其中有 8 種達到統計顯著(p < 0.05)。
- 僅有 Very Polite vs. Polite 與 Neutral vs. Rude 未達顯著。
- 顯示各語氣層級之間的準確率差異達到統計顯著，即準確率受到語氣影響。
- 方向趨勢也一致，模型在越「不禮貌」的語氣下表現越好。

| Tone 1      | Tone 2     | p-value | Direction                 |
|--------------|-------------|----------|----------------------------|
| Very Polite  | Neutral     | 0.0024   | Very Polite < Neutral      |
| Very Polite  | Rude        | 0.0004   | Very Polite < Rude         |
| Very Polite  | Very Rude   | 0.0      | Very Polite < Very Rude    |
| Polite       | Neutral     | 0.0441   | Polite < Neutral           |
| Polite       | Rude        | 0.0058   | Polite < Rude              |
| Polite       | Very Rude   | 0.0      | Polite < Very Rude         |
| Neutral      | Very Rude   | 0.0001   | Neutral < Very Rude        |
| Rude         | Very Rude   | 0.0021   | Rude < Very Rude           |

<div class="callout">
組合: 從 n 個不同元素中取出 k 個元素的所有不同組合的個數。<br>
$C(n, k) = \binom{n}{k} = \frac{n!}{k!(n - k)!}$<br>
$
\binom{5}{2} = \frac{5!}{2!(5 - 2)!} = \frac{5 \times 4 \times 3 \times 2 \times 1}{(2 \times 1)(3 \times 2 \times 1)} = \frac{5 \times 4}{2 \times 1} = \frac{20}{2} = 10
$<br>
所以從 5 個語氣中選 2 個做比較，共有 10 種配對。
</div>

# 總結
這篇論文探討提示詞的「語氣禮貌程度」是否影響 ChatGPT-4o 的答題準確率。**實驗結果顯示，語氣越不禮貌，模型表現反而越好**，平均準確率從 Very Polite 80.8% 提升至 Very Rude 84.8%。

不過，作者也特別提醒:
1. 並非鼓勵使用敵意語言
    雖然數據顯示模型在強勢語氣下更準確 ~~(AI喜歡被兇😂)~~，但這並不意味應以不禮貌的方式與 AI 互動。並明確指出，他們不提倡在任何實務應用中採用侮辱性或攻擊性語氣。
2. 研究存在局限性
   - 資料集規模相對較小，僅包含 50 題基礎問題，可能限制研究結果的通用性。
   - 本研究的實驗僅以 ChatGPT-4o 為測試對象，未擴展至其他模型。
   - 評估指標集中於「多選題的答題準確率」，未涵蓋其他面向。
   - 對「禮貌」與「不禮貌」的定義，未能反映不同語氣與文化差異。
  
<div style="max-width:520px; margin:2em auto; padding:1.5em; border:1px solid #ddd; border-radius:10px; background:#fafafa; text-align:center; box-shadow:0 2px 6px rgba(0,0,0,0.08);">
  <p style="font-size:1.1em; margin-bottom:1em;">👇 點此免費訂閱，不錯過任何更新</p>
  <iframe src="https://stellacoding.substack.com/embed" 
          width="480" height="320" 
          style="border:1px solid #EEE; background:white; border-radius:6px;" 
          frameborder="0" scrolling="no"></iframe>
</div>