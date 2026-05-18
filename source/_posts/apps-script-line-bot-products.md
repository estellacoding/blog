---
title: 用 Apps Script 建立 LINE Bot 查詢資料小幫手
date: 2025-04-30 11:11:11
updated: 2025-04-30 11:11:11
tags:
  - Apps Script
  - LINE Bot
categories:
  - Apps Script
  - LINE Bot
comments: true
---

通常在開發 LINE Bot 的時候，想要正式上線給使用者使用，因為要保持 Webhook 連線，就必須申請一台雲端主機，但通常都需要支付費用。但我發現其實可以用 Google Apps Script (GAS) 來開發，GAS 支援 HTTPS Webhook、排程觸發器，重點有免費額度，不必額外花錢，也省下了伺服器維護的負擔。

<!-- more -->

在這篇文章中，我將分享用 Google Apps Script (GAS) 建立 LINE Bot 查詢資料小幫手，可以協助查詢產品銷售數據，並透過 LINE 訊息自動回覆使用者或群組。

LINE Bot 查詢資料小幫手的功能有:
- 記錄使用者ID是否啟用小幫手
- 記錄群組ID是否啟用小幫手
- 取消啟用小幫手及刪除紀錄
- 讀取產品銷售資料及排序
- 以LINE文字或Flex訊息回覆
- 自動記錄錯誤資訊供Debug用

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

<div class="callout">
<span class="callout-icon">💡</span>
歡迎加入我的官方 LINE 帳號 👉 
<a href="https://lin.ee/VPYVeGH" target="_blank">史戴拉寫扣</a><br>
點擊圖文選單的「<strong>小幫手</strong>」，然後輸入以下關鍵字即可啟用對應功能:<br>
- <strong>啟用小幫手</strong>: 啟用小幫手<br>
- <strong>取消啟用小幫手</strong>: 取消啟用小幫手<br>
- <strong>統計產品銷售數據</strong>: 查看Flex卡片訊息統計資料
</div>


