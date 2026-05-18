---
title: 如何估算 OpenAI API 成本?
date: 2025-10-16 11:11:11
updated: 2025-10-17 11:11:11
tags:
  - OpenAI
  - GPT
  - API
categories:
  - OpenAI
comments: true
---

最近公司在評估導入企業級AI聊天助理，老闆通常最關心的是成本問題，讓我不得不思考:「如何估算 OpenAI API 成本?」一開始確實有點頭大，因為使用量不好預測，在沒有既有數據的情況下，成本估算往往很難找到依據而有所本。

幸運的是，我有買「[2025 Generative AI 年會](https://live.gaiconf.com/courses/gaiconf2025)」的課程，其中玉山銀行總工程師黃仕鎮分享了他們導入內部智能助理 GENIE 的真實使用數據，剛好能給我作為一個參考基準。我也把自己的估算過程整理出來，並做了一個 OpenAI API 費用估算工具，方便大家快速帶入自己的場景去估算。

<!-- more -->

# 第一步: 使用量
以玉山銀行為例:
- 公司員工數 ≈ 8,000 人 (104公開資訊)
- GENIE 上線初期
  - 每月呼叫次數 ≈ 50,000 次
  - 每月實際使用人數 ≈ 1,000 人
- 則 50,000 ÷ 1000 = 50 次/人/月
- **初期一個人一個月平均大約呼叫 50 次**

# 第二步: Token數
以我的案例為例:
- 每次輸入(使用者提問) ≈ 45 tokens
- 每次輸出(模型思考+回覆) ≈ 4,445 tokens
- 單次互動合計 ≈ 4,490 tokens

這一步是影響成本的關鍵因素，因為 API 計費是按照「輸入 tokens + 輸出 tokens」計算，不同場景會造成不同差異，因此<u>**建議一定要依照實際使用情境**</u>來校正這個數字喔。

{% note info %}
OpenAI Token 計算工具: [Tokenizer](https://platform.openai.com/tokenizer)。
{% endnote %}

## 注意思考過程
gpt-5 系列模型會把「思考過程」也算在輸出 tokens 裡面，需將此納入成本估算。
```
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
  model="gpt-5-nano",
  input="用100字說明模型參數中reasoning的用途?"
)

print("Model Name:", response.model)
print("Response Content:", response.output[1].content[0].text)
print("Input Tokens:", response.usage.input_tokens)
print("Output Tokens:", response.usage.output_tokens)
print("Reasoning Effort:", response.reasoning.effort)
print("Reasoning Tokens:", response.usage.output_tokens_details.reasoning_tokens)
print("Total Tokens:", response.usage.total_tokens)
```
```
Model Name: gpt-5-nano-2025-08-07
Response Content: 推理能力在參數中的作用是讓模型先列出解題思路、再驗證步驟與結論，避免跳步與矛盾，提升推理穩定性、可解釋性及調試效率。這有助於模型自我檢查、抗干擾、跨任務的一致性呢。也便於評估改進方向。促進穩定迭代呢！
Input Tokens: 20
Output Tokens: 5416
Reasoning Effort: medium
Reasoning Tokens: 5312
Total Tokens: 5436
```

gpt-4 系列模型則不會把「思考過程」算在輸出 tokens 裡面。
```
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
  model="gpt-4.1-mini",
  input="用100字說明模型參數中reasoning的用途?"
)

print("Model Name:", response.model)
print("Response Content:", response.output[0].content[0].text)
print("Input Tokens:", response.usage.input_tokens)
print("Output Tokens:", response.usage.output_tokens)
print("Reasoning Effort:", response.reasoning.effort)
print("Reasoning Tokens:", response.usage.output_tokens_details.reasoning_tokens)
print("Total Tokens:", response.usage.total_tokens)
```
```
Model Name: gpt-4.1-mini-2025-04-14
Response Content: 模型參數中reasoning（推理）部分的用途是幫助模型理解和處理複雜問題。它使模型能夠從已有知識中推導出新的結論，分析多步驟邏輯關係，並做出合理判斷。推理能力提升了模型解決抽象問題和回答具有深層含義問題的準確性，增強了模型在自然語言理解、問題解決與決策支持等任務中的表現。
Input Tokens: 21
Output Tokens: 115
Reasoning Effort: None
Reasoning Tokens: 0
Total Tokens: 136
```



# 第三步: 模型價格
以 OpenAI 最新的 GPT-5 系列為例:
Model|1M input tokens|1M output tokens|
:---:|:---:|:---:
GPT-5|$1.250|$10.000|
GPT-5 mini|$0.250|$2.000|
GPT-5 nano|$0.050|$0.400|
<div style="margin-top: -15px; font-size: 14px; color: #555; text-align: center; font-style: normal; font-family: 'Arial', sans-serif;">
(資料來源: 
<a href="https://platform.openai.com/docs/pricing" style="color: #555; text-decoration: none;">
OpenAI API Pricing)
</a>
</div>

# 第四步: 開始計算

|項目|數值|計算過程|結果(USD)|結果(NTD)<br>30.41|
|:---:|:---:|:---:|:---:|:---:|
|單次互動成本|Tokens Input:45 / Output:4445<br>GPT-5 Input:<span>$1.25</span> / Output:<span>$10</span>|1.25/10<sup>6</sup>×45+<br>10/10<sup>6</sup>×4445|$0.0445|≈$1.35|
|每人每月互動成本|50 次互動|0.0445 × 50|$2.23|≈$68|
|全公司每月成本|若 1,000 人使用|2.23 × 1,000|$2,230|≈$67,814|
|全公司每年成本|12 個月|2,230 × 12|$26,760|≈$813,772|

# 結論
以玉山銀行 GENIE 的使用數據，來推估初期 OpenAI API 成本:
- 單次互動成本: NT$1.35
- 每人每月平均 50 次互動
- 則每人每月互動成本: NT$68
- 若全公司 1,000 人使用
- **則一年成本約台幣81萬元**

<div style="max-width:520px; margin:2em auto; padding:1.5em; border:1px solid #ddd; border-radius:10px; background:#fafafa; text-align:center; box-shadow:0 2px 6px rgba(0,0,0,0.08);">
  <p style="font-size:1.1em; margin-bottom:1em;">👇 點此免費訂閱，不錯過任何更新</p>
  <iframe src="https://stellacoding.substack.com/embed" 
          width="480" height="320" 
          style="border:1px solid #EEE; background:white; border-radius:6px;" 
          frameborder="0" scrolling="no"></iframe>
</div>


# OpenAI API 費用估算工具
{% note info %}
記得要先去取得一組 [OpenAI API key](https://platform.openai.com/settings/profile?tab=api-keys)。
{% endnote %}

{% raw %}
<div id="estimated-chatgpt-api-widget">
<style>
/* ---- Layout ---- */
.gptcost-wrap {max-width: 980px;margin: 24px auto;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Noto Sans TC","PingFang TC","Microsoft JhengHei",Arial,sans-serif;color:#1f2937;}
.gptcost-card {background:#fff;border:1px solid #e5e7eb;border-radius:14px;box-shadow:0 6px 18px rgba(17,24,39,.06);}
.gptcost-header {display:flex;gap:12px;align-items:center;border-bottom:1px solid #eef2f7;padding:16px 18px;}
.gptcost-title {font-size:18px;font-weight:800;color:#4f46e5;display:flex;align-items:center;gap:.5em}
.badge {font-size:12px;background:#e0e7ff;color:#4338ca;padding:4px 8px;border-radius:6px;font-weight:600}

/* ---- Tabs ---- */
.gptcost-tabs {display:flex;border-bottom:1px solid #eef2f7;background:#fafafa;padding:0 12px}
.tabbtn {flex:1;display:flex;justify-content:center;align-items:center;gap:6px;padding:12px 14px;cursor:pointer;font-weight:700;border:none;background:none;transition:.15s}
.tabbtn small{font-weight:600;color:#6b7280}
.tabbtn.active{color:#3730a3;border-bottom:3px solid #6366f1;background:#fff}

/* ---- Content ---- */
.gptcost-content {padding:16px 18px}

/* ---- Form ---- */
.fgroup{margin-bottom:14px}
.flabel{display:block;font-weight:700;margin-bottom:6px}
.fsub{font-size:12px;color:#6b7280;margin-left:6px}
.finput,.fselect,.ftextarea{width:100%;box-sizing:border-box;border:1px solid #d1d5db;border-radius:10px;padding:10px 12px;outline:none;transition:.15s;background:#fff}
.ftextarea{min-height:96px;resize:vertical}
.finput:focus,.fselect:focus,.ftextarea:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.15)}
.row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
@media (max-width:700px){.row{grid-template-columns:1fr}}

/* ---- Buttons ---- */
.btn{display:inline-flex;align-items:center;gap:.5em;border:none;background:#4f46e5;color:#fff;font-weight:800;padding:12px 16px;border-radius:12px;cursor:pointer;transition:.15s}
.btn:hover{background:#4338ca}
.btn:disabled{background:#9ca3af;cursor:not-allowed;opacity:0.6}
.btn-ghost{background:#f3f4f6;color:#374151}
.btn-ghost:hover{background:#e5e7eb}
.btn-sm{padding:8px 12px;font-size:13px}
.spinner{display:inline-block;width:14px;height:14px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin 0.6s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}

/* ---- Results ---- */
.result{margin-top:12px;border:1px solid #e5e7eb;border-radius:12px;background:#fbfbfe;padding:14px}
.kv{display:grid;grid-template-columns:180px 1fr;gap:10px;padding:6px 8px;border-bottom:1px dashed #e5e7eb}
.kv:last-child{border-bottom:none}
.k{font-weight:800;color:#374151}
.v{color:#1f2937;white-space:pre-wrap}
.total{color:#4338ca;font-weight:900}

/* ---- Price Table ---- */
.ptable{width:100%;border-collapse:separate;border-spacing:0;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;table-layout:fixed}
.ptable th,.ptable td{padding:10px 12px;border-bottom:1px solid #eef2f7;font-size:14px;vertical-align:middle;overflow:hidden;text-overflow:ellipsis}
.ptable th{background:#f8fafc;text-align:left;font-weight:700}
.ptable tr:last-child td{border-bottom:none}
.ptable th:nth-child(1),.ptable td:nth-child(1){width:28%}
.ptable th:nth-child(2),.ptable td:nth-child(2){width:22%}
.ptable th:nth-child(3),.ptable td:nth-child(3){width:22%}
.ptable th:nth-child(4),.ptable td:nth-child(4){width:28%}
.ptable input.finput{width:100%;max-width:100%;box-sizing:border-box;height:36px;line-height:36px;padding:0 10px}
.ptable input[type="number"].finput{text-align:right}
.price-actions{display:flex;gap:6px;flex-wrap:wrap}

/* ---- Alert ---- */
.alert{padding:12px 14px;border-radius:8px;margin-bottom:12px;font-size:14px}
.alert-success{background:#d1fae5;color:#065f46;border:1px solid #a7f3d0}
.alert-error{background:#fee2e2;color:#991b1b;border:1px solid #fecaca}
</style>
</head>
<body>
<div class="gptcost-wrap">
  <div class="gptcost-card" id="gptCostApp">
    <div class="gptcost-header">
      <div class="gptcost-title">💰 OpenAI API 費用估算工具 <span class="badge">前端版</span></div>
    </div>

    <!-- Tabs -->
    <div class="gptcost-tabs">
      <button class="tabbtn active" data-tab="chat">💬 成本估算 <small></small></button>
      <button class="tabbtn" data-tab="price">🧮 價格設定 <small>僅適用 OpenAI 模型</small></button>
      <button class="tabbtn" data-tab="key">🔑 API Key 設定</button>
    </div>

    <!-- Chat 試算 -->
    <div class="gptcost-content" data-panel="chat">
      <div class="row">
        <div class="fgroup">
          <label class="flabel">選擇模型</label>
          <select id="gc_model" class="fselect"></select>
        </div>
        <div class="fgroup">
          <label class="flabel">最大輸出 tokens <span class="fsub">（上限）</span></label>
          <input id="gc_maxtokens" class="finput" type="number" min="1" max="128000" value="128000">
        </div>
      </div>
      <div class="fgroup">
        <label class="flabel">輸入文字 <span class="fsub">（飯粒:用100字說明模型參數中reasoning的用途?）</span></label>
        <textarea id="gc_prompt" class="ftextarea"></textarea>
      </div>
      <div class="row">
        <button class="btn" id="gc_run">🚀 開始計算</button>
        <button class="btn btn-ghost" id="gc_clear">🧹 清空</button>
      </div>
      <div class="result" id="gc_result" style="display:none"></div>
    </div>

    <!-- 價格設定 -->
    <div class="gptcost-content" data-panel="price" style="display:none">
      <div id="priceAlert" style="display:none"></div>
      <p class="fsub">單位: <b>USD / 百萬 Tokens</b>。<br><strong>⚠️ 注意: 目前只適用 OpenAI 的模型</strong></p>
      <table class="ptable" id="priceTable">
        <thead><tr><th>模型名稱</th><th>Input</th><th>Output</th><th>操作</th></tr></thead>
        <tbody></tbody>
        <tfoot>
          <tr>
            <td><input class="finput" id="newModelName" placeholder="模型名稱"></td>
            <td><input class="finput" type="number" step="0.001" id="newModelIn" placeholder="0.00"></td>
            <td><input class="finput" type="number" step="0.001" id="newModelOut" placeholder="0.00"></td>
            <td><button class="btn btn-ghost btn-sm" id="addModel">➕ 新增模型</button></td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- API Key 設定 -->
    <div class="gptcost-content" data-panel="key" style="display:none">
      <div id="keyAlert" style="display:none"></div>
      <div class="fgroup">
        <label class="flabel">OpenAI API Key</label>
        <input id="gc_api" class="finput" type="password" placeholder="sk-xxxx..." autocomplete="off" />
        <p class="fsub">儲存於瀏覽器localStorage，僅用於本機，不會上傳至任何伺服器。</p>
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn" id="saveKey">💾 儲存 API Key</button>
        <button class="btn btn-ghost" id="clearKey">🗑️ 清除 API Key</button>
      </div>
    </div>
  </div>
</div>

<script>
(function(){
  const $ = (s,ctx=document)=>ctx.querySelector(s);
  const $$= (s,ctx=document)=>Array.from(ctx.querySelectorAll(s));
  const app=$("#gptCostApp");
  
  const STORAGE_KEY_API = 'gptcost_api_key';
  const STORAGE_KEY_PRICES = 'gptcost_prices';
  const DEFAULT_MODEL = 'gpt-4.1-mini';

  // 預設模型單價
  let prices = loadPrices() || {
    "gpt-5-nano":{input:0.05,output:0.4},
    "gpt-5-mini":{input:0.25,output:2},
    "gpt-5":{input:1.25,output:10}
  };

  // ========== Storage Functions ==========
  function savePrices(){
    try{
      localStorage.setItem(STORAGE_KEY_PRICES, JSON.stringify(prices));
    }catch(e){
      console.error('儲存價格失敗',e);
    }
  }
  
  function loadPrices(){
    try{
      const saved = localStorage.getItem(STORAGE_KEY_PRICES);
      return saved ? JSON.parse(saved) : null;
    }catch(e){
      return null;
    }
  }

  function saveApiKey(key){
    try{
      localStorage.setItem(STORAGE_KEY_API, key);
      return true;
    }catch(e){
      console.error('儲存 API Key 失敗',e);
      return false;
    }
  }
  
  function loadApiKey(){
    try{
      return localStorage.getItem(STORAGE_KEY_API) || '';
    }catch(e){
      return '';
    }
  }
  
  function clearApiKey(){
    try{
      localStorage.removeItem(STORAGE_KEY_API);
      return true;
    }catch(e){
      return false;
    }
  }

  // ========== UI Helper Functions ==========
  function showAlert(containerId, message, type='success'){
    const container = $(containerId);
    container.className = `alert alert-${type}`;
    container.textContent = message;
    container.style.display = '';
    setTimeout(()=>container.style.display='none', 3000);
  }

  function escapeHtml(text){
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ========== Price Table Functions ==========
  function renderTable(){
    const tbody=$("#priceTable tbody");
    tbody.innerHTML="";
    Object.entries(prices).forEach(([m,v])=>{
      const tr=document.createElement("tr");
      const safeId = m.replace(/[^a-zA-Z0-9]/g,'_');
      const nameId = `name_${safeId}`;
      const inputId = `input_${safeId}`;
      const outputId = `output_${safeId}`;
      
      tr.innerHTML=`<td><input class="finput" id="${nameId}" value="${escapeHtml(m)}" data-original="${escapeHtml(m)}"></td>
        <td><input type="number" step="0.001" class="finput" id="${inputId}" value="${v.input}"></td>
        <td><input type="number" step="0.001" class="finput" id="${outputId}" value="${v.output}"></td>
        <td><div class="price-actions">
          <button class="btn btn-ghost btn-sm update-price" data-model="${escapeHtml(m)}">💾 更新</button>
          <button class="btn btn-ghost btn-sm delete-price" data-model="${escapeHtml(m)}">🗑️ 刪除</button>
        </div></td>`;
      
      tr.querySelector(".update-price").onclick=()=>updatePrice(m, nameId, inputId, outputId);
      tr.querySelector(".delete-price").onclick=()=>deletePrice(m);
      
      tbody.appendChild(tr);
    });
  }

  function updatePrice(oldName, nameId, inputId, outputId){
    const newName = $(`#${nameId}`).value.trim();
    const inputVal = parseFloat($(`#${inputId}`).value || "0");
    const outputVal = parseFloat($(`#${outputId}`).value || "0");
    
    if(!newName){
      showAlert('#priceAlert', '模型名稱不能為空', 'error');
      return;
    }
    
    if(newName !== oldName){
      if(prices[newName]){
        showAlert('#priceAlert', `模型名稱 "${newName}" 已存在`, 'error');
        return;
      }
      delete prices[oldName];
    }

    const norm = v => (Number.isFinite(v) && v >= 0) ? v : 0;
    prices[newName] = { input: norm(inputVal), output: norm(outputVal) };
    savePrices();
    renderTable();
    updateSelect();
    showAlert('#priceAlert', `✓ ${newName} 已更新`);
  }

  function deletePrice(modelName){
    if(confirm(`確定要刪除 ${modelName} 嗎?`)){
      delete prices[modelName];
      savePrices();
      renderTable();
      updateSelect();
      showAlert('#priceAlert', `✓ ${modelName} 已刪除`);
    }
  }

  function updateSelect(){
    const sel=$("#gc_model");
    const currentValue = sel.value;
    sel.innerHTML="";
    
    Object.keys(prices).forEach(m=>{
      const opt=document.createElement("option");
      opt.value=m;
      opt.textContent=m;
      sel.appendChild(opt);
    });
    
    // 設定預設值：優先使用當前選擇，否則使用DEFAULT_MODEL
    if(currentValue && prices[currentValue]){
      sel.value = currentValue;
    }else if(prices[DEFAULT_MODEL]){
      sel.value = DEFAULT_MODEL;
    }
    // 若DEFAULT_MODEL不存在，回退到第一個模型
    if (!sel.value && sel.options.length) {
      sel.selectedIndex = 0;
    }
  }

  // ========== API Response Parser ==========
  function parseApiResponse(data){
    let outputText = "";
    let reasoningText = "";
    let inputTokens = 0;
    let outputTokens = 0;
    let reasoningTokens = 0;
    let modelName = data.model || "unknown";

    const isResponsesAPI = data.object === "response" || data.output;
    
    if(isResponsesAPI){
      // Responses API 格式
      if(data.output && Array.isArray(data.output)){
        const textParts = [];
        const reasoningParts = [];
        
        data.output.forEach(item => {
          if(item.type === "message" && item.content && Array.isArray(item.content)){
            item.content.forEach(contentItem => {
              if(contentItem.type === "output_text" && contentItem.text){
                textParts.push(contentItem.text);
              }
            });
          }else if(item.type === "reasoning" && item.content && Array.isArray(item.content)){
            item.content.forEach(contentItem => {
              if(contentItem.type === "reasoning_text" && contentItem.text){
                reasoningParts.push(contentItem.text);
              }
            });
          }
        });
        
        outputText = textParts.join("");
        reasoningText = reasoningParts.join("");
      }
      
      if(!outputText && data.output_text){
        outputText = data.output_text;
      }
      
      inputTokens = data.usage?.input_tokens ?? 0;
      outputTokens = data.usage?.output_tokens ?? 0;
      reasoningTokens = data.usage?.output_tokens_details?.reasoning_tokens ?? 0;
    }else{
      // Chat Completions API 格式
      if(data.choices && data.choices.length > 0){
        outputText = data.choices[0]?.message?.content || "";
      }
      inputTokens = data.usage?.prompt_tokens ?? 0;
      outputTokens = data.usage?.completion_tokens ?? 0;
    }
    
    outputText = outputText.trim();
    reasoningText = reasoningText.trim();
    
    // 錯誤處理
    if(!outputText && data.output && data.output.length > 0){
      const hasMessage = data.output.some(item => item.type === "message");
      const hasReasoning = data.output.some(item => item.type === "reasoning");
      
      if(!hasMessage && hasReasoning){
        outputText = "⚠️ API 只返回推理過程,沒有最終回應。\n請嘗試增加「最大輸出 tokens」數值(建議 500-1000)";
      }else if(!hasMessage){
        outputText = "⚠️ API 未返回有效的輸出內容";
      }
    }else if(!outputText){
      outputText = "⚠️ API 未返回文字內容";
    }

    return { outputText, reasoningText, inputTokens, outputTokens, reasoningTokens, modelName };
  }

  // ========== API Call Function ==========
  async function callOpenAIAPI(apiKey, model, prompt, maxTok){
    const endpoint = "https://api.openai.com/v1/responses";
    const requestBody = { model, input: prompt };
    if (maxTok && maxTok > 0) requestBody.max_output_tokens = maxTok;

    const resp = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    // 先取得回應文字
    const rawText = await resp.text();
    
    // 嘗試解析為 JSON
    let data = null;
    try {
      data = rawText ? JSON.parse(rawText) : null;
    } catch (e) {
      // JSON 解析失敗
      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status} ${resp.statusText}: ${rawText.substring(0, 200)}`);
      }
      throw new Error('API 回應格式錯誤');
    }

    // 檢查 HTTP 狀態
    if (!resp.ok) {
      const apiMsg = data?.error?.message;
      const httpMsg = `HTTP ${resp.status} ${resp.statusText}`;
      throw new Error(apiMsg || httpMsg);
    }

    // 檢查 API 錯誤
    if (data?.error) {
      throw new Error(data.error.message || 'API 返回錯誤');
    }

    return parseApiResponse(data);
  }

  // ========== Event Handlers ==========
  function setupEventHandlers(){
    // Tab 切換
    const tabBtns=$$(".tabbtn",app);
    const panels=$$("[data-panel]",app);
    tabBtns.forEach(btn=>{
      btn.onclick=()=>{
        tabBtns.forEach(b=>b.classList.remove("active"));
        btn.classList.add("active");
        const key=btn.dataset.tab;
        panels.forEach(p=>p.style.display=(p.dataset.panel===key)?"":"none");
      };
    });

    // 新增模型
    $("#addModel").onclick=()=>{
      const name=$("#newModelName").value.trim();
      const input=parseFloat($("#newModelIn").value||"0");
      const output=parseFloat($("#newModelOut").value||"0");
      
      if(!name){
        showAlert('#priceAlert', '請輸入模型名稱', 'error');
        return;
      }
      if(prices[name]){
        showAlert('#priceAlert', '模型名稱已存在', 'error');
        return;
      }

      const norm = v => (Number.isFinite(v) && v >= 0) ? v : 0;
      prices[name] = { input: norm(input), output: norm(output) };
      savePrices();
      renderTable();
      updateSelect();
      $("#newModelName").value=$("#newModelIn").value=$("#newModelOut").value="";
      showAlert('#priceAlert', `✓ ${name} 已新增`);
    };

    // API Key 管理
    $("#saveKey").onclick=()=>{
      const key = $("#gc_api").value.trim();
      if(!key){
        showAlert('#keyAlert', '請輸入 API Key', 'error');
        return;
      }
      if(saveApiKey(key)){
        showAlert('#keyAlert', '✓ API Key 已儲存');
      }else{
        showAlert('#keyAlert', '儲存失敗,請檢查瀏覽器設定', 'error');
      }
    };

    $("#clearKey").onclick=()=>{
      if(confirm('確定要清除已儲存的 API Key 嗎?')){
        if(clearApiKey()){
          $("#gc_api").value = '';
          showAlert('#keyAlert', '✓ API Key 已清除');
        }else{
          showAlert('#keyAlert', '清除失敗', 'error');
        }
      }
    };

    // 清空輸入
    $("#gc_clear").onclick=()=>{
      $("#gc_prompt").value="";
      $("#gc_result").style.display="none";
    };

    // 執行測試
    $("#gc_run").onclick=async()=>{
      const apiKey=$("#gc_api").value.trim();
      const prompt=$("#gc_prompt").value.trim();
      const model=$("#gc_model").value;
      const maxTok=parseInt($("#gc_maxtokens").value||"128000",10);
      
      if(!apiKey){
        alert("請先在「API Key 設定」分頁輸入並儲存 API Key");
        return;
      }
      if(!prompt){
        alert("請輸入文字");
        return;
      }

      const runBtn = $("#gc_run");
      const originalHTML = runBtn.innerHTML;
      
      runBtn.disabled = true;
      runBtn.innerHTML = '<span class="spinner"></span> 計算中...';

      try{
        const { outputText, reasoningText, inputTokens, outputTokens, reasoningTokens, modelName } = await callOpenAIAPI(apiKey, model, prompt, maxTok);

        const p = prices[model] || {input:0, output:0};
        const inCost = inputTokens/1e6 * p.input;
        const outCost = outputTokens/1e6 * p.output;
        const total = inCost + outCost;

        // 計算實際回應的 tokens（總輸出 - 思考）
        const responseTokens = outputTokens - reasoningTokens;

        let resultHTML = `
          <div class="kv"><div class="k">模型</div><div class="v">${escapeHtml(modelName)}</div></div>
          <div class="kv"><div class="k">輸入文字</div><div class="v">${escapeHtml(prompt)}</div></div>
          <div class="kv"><div class="k">輸入 Token 數</div><div class="v">${inputTokens.toLocaleString()}</div></div>
          <div class="kv"><div class="k">輸出文字</div><div class="v">${escapeHtml(outputText)}</div></div>
          <div class="kv"><div class="k">思考 Token 數</div><div class="v">${reasoningTokens.toLocaleString()}</div></div>
          <div class="kv"><div class="k">輸出 Token 數</div><div class="v">${responseTokens.toLocaleString()}${reasoningTokens > 0 ? ` <small style="color:#6b7280">(${outputTokens.toLocaleString()} - ${reasoningTokens.toLocaleString()})</small>` : ''}</div></div>
          <div class="kv"><div class="k">總輸出 Token 數</div><div class="v">${outputTokens.toLocaleString()}${reasoningTokens > 0 ? ' <small style="color:#6b7280">(含思考)</small>' : ''}</div></div>
          <div class="kv"><div class="k">輸入費用</div><div class="v">${inCost.toFixed(6)} <small style="color:#6b7280">(${p.input}/10⁶ × ${inputTokens.toLocaleString()})</small></div></div>
          <div class="kv"><div class="k">輸出費用</div><div class="v">${outCost.toFixed(6)} <small style="color:#6b7280">(${p.output}/10⁶ × ${outputTokens.toLocaleString()})</small></div></div>
          <div class="kv"><div class="k total">總費用</div><div class="v total">${total.toFixed(6)}</div></div>`;

        $("#gc_result").style.display = "";
        $("#gc_result").innerHTML = resultHTML;
      }catch(err){
        alert("執行失敗：" + (err.message || '未知錯誤'));
      }finally{
        runBtn.disabled = false;
        runBtn.innerHTML = originalHTML;
      }
    };
  }

  // ========== Initialize ==========
  function init(){
    renderTable();
    updateSelect();
    
    const savedKey = loadApiKey();
    if(savedKey){
      $("#gc_api").value = savedKey;
    }
    
    setupEventHandlers();
  }

  init();
})();
</script>
{% endraw %}

