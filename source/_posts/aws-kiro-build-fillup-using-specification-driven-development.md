---
title: 【AWS Kiro 實戰】用規格驅動開發喝水記錄應用
date: 2025-11-06 11:11:11
updated: 2025-11-12 11:11:11
tags:
  - Kiro
  - AWS
  - IDE
  - Vibe Coding
  - Spec Coding
  - Spec-Driven Development
  - SDD
categories:
  - Kiro
comments: true
---

Kiro 是 AWS 推出的 Agentic IDE，採用規格驅動開發(Spec-Driven Development)，是指先把需求、技術架構、任務都規劃清楚後，AI 再開始寫程式。本篇文章將帶你實際體驗 Kiro 的 Spec Coding 完整開發流程，從零開始打造一個喝水記錄應用「FillUp!」。

{% note info %}
**什麼是規格驅動開發(Spec-Driven Development)?**
規格驅動開發改變了傳統軟體開發的流程。數十年來，「程式碼」一直被視為主角，而「規格書(specifications)」只是輔助說明文件，在程式開始撰寫後常被遺棄或忽視，但在 Spec-Driven Development 中，規格本身就是執行單位。這些規格不再只是描述，而是可被執行、可生成程式碼、可驗證邏輯的文件。
\- [Spec Kit](https://github.com/github/spec-kit)
{% endnote %}

<!-- more -->

# 前置準備
- 安裝 [Kiro IDE](https://kiro.dev/downloads)。

# 建立專案
1. 建立專案資料夾，如`fillup-web`。
2. 在 Kiro 中打開項目。
3. 中間導覽頁可選擇 Vibe 或 Spec 模式。
4. 左側功能列有 Kiro 面板，其中包含 Specs、Hooks、Steering、MCP 等功能。

![kiro-vibe-spec-navigation-1](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Faws-kiro-build-fillup-using-specification-driven-development%2Fkiro-vibe-spec-navigation-1.jpg?alt=media&token=3fbf66c7-08d2-4bee-9eab-8e4e91988654)

# Steering
{% note info %}
Steering = 長期記憶
{% endnote %}

## 主要優點
Steering 是 Kiro 的長期記憶系統，能讓專案知識被「記住」，自動讓 AI 理解並延續你的開發慣例，不再依賴個別工程師的經驗或重複向 AI 解釋規則，確保整個團隊的開發邏輯保持一致。

具體有以下幾個關鍵優點:
1. 一致的程式碼(Consistent Code Generation)
每個元件、API 端點或測試案例，都會自動遵循團隊定義的模式與慣例。
2. 減少重複(Reduced Repetition)
不需要再每次對話中重複「專案用什麼框架、命名怎麼取」等，Kiro 自動引用文件。
3. 團隊一致性(Team Alignment)
所有人員都能在相同標準下開發，無論是剛加入或資深工程師，都能理解並遵循專案規則。
4. 可擴展的專案知識(Scalable Project Knowledge)
可隨著程式碼更新而動態更新，這些文件會成為知識資產，幫助未來開發者延續專案邏輯。

## 常見文件

|項目|檔名|說明
-|-|-
Product Overview|product\.md|定義產品的用途、目標使用者、主要功能和業務目標。這有助於 Kiro 了解技術決策背後的原因，並提出符合產品目標的解決方案。
Technology Stack|tech\.md|列出本專案所使用的框架、函式庫、開發工具及任何技術限制，如語言版本、部署環境或相依套件。Kiro 在生成程式碼或建議實作方案時，將優先採用這些定義好的技術棧與開發慣例。
Project Structure|structure\.md|檔案與目錄結構、命名慣例、匯入(import)模式與架構決策，以確保產生的程式碼能與整合至現有程式庫。
API Standards|api-standards\.md|定義 REST 慣例、錯誤回應格式、驗證流程和版本控制策略。包括端點命名模式、HTTP 狀態碼使用方式和請求/回應範例。
Testing Approach|testing-standards\.md|建立單元測試模式、整合測試策略、模擬方式(Mocking Approaches)與覆蓋率標準，並記錄團隊偏好的測試函式庫、斷言語法及測試檔案結構。
Code Style|code-conventions\.md|規範命名慣例、檔案組織、匯入順序和架構決策，並提供範例說明，如建議的程式碼結構、元件設計模式和需避免的反模式。
Security Guidelines|security-policies\.md|身分驗證與授權需求、資料驗證與錯誤回饋規則、輸入清理(Sanitization)與正規化(Normalization)標準，以及常見弱點的防護策略，如 XSS/SQLi/CSRF/SSRF/IDOR 等，並納入本應用專屬的安全編碼實務，如密鑰與機密管理、最小權限、依賴套件漏洞管理、日誌與稽核、錯誤處理與回報流程等。
Deployment Process|deployment-workflow\.md|規劃建置流程、環境設定、部署步驟與回滾策略，並詳列 CI/CD 流水線設計與各環境(Dev/Staging/Prod)的特定需求與差異。

{% note info %}
Steering 詳細說明可參考 [Kiro Doc - Steering](https://kiro.dev/docs/steering/)。
{% endnote %}

## 檔案架構
```
.kiro/
  steering/
    product.md
    tech.md
    structure.md
    api-standards.md
    testing-standards.md
    code-conventions.md
    security-policies.md
    deployment-workflow.md
```

# Specs
{% note info %}
Specs = 短期記憶
{% endnote %}

## 功能說明
Specs(Specifications) 是一個結構化的開發流程工具，能將抽象的產品構想，轉化為具體可執行的實作計畫。在 Kiro 的工作流程中，每個 Spec 會引導開發者依序完成 3 個核心階段: 需求定義(Requirements) → 技術設計(Design) → 任務分解(Task list)。

{% mermaid%}
flowchart TB
  A[Start a spec]
  B[requirements.md]
  C{Happy?}
  D[Edit/Request changes]
  E[design.md]
  F{Happy?}
  G[Edit/Request changes]
  H[Implementation<br/>tasks.md]

  A --> B --> C
  C -- no --> D --> B
  C -- yes --> E --> F
  F -- no --> G --> E
  F -- yes --> H
{% endmermaid %}


## 主要檔案
Kiro 會為每個規格產生 3 個關鍵檔案:
|項目|檔名|說明|
| - | - | - |
|Requirements|requirements\.md|以 EARS 格式撰寫使用者故事與驗收準則。|
|Design|design\.md|整體技術架構、流程圖(主要模組間的互動流程)，並說明實作時需考慮的設計決策、相依關係與效能、安全等技術面因素。|
|Tasks| tasks\.md|提供具體的實作計畫，包含可分解、可追蹤的任務項目。|

### Requirements
requirements\.md 以 EARS(Easy Approach to Requirements Syntax) 格式撰寫。

EARS 格式格式:
```
WHEN [條件／事件]
THE SYSTEM SHALL [系統應有的行為]
```
```
WHEN 使用者提交一份包含無效資料的表單  
THE SYSTEM SHALL 在對應欄位顯示驗證錯誤訊息
```

### Design
design\.md 用來記錄技術架構、資料流、與系統運作邏輯。

內容可包含:
- Architecture (系統架構)
- Data Flow (資料流程)
- Interfaces (介面定義)
- Data Models (資料模型)
- Error Handling (錯誤處理)
- Unit Testing Strategy (測試策略)

### Task list
tasks\.md 提供詳細的實施計畫，包含獨立且可追蹤的任務與子任務。每個任務皆有明確定義、清晰描述、預期成果，以及所需的資源或套件。並提供互動式任務執行介面，可即時追蹤狀態與進度。

## 檔案架構
```
.kiro/
  specs/
    <specs-name>/
      requirements.md
      design.md
      tasks.md
```

{% note info %}
Specs 詳細說明可參考 [Kiro Doc - Specs](https://kiro.dev/docs/specs/concepts/)
{% endnote %}

# 開始FillUp!實作

## Steering
### 自動產生
若為既有專案已有程式碼，或是也可以用 Vibe 的方式先產生專案程式碼後，就可以直接點擊左側導覽列的 Kiro，打開 Kiro 面板，點擊 Agent Steering 裡面的「Generate Steering Docs」按鈕，會自動掃專案程式碼，並建立3個基礎文件: `product.md`、`tech.md`、`structure.md`。

![kiro-steering-2-1](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Faws-kiro-build-fillup-using-specification-driven-development%2Fkiro-steering-2-1.jpg?alt=media&token=248223a0-822f-45f4-a200-88015b1b6a48)

### 自訂文件

或是不直接產生，用自己的 Steering 文件，則可點擊「Generate a custom steering document」，輸入 Steering 文件名稱，如 `product`。

![kiro-steering-2-2](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Faws-kiro-build-fillup-using-specification-driven-development%2Fkiro-steering-2-2.jpg?alt=media&token=68f2d798-e2d0-4341-a4ff-2a4ad7e6077d)

因為喝水記錄應用「FillUp!」是從零開始的專案，我先用 ChatGPT 協助先規劃專案、技術棧與檔案結構，所以這邊就使用自訂的 Steering 文件，本次我使用的初版 Steering 的文件內容可參考這個 Notion: [Product、Tech、Structure](https://stellacoding.notion.site/FillUp-29b9a83673d680e39a4bde9f4d54c4d3?pvs=74)。

我另外還有使用 [Steering Samples by Vivek V.](https://github.com/awsdataarchitect/kiro-best-practices/tree/main/.kiro/steering) 所提供的 Steering 文件:
- .kiro/steering/development-standards.md
- .kiro/steering/git-best-practices.md
- .kiro/steering/mcp-best-practices.md
- .kiro/steering/python-best-practices.md
- .kiro/steering/react-best-practices.md
- .kiro/steering/security-best-practices.md
- .kiro/steering/testing-best-practices.md
- .kiro/steering/typescript-best-practices.md

![kiro-steering-2-5](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Faws-kiro-build-fillup-using-specification-driven-development%2Fkiro-steering-2-5.jpg?alt=media&token=b1e4a800-8ba6-49bd-b140-8181b7f20258)

這個專案一開始在 Steering 文件中，我本來是沒有 `tech.md` 和 `structure.md`(~~想說有Specs就行~~)，所以當 Specs 完成後就請 AI 直接開寫程式，結果發現這樣「很不OK」。因為專案拆成多個 Specs 後，每個 Spec 若各自開發，初期看不出問題，但當規格變多、甚至換到 Claude Code 接續開發時，就會出現各種不一致。燒了我很多 Kiro Credits(~~還我Credits😭~~)，才真正體會到沒有統一技術棧與檔案結構，整個場面就會逐漸失控(~~如果不想死趕緊逃跑吧~~)。

主要有以下問題:
- 混雜的檔案組織策略: 有的依功能(feature-based)，有的依層級(layer-based)。
- 缺乏統一的命名規範: 目錄與檔案名稱風格不一致。
- 模組邊界不清晰: 同一功能的程式散落在不同資料夾。

為了解決這些問題，專案最好在開發前就建立好核心文件，不過因為我對技術棧與檔案結構沒有很明確的想法(~~我是菜菜~~)，所以我是先用 ChatGPT 協助先規劃專案說明文件 `product.md`，再請 ChatGPT 根據 `product.md` 內容，協助建議 `tech.md` 和 `structure.md` 內容，所以我還是建議在開始開發前，要先準備好以下這 3 個核心文件:
|項目|檔名|說明
-|-|-
Product Overview|product\.md|定義產品的用途、目標使用者、主要功能和業務目標。這有助於 Kiro 了解技術決策背後的原因，並提出符合產品目標的解決方案。
Technology Stack|tech\.md|列出本專案所使用的框架、函式庫、開發工具及任何技術限制，如語言版本、部署環境或相依套件。Kiro 在生成程式碼或建議實作方案時，將優先採用這些既定的技術棧與開發慣例，而非其他替代方案。
Project Structure|structure\.md|檔案與目錄結構、命名慣例、匯入(import)順序與架構決策，以確保產生的程式碼能無縫融入現有代碼庫。

## Specs
因為我在上一步有準備好 [Product、Tech、Structure](https://stellacoding.notion.site/FillUp-29b9a83673d680e39a4bde9f4d54c4d3?pvs=74) 文件，所以我請 ChatGPT 直接參考後幫我寫 Specs 結構。

{% note warning %}
我們建議您為專案的不同功能建立多個規格，而不是嘗試為整個程式碼庫只使用單一規格。
\- [Kiro 官方文件](https://kiro.dev/docs/specs/best-practices/#how-many-specs-can-i-have-in-a-single-repo)
{% endnote %}

我一開始嘗試用「單一規格」讓 Kiro 開發整個專案，不過我實際執行後發現，當所有功能都集中在同一份規格中時，開發出來的結果不好，所以才發現其實 Kiro 官方是有建議建立不同規格，不過這段沒有自動化，所以需要先請 ChatGPT 根據 [Product、Tech、Structure](https://stellacoding.notion.site/FillUp-29b9a83673d680e39a4bde9f4d54c4d3?pvs=74) 文件內容，來協助建議 Specs 結構及其提示詞，可參考以下提示詞內容。

{% note info %}
\<role>
你是「Spec 方案規劃專家」。請根據上傳檔案來設計 .kiro/specs 結構，並為每個 Spec 生成可直接給 Kiro 使用的一段提示詞。
\</role>

\<objective>
輸出一份「可落地的 Specs 規劃」與「每個 Spec 的 Kiro 提示詞模板」。要求：
\- 最小可行版本 (MVP)：先開發最小可運行的功能。
\- 以「功能切分（function cut）」為核心，保證單一責任、清楚邊界、可並行開發與測試。
\- 每個 Spec 對應一個端到端的最小可交付流程（1~3 條用戶旅程），其餘拆到其他 Spec。
\- 優先以 project\.md 的業務目標為準；若與 tech\.md/structure\.md 衝突，請說明取捨。
\- 產出/docs/spec/{spec_name}-prompt.md
\- 分段測試：每個模組完成後要能獨立測試。
\- 可讀性優先：程式碼要有清楚的註解與命名。
\- 可維護性：設計需方便後續擴充。
\</objective>

\<constraints>
\- 語言：繁體中文。
\- 命名：資料夾使用 kebab-case，如：user-authentication。
\- 每個 Spec 必須輸出一段 Kiro 可用的規格提示詞。
\</constraints>

\<example>
（樹狀僅示意Kiro官方範例）
For example, in an e-commerce application, you might organize your specs like this:
.kiro/specs/
├── user-authentication/       # Login, signup, password reset
├── product-catalog/           # Product listing, search, filtering
├── shopping-cart/             # Add to cart, quantity updates, checkout
├── payment-processing/        # Payment gateway integration, order confirmation
└── admin-dashboard/           # Product management, user analytics
請依實際 project\.md/tech\.md/structure\.md 內容重新規劃，而非照抄此範例。
\</example>
{% endnote %}

得到[每個 Spec 的提示詞](https://stellacoding.notion.site/FillUp-29b9a83673d680e39a4bde9f4d54c4d3?pvs=74)後，你可以複製給 Kiro，Kiro 會幫你逐步引導你以下事項:
1. 建立 `.kiro/specs/{spec-name}/requirements.md`。
2. 確認需求文件內容。
3. 建立 `.kiro/specs/{spec-name}/design.md`。
4. 確認技術設計文件內容。
5. 建立 `.kiro/specs/{spec-name}/tasks.md`。
6. 確認任務清單文件內容。
7. 手動或自動逐步執行任務。

而我的 FillUp! 專案，ChatGPT 建議的 Specs 結構如下:
```
.kiro/specs/
├── hydration-recording/  # 快速容量記錄 + 水桶動畫（核心 MVP）
├── goals-and-settings/   # 每日目標、時段、單位與預設容量
├── gamification-badges/  # 達標/連續天數徽章與慶祝動畫
├── stats-and-trends/     # 每日/週/月統計與趨勢圖
├── smart-reminders/      # 智慧提醒（Web Push / Notification）
└── sync-and-profile/     # 匿名裝置識別 +（可選）JWT 登入與資料同步
```

以下我示範新增 Specs 的實際流程，每個 Specs 按照一樣流程即可。

1.點擊「Create a new spec」新增 Specs。
![kiro-spec-create-a-new-spec-4-1](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Faws-kiro-build-fillup-using-specification-driven-development%2Fkiro-spec-create-a-new-spec-4-1.jpg?alt=media&token=2f721d68-555f-48f7-ac5e-65fd721d9390)

2.輸入提示詞。
{% note info %}
請在「hydration-recording」Spec 內完成：
\- 前端：React 18 + Vite + Tailwind + Zustand + Framer Motion；頁面 Home，元件 BucketVisualizer、QuickInputButtons；服務 hydration.service；狀態 useHydrationStore。
\- 後端：FastAPI 路由 /api/hydration（POST 新增、GET 取當日彙總、DELETE 撤銷可選）；模型 hydration；Schema HydrationCreate/HydrationOut。
\- 資料：內部以 ml 為單位，本地 IndexedDB 作為離線快取；恢復網路自動同步。
\- 互動：點按預設容量（250/350/500 或自訂）→ 3 秒內完成提交與水桶填充動畫（60fps）；完成率=當日總和/目標。
\- 測試：前端 RTL/Jest（按鈕點擊→狀態/畫面）；後端 pytest（路由與聚合）。請附驗收規格（acceptance criteria）與 API 契約（OpenAPI 片段）。

請依此功能切分產出前後端程式碼骨架與範例實作，檔案放到對應的 frontend/backend 目錄，遵守既有匯入與命名慣例。
{% endnote %}

![kiro-spec-create-a-new-spec-4-2](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Faws-kiro-build-fillup-using-specification-driven-development%2Fkiro-spec-create-a-new-spec-4-2.jpg?alt=media&token=f7716d98-4058-4551-896d-242f6eae30de)

3.建立 `requirements.md` 需求文件。
請一定要確認需求，因為接下來都會以這份需求繼續撰寫技術設計及任務清單文件。確認需求文件內容後，點擊「Move to design phase」。
![kiro-spec-create-a-new-spec-4-3](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Faws-kiro-build-fillup-using-specification-driven-development%2Fkiro-spec-create-a-new-spec-4-3.jpg?alt=media&token=783f2635-8c0b-4474-a299-070efd4cfc34)

4.建立 `design.md` 技術設計文件。
確認技術設計文件內容後，點擊「Move to implementation plan」。
![kiro-spec-create-a-new-spec-4-4](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Faws-kiro-build-fillup-using-specification-driven-development%2Fkiro-spec-create-a-new-spec-4-4.jpg?alt=media&token=1d771710-e49f-4478-9269-b713c1b7b91b)

5.建立 `tasks.md` 任務清單文件。
確認任務清單文件內容，<span style="color: red; font-weight: bold; text-decoration: underline;">先不執行任務</span>。

![kiro-spec-create-a-new-spec-4-5](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Faws-kiro-build-fillup-using-specification-driven-development%2Fkiro-spec-create-a-new-spec-4-5.jpg?alt=media&token=eabcd94d-bcc9-4522-8cdb-adceec23f989)



## Start tasks

彎彎繞繞這麼久，終於可以開始 AI 寫程式了🥲，可參考 Kiro 為第一個 Specs「hydration-recording」所產生的文件內容: [Requirements & Design & Task list](https://stellacoding.notion.site/FillUp-29b9a83673d680e39a4bde9f4d54c4d3?pvs=74)。

當任務清單完成時，這時就可以手動逐步點擊「Start task」，或是請 Kiro 自動逐步幫忙執行任務。

![kiro-tasks-start-task-5-1](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Faws-kiro-build-fillup-using-specification-driven-development%2Fkiro-tasks-start-task-5-1.jpg?alt=media&token=62d76a2d-c1d0-47a5-855c-c81cb4c6199e)

![kiro-tasks-start-task-5-2](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Faws-kiro-build-fillup-using-specification-driven-development%2Fkiro-tasks-start-task-5-2.jpg?alt=media&token=1bc957f2-27ad-4927-abc5-32b208b5fe65)

![kiro-tasks-start-task-5-3](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Faws-kiro-build-fillup-using-specification-driven-development%2Fkiro-tasks-start-task-5-3.jpg?alt=media&token=b8d86882-a4d0-4557-a75b-6ef7ec3e7c71)

{% note warning %}
**可以一次執行規格中的所有任務嗎?**
是的，可以要求 Kiro 執行 tasks\.md 檔案中的所有任務，Kiro 將開始執行您的所有任務。但注意: 我們不建議這樣做，因為我們建議按任務執行以獲得更好的結果。
\- [Kiro 官方文件](https://kiro.dev/docs/specs/best-practices/#how-many-specs-can-i-have-in-a-single-repo)
{% endnote %}

如果想一次執行所有任務(~~就去旁邊廢~~)，你可以一個一個點擊「Start task」來執行任務，Kiro 會自動排程任務，在對話的右上角，點擊 「Task List」 按鈕，可查看目前的任務執行狀態。「CURRENT TASKS」是正在執行的任務，而「TASKS IN QUEUE」則是排程中的任務。

![kiro-spec-task-list-in-queue-1](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Faws-kiro-build-fillup-using-specification-driven-development%2Fkiro-spec-task-list-in-queue-1.jpg?alt=media&token=8ca591ff-f3cc-4c47-b298-1f169cd33686)

另外也可以用對話方式，輸入提示詞，讓 Kiro 一次執行所有任務。不過我實際執行後發現，Kiro 常會漏執行部分 Tasks，建議執行過程中需要再次確認是否有被漏掉的任務。

{% note info %}
一次執行所有任務的提示詞:
#{your_spec_name} Execute all tasks in the spec
{% endnote %}


# FillUp!實作成果
經過上面的 Steering + Specs 流程，FillUp! 已經誕生了！🎉

![fillup-project-screenshot-1](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Faws-kiro-build-fillup-using-specification-driven-development%2Ffillup-project-screenshot-1.jpg?alt=media&token=b745a030-51bc-4568-ac08-006e192f249c)

<div style="margin-top: -15px; font-size: 14px; color: #555; text-align: center; font-style: normal; font-family: 'Arial', sans-serif;">(專案連結: <a href="https://github.com/estellacoding/fillup-web" style="color: #555; text-decoration: none;"> GitHub Repository)</a></div>



# 進階概念預告
完成 Kiro 的 Spec Coding 之後，下一篇我們將一起解鎖 MCP Server。
- AWS Documentation MCP Server: 可與 AWS 官方文件互動的工具，支援文件內容搜尋、知識檢索與自動化推薦，協助開發者快速找到所需的技術資訊。
- AWS Diagram MCP Server: 可透過 Python 的 Diagrams 套件，產生 AWS 架構圖(AWS Diagrams)、序列圖(Sequence Diagrams)、流程圖(Flow Diagrams)、類別圖(Class Diagrams)等圖表。
- AWS CDK MCP Server: 提供用於 AWS 雲端部署與架構開發的工具集，如 AWS Cloud Development Kit(CDK) 的最佳實踐、Infrastructure as Code 設計模式，以及透過 CDK Nag 進行安全性合規檢查的工具。

<div style="max-width:520px; margin:2em auto; padding:1.5em; border:1px solid #ddd; border-radius:10px; background:#fafafa; text-align:center; box-shadow:0 2px 6px rgba(0,0,0,0.08);">
  <p style="font-size:1.1em; margin-bottom:1em;">👇 點此免費訂閱，不錯過任何更新</p>
  <iframe src="https://stellacoding.substack.com/embed" 
          width="480" height="320" 
          style="border:1px solid #EEE; background:white; border-radius:6px;" 
          frameborder="0" scrolling="no"></iframe>
</div>