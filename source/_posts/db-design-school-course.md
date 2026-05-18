---
title: 學校選課系統的關聯式資料庫設計
date: 2024-12-03 11:11:11
updated: 2024-12-04 11:11:11
tags:
  - Database
  - SQL
categories: Database
comments: true
---

本文以學校選課系統為例，從一個初始需求的資料表出發，一步步完成資料庫正規化的過程。同時，也會解析如何處理一對一、一對多、多對多等關係，會更明白關聯式資料庫設計的核心概念與應用技巧。
<!-- more -->

# 正規化類型
## 資料庫正規化
- 第一正規化(1NF): 每個欄位必須具有原子性，即單一值，不能存放多值或重複資料。
- 第二正規化(2NF): 滿足 1NF 下，確保每個欄位都只和主鍵完全相關。
- 第三正規化(3NF): 滿足 2NF 下，確保非主鍵欄位不依賴於其他非主鍵欄位。

## 關係類型
- 一對一(1:1): 通常可以合併在一個表中。若資訊過多，也可以依主鍵拆分不同表格。
- 一對多(1:N): 在「多」的一方加入外鍵，用「一」的一方為主鍵。
- 多對多(M:N): 使用中間表(關聯表)拆分成兩個一對多的關係，中間表通常包含兩邊的主鍵作為外鍵。

# 案例介紹

以下我將以一個學校選課系統為例，說明資料表從初始需求的資料表到正規化的過程。

<span style="font-size: 1em; font-weight: bold; color: #000000; background-color: #F8F9FA; padding: 5px 10px; border-radius: 5px;">&downarrow;初始需求的資料表&downarrow;</span>

| 學生ID | 學生姓名 | 聯繫方式   | 課程ID         | 課程名稱             | 學分 | 教師姓名 | 辦公室    |
|--------|----------|------------|--------------|---------------------|------|----------|-----------|
| S001   | Stella   | 0981123456 | C101, C102   | 數學, 機器學習       | 3    | 李老師   | 教學樓101 |
| S004   | Joe      | 0983123456 | C103         | 英語                | 2    | 王老師   | 教學樓102 |
| S002   | Tom      | 0986123456 | C101         | 數學                | 3    | 李老師   | 教學樓101 |
| S003   | Lily     | 0989123456 | C104         | 物理                | 4    | 張老師   | 教學樓103 |

# 正規化過程
## 第一正規化(1NF)
第一正規化(1NF): 每個欄位必須具有原子性，即單一值，不能存放多值或重複資料。

對於原始資料表中的「課程ID」和「課程名稱」多值情況，我們需要拆分為多行以滿足 1NF。

<span style="font-size: 1em; font-weight: bold; color: #000000; background-color: #F8F9FA; padding: 5px 10px; border-radius: 5px;">&downarrow;更新的資料表&downarrow;</span>
| 學生ID | 學生姓名 | 聯繫方式   | 課程ID | 課程名稱    | 學分 | 教師姓名 | 辦公室    |
|--------|----------|------------|--------|-------------|------|----------|-----------|
| S001   | Stella   | 0981123456 | C101   | 數學        | 3    | 李老師   | 教學樓101 |
| S001   | Stella   | 0981123456 | C102   | 機器學習    | 3    | 李老師   | 教學樓101 |
| S004   | Joe      | 0983123456 | C103   | 英語        | 2    | 王老師   | 教學樓102 |
| S002   | Tom      | 0986123456 | C101   | 數學        | 3    | 李老師   | 教學樓101 |
| S003   | Lily     | 0989123456 | C104   | 物理        | 4    | 張老師   | 教學樓103 |

## 第二正規化(2NF)
第二正規化(2NF): 滿足 1NF 下，確保每個欄位都只和主鍵完全相關。

在原始資料表中:
- 「學生姓名」和「聯繫方式」欄位，僅與「學生ID」相關。
- 「課程名稱」和「學分」欄位，則與「課程ID」相關。
- 我們通過拆分表格，使每個非主鍵欄位只與主鍵完全相關。

