---
title: 【LLM API】實作串接 OpenAI
date: 2024-12-13 11:11:11
updated: 2024-12-14 11:11:11
tags:
  - OpenAI
  - GPT
  - LLM
  - API
categories:
  - LLM
  - OpenAI
comments: true
---

隨著生成式 AI 的快速發展，OpenAI 提供的 API 成為許多開發者進行自然語言處理與生成應用的首選工具(~~學會串接OpenAI就可以說是AI工程師了XD~~)。本文將詳細介紹兩種串接 OpenAI API 的方法：使用官方 Python 套件，以及通過發送 HTTP 請求。

<!-- more -->

# 各模型價格
OpenAI 提供多種模型，價格與功能各有不同。模型可以選擇價格較實惠且效能優於 `gpt-3.5-turbo` 的 `gpt-4o mini`。不過如果需要更強的理解與推理能力，則可以考慮使用 `gpt-4o`。

Model|1M input <br>tokens|1M output <br>tokens|Context<br>Window|Max output <br>tokens
:---:|:---:|:---:|:---:|:---:
gpt-4o|$2.50|$10.00|128K|16,384
gpt-4o-mini|$0.150|$0.600|128K|16,384
o1-preview|$15.00|$60.00|128K|32,768
o1-mini|$3.00|$12.00|128K|65,536
<div style="margin-top: -15px; font-size: 14px; color: #555; text-align: center; font-style: normal; font-family: 'Arial', sans-serif;">
(資料來源: 
<a href="https://openai.com/api/pricing/" style="color: #555; text-decoration: none;">
OpenAI API Pricing)
</a>
</div>

# OpenAI API key

{% note info %}
記得要先去取得一組 [OpenAI API key](https://platform.openai.com/settings/profile?tab=api-keys)。
{% endnote %}

# 用 OpenAI 套件
OpenAI 提供了官方的 Python 及 JavaScript 套件，我們會使用 Python 套件來實作串接。

```
pip install openai
```
```
from openai import OpenAI

openai_api_key = "<your-openai-api-key>"

client = OpenAI(api_key=openai_api_key)

completion = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user","content": "講笑話"}
    ]
)

print(completion.choices[0].message.content)
```

<div style="margin-top: -15px; font-size: 14px; color: #555; text-align: center; font-style: normal; font-family: 'Arial', sans-serif;">
(資料來源: 
<a href="https://platform.openai.com/docs/quickstart" style="color: #555; text-decoration: none;">
OpenAI API Developer quickstart)
</a>
</div>

# 發送 HTTP 請求

## 什麼是 curl?

cURL(client URL)是一個好用的命令列工具，用於透過 URL 與伺服器進行資料傳輸，可以利用 cURL 發送請求到伺服器並接收回應，支援多達 25 種以上的協定(如 HTTP/HTTPS、FTP/FTPS 等)，通常廣泛應用於測試和調試 API(Application Programming Interface)。
- URL: 就是 API 的目標網址。
- H 表示 Headers: 定義 HTTP 請求的表頭。
    - Content-Type：指定資料的格式，通常為 application/json。
    - Authorization：用於身份驗證，例如傳遞 API 金鑰(Token)。
- d 表示 Data: 指定請求的資料內容，通常為 JSON 格式，如 `{"key": "value"}`。

```
curl "https://api.openai.com/v1/chat/completions" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
        "model": "gpt-4o-mini",
        "messages": [
            {
                "role": "system",
                "content": "You are a helpful assistant."
            },
            {
                "role": "user",
                "content": "Write a haiku that explains the concept of recursion."
            }
        ]
    }'
```

<div style="margin-top: -15px; font-size: 14px; color: #555; text-align: center; font-style: normal; font-family: 'Arial', sans-serif;">
(資料來源: 
<a href="https://platform.openai.com/docs/quickstart" style="color: #555; text-decoration: none;">
OpenAI API Developer quickstart)
</a>
</div>

## Python requests
我們可以透過 Python 的 requests 套件來發送 HTTP 請求，並實現 cURL 的功能。

|功能|cURL|requests|
|-|-|-|
|發送請求| `curl <URL>` | `requests.get("<URL>")`<br>`requests.post("<URL>")` |
|設定表頭| `-H "key: value"`  | `headers={"key": "value"}`|
|傳遞資料| `-d "key=value"` | `data={"key": "value"}` |
|處理回應| 終端機檢視輸出(stdout) | `response.json()` |

```
pip install requests
```
```
import requests
import json

openai_api_key = "<your-openai-api-key>"

headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {openai_api_key}',
}

data = {
    "model": "gpt-4o-mini",
    "messages": [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "講笑話"}
    ]
}

url = 'https://api.openai.com/v1/chat/completions'
response = requests.post(url, headers=headers, data=json.dumps(data))
result = response.json()

print(result['choices'][0]['message']['content'])
```

# 比較兩者差異

|方法|優點|缺點|
|-|-|-|
HTTP 請求|掌控請求流程與錯誤處理。<br>可用自己熟悉的程式語言。<br>不依賴官方套件版本。<br>直接基於 API 文件開發。|需要熟悉 HTTP 請求結構。<br>無法使用官方套件內建功能。<br>需自行設計相應邏輯。<br>API 更新時需調整程式碼。
使用官方套件|官方套件簡化 API 調用。<br>提供官方套件內建功能。<br>通常有技術文檔與社群支持。<br>會隨 API 更新進行同步調整。|套件更新需等待官方釋出。<br>大版本更新時需調整程式碼。<br>僅支持官方指定程式語言。<br>需熟悉官方套件使用方法。

HTTP 請求:
- 優點:
    - 開發者可完全掌控請求流程與錯誤處理。
    - 適用於非 Python，可用自己熟悉的程式語言。
    - 不依賴官方套件版本，直接基於 API 文件開發。
- 缺點:
    - 需要開發者熟悉 API 文件與 HTTP 請求的結構。
    - 無法使用官方套件內建功能(如重試機制或錯誤處理)。
    - 需自行設計重試機制或錯誤處理等相應邏輯。
    - API 更新(如端點或參數調整)時，需要調整程式碼。

使用官方套件:
- 優點:
    - 官方套件簡化 API 調用，只需熟悉 API 文件即可。
    - 提供如自動重試、錯誤處理等內建功能。
    - 通常有技術文檔與社群支持，可加快解決問題。
    - 會隨 API 更新進行同步調整，減少不兼容風險。
- 缺點:
    - 需要等待官方開發團隊釋出套件更新。
    - 當有大版本更新時，會需要調整現有程式碼。
    - 僅支持官方提供的程式語言，如 Python、JavaScript。
    - 需要熟悉官方套件的使用方法與特定語法。


![openai-requests-comparison](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fllm-api-openai%2Fopenai-requests-comparison.png?alt=media&token=a29db0dd-57bb-4228-8110-57eb97569342)

<iframe src="https://nbviewer.org/github/estellacoding/llm-api-openai/blob/main/llm-api-openai.ipynb" width="100%" height="600"></iframe>