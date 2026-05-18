---
title: 【SQL】比「昨天」溫度還高的紀錄
date: 2025-05-14 11:11:11
updated: 2025-05-14 11:11:11
tags:
  - SQL
  - LeetCode
categories: SQL
comments: true
---

這題是 LeetCode 上的 SQL 題目 [197. Rising Temperature](https://leetcode.com/problems/rising-temperature/description/)，任務是:
> 找出氣溫比「昨天」更高的日期紀錄。

<!-- more -->

# 題目
找出與前一天(昨天)相比溫度更高的所有日期的ID。以任意順序傳回結果表。

Table: `Weather`
Column Name|Type
-|-
id|int
recordDate|date
temperature|int


請參考以下範例:

<div style="display: flex; gap: 24px; flex-wrap: wrap;">

<div style="flex: 1; min-width: 250px;">
<b>Input: Weather table</b>

| id | recordDate | temperature |
|----|------------|-------------|
| 1  | 2015-01-01 | 10          |
| 2  | 2015-01-02 | 25          |
| 3  | 2015-01-03 | 20          |
| 4  | 2015-01-04 | 30          |

</div>

<div style="flex: 1; min-width: 150px;">
<b>Output:</b>

| id |
|----|
| 2  |
| 4  |

</div>
</div>

解釋說明: 
- 2015-01-02 溫度比前一天 (2015-01-01) 高 (25 > 10)。
- 2015-01-04 溫度比前一天 (2015-01-03) 高 (30 > 20)。



# 解法

{% note info %}
解題核心觀念: 自己JOIN自己。
{% endnote %}

## Self Join
- 從`Weather`表取兩份表，取名為`today`和`yesterday`。
- 把`today`的資料，和前一天`yesterday`的資料配對起來。

```sql
FROM Weather today
JOIN Weather yesterday
```

## 算日期差
- 用`DATEDIFF()`算日期差。
- `DATEDIFF(a, b)`是`a - b`，我們希望`today - yesterday = 1`，代表`today`是比`yesterday`晚一天。
- 故`DATEDIFF(today.recordDate, yesterday.recordDate) = 1`意思即是`today.recordDate - yesterday.recordDate = 1`，所以如果差一，我們就可以得到今天跟昨天的配對資料。

```sql
JOIN Weather yesterday ON DATEDIFF(today.recordDate, yesterday.recordDate) = 1
```

### 怎麼配對資料呢?
把`today`表和`yesterday`表中`recordDate`的所有資料，兩兩配對起來。

`today.recordDate`|`yesterday.recordDate`|`DATEDIFF()`
-|-|-
2015-01-01|2015-01-01	|0
2015-01-01|2015-01-02	|-1
2015-01-01|2015-01-03	|-2
2015-01-01|2015-01-04	|-3
2015-01-02|2015-01-01	|1 ✅ ←選中這個組合
2015-01-02|2015-01-02	|0
2015-01-02|2015-01-03	|-1
2015-01-02|2015-01-04	|-2
2015-01-03|2015-01-01	|2
2015-01-03|2015-01-02	|1 ✅ ←選中這個組合
2015-01-03|2015-01-03	|0
2015-01-03|2015-01-04	|-1
2015-01-04|2015-01-01	|3
2015-01-04|2015-01-02	|2
2015-01-04|2015-01-03	|1 ✅ ←選中這個組合
2015-01-04|2015-01-04	|0

然後只留下「差一天」的組合
`today.recordDate`|`yesterday.recordDate`|`DATEDIFF()`
-|-|-
2015-01-02|2015-01-01	|1 ✅ ←選中這個組合
2015-01-03|2015-01-02	|1 ✅ ←選中這個組合
2015-01-04|2015-01-03	|1 ✅ ←選中這個組合

## 比較溫度
用`WHERE`篩選出`today`溫度比`yesterday`溫度高的紀錄。
```sql
WHERE today.temperature > yesterday.temperature
```

|today<br>id|today<br>recordDate|today<br>temperature|yesterday<br>recordDate|yesterday<br>temperature|比較溫度|是否保留|
| -------- | ---------- | ---------- | -------------- | -------------- | ------- | ---- |
| 2        | 2015-01-02 | 25         | 2015-01-01     | 10             | 25 > 10 | ✅    |
| 3        | 2015-01-03 | 20         | 2015-01-02     | 25             | 20 < 25 | ❌    |
| 4        | 2015-01-04 | 30         | 2015-01-03     | 20             | 30 > 20 | ✅    |


## 選出id
最後只要回傳`today`的`id`就可以了。
```sql
SELECT today.id
```
| id |
|----|
| 2  |
| 4  |

# 完整程式碼
```sql
SELECT today.id
FROM Weather today
JOIN Weather yesterday ON DATEDIFF(today.recordDate, yesterday.recordDate) = 1
WHERE today.temperature > yesterday.temperature
```

<div style="display: flex; gap: 24px; flex-wrap: wrap;">

<div style="flex: 1; min-width: 250px;">
<b>Input: Weather table</b>

| id | recordDate | temperature |
|----|------------|-------------|
| 1  | 2015-01-01 | 10          |
| 2  | 2015-01-02 | 25          |
| 3  | 2015-01-03 | 20          |
| 4  | 2015-01-04 | 30          |

</div>

<div style="flex: 1; min-width: 150px;">
<b>Output:</b>

| id |
|----|
| 2  |
| 4  |

</div>
</div>