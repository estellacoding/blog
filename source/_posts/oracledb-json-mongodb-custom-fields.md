---
title: Oracle DB JSON 與 MongoDB 的差異
date: 2024-10-16 11:11:11
updated: 2025-01-08 11:11:11
tags:
  - Oracle
  - Oracle Database 23ai
  - JSON
  - MongoDB
  - NoSQL
categories: Oracle
comments: true
---

上一篇我們提到了 Oracle Database 23ai 對 JSON 的支援，並針對三種資料庫結構進行了效能測試，請看 [實測單一表格、EAV 模型與 JSON 欄位的查詢效能](https://estellacoding.github.io/blog/oracle-table-schema-json-comparison)。

但我就有進一步的問題是: 那那...Oracle DB 的 JSON 支援與 MongoDB 有什麼不同？
<!-- more -->

# 兩者本質不同
Oracle DB JSON vs. MongoDB 兩者來自不同的資料庫設計理念。
- OracleDB 是關聯式資料庫，主要是**關聯式表格(table)來儲存結構化資料**。隨著版本更新，OracleDB 增加了對 JSON 的支援，使其能夠更好地處理半結構化或動態資料，這使得 Oracle 具備了部分 NoSQL 的功能。
- MongoDB 是 NoSQL 資料庫，主要是**文件模型(Document)儲存，使用 BSON(Binary JSON) 格式來儲存非結構化資料**，以 JSON 和 Key-Value 的設計結構，易於擴展並處理複雜結構。

以下我們將使用具體的操作範例，比較 OracleDB 和 MongoDB 在 CRUD 操作中的差異。

# Create

## Oracle JSON
在 OracleDB，可以創建一個包含 JSON 資料的表格，不需要預先定義欄位結構。
```sql
-- 創建 JSON 集合表
CREATE TABLE products_json (
  data JSON
);
```
## MongoDB
MongoDB 是無結構的(Schema-less)，當插入資料時會自動創建集合，因此不需要明確創建集合。
```m
// 創建資料庫
use database-1
// 創建集合(非必要)
db.createCollection("products");
```

# Insert
我們將插入一筆資料和多筆隨機資料作為範例。

## Oracle JSON
### 插入一筆資料
資料內容如下:
```json
{
  "_id": 2,
  "product_name": "Product 2",
  "category": "Electronics",
  "price": 560.52,
  "description": "Description of product 2",
  "attributes": {
    "brand": "Brand2",
    "warranty": "1 year"
  }
}
```
插入一筆資料:
```sql
-- 插入一筆資料
INSERT INTO products_json (data)
VALUES (
  JSON_OBJECT(
    '_id' VALUE 2,
    'product_name' VALUE 'Product 2',
    'category' VALUE 'Electronics',
    'price' VALUE 560.52,
    'description' VALUE 'Description of product 2',
    'attributes' VALUE JSON_OBJECT(
      'brand' VALUE 'Brand2',
      'warranty' VALUE '1 year'
    )
  )
);
COMMIT;
```

### 隨機插入多筆
```sql
-- 插入 10,000 筆資料
BEGIN
  FOR i IN 1..10000 LOOP
    INSERT INTO products_json (data)
    VALUES (
      JSON_OBJECT(
        '_id' VALUE i,
        'product_name' VALUE 'Product ' || i,
        'category' VALUE CASE WHEN MOD(i, 2) = 0 THEN 'Electronics' ELSE 'Apparel' END,
        'price' VALUE ROUND(DBMS_RANDOM.VALUE(100, 1000), 2),
        'description' VALUE 'Description of product ' || i,
        'attributes' VALUE CASE
          WHEN MOD(i, 2) = 0 THEN JSON_OBJECT('brand' VALUE 'Brand' || i, 'warranty' VALUE '1 year')
          ELSE JSON_OBJECT('color' VALUE 'Red', 'product_size' VALUE 'L')
        END
      )
    );
  END LOOP;
  COMMIT;
END;
```

```sql
-- 查詢表中的所有資料
SELECT * FROM products_json
-- 計算總筆數
SELECT COUNT(DATA)FROM products_json
```

## MongoDB
### 插入一筆資料
資料內容如下:
```json
{
  "_id": 2,
  "product_name": "Product 2",
  "category": "Electronics",
  "price": 560.52,
  "description": "Description of product 2",
  "attributes": {
    "brand": "Brand2",
    "warranty": "1 year"
  }
}
```
插入一筆資料:
```m
// 插入一筆資料
db.products.insertOne({
  _id: 2,
  product_name: "Product 2",
  category: "Electronics",
  price: 560.52,
  description: "Description of product 2",
  attributes: {
    brand: "Brand2",
    warranty: "1 year"
  }
})
```

### 隨機插入多筆
```m
// 插入 10,000 筆資料
let products = [];
for (let i = 1; i <= 10000; i++) {
  products.push({
    _id: i,
    product_name: "Product " + i,
    category: i % 2 === 0 ? "Electronics" : "Apparel",
    price: Math.round(Math.random() * (1000 - 100) + 100),
    description: "Description of product " + i,
    attributes: i % 2 === 0
      ? { brand: "Brand" + i, warranty: "1 year" }
      : { color: "Red", product_size: "L" }
  });
}
db.products.insertMany(products);
```
```m
// 查詢所有資料
db.products.find().pretty();
// 計算集合中的總筆數
db.products.countDocuments();
```

# Read
## Oracle JSON
```sql
-- 查詢價格大於500且屬於Electronics類別的商品
SELECT data
FROM products_json
WHERE 
  JSON_VALUE(data, '$.price' RETURNING NUMBER) > 500
  AND JSON_VALUE(data, '$.category') = 'Electronics';
```

## MongoDB
```m
// 查詢價格大於500且屬於Electronics類別的商品
db.products.find({ price: { $gt: 500 }, category: "Electronics" });
```

# Update
將 `_id = 2` 的商品價格從 `560.52` 更新為 `999`。
同時，如果商品 `attributes` 沒有 `color`，則加上 `"color": "Red"`。

原始資料內容如下:
```json
{
  "_id": 2,
  "product_name": "Product 2",
  "category": "Electronics",
  "price": 560.52,
  "description": "Description of product 2",
  "attributes": {
    "brand": "Brand2",
    "warranty": "1 year"
  }
}
```

## Oracle JSON
使用 `JSON_TRANSFORM` 函數更新 JSON 資料。
- 欄位已存在: `SET` 原欄位會被新值覆蓋。
  - ex: `SET $.price` 將會更新為 `"price": 999`。
- 欄位不存在: `INSERT` 會將新欄位及其值加入 JSON。
  - ex: 若 JSON 中沒有 `"color"`，則會新增`"color": "Red"`。
  - `ERROR ON EXISTING` 確保已存在欄位不會被覆蓋。

```sql
UPDATE products_json
SET data = JSON_TRANSFORM(
  data,
  SET '$.price' = 999,
  INSERT '$.attributes.color' = 'Red' ERROR ON EXISTING
)
WHERE JSON_VALUE(data, '$._id') = 2;
```

```sql
-- 查詢表中id為2的資料
SELECT * FROM products_json
WHERE JSON_VALUE(data, '$._id') = 2
```

## MongoDB
使用 `$set` 來更新特定欄位。若欄位不存在 MongoDB 會自動加上該欄位及欄位值。
```m
db.products.updateOne(
  { _id: 2 },
  { $set: { price: 999, "attributes.color": "Red" } }
);
```
```m
// 查詢id為2的資料
db.products.find({ _id: 2 });
```

# Delete

## Oracle JSON
### 刪除特定欄位
使用 `JSON_TRANSFORM` 刪除 `_id = 2` 的商品資料中的 `attributes.color` 欄位。

```sql
UPDATE products_json
SET data = JSON_TRANSFORM(data, REMOVE '$.attributes.color')
WHERE JSON_VALUE(data, '$._id') = 2;
```

### 刪除整筆資料
```sql
DELETE FROM products_json
WHERE JSON_VALUE(data, '$._id') = 2;
```

## MongoDB
### 刪除特定欄位
使用 `$unset` 刪除 `_id = 2` 的商品資料中的 `attributes.color` 欄位。
```m
db.products.updateOne(
  { _id: 2 },
  { $unset: { "attributes.color": "" } }
);
```

### 刪除整筆資料
```m
db.products.deleteOne({ _id: 2 });
```

# 兩者效能比較
下圖是 OracleDB JSON 和 MongoDB 在不同讀寫比例，以及不同數據規模下的效能比較。使用 YCSB(Yahoo! Cloud Serving Benchmark) 進行測試不同資料庫在不同讀寫比例，以及不同數據規模下，每秒的操作數量(Operations per Second)。

![oracle-json-databse-mongodb-performance](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracledb-json-mongodb-custom-fields%2Foracle-json-databse-mongodb-performance.png?alt=media&token=ce3d5f1c-6f6d-4b3a-9395-5c9123ef4ac4)
<div style="margin-top: -15px; margin-bottom: 10px; font-size: 14px; color: #555; text-align: center; font-style: normal; font-family: 'Arial', sans-serif;">
    (資料來源: <a href="https://www.oracle.com/cn/a/ocom/docs/oracle-json-database-zhs.pdf" style="color: #555; text-decoration: none;">Oracle JSON 数据库介绍 by Xu Guang)
    </a>
</div>

我們可以發現:
- OracleDB 在面對 400 萬筆文檔時，隨著讀取操作比例增加，OracleDB 的性能顯著提升，操作數量每秒從約 30,000 提升至 80,000 次。而同時 MongoDB 則從每秒 10,000 次提升至 30,000 次。
- OracleDB 在面對 8100 萬筆文檔時，操作次數依然保持增長，隨著讀取操作比例增加，操作數量每秒從約 28,000 提升至 58,000 次。而同時 MongoDB 則從每秒 12,000 次提升至 22,000 次。
- 在高比例讀取的場景下，OracleDB 的查詢速度更快，這是由於 OracleDB 在處理結構化數據和索引方面的優勢，使其能高效處理大規模讀取操作。

# 總結
我參加了 2024 MongoDB.local Taipei，聽到 91APP 的首席架構師 Andrew Wu 有說到他們選擇用 MongoDB 的來實現客戶想要自訂欄位的需求，才進一步讓我想要深入了解兩者的差別(~~很多觀念值得研究但記憶體跑不動了XD~~)。從技術層面來看，使用 OracleDB 的 JSON 功能可以實現類似 MongoDB 的自訂欄位效果，JSON 資料在 OracleDB 中以動態結構儲存，因此可以根據需要隨時新增不同的欄位。

但當同一 JSON 包含不同類型產品的資料，如電器或衣服，每個產品類型可能對應到不同的屬性，在這種情況下，可能會有一些需要思考的面向。
1. 無法預測的資料結構
    - 因為 JSON 支援不固定欄位，每筆資料的欄位結構可能不同，需要更仔細管理與追蹤欄位。
2. 增加查詢的複雜性
    - 需精確指定 JSON 中的欄位路徑 `$.attributes.color`。
    - 需檢查欄位是否存在: 因為即使資料庫不會報錯，但可能導致結果不準確。
    - 如果欄位結構不統一，可能需要額外處理 NULL 欄位或缺失欄位。
3. 查詢效能的挑戰
    - 雖然 JSON 讓資料更彈性，但資料量一大可能出現查得慢、空間浪費等情況。

但總結來看，OracleDB JSON 是一個加分的擴充功能，可以在關聯式資料庫中支持半結構化資料，讓 OracleDB 保持在高度結構化和部分動態資料的混合場景中具備優勢。而 MongoDB 本來就是專門為動態資料設計的 NoSQL 資料庫，特別適合那些需要高靈活性、動態結構和大規模資料處理的應用。MongoDB 和關聯式資料庫各有優勢，應該根據實際場景選擇最適合的資料庫。
