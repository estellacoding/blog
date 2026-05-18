---
title: 在 Oracle APEX 中使用 AI 輔助開發的專案管理應用
date: 2024-09-28 11:11:11
updated: 2024-09-28 11:11:11
tags:
  - Oracle
  - Oracle APEX
  - LiveLabs
  - AI-Assisted Development
  - LLM
  - OpenAI
  - Project Management
categories: Oracle
comments: true
---

Oracle APEX 是用於 Oracle 資料庫的低代碼應用開發平台，我們會依照 Oracle LiveLabs 這篇文章 [Smart Project Management App with AI-Assisted Development in Oracle APEX](https://apexapps.oracle.com/pls/apex/r/dbpm/livelabs/view-workshop?wid=633) 中的一步一步的教學引導，在 Oracle APEX AI Assistant 輔助(~~沒有AI幫忙不會寫程式了😂~~)下建立一個專案管理應用程式，詳細請看 [這篇教學](https://apexapps.oracle.com/pls/apex/r/dbpm/livelabs/run-workshop?p210_wid=633&p210_wec=&session=79497038985)。
<!-- more -->


# 立即體驗

透過連結登入並先體驗 AI 生成的 [專案管理應用程式](https://apex.oracle.com/pls/apex/r/stelladai1111/%E5%B0%88%E6%A1%88%E7%AE%A1%E7%90%86%E6%87%89%E7%94%A8%E7%A8%8B%E5%BC%8F/login?session=14381314151306)。

{% note info %}
帳號: stelladai
密碼: 00000000
{% endnote %}

![oracle-apex-ai-development-10-1](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-10-1.png?alt=media&token=d9861fbd-65f2-4d8f-ab79-7f57a65880b1)

# 獲取免費開發環境

進入並註冊 [Oracle Apex](https://apex.oracle.com)，點擊 [Free APEX Workspace](https://apex.oracle.com/pls/apex/r/apex/quick-sign-up/request-workspace)，完成資料填寫。

![oracle-apex-ai-development-1](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-1.png?alt=media&token=a882128e-d415-4d05-a258-0d1c625c9b74)

完成資料填寫後，幾分鐘後應該會收到一封 Oracle APEX 的電子郵件。
![oracle-apex-ai-development-2](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-2.png?alt=media&token=82bd6124-7dce-4b2c-8033-ccbbe1f18426)

{% note info %}
Workspace 在登入 [Oracle Apex](https://apex.oracle.com) 環境時會用到喔!
{% endnote%}

點擊電子郵件中的 Create Workspace，引導你建立工作區。
![oracle-apex-ai-development-3](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-3.png?alt=media&token=80fb7045-3bc6-4b1c-ad66-9706341bd740)

接著，引導你變更密碼。
![oracle-apex-ai-development-4](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-4.png?alt=media&token=b3b747a9-9b62-479b-a9be-f473d2c0076c)

{% note info %}
帳號密碼 在登入 [Oracle Apex](https://apex.oracle.com) 環境時會用到喔!
{% endnote%}

註冊完成後即可使用**Workspace及帳號密碼**登入 [Oracle APEX Workspace](https://apex.oracle.com/pls/apex/r/apex/workspace-sign-in/oracle-apex-sign-in?session=14574087583374)。
![oracle-apex-ai-development-5](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-5.png?alt=media&token=7449c974-fee3-4aa0-8e3d-2d26c229c1d3)


# 創建 AI Service
點擊「應用程式產生器」，點擊「工作區公用程式」，點擊「生成式 AI」，建立 OpenAI Service。
![oracle-apex-ai-development-6-1](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-6-1.png?alt=media&token=af58a94c-d2c4-41ef-b76b-4f3b5faa0ac7)

![oracle-apex-ai-development-6-2](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-6-2.png?alt=media&token=96dfa793-465e-4838-8c6e-8a402f64f996)

{% note info %}
記得要先去取得一組 [OpenAI API keys](https://platform.openai.com/settings/profile?tab=api-keys)。
{% endnote %}

# 安裝範例數據集
點擊「SQL 工作室」，點擊「公用程式」，點擊「範例資料集」，找到「專案資料」後點擊「安裝」、「下一頁」、「安裝資料集」、「結束」。
![oracle-apex-ai-development-7-1](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-7-1.png?alt=media&token=f4ab7b38-0c43-4063-817b-558bf3b405c0)

安裝完後可查看資料庫物件。點擊「SQL 工作室」，點擊「物件瀏覽器」，找到左側的「表格」後，即可看到每個表格的資料欄位資訊及內容。
![oracle-apex-ai-development-7](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-7.png?alt=media&token=0656d25d-8bf8-408f-8a5f-f651a93ecb9b)

# AI 創建應用
點擊「應用程式產生器」，點擊「建立」，點擊「使用生成式 AI 建立應用程式」。
:::tip
提示詞:
創建具有 Projects, Milestones, Status, Tasks, To Dos, Links 和 Comments 的專案管理應用程式，並啟用所有功能
Create an application with Projects, Milestones, Status, Tasks, To Dos, Links, and Comments. Also, enable all the Features
:::

注意，頁面每次生成結果不一定相同喔!可以再給提示詞來修正應用程式，因為==一旦建立就無法再用提示詞的方式修改了==，所以確認都沒問題，再點擊「建立應用程式」。
![oracle-apex-ai-development-8](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-8.png?alt=media&token=7d8a5761-a529-4b64-92b4-4a14c5bda683)

點擊「設定外觀」，點擊「Redwood Light」。
![oracle-apex-ai-development-9-1](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-9-1.png?alt=media&token=6342d050-89ef-4994-8b96-bd98d69aa3db)

![oracle-apex-ai-development-9-2](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-9-2.png?alt=media&token=e621a224-4b53-4adb-82f9-52b8821bafdc)

點擊「建立應用程式」，AI 開始自動生成應用程式。
![oracle-apex-ai-development-10-3](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-10-3.png?alt=media&token=1360f47e-88e7-41fa-b2b4-1f406d66a889)

生成完後會跳轉至應用程式後台頁面，即可點擊「執行應用程式」。
![oracle-apex-ai-development-10-2](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-10-2.png?alt=media&token=0f9b788f-eb6b-48f0-b76e-ad5dda31f248)

一個專案管理的應用程式就建立完成囉!(OH YA!)
![oracle-apex-ai-development-10-1](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-10-1.png?alt=media&token=d9861fbd-65f2-4d8f-ab79-7f57a65880b1)

# AI 優化應用
接下來，我們來用 AI 輔助優化應用程式。

## 更改選單格式
將原本向下滾動長清單，改成可搜尋的、有不同欄位的列表格式。
![oracle-apex-ai-development-11](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-11.png?alt=media&token=8843e543-bf71-418e-8f8b-c10359c33fc0)

進入「14 - Project Task Todo」的頁面設計工具頁面。

點擊「P14_PROJECT_ID」元件，在右側窗格中「值清單」，點擊「前往 值清單」。
![oracle-apex-ai-development-12](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-12.png?alt=media&token=6af41667-0b88-4aa0-883f-f156fdc1d2fd)

點擊「編輯元件」。
![oracle-apex-ai-development-13](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-13.png?alt=media&token=8ead5e08-147c-457e-90df-3cbab31c733d)

點擊「選取資料欄」。
![oracle-apex-ai-development-14](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-14.png?alt=media&token=fa019fc1-c9c7-4dae-ab07-a5c85bd8bfde)

加入 STATUS_ID, DESCRIPTION, COMPLETED_DATE 欄位。
![oracle-apex-ai-development-15](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-15.png?alt=media&token=e49559b8-61a6-4454-b7b5-fe11476cca33)

點擊「套用變更」。
![oracle-apex-ai-development-16](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-16.png?alt=media&token=9c0cb691-6efb-4f8d-b1dd-8c7d445cf27a)

回到「14 - Project Task Todo」的頁面設計工具頁面。

點擊「P14_PROJECT_ID」元件，修改右側窗格內容。
- 識別的類型: 選擇「彈出視窗 LOV (Popup LOV)」

![oracle-apex-ai-development-17](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-17.png?alt=media&token=a775da72-98c8-4b85-af32-6af7e18d58bf)

點擊「儲存」並執行應用程式，即可看到原本 Project 向下滾動長清單，改成了可搜尋的、有加入 STATUS_ID, DESCRIPTION, COMPLETED_DATE 欄位的列表格式。
![oracle-apex-ai-development-11](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-11.png?alt=media&token=8843e543-bf71-418e-8f8b-c10359c33fc0)

## 連動選單選項
將選項內容根據上一個選單所選擇的項目而連動改變。
![oracle-apex-ai-development-24](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-24.png?alt=media&token=5571fadb-9f17-48ec-b15e-6f6391cbe34a)

進入「14 - Project Task Todo」的頁面設計工具頁面。

點擊「共用的元件」。
![oracle-apex-ai-development-18](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-18.png?alt=media&token=89fe8747-7b6b-447b-8f7f-487c0282a18d)

點擊「值清單」。
![oracle-apex-ai-development-19](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-19.png?alt=media&token=2b073628-62fa-4fed-808c-1acc5466bad2)

在值清單頁面中，點擊 EBA_PROJECT_MILESTONES.NAME 右方的「複製」。
![oracle-apex-ai-development-20](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-20.png?alt=media&token=da991575-f541-49e5-8b05-5986ac2a365f)

新值清單名稱輸入 EBA_PROJECT_MILESTONES.NAME_P14。
![oracle-apex-ai-development-21](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-21.png?alt=media&token=b4e10b4f-cb5a-4df6-b3a3-c78974709042)

進入「EBA_PROJECT_MILESTONES.NAME_P14」，在 Where 子句中輸入以下語法。即會根據 Project 選項的當前值 P14_PROJECT_ID 限制返回 Milestone 選項。
```
project_id = :P14_PROJECT_ID
```
![oracle-apex-ai-development-22](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-22.png?alt=media&token=e43b5a25-b0e7-4bae-a39d-3b198cdbd3ef)

回到「14 - Project Task Todo」的頁面設計工具頁面。

點擊「P14_MILESTONE_ID」元件，修改右側窗格內容。
- 值清單: 選擇「EBA_PROJECT_MILESTONES.NAME_P14」。
- 父項項目: 選擇「P14_PROJECT_ID」。

![oracle-apex-ai-development-23](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-23.png?alt=media&token=f1d9fb95-e67b-4615-9b3f-398e78bdbdfa)

點擊「儲存」並執行應用程式，即可看到 Milestone 選項內容會根據 Project 選項而連動改變。
![oracle-apex-ai-development-24](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-24.png?alt=media&token=5571fadb-9f17-48ec-b15e-6f6391cbe34a)

## 增加表格欄位
在表格中增加 Project Name 和 Milestone Name 欄位，需要使用 SQL 將 Projects 和 Milestones 表關聯起來。我們將會使用 Oracle APEX AI Assistant 來產生此 SQL 語法。
![oracle-apex-ai-development-33](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-33.png?alt=media&token=330ebc40-5303-4acd-adaf-f10f119245f1)

進入「13 - 代辦事項」的頁面設計工具頁面。

點擊「Project Task Todos」元件，修改右側窗格內容。
- 來源的類型: 選擇「SQL 查詢」
- SQL 查詢: 點擊「程式碼編輯器」

![oracle-apex-ai-development-25](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-25.png?alt=media&token=f45c8ab6-f760-4dc6-8cd0-79165de2ef29)

點擊「APEX 輔助程式」，輸入所需的提示詞。
![oracle-apex-ai-development-26](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-26.png?alt=media&token=02c62d8d-6cd3-4627-9a61-730f07088189)

:::tip
提示詞:
通過使用子查詢連接 EBA_PROJECTS、EBA_PROJECT_TASKS 和 EBA_PROJECT_MILESTONES 表，從 EBA_PROJECT_TASK_TODOS 表中檢索詳細資訊，包括關聯的專案和里程碑名稱
Write a query to retrieve details from the EBA_PROJECT_TASK_TODOS table, including associated project and milestone names, by using subqueries to join the EBA_PROJECTS, EBA_PROJECT_TASKS, and EBA_PROJECT_MILESTONES tables
:::

APEX 會生成 SQL 語法，點擊「插入」，並點擊程式碼編輯器的「驗證」，驗證成功即可點擊確定。
![oracle-apex-ai-development-27](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-27.png?alt=media&token=fd16e0e8-dce5-4d30-9903-969f9417c6bc)

點擊「儲存」並執行應用程式。
![oracle-apex-ai-development-28](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-28.png?alt=media&token=3e5aeb6e-fe1c-4f8e-ac98-41f4bd0da798)

進入專案管理應用程式的代辦事項頁面，點擊「動作」的「資料欄」。
![oracle-apex-ai-development-29](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-29.png?alt=media&token=f7b5fdd9-3b40-4649-86a6-06243bd40444)

將 Project Name 和 Milestone Name 選入顯示在報表中的欄位。
![oracle-apex-ai-development-30](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-30.png?alt=media&token=b4b92de5-604f-4a29-8c95-71267b89a4b8)

點擊「動作」的「報表」的「儲存報表」。
![oracle-apex-ai-development-31](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-31.png?alt=media&token=b89a2131-f476-4e50-b8be-ffc0c831b2f5)

選擇「另存為預設報表設定值」及「主要」報表類型。
![oracle-apex-ai-development-32](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-32.png?alt=media&token=fe4621a0-def7-48e2-ae91-5719e1690096)

我們就成功在表格中成功增加 Project Name 和 Milestone Name 欄位囉。
![oracle-apex-ai-development-33](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-33.png?alt=media&token=330ebc40-5303-4acd-adaf-f10f119245f1)


## 增加選單欄位
將選單改成可搜尋的、有不同欄位的列表格式。
![oracle-apex-ai-development-42](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-42.png?alt=media&token=12a60eee-691e-486a-a975-5a4d4125160b)

進入「14 - Project Task Todo」的頁面設計工具頁面。

進入「共用的元件」，複製一個新的「EBA_PROJECT_TASKS.NAME_P14」。
![oracle-apex-ai-development-34](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-34.png?alt=media&token=41bd2939-77a8-4c97-aa12-3e9d620c0bba)

點擊「P14_TASK_ID」元件，修改右側窗格內容。
- 值清單: 選擇「EBA_PROJECT_TASKS.NAME_P14」
- 點擊「前往 值清單」

![oracle-apex-ai-development-35](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-35.png?alt=media&token=e951a4d2-116b-4071-9e9a-dd34b50d9afa)

來源類型選擇「SQL 查詢」。
![oracle-apex-ai-development-36](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-36.png?alt=media&token=1464520e-47da-4c87-9f1d-3f6d3758e2ec)

點擊「APEX 輔助程式」，輸入所需的提示詞。
![oracle-apex-ai-development-37](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-37.png?alt=media&token=dbb492c5-bb61-4d7d-9c35-3480cd343cbd)

:::tip
提示詞:
通過使用子查詢連接 EBA_PROJECTS 和 EBA_PROJECT_MILESTONES 表，從 EBA_PROJECT_TASKS 表中檢索 id 和 name，包括關聯的專案和里程碑名稱
Write a query that retrieves id and name from the EBA_PROJECT_TASKS table, including the associated project and milestone names, by using subqueries to join EBA_PROJECTS and EBA_PROJECT_MILESTONES tables
:::

APEX 會生成 SQL 語法，點擊「插入」，並點擊程式碼編輯器的「驗證」，驗證成功即可點擊確定。
![oracle-apex-ai-development-38](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-38.png?alt=media&token=79cbc22e-e014-4a3f-b059-42ff19f299b7)

點擊「選取資料欄」。
![oracle-apex-ai-development-40](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-40.png?alt=media&token=d4d388f3-f369-4532-80c0-f947d11c3103)

將 Project Name 和 Milestone Name 選入顯示欄位。
![oracle-apex-ai-development-39](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-39.png?alt=media&token=f5f9eefc-c3e7-4fdb-a75c-f3c4aa0f3d36)

回到「14 - Project Task Todo」的頁面設計工具頁面。

點擊「P14_TASK_ID」元件，修改右側窗格內容。
- 識別的類型: 選擇「彈出視窗 LOV (Popup LOV)」。
- 值清單: 選擇「EBA_PROJECT_TASKS.NAME_P14」。

![oracle-apex-ai-development-41](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-41.png?alt=media&token=de71f725-e7fb-4995-b1d2-fec6f7466c68)


點擊「儲存」並執行應用程式，即可看到原本 Task 向下滾動長清單，改成了可搜尋的、有加入 Project Name 和 Milestone Name 欄位的列表格式。
![oracle-apex-ai-development-42](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-42.png?alt=media&token=12a60eee-691e-486a-a975-5a4d4125160b)


# 創建 AI 專案助手
創建 AI 專案助手，點擊「Chat with AI Assistant」即可詢問與所選專案相關的任何問題。
![oracle-apex-ai-development-62](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-62.png?alt=media&token=7baa08e9-bd8c-4783-9512-c5e7eb1b14a0)

## 設置 AI
點擊「編輯應用程式定義」。
![oracle-apex-ai-development-43](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-43.png?alt=media&token=bcf712d2-89dc-4279-9806-4f65b28cd9a4)

點擊「AI」，選擇「OpenAI Service」。
![oracle-apex-ai-development-44](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-44.png?alt=media&token=45b58682-7d6d-413c-8cbe-2b631b1620d6)

## 創建頁面
點擊「建立頁面」。
![oracle-apex-ai-development-45](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-45.png?alt=media&token=f4efd51b-8256-4e40-8ab7-4b89ae5f176a)

點擊「空白頁面」。
![oracle-apex-ai-development-46](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-46.png?alt=media&token=d2665025-6479-4120-9e18-212af6628d73)

頁面定義:
- 頁碼: 17
- 名稱: Inline Assistant
- 頁面模式: 強制回應對話方塊

![oracle-apex-ai-development-47](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-47.png?alt=media&token=0701a8a9-df04-44d3-8626-b5af20286ee2)

{% note info %}
頁碼在接下來的步驟都會用到喔!(我的是 17)
{% endnote%}

## 創建項目
進入「17 - Inline Assistant」的頁面設計工具頁面。

點擊「元件」，右鍵點擊「建立 項目」。
![oracle-apex-ai-development-48](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-48.png?alt=media&token=e81b1ff9-8d5a-4921-b201-0f83f7449917)


建立以下 3 個項目。
|名稱|類型|
|-|-|
|P17_PROJECT_ID|隱藏|
|P17_PROJECT_NAME|隱藏|
|P17_PROJECT_DETAILS|隱藏|

![oracle-apex-ai-development-49](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-49.png?alt=media&token=71fc7a1c-59ca-47f8-95bb-520ca8485cfd)

## 創建區域
點擊「元件」，右鍵點擊「建立 區域」。
![oracle-apex-ai-development-50](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-50.png?alt=media&token=acd9f2f3-9c75-47a9-9c83-982926492ea9)

修改右側窗格內容。
- 名稱: Interact with AI about the Project: &P17_PROJECT_NAME.
- 類型: 靜態內容
- 靜態 ID: inline-assist

![oracle-apex-ai-development-51](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-51.png?alt=media&token=7e694490-d2bd-46ce-a009-f8b2b1d9d391)

{% note info %}
注意名稱中有.喔，是變數名稱一部份要加上去!(&P17_PROJECT_NAME.)
{% endnote%}

## 創建運算
點擊「標頭之前」，右鍵點擊「建立 運算」。
![oracle-apex-ai-development-52](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-52.png?alt=media&token=22d5a9c8-f63f-4068-987d-640903d770bd)

修改右側窗格內容。
- 項目名稱: P17_PROJECT_DETAILS
- 類型: SQL 查詢(返回單一值)
- SQL 查詢: 開啟程式碼編輯器

![oracle-apex-ai-development-53](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-53.png?alt=media&token=1c3d51b2-02bc-431c-9540-472b65e7a779)

輸入以下 SQL 語法。
```
SELECT
    'Project Name : '|| NAME ||chr(10) || chr(13)||
    'Status : '||Status||chr(10) || chr(13)||
    'Project Lead : '||PROJECT_LEAD||chr(10) || chr(13)||
    'Completed Date: '||COMPLETED_DATE||chr(10) || chr(13)||
    'Budget : '|| BUDGET || chr(10) ||chr(13)||
    'COST: '|| COST || chr(10) ||chr(13)||
    'Budget versus Cost: '||BUDGET_V_COST || chr(10) ||chr(13)||
    'Number of Milestones : '||MILESTONES || chr(10) ||chr(13)||
    'Number of Tasks : '|| TASKS || chr(10)||chr(13)
    as prompt_context
FROM EBA_PROJECTS_V
WHERE id = :P17_PROJECT_ID;
```

![oracle-apex-ai-development-54](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-54.png?alt=media&token=88eeb19d-1fd3-405a-b17e-0ec3242d3df8)

{% note info %}
項目名稱、id是使用你的頁碼!(我的是 17)
{% endnote%}

點擊「標頭之前」，右鍵點擊「建立 運算」。
![oracle-apex-ai-development-52](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-52.png?alt=media&token=22d5a9c8-f63f-4068-987d-640903d770bd)

修改右側窗格內容。
- 項目名稱: P17_PROJECT_NAME
- 類型: SQL 查詢(返回單一值)
- SQL 查詢: 開啟程式碼編輯器

```
SELECT
      NAME
  FROM EBA_PROJECTS_V
  WHERE id = :P17_PROJECT_ID;
```

![oracle-apex-ai-development-55](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-55.png?alt=media&token=e01c7b0f-703b-4d5c-b5e4-4343e735e0d3)


## 創建動態動作
進入「動態動作」的「載入頁面」，右鍵點擊「建立 動態動作」。
![oracle-apex-ai-development-56](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-56.png?alt=media&token=23ec47a1-44db-479e-a3e4-ebcc7bae6bcb)


點擊「Open Chat Widget」元件，修改右側窗格內容。
- 名稱: Open Chat Widget。
- 事件: 載入頁面。

![oracle-apex-ai-development-57](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-57.png?alt=media&token=1ba93c00-f68c-4b21-8008-146351e708f0)


點擊「真」的「顯示」元件，修改右側窗格內容。
- 名稱: Open Assitant。
- 動作: 開啟 AI 輔助程式。
- 糸統提示: 使用以下說明回答所有問題。&P17_PROJECT_DETAILS.
- 歡迎訊息: 您好，歡迎來到專案小幫手。請隨時詢問有關所選專案的任何問題。
- 顯示方式: 內嵌。
- 容器選取器: #inline-assist。

![oracle-apex-ai-development-58](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-58.png?alt=media&token=35bed84d-7d9d-41b1-ac58-04fc3924fa7f)


## 設定頁面
進入「3 - 里程碑概覽」的頁面設計工具頁面。

點擊「動作」，右鍵點擊「建立 動作」。
![oracle-apex-ai-development-59](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-59.png?alt=media&token=a8059cf6-c919-44ea-a17d-5673cc58bae4)

修改右側窗格內容。
- 類型: 按鈕
- 標籤: Chat with AI Assistant
- 連結的類型: 重新導向至此應用程式中的頁面
- 熱鈕: 勾選
- 連結產生器-目標
  - 頁面: 17
  - 名稱: P17_PROJECT_ID
  - 值: &ID.
  - 清除快取: 17

![oracle-apex-ai-development-60](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-60.png?alt=media&token=f7ff91cb-c79f-4742-a47a-2b8e1e7e1d7a)

設定完成後，點擊「儲存」並執行應用程式。

點擊「Chat with AI Assistant」。
![oracle-apex-ai-development-61](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-61.png?alt=media&token=3ff68093-18ed-4467-82cb-f2fd5b247c09)

使用「Chat with AI Assistant」，並詢問與所選專案相關的任何問題。
![oracle-apex-ai-development-62](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foracle-apex-ai-development%2Foracle-apex-ai-development-62.png?alt=media&token=7baa08e9-bd8c-4783-9512-c5e7eb1b14a0)

# 總結
本篇文章介紹了在 Oracle APEX 中使用 Oracle APEX AI Assistant 輔助開發一個專案管理應用程式，生成初版應用程式時間應該不到 1 分鐘，最後還打造 AI 專案助手讓 AI 使用資料庫內容來回答各專案相關問題，有效解決 LLM 常見的幻覺問題，提高回答的準確性。