<span style="font-size: 1em; font-weight: bold; color: #000000; background-color: #F8F9FA; padding: 5px 10px; border-radius: 5px;">&downarrow;學生表 (Students)&downarrow;</span>
| 學生ID | 學生姓名 | 聯繫方式   |
|--------|----------|------------|
| S001   | Stella   | 0981123456 |
| S004   | Joe      | 0983123456 |
| S002   | Tom      | 0986123456 |
| S003   | Lily     | 0989123456 |

<span style="font-size: 1em; font-weight: bold; color: #000000; background-color: #F8F9FA; padding: 5px 10px; border-radius: 5px;">&downarrow;課程表 (Courses)&downarrow;</span>
| 課程ID | 課程名稱    | 學分 |
|--------|------------|------|
| C101   | 數學        | 3    |
| C102   | 機器學習    | 3    |
| C103   | 英語        | 2    |
| C104   | 物理        | 4    |

<span style="font-size: 1em; font-weight: bold; color: #000000; background-color: #F8F9FA; padding: 5px 10px; border-radius: 5px;">&downarrow;教師表 (Teachers)&downarrow;</span>
| 教師姓名 | 辦公室    |
|---------|-----------|
| 李老師   | 教學樓101 |
| 王老師   | 教學樓102 |
| 張老師   | 教學樓103 |

## 第三正規化(3NF)
第三正規化(3NF): 滿足 2NF 下，確保非主鍵欄位不依賴於其他非主鍵欄位。

若「辦公室」直接依賴於「教師姓名」...

<span style="font-size: 1em; font-weight: bold; color: #000000; background-color: #F8F9FA; padding: 5px 10px; border-radius: 5px;">&downarrow;教師表 (Teachers)&downarrow;</span>
| 教師姓名 | 辦公室    |
|---------|-----------|
| 李老師   | 教學樓101 |
| 王老師   | 教學樓102 |
| 張老師   | 教學樓103 |

當多個課程由同一教師授課時，對應的「辦公室」資訊會在每條記錄中重複儲存。

課程ID|課程名稱|學分|教師姓名|辦公室
-|-|-|-|-
C101|數學|3|李老師|教學樓101
C102|機器學習|3|李老師|教學樓101

那我們要怎麼簡化資料儲存呢? 我們需要分離非主鍵欄位「辦公室」與「教師姓名」之間的依賴關係，是透過加入唯一識別碼(教師ID)。
- 以`教師ID`作為主鍵，提供每位教師的唯一識別碼。
- 將教師的描述性資訊（如教師姓名和辦公室）儲存在與`教師ID`相關的記錄中。

<span style="font-size: 1em; font-weight: bold; color: #000000; background-color: #F8F9FA; padding: 5px 10px; border-radius: 5px;">&downarrow;更新的教師表 (Teachers)&downarrow;</span>
| 教師ID | 教師姓名 | 辦公室    |
|--------|----------|-----------|
| T001   | 李老師   | 教學樓101 |
| T002   | 王老師   | 教學樓102 |
| T003   | 張老師   | 教學樓103 |

這樣當多個課程由同一教師授課時，對應的「辦公室」資訊就不需在每條記錄中重複儲存了。
| 課程ID | 課程名稱   | 學分 | 教師ID |
|--------|-----------|------|-------|
| C101   | 數學      | 3    | T001  |
| C102   | 機器學習   | 3    | T001  |

# 關係處理過程
## 一對一(1:1)
- 通常可以合併在一個表中。
- 若資訊過多，也可以依主鍵拆分不同表格。

<span style="font-size: 1em; font-weight: bold; color: #000000; background-color: #F8F9FA; padding: 5px 10px; border-radius: 5px;">&downarrow;學生表 (Students)&downarrow;</span>
| 學生ID | 學生姓名 | 聯繫方式   |
|--------|----------|------------|
| S001   | Stella   | 0981123456 |
| S004   | Joe      | 0983123456 |
| S002   | Tom      | 0986123456 |
| S003   | Lily     | 0989123456 |

