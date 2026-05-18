---
title: MongoDB Compass 圖形介面操作資料庫
date: 2024-10-22 11:11:11
updated: 2024-10-22 11:11:11
tags:
  - MongoDB
  - MongoDB Compass
  - NoSQL
  - GUI
categories: MongoDB
comments: true
---

先前我們使用具體的操作範例比較 Oracle DB JSON 與 MongoDB 的差異，請看 [Oracle DB JSON 與 MongoDB 的差異](https://estellacoding.github.io/blog/oracledb-json-mongodb-custom-fields)。而這篇要來補充說明，怎麼用 MongoDB Compass 圖形介面操作資料庫。

<!-- more -->

# MongoDB Compass
MongoDB Compass 是官方提供免費的圖形使用者介面(GUI)工具，用來操作和分析 MongoDB 資料，通過圖形介面執行查詢，並可在 macOS、Windows 和 Linux 操作系統上運行。

好用功能:
- 瀏覽資料: Compass 介面上查看和瀏覽 MongoDB 文件資料，並可同時連接到不同的資料庫。
- 命令行介面(CLI): 內建一個 MongoDB Shell，可以直接輸入命令操作資料庫。
- 匯入匯出資料: 可將 JSON 或 CSV 檔案中的資料匯入 MongoDB，也可以將資料匯出。
- AI 查詢: 可使用自然語言來簡化資料查詢。
- 更多功能: ...

{% note default %}
[MongoDB Compass 官方文檔](https://www.mongodb.com/zh-cn/docs/compass/current/)
{% endnote %}

# 下載 Compass
[下載 MongoDB Compass](https://www.mongodb.com/products/tools/compass)

{% note info %}
MongoDB Compass 不支援虛擬桌面環境喔。
{% endnote %}

# 設定資料庫
## 註冊帳號
先去 [註冊 MongoDB Atlas](https://www.mongodb.com/products/platform/cloud) 帳號。

## 建立專案
### 資料結構
在建立專案前，我們先了解在 MongoDB 中的資料結構的層級。
```
Project
  └── Cluster
        └── Database
              └── Collection [Documents]
                    └── Document {name: 'Ned Stark', name: 'Robert Baratheon', ...}
                          └── Field {name: 'Ned Stark'}
```

個別對應到 RDBMS 中的概念:
| **MongoDB**  | **RDBMS**   |
|--------------|-------------|
| Project      | 專案        |
| Cluster      | 資料庫伺服器 |
| Database     | 資料庫       |
| Collection   | 表 (Table)   |
| Document     | 行 (Row)     |
| Field        | 欄位 (Column)|

### 建立專案
註冊完成並 [登入帳號](https://account.mongodb.com/account/login) 後，就可以建立專案。
![mongodb-compass-1](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fmongodb-compass-gui-introduction%2Fmongodb-compass-1.png?alt=media&token=b8fc053e-662f-401f-a906-798bb32a428b)

為專案命名後，點擊「Next」。
![mongodb-compass-2](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fmongodb-compass-gui-introduction%2Fmongodb-compass-2.png?alt=media&token=45d2ee3d-87f1-4138-bce4-942c8494d6b3)

## 建立集群
接著，我們要建立集群(Cluster)，點擊「Create」。
![mongodb-compass-3](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fmongodb-compass-gui-introduction%2Fmongodb-compass-3.png?alt=media&token=56d2fe4f-b57b-4390-977c-acae3510cb46)

選擇「M0」免費方案，提供 512 MB 的儲存空間。
![mongodb-compass-4](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fmongodb-compass-gui-introduction%2Fmongodb-compass-4.png?alt=media&token=495b3e99-409f-47eb-ad65-195ae6a88a33)

{% note default %}
[Atlas M0 配置限制](https://www.mongodb.com/zh-cn/docs/atlas/reference/free-shared-limitations/)
{% endnote %}

- 為集群命名
- 勾選「Automate Security setup」自動新增目前的 IP 啟用本地連線。
- 勾選「Preload sample dataset」預載 45MB 的範例資料集。
- 選擇「Google Cloud」，地區為台灣。
- 選項確認沒問題後，就可以點擊「Create Deployment」。

![mongodb-compass-5](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fmongodb-compass-gui-introduction%2Fmongodb-compass-5.png?alt=media&token=941ef7cd-78a8-4130-a7e1-09e865a23dbd)

點擊「Copy」複製密碼後，才能點擊「Create Database User」。
![mongodb-compass-7](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fmongodb-compass-gui-introduction%2Fmongodb-compass-7.png?alt=media&token=25529a74-c579-4993-a195-53f78a760e69)

{% note info %}
這是資料庫帳號密碼要記得保存下來。
{% endnote %}

點擊「Choose a connection method」。
![mongodb-compass-6](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fmongodb-compass-gui-introduction%2Fmongodb-compass-6.png?alt=media&token=882f2c5a-325b-4914-8dd6-25bf8cd2c7ba)

MongoDB 有提供很多種連線方式，我們這次選擇「Compass」。
![mongodb-compass-8](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fmongodb-compass-gui-introduction%2Fmongodb-compass-8.png?alt=media&token=1797685b-6cba-4310-865e-095ed2e2a382)

因為我已經先安裝好 MongoDB Compass，所以可直接點擊「I have MongoDB Compass installed」。如果還沒安裝可以點擊「I don\'t have MongoDB Compass installed」進行安裝。

複製「連線字串(connection string)」。
![mongodb-compass-9](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fmongodb-compass-gui-introduction%2Fmongodb-compass-9.png?alt=media&token=1594d458-a883-4323-a254-802334e8891f)


## 連接資料庫
打開 MongoDB Compass，建立新連線，將剛才複製的連線字串貼上。
![mongodb-compass-10](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fmongodb-compass-gui-introduction%2Fmongodb-compass-10.png?alt=media&token=c24a7808-34a2-4533-aba0-0c250099e9bb)

當出現綠色連線標誌時，表示連線成功！剛才預載的範例資料集位於 sample_mflix。
![mongodb-compass-10-1](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fmongodb-compass-gui-introduction%2Fmongodb-compass-10-1.png?alt=media&token=b2f0d72b-e9d6-43c5-a324-4e715d261848)

# 建立資料
我將以簡單電商網站的資料作為的 MongoDB 資料庫設計範例，包括用戶、商品、訂單等資料結構。

## 建立資料庫

點擊「cluser-2」後，再點擊「Open MongoDB shell」。
![mongodb-compass-11-0](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fmongodb-compass-gui-introduction%2Fmongodb-compass-11-0.png?alt=media&token=176d8d4b-0309-4eb3-bb5f-634676421277)

在「Open MongoDB shell」的視窗中，輸入以下指令。
```m
// 創建並切換到 ecommerce 資料庫
use ecommerce
```
![mongodb-compass-11](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fmongodb-compass-gui-introduction%2Fmongodb-compass-11.png?alt=media&token=7bfdadec-56af-4861-a72a-15fb5cd92e95)

![mongodb-compass-12](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fmongodb-compass-gui-introduction%2Fmongodb-compass-12.png?alt=media&token=ce40f84e-9ab3-4561-9bc3-7a5c6a0d2152)


## 建立集合
在「Open MongoDB shell」的視窗中，輸入以下指令插入資料。
```m
// 創建 users 集合並插入資料
db.createCollection('users')
db.users.insertOne({
  "name": "John Doe",
  "email": "john.doe@example.com",
  "passwordHash": "hashedpassword",
  "phone": "+123456789",
  "addresses": [
    {
      "type": "home",
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zip": "10001",
      "country": "USA"
    },
    {
      "type": "work",
      "street": "456 Office St",
      "city": "New York",
      "state": "NY",
      "zip": "10002",
      "country": "USA"
    }
  ],
  "createdAt": new Date("2024-01-01T12:00:00Z"),
  "isAdmin": false
})

// 創建 products 集合並插入資料
db.createCollection('products')
db.products.insertOne({
  "name": "Smartphone X",
  "description": "Latest model of the Smartphone X series with 128GB storage.",
  "category": "Electronics",
  "price": 799.99,
  "stock": 50,
  "brand": "Brand X",
  "specifications": {
    "color": "Black",
    "weight": "180g",
    "batteryLife": "10h"
  },
  "images": [
    "https://example.com/images/smartphone-x-front.jpg",
    "https://example.com/images/smartphone-x-back.jpg"
  ],
  "ratings": {
    "average": 4.5,
    "totalReviews": 150
  },
  "createdAt": new Date("2024-01-05T08:30:00Z")
})

// 創建 orders 集合並插入資料
db.createCollection('orders')
db.orders.insertOne({
  "userId": ObjectId("64a543d293be0307c812b73f"),
  "items": [
    {
      "productId": ObjectId("64a543d293be0307c812b741"),
      "quantity": 2,
      "price": 799.99
    }
  ],
  "totalAmount": 1599.98,
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zip": "10001",
    "country": "USA"
  },
  "orderStatus": "pending",
  "orderDate": new Date("2024-01-10T12:30:00Z"),
  "shippingDate": new Date("2024-01-11T12:30:00Z"),
  "deliveryDate": new Date("2024-01-15T14:00:00Z")
})
```
## 創建索引
在「Open MongoDB shell」的視窗中，輸入以下指令創建索引。
```m
// 為 users 集合的 email 欄位創建唯一索引
db.users.createIndex({ email: 1 }, { unique: true })
```

## 執行查詢
### 命令行
在「Open MongoDB shell」的視窗中，輸入以下指令查詢資料。
```m
// 查找訂單狀態為"pending"的訂單
db.orders.find({ "orderStatus": "pending" })
```
![mongodb-compass-13](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fmongodb-compass-gui-introduction%2Fmongodb-compass-13.png?alt=media&token=7457f6b7-3eca-4169-8032-54621a6412d4)

### 自然語言
MongoDB Compass 支援使用自然語言生成查詢。(~~有AI還需我嗎XD~~)
![mongodb-compass-16](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fmongodb-compass-gui-introduction%2Fmongodb-compass-16.png?alt=media&token=11830a10-0b3b-4967-a543-d0c5cc24954b)

![mongodb-compass-14](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fmongodb-compass-gui-introduction%2Fmongodb-compass-14.png?alt=media&token=3bffa650-3085-4fab-93bc-025f98556144)

例如，輸入「查找訂單狀態為 pending 的訂單」，Compass 會自動生成相應的查詢語法。
![mongodb-compass-15](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fmongodb-compass-gui-introduction%2Fmongodb-compass-15.png?alt=media&token=15450947-408a-401c-bd4a-fe6adc9b3d13)

# 總結
MongoDB Compass 是一個非常好用的圖形化工具，使用上很直覺，再加上有了自然語言生成指令，省去很多人工寫查詢語法的時間，在資料庫管理與操作上更能提高工作效率。