# LINE token
1. 建立 [LINE 官方帳號](https://manager.line.biz/)
2. LINE OA 設定啟用 Messaging API 功能
3. 前往 [LINE Developers](https://developers.line.biz/console/)
4. 選擇一個 LINE 官方帳號
5. 進入「Messaging API」設定頁
6. 取得 `Channel access token`

# 設定環境變數
新增 Google Sheet，進入 Apps Script 編輯器的設定，在 Script Properties 中新增以下變數。
- LINE_CHANNEL_TOKEN: 你的 LINE Channel access token
- SHEET_ID: 你的 Google Sheet ID

# 宣告全域變數
```
// 全域變數區
const LINE_CHANNEL_TOKEN = PropertiesService.getScriptProperties().getProperty('LINE_CHANNEL_TOKEN');
const SHEET_ID = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
const ACTIVATE_KEYWORD = '啟用小幫手';
const DEACTIVATE_KEYWORD = '取消啟用小幫手';
const PRODUCTS_KEYWORD = '統計產品銷售數據';
```

# 回覆LINE訊息
## replyTextMessage
傳送一般純文字。
```
// 發送LINE文字訊息
function replyTextMessage(replyToken, text) {
  const url = 'https://api.line.me/v2/bot/message/reply';
  const options = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + LINE_CHANNEL_TOKEN
    },
    payload: JSON.stringify({
      replyToken: replyToken,
      messages: [{ type: 'text', text: text }]
    }),
    muteHttpExceptions: true
  };
  const response = UrlFetchApp.fetch(url, options);
  Logger.log('回覆訊息的response: ' + response.getContentText());
  logError('回覆訊息的response: ' + response.getContentText());
}
```

![replyTextMessage](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fapps-script-line-bot-products%2FreplyTextMessage.jpg?alt=media&token=edb7ab50-fb3d-4941-8ad9-31b594d5fd66)

## replyFlexMessage
傳送 Flex Message 格式的圖文訊息。
{% note info %}
可使用 [FLEX MESSAGE SIMULATOR](https://developers.line.biz/flex-simulator/) 設計Flex訊息的內容。
{% endnote %}

```
// 發送LINE Flex訊息
function replyFlexMessage(replyToken, flexContents, altText) {
  const url = 'https://api.line.me/v2/bot/message/reply';
  const payload = JSON.stringify({
    replyToken: replyToken,
    messages: [{
      type: 'flex',
      altText: altText,
      contents: flexContents
    }]
  });
  
  const response = UrlFetchApp.fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + LINE_CHANNEL_TOKEN
    },
    payload: payload,
    muteHttpExceptions: true
  });

  Logger.log(response.getContentText());
  logError('回覆Flex訊息的response: ' + response.getContentText());
}
```

![replyFlexMessage](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fapps-script-line-bot-products%2FreplyFlexMessage.jpg?alt=media&token=d726aa46-a7ad-42ef-8d5c-45b3ad476434)

# 啟用小幫手
## addRecord
當使用者傳來「啟用小幫手」訊息時:
- 檢查 line_ids 表中是否已有紀錄
- 如果沒有，就新增一筆紀錄（包含時間、來源類型、使用者ID、群組ID、原始訊息）

```
// 加入紀錄（私訊或群組）
function addRecord(sourceType, groupId, userId, message) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('line_ids');
  const rows = sheet.getDataRange().getValues();

  groupId = groupId || '';
  userId = userId || '';

  // 檢查是否已經存在
  const exists = rows.some(row => {
    return row[1] === sourceType &&
           row[2] === userId &&
           row[3] === groupId;
  });

  if (exists) return false; // 如果存在就不新增

  // 新增一筆記錄
  const timestamp = new Date();
  sheet.appendRow([timestamp, sourceType, userId, groupId, message]);
  return true;
}
```

![addRecord](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fapps-script-line-bot-products%2FaddRecord.jpg?alt=media&token=35bf9de3-b8db-49bc-a593-1a910a24468d)

## removeRecord
當使用者傳來「取消啟用小幫手」訊息時:
- 在 line_ids 表格中搜尋符合條件的資料列
- 若找到，就刪除該列紀錄

```
// 移除紀錄
function removeRecord(sourceType, groupId, userId) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('line_ids');
  const rows = sheet.getDataRange().getValues();

  groupId = groupId || '';
  userId = userId || '';

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const match =
      row[1] === sourceType &&
      row[2] === userId &&
      row[3] === groupId;
    if (match) {
      sheet.deleteRow(i + 1); // Google Sheet從1開始計，所以要+1
      return true;
    }
  }
  return false;
}
```

# 產品銷售資料
當使用者傳來「統計產品銷售數據」訊息時:
- 讀取 products 工作表的產品銷售資料
- 將產品按照名稱分組，並且每組內依照日期排序
- 將資料轉成 Flex Bubble 卡片格式

## getProductData
從 products 工作表讀取產品銷售資料。

每筆資料包含:
- 日期
- 產品名稱
- 售價
- 銷售數量

```
// 讀取產品資料
function getProductData() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('products');
  const rows = sheet.getDataRange().getValues(); // 讀取全部資料

  const products = rows.slice(1).map(row => ({    // 跳過第一列標題，開始整理資料
    date: row[0],               // A欄 = 日期
    product_name: row[1],       // B欄 = 產品名稱
    sell_price: row[2],         // C欄 = 售價
    sell_quantity: row[3]       // D欄 = 銷售數量
  }));
  return products; // 回傳整理好的產品資料陣列
}
```

![products-data](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fapps-script-line-bot-products%2Fproducts-data.jpg?alt=media&token=e1e09ce3-4eb8-4239-9b35-cf4d94f1d2d8)

## groupAndSortProducts
將產品按照名稱分組，並且每組內依照日期排序。

```
// 將產品分組排序
function groupAndSortProducts(products) {
  const grouped = {}; // 建立空的分組物件

  // 分組
  products.forEach(p => {
    if (!grouped[p.product_name]) grouped[p.product_name] = [];
    grouped[p.product_name].push(p);
  });

  // 每組內部排序(依日期從小到大)
  for (let name in grouped) {
    grouped[name].sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  return grouped; // 回傳分好組、排序好的資料
}
```

## 資料格式處理
```
// 數字加上千分位逗號
function formatNumber(num) {
  return Number(num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// 日期格式
function formatDateToYMD(dateStr) {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '未知日期'; // 日期錯誤時回傳"未知日期"

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}/${month}/${day}`; // 格式化成2025/04/28
}
```


## createFlexBubbles
把整理好的資料轉成一個一個 Flex Bubble 卡片格式。
- 資料包含產品名稱、日期、售價(加上千分位)、銷售數量
- 不同產品設定不同背景顏色
- 將不同卡片再組成一個 Flex Carousel

```
// 建立Flex訊息內容
function createFlexBubbles(products) {
  const grouped = groupAndSortProducts(products); // 先分組、排序好

  // 每個產品群用不同顏色背景
  const colorMap = {
    'Trek 820': '#00C853',
    'Ritchey': '#AA00FF',
    'Surly': '#2962FF',
    'Trek Fuel': '#FF6D00',
  };
  const defaultColor = '#888888'; // 預設顏色
  const bubbles = [];

  for (let productName in grouped) {
    const productGroup = grouped[productName];
    const color = colorMap[productName] || defaultColor;

    productGroup.forEach(product => {
      const safeProductName = (product.product_name || '未知產品').toString().substring(0, 50); 
      const safeDate = formatDateToYMD(product.date);
      const price = parseFloat(product.sell_price);
      const safePrice = isNaN(price) ? 0 : price;
      const safeQuantity = typeof product.sell_quantity === 'number' ? product.sell_quantity : 0;

      const bubble = {
        type: 'bubble',
        size: 'micro',
        body: {
          type: 'box',
          layout: 'vertical',
          spacing: 'sm',
          backgroundColor: color,
          paddingAll: '20px',
          contents: [
            {
              type: 'text',
              text: safeProductName,
              weight: 'bold',
              size: 'md',
              color: '#ffffff',
              wrap: true,
            },
            {
              type: 'text',
              text: `📅 ${safeDate}`,
              size: 'sm',
              color: '#ffffff',
            },
            {
              type: 'text',
              text: `🏷️ $${formatNumber(safePrice)}`,
              size: 'sm',
              color: '#ffffff',
            },
            {
              type: 'text',
              text: `📦 銷售 ${safeQuantity} 台`,
              size: 'sm',
              color: '#ffffff',
            }
          ]
        }
      };
      bubbles.push(bubble); // 把這個小卡片加入陣列
    });
  }

  return bubbles; // 回傳全部bubble
}
```

# 操作記錄
將操作記錄到 Google Sheet 的 logs 工作表中，幫助追蹤bug。

```
// 操作記錄
function logError(message) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('logs');
  const timestamp = new Date();
  sheet.appendRow([timestamp, message]);
}
```

![log](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fapps-script-line-bot-products%2Flog.jpg?alt=media&token=0ac60c93-a09e-4368-a2e1-12bef24af55a)

# 主程式
這是整個應用的主入口。
當 LINE Webhook 送來訊息時:
- 解析訊息內容與來源
- 根據文字內容判斷要執行的動作
    - 啟用小幫手
    - 取消啟用小幫手
    - 回傳產品銷售資料

```
// 主程式
function doPost(e) {
  try {
    const contents = JSON.parse(e.postData.contents);
    logError('webhook 收到： ' + JSON.stringify(contents));
    Logger.log('webhook 收到： ' + JSON.stringify(contents));

    const events = contents.events;
    if (!events || !Array.isArray(events) || events.length === 0) {
      return ContentService.createTextOutput('NO EVENTS');
    }

    for (const event of events) {
      const messageText = event.message?.text?.trim();
      const replyToken = event.replyToken;
      const source = event.source || {};
      const sourceType = source.type;
      const userId = source.userId;
      const groupId = source.groupId;

      if (!messageText || !replyToken) continue;

      if (messageText === ACTIVATE_KEYWORD) {
        const isNew = addRecord(sourceType, groupId, userId, messageText);
        replyTextMessage(replyToken, isNew ? "✅ 已啟用小幫手" : '🎉 你已經啟用過囉！');

      } else if (messageText === DEACTIVATE_KEYWORD) {
        const removed = removeRecord(sourceType, groupId, userId);
        replyTextMessage(replyToken, removed ? "❌ 已取消啟用小幫手" : '⚠️ 尚未啟用，無需取消。');

      } else if (messageText === PRODUCTS_KEYWORD) {
        const products = getProductData();
        const bubbles = createFlexBubbles(products.slice(0, 12));
        if (bubbles.length === 0) {
          replyTextMessage(replyToken, '⚠️ 目前沒有產品銷售數據喔！');
          continue;
        }
        const flexContents = {
          type: 'carousel',
          contents: bubbles
        };
        replyFlexMessage(replyToken, flexContents, '統計產品銷售數據');
      }
    }
    return ContentService.createTextOutput('OK');
  } catch (error) {
    Logger.log('錯誤訊息: ' + error);
    logError('錯誤訊息: ' + error);
    return ContentService.createTextOutput('錯誤: ' + error);
  }
}
```

# 部署
1. 點選「Deploy」 > 「New deployment」
   - 類型: 網路應用程式
   - 說明: 填寫本次部署的說明
   - 執行應用程式的身份: 自己
   - 誰可以存取: 任何人
2. 成功部署後會出現一個網址
3. 前往 [LINE Developers](https://developers.line.biz/console/)
4. 選擇一個 LINE 官方帳號
5. 進入「Messaging API」設定頁
6. 找到「Webhook URL」欄位，貼上部署後`https://script.google.com/.../exec`網址
7. 之後有更新，可以點擊「Manage deployments」，新增一個新版本的部署

# 免費配額和限制
雖然 Google Apps Script (GAS) 提供了免費額度，但在開發和部署 LINE Bot 時，還是有一些需要特別注意的配額和使用限制，避免因為超出限制導致服務中斷。

功能|消費者帳戶(如`gmail.com`)|Google Workspace帳戶|注意事項
:-|:-|:-|:-
⏳ **觸發條件總執行階段**<br>(Triggers total runtime)|90分鐘/天|每天6小時|每天執行的總時長上限，超過後當天將無法再觸發腳本
📈 **網址擷取呼叫次數**<br>(URL Fetch calls)|20,000次/天|100,000次/天|每次使用`UrlFetchApp.fetch()`呼叫 LINE API 都會消耗，例如發送文字`replyTextMessage`、發送Flex訊息`replyFlexMessage`等
⏱️ **指令碼執行時間**<br>(Script runtime)|6分鐘/次|6分鐘/次|每次腳本執行，不論是來自Webhook或觸發器，都必須在6分鐘內結束，否則會自動中斷

完整配額和限制表請看 [Apps Script Quotas 官方文件](https://developers.google.com/apps-script/guides/services/quotas?hl=zh-tw)。


# 配額估算小工具
我寫了一個配額估算小工具，可以協助你估算可能會消耗的「觸發條件總執行階段(Triggers total runtime)」和「網址擷取呼叫次數(URL Fetch calls)」使用量。
## 觸發條件總執行階段
估算每天的總執行時間。

### 觸發器每次執行時間
可以進入觸發器的執行項目中查看觸發器每次執行的時間。
![triggers-total-runtime](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fapps-script-line-bot-products%2Ftriggers-total-runtime.jpg?alt=media&token=536d6319-c86e-416b-af0a-f305236fa1e5)

### 觸發器間隔時間
可以進入觸發器的設定中查看觸發器所設定的間隔時間。
![url-fetch-calls](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fapps-script-line-bot-products%2Furl-fetch-calls.jpg?alt=media&token=78b5a0da-26d5-40b0-9f4e-ec7ed130506b)

## 網址擷取呼叫次數
估算每天的網址擷取呼叫次數。

以本篇文章的程式碼為例:
- 每次使用者啟用小幫手 → 呼叫 LINE API 1 次
- 每次查詢產品銷售資料 → 呼叫 LINE API 1 次
- 若每天有 100 位使用者，平均每人互動 2 次
- → 則每天會消耗 100 × 2 = 200 次呼叫

## 配額估算小工具

{% raw %}
<!-- 網址擷取呼叫次數 和 觸發條件總執行階段 計算小工具 -->
<style>
.tabs-wrapper {
  margin-top: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background: #f9f9f9;
  font-family: "Segoe UI", Arial, sans-serif;
}
.tab-buttons {
  display: flex;
  border-bottom: 1px solid #ddd;
}
.tab-buttons button {
  flex: 1;
  padding: 12px;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  border-bottom: 3px solid transparent;
}
.tab-buttons button.active {
  border-color: #007bff;
  color: #007bff;
  background: #ffffff;
}
.tab-content {
  display: none;
  padding: 20px;
}
.tab-content.active {
  display: block;
}
.calc-card label {
  display: block;
  margin: 10px 0 6px;
  font-weight: bold;
}
.calc-card input {
  max-width: 200px;
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
.calc-card button {
  margin-top: 10px;
  padding: 8px 16px;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.calc-card button:hover {
  background: #0056b3;
}
.calc-result {
  display: none;
  margin-top: 16px;
  background: #eef6ff;
  padding: 14px 18px;
  border-radius: 8px;
  font-size: 15px;
  line-height: 1.8;
}
</style>

<div class="tabs-wrapper">
  <div class="tab-buttons">
    <button class="active" onclick="switchTab('tab-trigger')">⏳ Triggers total runtime</button>
    <button onclick="switchTab('tab-fetch')">📈 URL Fetch calls</button>
  </div>

  <div id="tab-fetch" class="tab-content calc-card">
    <label for="urlfetch_interactions">每天互動次數：</label>
    <p>如: 假設每次執行時會呼叫1次LINE API，每天有200個使用者，平均每位互動2次，請輸入200。</p>
    <input id="urlfetch_interactions" type="number" placeholder="例如 200" value="200">
    <button onclick="calculateUrlFetch()">計算</button>
    <div id="urlfetch_result" class="calc-result"></div>
  </div>

  <div id="tab-trigger" class="tab-content active calc-card">
    <label for="trigger_duration">每次觸發執行時間（秒）：</label>
    <p>如: 觸發器每次執行的時間，假設觸發器每次執行需要15.379秒，請輸入15.379。</p>
    <input id="trigger_duration" type="number" placeholder="例如 15.379" value="15.379">

    <label for="trigger_interval">觸發間隔（分鐘）：</label>
    <p>如: 觸發器每次執行的間隔時間，假設設定每10分鐘要啟動觸發器，請輸入10。</p>
    <input id="trigger_interval" type="number" placeholder="例如 10" value="10">

    <button onclick="calculateTrigger()">計算</button>
    <div id="trigger_result" class="calc-result"></div>
  </div>
</div>

<script>
function switchTab(tabId) {
  const tabs = document.querySelectorAll('.tab-content');
  const buttons = document.querySelectorAll('.tab-buttons button');

  tabs.forEach(t => t.classList.remove('active'));
  buttons.forEach(b => b.classList.remove('active'));

  document.getElementById(tabId).classList.add('active');
  event.target.classList.add('active');
}

function calculateUrlFetch() {
  const value = parseInt(document.getElementById('urlfetch_interactions').value);
  const result = document.getElementById('urlfetch_result');
  if (isNaN(value) || value <= 0) {
    result.innerHTML = '⚠️ 請輸入有效的互動次數！';
    result.style.display = 'block';
    return;
  }
  const percent = ((value / 20000) * 100).toFixed(2);
  result.innerHTML = `
    ✅ 每天預估消耗 <strong>${value}</strong> 次網址擷取呼叫。<br>
    📊 使用率為 <strong>${percent}%</strong>（以免費帳戶上限計算）。<br><br>
    🔺 <strong>免費帳戶上限：</strong>20,000 次/天<br>
    🔺 <strong>Workspace帳戶上限：</strong>100,000 次/天
  `;
  result.style.display = 'block';
}

function calculateTrigger() {
  const seconds = parseFloat(document.getElementById('trigger_duration').value);
  const interval = parseFloat(document.getElementById('trigger_interval').value);
  const result = document.getElementById('trigger_result');

  if (isNaN(seconds) || isNaN(interval) || seconds <= 0 || interval <= 0) {
    result.innerHTML = '⚠️ 請輸入有效的秒數與間隔！';
    result.style.display = 'block';
    return;
  }

  const perDay = 1440 / interval;
  const totalSeconds = perDay * seconds;
  const totalMinutes = (totalSeconds / 60).toFixed(2);
  const usagePercent = ((totalMinutes / 90) * 100).toFixed(2);  // 90 是免費帳戶上限

  result.innerHTML = `
    ✅ 每天會觸發 <strong>${perDay.toFixed(0)}</strong> 次。<br>
    ⏱️ 每天總執行時間為 <strong>${totalMinutes}</strong> 分鐘。<br>
    📊 使用率為 <strong>${usagePercent}%</strong>（以免費帳戶上限計算）。<br><br>
    🔺 <strong>免費帳戶上限：</strong>90 分鐘/天<br>
    🔺 <strong>Workspace帳戶上限：</strong>360 分鐘/天
  `;
  result.style.display = 'block';
}
</script>
{% endraw %}