<span style="font-size: 1em; font-weight: bold; color: #000000; background-color: #F8F9FA; padding: 5px 10px; border-radius: 5px;">&downarrow;學生詳細資訊表 (Student_Details)&downarrow;</span>
|學生ID|出生日期|居住地|入學日期| 
|-|-|-|-|
|S001|2000-01-01|海奧華|2020-09-01|
|S004|2000-02-01|天狼星|2020-09-02|
|S002|2000-03-01|尼比魯|2020-09-04|
|S003|2000-04-01|阿爾法|2020-09-05|

## 一對多(1:N)
在「多」的一方加入外鍵，用「一」的一方為主鍵。

思考方向:
- 以「課程」角度: `1` 個課程會有 `1` 個教師。
- 以「教師」角度: `1` 個教師會有 `多` 個課程。
- **所以以「教師ID」為外鍵(FK)，以「課程ID」為主鍵(PK)。**

{% note default %}
可以這樣記: 能者多勞
教師會面對多個課程，所以教師是對外的業務窗口。
所以讓 `教師ID` 進入到課程表中成為外鍵(FK)。
{% endnote %}

<span style="font-size: 1em; font-weight: bold; color: #000000; background-color: #F8F9FA; padding: 5px 10px; border-radius: 5px;">&downarrow;教師表 (Teachers)&downarrow;</span>
| 教師ID | 教師姓名 | 辦公室    |
|--------|----------|-----------|
| T001   | 李老師   | 教學樓101 |
| T002   | 王老師   | 教學樓102 |
| T003   | 張老師   | 教學樓103 |

<span style="font-size: 1em; font-weight: bold; color: #000000; background-color: #F8F9FA; padding: 5px 10px; border-radius: 5px;">&downarrow;課程表 (Courses)&downarrow;</span>
| 課程ID | 課程名稱    | 學分 |
|--------|------------|------|
| C101   | 數學        | 3    |
| C102   | 機器學習    | 3    |
| C103   | 英語        | 2    |
| C104   | 物理        | 4    |

<span style="font-size: 1em; font-weight: bold; color: #000000; background-color: #F8F9FA; padding: 5px 10px; border-radius: 5px;">&downarrow;更新的課程表 (Courses)&downarrow;</span>
| 課程ID | 課程名稱    | 學分 | 教師ID |
|--------|------------|------|-------|
| C101   | 數學        | 3    | T001   |
| C102   | 機器學習    | 3    | T001   |
| C103   | 英語        | 2    | T002   |
| C104   | 物理        | 4    | T003   |

## 多對多(M:N)
使用中間表(關聯表)拆分成兩個一對多的關係，中間表通常包含兩邊的主鍵作為外鍵。

<span style="font-size: 1em; font-weight: bold; color: #000000; background-color: #F8F9FA; padding: 5px 10px; border-radius: 5px;">&downarrow;學生選課表 (Student_Courses)&downarrow;</span>
- 學生與課程之間是多對多關係。
- 通過學生選課表 (Student_Courses) 作為中間表，將其轉化為兩個一對多關係。
- `學生ID` 和 `課程ID` 組合可以作為主鍵，用於唯一標識每條記錄。

| 學生ID | 課程ID |
|--------|--------|
| S001   | C101   |
| S001   | C102   |
| S004   | C103   |
| S002   | C101   |
| S003   | C104   |

# 總結

我將學校選課系統繪製成視覺化的資料庫設計圖，呈現實體(如學生、教師、課程)及其彼此之間的關係。
- 一對一: `Students` 與 `Student_Details` 的連結，將學生的基本資訊與詳細資料分開管理。
- 一對多: `Teachers` 與 `Courses`的連結，表示每位教師可授課多門課程的關係。
- 多對多: `Students`與 `Courses` 透過中間表 `Student_Courses` 連結，表示每位學生可選多門課程，且每個課程也可有多位學生的關係。

![db-design-school-course-uml](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fdb-design-school-course%2Fdb-design-school-course-uml.png?alt=media&token=826aeb3b-1f48-4951-a156-8b9571663995)

<iframe width="1920" height="315" src='https://dbdiagram.io/e/674d6f0ae9daa85aca5691b6/674d6f13e9daa85aca5692b7'> </iframe>
