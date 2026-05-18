---
title: 搞懂 SQL JOIN 的4種基本類型
date: 2024-12-04 11:11:11
updated: 2024-12-14 11:11:11
tags:
  - Database
  - SQL
  - JOIN
categories: Database
comments: true
---

在 SQL 查詢中，JOIN 是用來合併兩張或多張資料表的重要語法。本文會以客戶訂單為範例，介紹常見的 4 種 JOIN: `INNER JOIN`、`LEFT JOIN`、`RIGHT JOIN` 和 `FULL JOIN`，幫助大家理解每種 JOIN 類型的用途。
<!-- more -->

在實務中，資料通常分散於多張不同用途的資料表中。例如，`customers` 儲存客戶資料，而 `orders` 則記錄訂單資料。當需要單純查詢某一類型資料時，可以直接查詢對應的資料表，例如「某位客戶的手機號碼」。然而，當問題涉及多個資料表的資料時，例如「某位客戶的所有訂單」，就需要使用 JOIN 將多個資料表的資料合併起來，以實現跨表查詢的效果。

# 常見 JOIN 類型
|類型|簡寫形式| 完整形式|
|-|-|-|
|INNER JOIN | `JOIN` | `INNER JOIN`|
|LEFT JOIN | `LEFT JOIN`| `LEFT OUTER JOIN`|
|RIGHT JOIN | `RIGHT JOIN`| `RIGHT OUTER JOIN`|
|FULL JOIN  | `FULL JOIN`| `FULL OUTER JOIN`|


# 範例資料表

<span style="font-size: 1em; font-weight: bold; color: #000000; background-color: #F8F9FA; padding: 5px 10px; border-radius: 5px;">&downarrow;客戶表 (Customers)&downarrow;</span>

| CustomerID | CustomerName | ContactNumber | Email                 |
|------------|--------------|---------------|-----------------------|
| 1          | Stella       | 0981-123-456  | stelladai1028@gmail.com |
| 2          | Bob          | 0982-789-000  | bob@gmail.com         |
| 3          | Charlie      | 0983-666-777  | charlie@gmail.com     |
| 4          | David        | 0984-111-333  | david@gmail.com       |
| 5          | Emily        | 0985-222-444  | emily@gmail.com       |

<span style="font-size: 1em; font-weight: bold; color: #000000; background-color: #F8F9FA; padding: 5px 10px; border-radius: 5px;">&downarrow;訂單表 (Orders)&downarrow;</span>

| OrderID | CustomerID | OrderDate   | Amount  |
|---------|------------|-------------|---------|
| 101     | 1          | 2023-12-11  | 250  |
| 102     | 2          | 2024-01-22  | 300  |
| 103     | 3          | 2024-02-29  | 150  |
| 104     | 6          | 2024-03-11  | 400  |
| 105     | 7          | 2024-04-22  | 100  |

# INNER JOIN
只選出兩張表中交集的部分。

<div style="text-align: center;">
  <svg id="vennDiagram" width="600" height="400" viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
    <!-- 定義條紋樣式 -->
    <defs>
      <pattern id="stripedPattern" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <!-- 淡藍色斜線條紋 -->
        <line x1="0" y1="0" x2="0" y2="6" stroke="#D4E2F4" stroke-width="2" />
      </pattern>
    </defs>
    <!-- 左邊的圓 -->
    <circle id="usersCircle" cx="100" cy="100" r="70" fill-opacity="0" stroke="black" stroke-width="1" />
    <!-- 右邊的圓 -->
    <circle id="teamsCircle" cx="180" cy="100" r="70" fill-opacity="0" stroke="black" stroke-width="1" />
    <!-- 中間的交集部分 -->
    <ellipse id="innerJoin" cx="140" cy="100" rx="30" ry="55" fill="url(#stripedPattern)" />
    <!-- 提示文字 -->
    <text id="tooltip" x="150" y="20" font-size="16" text-anchor="middle" fill="black" visibility="hidden"></text>
    <!-- 標籤 -->
    <text x="73" y="101" font-size="10" text-anchor="middle">Customers</text>
    <text x="199" y="101" font-size="10" text-anchor="middle">Orders</text>
  </svg>
</div>

