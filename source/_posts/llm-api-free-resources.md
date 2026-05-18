---
title: 【LLM API】申請免費 API 使用額度
date: 2025-04-15 11:11:11
updated: 2025-05-13 11:11:11
tags:
  - LLM
  - API
  - OpenAI
  - xAI
  - OpenRouter
categories:
  - LLM
comments: true
---

哇！連 OpenAI、xAI(2025/5結束) 都有提供免費的 API 使用額度囉！

<!-- more -->

# OpenAI

## Tier
進入 [Rate limits](https://platform.openai.com/settings/organization/limits) 頁面，查看自己的等級。先確認自己至少符合 Tier 1 的資格條件。

等級|資格條件
-|-
|Tier 1|已付款 $5
|Tier 2|已付款 $50 <br>且距首次成功付款已超過 7 天
|Tier 3|已付款 $100 <br>且距首次成功付款已超過 7 天
|Tier 4|已付款 $250 <br>且距首次成功付款已超過 14 天
|Tier 5|已付款 $1,000 <br>且距首次成功付款已超過 30 天

![openai-limits-usage-tier](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fllm-api-free-resources%2Fopenai-limits-usage-tier.jpg?alt=media&token=5ca661cd-8c8c-4b5b-80ca-b4787c31069b)

## 資料共享
進入 [Data controls](https://platform.openai.com/settings/organization/data-controls/sharing) 頁面，找到 `Share inputs and outputs with OpenAI`，並選擇 `Enabled for all projects` 打開資料共享。

![openai-data-controls-enable-sharing-data-3](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fllm-api-free-resources%2Fopenai-data-controls-enable-sharing-data-3.png?alt=media&token=78f62555-8c37-4b0d-b60b-c3e7581b54d5)

![openai-data-controls-enable-sharing-data-4](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fllm-api-free-resources%2Fopenai-data-controls-enable-sharing-data-4.png?alt=media&token=21e77dd3-252c-4c3d-8015-3e2300c2efda)

舊版是在 `Enable sharing prompts, completions, and traces with OpenAI`，並選擇 `Enabled for all projects` 打開資料共享。
![openai-data-controls-enable-sharing-data-1](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fllm-api-free-resources%2Fopenai-data-controls-enable-sharing-data-1.jpg?alt=media&token=d76faa9d-7823-41c4-b22c-277bbe23644b)

設定完成後，系統會自動解鎖 <u>**每日 275 萬免費 tokens**</u> 的使用額度。
![openai-data-controls-enable-sharing-data-2](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fllm-api-free-resources%2Fopenai-data-controls-enable-sharing-data-2.jpg?alt=media&token=6ddeb654-7901-4b5d-9731-e20863854822)

# xAI

## 已結束
資料共享計畫於2025年5月底終止計畫囉!

{% note info %}
Thank you for participating in our API data sharing program. We decided to sunset the program at the end of May 2025.

This means you can continue using thee $150 in free credits until the end of the month but they will not renew in June 2025.

So long, and thanks for all the fish,
The xAI Team
{% endnote %}

## 儲值
前往 [xAI API 控制台](https://console.x.ai) 的 Billing 的 Credits，先儲值 $5 美金。
![x-ai-billing-credits-sharing-data-1](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fllm-api-free-resources%2Fx-ai-billing-credits-sharing-data-1.jpg?alt=media&token=7f8b237c-26f5-448a-ae1e-371801acd1ac)

## 資料共享
開啟「Share Data」。
![x-ai-billing-credits-sharing-data-2](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fllm-api-free-resources%2Fx-ai-billing-credits-sharing-data-2.jpg?alt=media&token=bcdbb7e0-b0da-4fc3-be53-092800f54709)

設定完成後，系統會自動解鎖 **<u>每月 $150 免費 credits</u>** 的使用額度。
![x-ai-billing-credits-sharing-data-3](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fllm-api-free-resources%2Fx-ai-billing-credits-sharing-data-3.jpg?alt=media&token=81acb850-ada5-449f-84bf-6bb0c5252294)

# OpenRouter
[OpenRouter](https://openrouter.ai/) 是一個統一的 API 服務平台，讓使用者透過單一介面訪問多種 LLM。裡面有提供 [超多種免費的 LLM API](https://openrouter.ai/models?fmt=table&max_price=0&order=newest)，參考 [LLM Rankings](https://openrouter.ai/rankings?view=month) 的排名，我應該會選擇以下的 LLM 來使用。
- Google: Gemini 2.5 Pro Experimental (free)
- DeepSeek: DeepSeek V3 0324 (free)
- DeepSeek: R1 (free)

## 資料共享
進入 [Privacy](https://openrouter.ai/settings/privacy) 頁面，將 Model Training 打開。
![openrouter-privacy-model-training](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fllm-api-free-resources%2Fopenrouter-privacy-model-training.jpg?alt=media&token=03cdf5ef-1267-4667-9b8b-517a85e63f53)

## VSCode
如果你有用 Github Copilot 的話，也可以加入 OpenRouter 的 API Key，這樣就可以選擇使用 OpenRouter 所提供的 LLM。

![vscode-add-openrouter-model-1](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fllm-api-free-resources%2Fvscode-add-openrouter-model-1.jpg?alt=media&token=0e1e0cdf-47fc-46d3-8bb5-37b4a183522d)
![vscode-add-openrouter-model-2](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fllm-api-free-resources%2Fvscode-add-openrouter-model-2.jpg?alt=media&token=225a23bc-96fe-40bf-b684-20dd6a7da52d)
![vscode-add-openrouter-model-3](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fllm-api-free-resources%2Fvscode-add-openrouter-model-3.jpg?alt=media&token=59168848-dfff-4d7e-ad9a-c2ee7ea86b97)

記得要開啟資料共享，不然不給用免費模型！
![openrouter-privacy-model-training-disable](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fllm-api-free-resources%2Fopenrouter-privacy-model-training-disable.jpg?alt=media&token=412b0d95-f0a5-487c-b717-e54e80d623cb)

## xAI
如果直接用 OpenRouter 的 Grok 是收費的，不過你可以加入 **<u>你個人的有開啟資料共享的 xAI API Key</u>**，那這樣就也有每月 $150 免費 credits 的使用額度。

![openrouter-grok-model-1](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fllm-api-free-resources%2Fopenrouter-grok-model-1.jpg?alt=media&token=91f42cda-8fd1-47bd-91bb-5f92bc3b9c27)
![openrouter-grok-model-2](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fllm-api-free-resources%2Fopenrouter-grok-model-2.jpg?alt=media&token=0f04c2e2-0b37-4686-96b9-bf1c7374e4b1)

## 查詢用量

可以點擊頭像下方的 Activity 看到你目前用的 LLM 的使用量與費用狀況。
![openrouter-activity-check-cost](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fllm-api-free-resources%2Fopenrouter-activity-check-cost.jpg?alt=media&token=25f6303b-044d-41f0-ae9e-819ac66d4e26)

# 總結
平台|免費額度|開通條件
-|-|-
OpenAI|每日 275 萬 Tokens|儲值 $5 + 資料共享
xAI<br>(2025/5結束)|每月 $150 credits|儲值 $5 + 資料共享
OpenRouter|提供免費模型|資料共享

