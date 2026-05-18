---
title: DeepSeek API不能用? 試試本地端吧!
date: 2025-02-11 11:11:11
updated: 2025-02-11 11:11:11
tags:
  - Ollama
  - DeepSeek
  - Local LLM
categories: Ollama
comments: true
---

DeepSeek API 突然不能用了？別擔心！本篇教你如何在本機電腦上，透過 Ollama 輕鬆運行 DeepSeek 模型，讓你免費體驗 DeepSeek LLM 的強大功能！

<!-- more -->

# 服務器緊張
DeepSeek 在 2025/2/6(四) 宣布「服務器緊張」!(~~為什麼就在我要去申請的時候啊~~)
{% note info %}
当前服务器资源紧张，为避免对您造成业务影响，我们已暂停 API 服务充值。存量充值金额可继续调用，敬请谅解！
{% endnote %}

QQ...但我就是想用 DeepSeek 模型，難道只能等 API 恢復嗎？

別擔心！本篇即將分享超棒的替代方案: <u>**如何在本地端使用 Ollama 運行 DeepSeek 模型**</u>！

# 為什麼選擇本地端？
- 資料保護: 所有資料都在本地，不用擔心資料外流。
- 免費推論: 可問到飽，不用擔心下個月帳單。
- 高度客製化: 如可對本地端的模型進行微調，讓模型符合特定任務和領域需求。
- 離線可用: 沒有網路連線的環境下，本地端 LLM 依然可以正常運作。

# 本地運行模型教學
## 下載Ollama
前往 [Ollama 官方下載頁面](https://www.ollama.com/download) 下載適用於你作業系統的版本並安裝。

## 設置開發環境
為了確保開發環境乾淨和避免套件衝突，建議使用 `Conda` 開立一個新的虛擬環境來安裝相關套件。

如果你選擇使用 `Conda`，請打開終端機並輸入以下指令。
```
conda create -n ollama-env python=3.12
conda activate ollama-env
```

## 下載模型
前往 [Ollama 模型庫](https://www.ollama.com/library) 挑選你需要的模型。

我們使用 DeepSeek 模型，選擇 deepseek-r1 的 latest 版本作為示範。
![ollama-deepseek-r1-latest](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Follama-deepseek%2Follama-deepseek-r1-latest.jpg?alt=media&token=6b7f94c3-c693-4acd-be40-a5d7b48d9f27)

### 安裝DeepSeek
請打開終端機並輸入以下指令。
```
ollama run deepseek-r1
```

- Ollama 就會開始自動下載 deepseek-r1 模型，檔案大小是 4.7GB，下載時間約5-10分鐘。
- 出現 success，就表示模型下載完成。
- Ollama 會自動啟動 DeepSeek 模型並進入互動模式，可以直接在終端機上對話啦！

{% note info %}
模型檔案存放位置:
/Users/daistella/.ollama/models/manifests/registry.ollama.ai/library/deepseek-r1/latest
{% endnote %}

### 本地執行Ollama
請打開終端機並輸入以下指令。
```
ollama run deepseek-r1
```
- 第一次運行指令時，會自動下載模型。
- 當模型下載完成後，再次運行相同的指令，即可直接啟動模型並開始對話。

![is-greater-than](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Follama-deepseek%2Fis-greater-than.jpg?alt=media&token=fa091966-36f4-452a-aebd-44564447cae5)

## 安裝Ollama套件
若要在 Python 中使用 Ollama 運行的 DeepSeek 模型，可以使用 langchain-ollama 套件。
```
pip install ollama langchain-ollama
```

### 錯誤訊息
如果有安裝成功，但執行時會出現 `ModuleNotFoundError: No module named 'langchain_ollama'`。這個問題有可能是因為安裝 langchain-ollama 時使用的 pip 安裝到了其他環境，而不是當前環境。
- 有可能你跟我一樣裝到其他路徑。
```
pip show langchain-ollama
# Location: /Library/Frameworks/Python.framework/Versions/3.9/lib/python3.9/site-packages
```
- 確保套件安裝在當前環境中。
```
python -m pip install langchain-ollama
# Location: /opt/anaconda3/envs/ollama-env/lib/python3.12/site-packages
```

## 完整程式碼
```
from langchain_ollama.chat_models import ChatOllama
from IPython.display import Markdown

# 建立 DeepSeek 模型的連線
llm = ChatOllama(model="deepseek-r1")

# 執行對話
response = llm.invoke("Strawberry這個單字中有幾個r?")
Markdown(response.content)
```
![execute-ollama-deepseek-r1-python](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Follama-deepseek%2Fexecute-ollama-deepseek-r1-python.jpg?alt=media&token=a53116a6-7bf9-403a-883e-4ceff858be2d)


# 總結
恭喜你成功解鎖本地 Ollama 運行 DeepSeek 模型的新技能！透過本篇教學，你已經掌握了在本地電腦上輕鬆部署和使用 DeepSeek 強大語言模型的完整步驟。即使 DeepSeek API 服務暫時受限，你也能透過 Ollama，繼續享有 DeepSeek 模型帶來的 AI 體驗囉!

當然，本地 Ollama 也存在一些需要注意的地方:
- 相較於雲端 API，本地部署需要設定上述步驟。
- 本地端推論速度取決於你的電腦硬體效能。
- 對於較複雜的問題或較長的回應，推論速度可能會比雲端 API 慢一些。
- 若本地資源不足，也可以使用雲端平台，如 Colab、AWS Bedrock。