```
SELECT Customers.CustomerID, Customers.CustomerName, Orders.OrderID, Orders.Amount
FROM Customers
INNER JOIN Orders ON Customers.CustomerID = Orders.CustomerID;
```

| CustomerID | CustomerName | OrderID | Amount |
|------------|--------------|---------|--------|
| 1          | Stella       | 101     | 250 |
| 2          | Bob          | 102     | 300 |
| 3          | Charlie      | 103     | 150 |


{% note info %}
用於兩張表資料重疊的部分。
例如: 分析哪些客戶下了訂單。
{% endnote %}

{% note success %}
用線上的 SQL Fiddle 來執行 SQL 指令:
[SQL Fiddle - INNER JOIN](https://sqlfiddle.com/sqlite/online-compiler?id=b420079e-e869-48c1-980c-c958151b3d1d)
{% endnote %}

<iframe src="https://sqlfiddle.com/sqlite/online-compiler?id=b420079e-e869-48c1-980c-c958151b3d1d" width="100%" height="500" scrolling="no" seamless="seamless"></iframe>

# LEFT JOIN
保留左表中的所有資料，即使右表沒有資料的部分，則會填充 `NULL`。

<div style="text-align: center;">
  <svg id="vennDiagram" width="600" height="400" viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
    <!-- 左邊的圓 -->
    <circle id="usersCircle" cx="100" cy="100" r="70" fill="#D4E2F4" fill-opacity="1" stroke="black" stroke-width="1" />
    <!-- 右邊的圓 -->
    <circle id="teamsCircle" cx="180" cy="100" r="70" fill-opacity="0" stroke="black" stroke-width="1" />
    <!-- 提示文字 -->
    <text id="tooltip" x="150" y="20" font-size="16" text-anchor="middle" fill="black" visibility="hidden"></text>
    <!-- 標籤 -->
    <text x="73" y="101" font-size="10" text-anchor="middle">Customers</text>
    <text x="199" y="101" font-size="10" text-anchor="middle">Orders</text>
  </svg>
</div>


```
SELECT Customers.CustomerID, Customers.CustomerName, Orders.OrderID, Orders.Amount
FROM Customers
LEFT JOIN Orders ON Customers.CustomerID = Orders.CustomerID;
```

| CustomerID | CustomerName | OrderID | Amount |
|------------|--------------|---------|--------|
| 1          | Stella       | 101     | 250 |
| 2          | Bob          | 102     | 300 |
| 3          | Charlie      | 103     | 150 |
| 4          | David        | NULL    | NULL   |
| 5          | Emily        | NULL    | NULL   |

{% note info %}
用於查詢左表中沒有對應的資料。
例如: 分析哪些客戶沒有下訂單。
{% endnote %}

{% note success %}
用線上的 SQL Fiddle 來執行 SQL 指令:
[SQL Fiddle - LEFT JOIN](https://sqlfiddle.com/sqlite/online-compiler?id=2d062ce6-c3db-4f26-a7f6-8d8af35165a6)
{% endnote %}

<iframe src="https://sqlfiddle.com/sqlite/online-compiler?id=2d062ce6-c3db-4f26-a7f6-8d8af35165a6" width="100%" height="500" scrolling="no" seamless="seamless"></iframe>

# RIGHT JOIN
保留右表中的所有資料，即使左表沒有資料的部分，則會填充 `NULL`。

<div style="text-align: center;">
  <svg id="vennDiagram" width="600" height="400" viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
    <!-- 左邊的圓 -->
    <circle id="usersCircle" cx="100" cy="100" r="70" fill-opacity="0" stroke="black" stroke-width="1" />
    <!-- 右邊的圓 -->
    <circle id="teamsCircle" cx="180" cy="100" r="70" fill="#D4E2F4" fill-opacity="1" stroke="black" stroke-width="1" />
    <!-- 提示文字 -->
    <text id="tooltip" x="150" y="20" font-size="16" text-anchor="middle" fill="black" visibility="hidden"></text>
    <!-- 標籤 -->
    <text x="73" y="101" font-size="10" text-anchor="middle">Customers</text>
    <text x="177" y="101" font-size="10" text-anchor="middle">Orders</text>
  </svg>
</div>

```
SELECT Customers.CustomerID, Customers.CustomerName, Orders.OrderID, Orders.Amount
FROM Customers
RIGHT JOIN Orders ON Customers.CustomerID = Orders.CustomerID;
```

| CustomerID | CustomerName | OrderID | Amount |
|------------|--------------|---------|--------|
| 1          | Stella       | 101     | 250 |
| 2          | Bob          | 102     | 300 |
| 3          | Charlie      | 103     | 150 |
| NULL       | NULL         | 104     | 400 |
| NULL       | NULL         | 105     | 100 |

{% note info %}
用於查詢右表中沒有對應的資料。
例如: 分析哪些訂單沒有對應的客戶。
{% endnote %}

{% note success %}
用線上的 MySQL Online 來執行 SQL 指令:
[MySQL Online - RIGHT JOIN](https://paiza.io/projects/YaQeeyzMvsMCKa1Qft8nLg)
{% endnote %}

<iframe src="https://paiza.io/projects/e/YaQeeyzMvsMCKa1Qft8nLg?theme=ambiance" width="100%" height="500" scrolling="no" seamless="seamless"></iframe>

# FULL JOIN
保留兩張表的所有資料，當某張表沒有資料時，則會填充 `NULL`。

<div style="text-align: center;">
  <svg id="vennDiagram" width="600" height="400" viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
    <!-- 左邊的圓 -->
    <circle id="usersCircle" cx="100" cy="100" r="70" fill="#D4E2F4" fill-opacity="1" stroke="black" stroke-width="1" />
    <!-- 右邊的圓 -->
    <circle id="teamsCircle" cx="180" cy="100" r="70" fill="#D4E2F4" fill-opacity="1" stroke="black" stroke-width="1" />
    <!-- 提示文字 -->
    <text id="tooltip" x="150" y="20" font-size="16" text-anchor="middle" fill="black" visibility="hidden"></text>
    <!-- 標籤 -->
    <text x="73" y="101" font-size="10" text-anchor="middle">Customers</text>
    <text x="177" y="101" font-size="10" text-anchor="middle">Orders</text>
  </svg>
</div>

```
SELECT Customers.CustomerID, Customers.CustomerName, Orders.OrderID, Orders.Amount
FROM Customers
FULL JOIN Orders ON Customers.CustomerID = Orders.CustomerID;
```

| CustomerID | CustomerName | OrderID | Amount |
|------------|--------------|---------|--------|
| 1          | Stella       | 101     | 250 |
| 2          | Bob          | 102     | 300 |
| 3          | Charlie      | 103     | 150 |
| 4          | David        | NULL    | NULL   |
| 5          | Emily        | NULL    | NULL   |
| NULL       | NULL         | 104     | 400 |
| NULL       | NULL         | 105     | 100 |


{% note info %}
用於兩張表所有資料的總覽。
例如: 查看所有客戶和所有訂單的情況。
{% endnote %}

由於 MySQL 不支援 `FULL JOIN`，我們可以使用 `UNION` 的方式來替代 `FULL JOIN`。`FULL JOIN` 是合併兩個表，而 `UNION` 是將兩個查詢結果進行合併，並去掉重複的行，所以我們結合 `LEFT JOIN` 和 `RIGHT JOIN` 即可達到相同效果，完整返回兩個表的所有資料，並保留沒有資料的部分。

```
SELECT Customers.CustomerID, Customers.CustomerName, Orders.OrderID, Orders.Amount
FROM Customers
LEFT JOIN Orders ON Customers.CustomerID = Orders.CustomerID
UNION
SELECT Customers.CustomerID, Customers.CustomerName, Orders.OrderID, Orders.Amount
FROM Customers
RIGHT JOIN Orders ON Customers.CustomerID = Orders.CustomerID;
```

{% note success %}
用線上的 MySQL Online 來執行 SQL 指令:
[MySQL Online - FULL JOIN](https://paiza.io/projects/cCW-kLUsiF1QYZHYJtveKA)
{% endnote %}

<iframe src="https://paiza.io/projects/e/cCW-kLUsiF1QYZHYJtveKA?theme=ambiance" width="100%" height="500" scrolling="no" seamless="seamless"></iframe>

# 總結

<div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
  <!-- 第一張圖 -->
  <div style="text-align: center; width: 45%; margin-bottom: 10px;">
    <svg id="vennDiagram" width="100%" height="auto" viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="stripedPattern" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="#D4E2F4" stroke-width="2" />
        </pattern>
      </defs>
      <circle id="usersCircle" cx="100" cy="100" r="70" fill-opacity="0" stroke="black" stroke-width="1" />
      <circle id="teamsCircle" cx="180" cy="100" r="70" fill-opacity="0" stroke="black" stroke-width="1" />
      <ellipse id="innerJoin" cx="140" cy="100" rx="30" ry="55" fill="url(#stripedPattern)" />
      <text id="tooltip" x="150" y="20" font-size="16" text-anchor="middle" fill="black" visibility="hidden"></text>
      <text x="73" y="101" font-size="10" text-anchor="middle">Customers</text>
      <text x="199" y="101" font-size="10" text-anchor="middle">Orders</text>
    </svg>
    <p style="margin-top: -50px; font-size: 12px; font-weight: bold; text-align: center;">INNER JOIN</p>
  </div>

  <!-- 第二張圖 -->
  <div style="text-align: center; width: 45%; margin-bottom: 10px;">
    <svg id="vennDiagram" width="100%" height="auto" viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
      <circle id="usersCircle" cx="100" cy="100" r="70" fill="#D4E2F4" fill-opacity="1" stroke="black" stroke-width="1" />
      <circle id="teamsCircle" cx="180" cy="100" r="70" fill-opacity="0" stroke="black" stroke-width="1" />
      <text id="tooltip" x="150" y="20" font-size="16" text-anchor="middle" fill="black" visibility="hidden"></text>
      <text x="73" y="101" font-size="10" text-anchor="middle">Customers</text>
      <text x="199" y="101" font-size="10" text-anchor="middle">Orders</text>
    </svg>
    <p style="margin-top: -50px; font-size: 12px; font-weight: bold; text-align: center;">LEFT JOIN</p>
  </div>

  <!-- 第三張圖 -->
  <div style="text-align: center; width: 45%; margin-bottom: 10px;">
    <svg id="vennDiagram" width="100%" height="auto" viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
      <circle id="usersCircle" cx="100" cy="100" r="70" fill-opacity="0" stroke="black" stroke-width="1" />
      <circle id="teamsCircle" cx="180" cy="100" r="70" fill="#D4E2F4" fill-opacity="1" stroke="black" stroke-width="1" />
      <text id="tooltip" x="150" y="20" font-size="16" text-anchor="middle" fill="black" visibility="hidden"></text>
      <text x="73" y="101" font-size="10" text-anchor="middle">Customers</text>
      <text x="177" y="101" font-size="10" text-anchor="middle">Orders</text>
    </svg>
    <p style="margin-top: -50px; font-size: 12px; font-weight: bold; text-align: center;">RIGHT JOIN</p>
  </div>

  <!-- 第四張圖 -->
  <div style="text-align: center; width: 45%; margin-bottom: 10px;">
    <svg id="vennDiagram" width="100%" height="auto" viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
      <circle id="usersCircle" cx="100" cy="100" r="70" fill="#D4E2F4" fill-opacity="1" stroke="black" stroke-width="1" />
      <circle id="teamsCircle" cx="180" cy="100" r="70" fill="#D4E2F4" fill-opacity="1" stroke="black" stroke-width="1" />
      <text id="tooltip" x="150" y="20" font-size="16" text-anchor="middle" fill="black" visibility="hidden"></text>
      <text x="73" y="101" font-size="10" text-anchor="middle">Customers</text>
      <text x="177" y="101" font-size="10" text-anchor="middle">Orders</text>
    </svg>
    <p style="margin-top: -50px; font-size: 12px; font-weight: bold; text-align: center;">FULL JOIN</p>
  </div>
</div>


</br>
JOIN 是 SQL 查詢時，用來合併兩張或多張資料表的重要語法。

- INNER JOIN：取交集。
- LEFT JOIN：保留左表。
- RIGHT JOIN：保留右表。
- FULL JOIN：保留兩表。

希望能幫助大家快速掌握每種 JOIN 類型的用途。Ciao~&#10084;
