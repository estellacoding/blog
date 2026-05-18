---
title: 【AWS Kiro 進階】實作 Hooks 自動化開發流程
date: 2025-11-26 15:00:00
updated: 2025-11-26 15:00:00
tags:
  - Kiro
  - Hooks
  - Agent
  - AWS
  - IDE
  - Vibe Coding
  - Spec Coding
categories:
  - Kiro
comments: true
---

上週 [這篇](https://estellacoding.github.io/blog/aws-kiro-build-fillup-using-specification-driven-development-mcp/) 一同走過 Kiro 的 MCP 實作流程，理解 Kiro 如何透過 MCP 將 AI 連接到其他資料，本篇將延伸這個概念，帶你進一步探索 Kiro 的另一個強大能力 Agent Hooks。

{% note info %}
**什麼是 Hooks?**
Agent Hooks 是一種能在特定事件發生時自動觸發 AI 代理行為的自動化工具。當 IDE 中發生特定事件，如儲存、建立、刪除檔案時，Hooks 會自動執行預先定義的流程，從而簡化開發工作流程。
\- [Kiro Doc - Hooks](https://kiro.dev/docs/hooks/)
{% endnote %}
<!-- more -->

<style>
.callout {
  border: 1px solid #eee;
  padding: 1em 1em 1em 1em; /* 上右下左 */
  background: #eef7fa;
  margin: 1em 0; /* 上下/右左 */
  border-radius: 8px;
  line-height: 1.9;
}
.callout-icon {
  font-weight: bold;
  margin-right: 8px;
}
.callout ul {
  margin: 0.39em 0 0.39em 1em;
  padding: 0;
}
.callout li {
  margin-bottom: 0.6em;
}
</style>

# 前置準備
1. 安裝 [Kiro IDE](https://kiro.dev/downloads)。
2. 在 Kiro 中打開項目，如`fillup-web`。

# 文件產生器
當更新程式碼時，自動從目前檔案中擷取結構化資訊，如函式、類別、參數、回傳值，再依照專案規範自動補齊說明、生成使用範例，更新至 `README.md`，讓文件維持一致性與最新狀態。

## 新增 Hooks

點擊「Open Kiro Hook UI」。
![kiro-hooks-add-hook-open-kiro-hook-ui](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Faws-kiro-build-fillup-using-specification-driven-development-hooks%2Fkiro-hooks-add-hook-open-kiro-hook-ui.jpg?alt=media&token=4a0ce744-5bdb-40bb-8c92-2c8635a7beaa)

輸入提示詞後，Kiro 自動生成 Hook 設定內容。
![kiro-hooks-add-hook-create-an-agent-hook](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Faws-kiro-build-fillup-using-specification-driven-development-hooks%2Fkiro-hooks-add-hook-create-an-agent-hook.jpg?alt=media&token=362f2240-20b8-481d-b0b7-8daabed7a88c)

{% note info %}
<div style="line-height:2; margin:0; padding:0;">
文件產生器提示詞:<br>
Generate comprehensive documentation for the current file:<br>
1. Extract function and class signatures<br>
2. Document parameters and return types<br>
3. Provide usage examples based on existing code<br>
4. Update the README.md with any new exports<br>
5. Ensure documentation follows project standards
</div>
{% endnote %}
<div style="margin-top: -15px; margin-bottom: 15px;font-size: 14px; color: #555; text-align: center; font-style: normal; font-family: 'Arial', sans-serif;">
(參考資料: <a href="https://kiro.dev/docs/hooks/examples/" style="color: #555; text-decoration: none;">Kiro Doc - Hook examples)
</a>
</div>

![kiro-hooks-add-hook-hook-created](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Faws-kiro-build-fillup-using-specification-driven-development-hooks%2Fkiro-hooks-add-hook-hook-enabled.jpg?alt=media&token=445e9713-8f58-4e1a-8a35-0da28c937cc0)

## 設定場景

偵測前端 TypeScript/TS/TSX 及後端 Python 檔案的變更後更新 `README.md`。

1. Event: File Saved
2. File path(s) to watch: `frontend/src/**/*.ts`、`frontend/src/**/*.tsx`、`backend/app/**/*.py`

![kiro-hooks-add-hook-hook-enabled](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Faws-kiro-build-fillup-using-specification-driven-development-hooks%2Fkiro-hooks-add-hook-hook-created.jpg?alt=media&token=7bf7f70f-7723-4e00-a54e-6645a810015f)

```
<!-- Instructions for Kiro agent -->
Generate comprehensive documentation for the edited file:

1. **Extract and Document Signatures**:
   - Identify all exported functions, classes, interfaces, and types
   - Document each with clear descriptions of purpose and behavior
   - Include parameter types, names, and descriptions
   - Document return types and what they represent
   - Note any thrown errors or edge cases

2. **Provide Usage Examples**:
   - Create practical usage examples based on existing code patterns
   - Show common use cases and integration patterns
   - Include examples of error handling where applicable
   - Reference related components or services

3. **Update README.md**:
   - Add or update entries for any new exports
   - Maintain consistent formatting with existing documentation
   - Include links to related documentation
   - Update API reference sections if applicable

4. **Follow Project Standards**:
   - Use TypeScript best practices for frontend files
   - Follow Python/FastAPI conventions for backend files
   - Maintain consistency with existing documentation style
   - Include JSDoc/docstring comments in the source code
   - Ensure documentation is clear, concise, and actionable

5. **Documentation Format**:
   - Add inline comments for complex logic
   - Use proper JSDoc format for TypeScript/React components
   - Use Python docstrings (Google or NumPy style) for backend code
   - Include type information and examples in comments
   - Link to relevant external documentation when appropriate

Please generate the documentation and update both the source file with inline documentation and the README.md with any new exports or significant changes.
```

## 實作成果

我以下是執行第2個 Spec 的第1個任務，可參考 Kiro 為第2個 Specs「goals-and-settings-prompt」所產生的文件內容: [Requirements & Design & Task list](https://stellacoding.notion.site/FillUp-29b9a83673d680e39a4bde9f4d54c4d3?pvs=74)。


當 Kiro 偵測到檔案有變更時，就會自動排程並更新 `README.md` 文件。

![kiro-hook-execute-hook-1](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Faws-kiro-build-fillup-using-specification-driven-development-hooks%2Fkiro-hook-execute-hook-1.jpg?alt=media&token=654dced1-8461-416f-a583-d00d942c921b)

![kiro-hook-execute-hook-2](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Faws-kiro-build-fillup-using-specification-driven-development-hooks%2Fkiro-hook-execute-hook-2.jpg?alt=media&token=f86523f0-b9d2-4707-89ef-a0a2a0aba0e7)

![kiro-hook-execute-hook-3](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Faws-kiro-build-fillup-using-specification-driven-development-hooks%2Fkiro-hook-execute-hook-3.jpg?alt=media&token=2a17f608-784f-4038-ae11-43fa9b86d0c9)


# 同步翻譯
當繁體中文文檔更新時，系統會自動比對新增或修改的字串，並檢查所有其他語系檔案是否一致。對於新增的字串會自動加入至其他語系的檔案中並自動翻譯，而對於修改的字串則會在其他語系的檔案中自動翻譯，同時產生一份所有語系的更新摘要。

## 新增 Hooks

{% note info %}
<div style="line-height:2; margin:0; padding:0;">
同步翻譯提示詞:<br>
When an Traditional Chinese locale file is updated:<br>
1. Identify which string keys were added or modified<br>
2. Check all other language files for these keys<br>
3. For missing keys, automatically translate from the source language to the target languages<br>
4. For modified keys, update the translation to match the modified source text<br>
5. Generate a summary of changes across all languages
</div>
{% endnote %}

## 設定場景
偵測 `/zh-TW/translation.json` 檔案的變更，自動更新所有其他語系文件。(雖然提示詞及指令有生成摘要，雖然實際執行後發現不太會主動生成摘要，不過瑕不掩瑜🤭。)

1. Event: File Saved
2. File path(s) to watch: `frontend/src/locales/zh-TW/translation.json`

![kiro-hooks-traditional-chinese-translation-sync](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Faws-kiro-build-fillup-using-specification-driven-development-hooks%2Fkiro-hooks-traditional-chinese-translation-sync.png?alt=media&token=55ac1832-fd91-4466-a739-c36bfa7a3ca2)

```
<!-- Instructions for Kiro agent -->
A Traditional Chinese locale file has been updated. Please perform the following tasks:

1. **Identify Changes**: Compare the updated zh-TW/translation.json with its previous version to identify which string keys were added or modified.

2. **Check Other Locale Files**: Examine all other language files in frontend/src/locales/ (en/translation.json, zh-CN/translation.json) for these keys.

3. **Translate Missing Keys**: For any keys that exist in zh-TW but are missing in other language files:
   - Translate from Traditional Chinese to the target language (English for en/, Simplified Chinese for zh-CN/)
   - Add the translated keys to the respective files
   - Maintain the same JSON structure and formatting

4. **Update Modified Keys**: For keys that were modified in zh-TW and already exist in other languages:
   - Update the translations in other language files to match the modified source text
   - Ensure semantic consistency across all translations

5. **Generate Summary**: Create a comprehensive summary including:
   - List of added keys with translations for each language
   - List of modified keys with before/after translations
   - Total count of changes per language file
   - Any keys that might need manual review due to context or complexity

Please ensure all JSON files remain valid and properly formatted after updates.
```

## 實作成果

我更改 `zh-TW/translation.json` 檔案中的「操作已被使用者取消。」字串後，Kiro 會排程 Hook「Traditional Chinese Translation Sync」，然後自動更新其他語系檔案。

![kiro-hooks-execute-traditional-chinese-translation-sync-1](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Faws-kiro-build-fillup-using-specification-driven-development-hooks%2Fkiro-hooks-execute-traditional-chinese-translation-sync-1.png?alt=media&token=70d509a0-9bbf-47e4-b576-43485cd0e896)

![kiro-hooks-execute-traditional-chinese-translation-sync-2](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Faws-kiro-build-fillup-using-specification-driven-development-hooks%2Fkiro-hooks-execute-traditional-chinese-translation-sync-2.png?alt=media&token=59534292-034d-4c91-8585-6269f8a4e6a8)


我在 `zh-TW/translation.json` 檔案中新增字串後，Kiro 會排程 Hook「Traditional Chinese Translation Sync」，然後自動更新其他語系檔案。

![kiro-hooks-execute-traditional-chinese-translation-sync-3](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Faws-kiro-build-fillup-using-specification-driven-development-hooks%2Fkiro-hooks-execute-traditional-chinese-translation-sync-3.png?alt=media&token=f0acd403-89fc-4fff-ae1a-79f27838ebbf)

![kiro-hooks-execute-traditional-chinese-translation-sync-4](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Faws-kiro-build-fillup-using-specification-driven-development-hooks%2Fkiro-hooks-execute-traditional-chinese-translation-sync-4.png?alt=media&token=1fdaa236-e460-4d5a-8d14-2ee8feb5119d)


# AWS架構圖
監控 CDK 文件的變動，並使用 AWS Diagram MCP Server 工具，自動生成對應的 AWS 雲端架構圖。

<div class="callout">
  <span class="callout-icon">💡</span><strong>什麼是 AWS CDK?</strong>
  <br>
  AWS 雲端開發套件(AWS Cloud Development Kit, AWS CDK)是一種基礎架構即程式碼(Infrastructure as Code, IaC)的軟體開發框架，可使用 TypeScript, JavaScript, Python, Java, C#/.Net, Go 等程式語言定義 AWS 雲端基礎架構，CDK 會將程式碼轉換為 CloudFormation 模板，並自動佈建 AWS 雲端資源。
  <br>
  AWS CDK 包含兩個主要部分:<br>
  <ul>
    <li>AWS CDK Construct Library: 預先編寫的模組化和可重複使用的程式碼，稱為建構(Construct)，可以使用、修改和整合來快速開發雲端基礎架構。</li>
    <li>AWS CDK Toolkit: 管理與 CDK 應用程式互動的工具。</li>
  </ul>
  AWS CDK 詳細說明可參考 <a href="https://docs.aws.amazon.com/zh_tw/cdk/v2/guide/home.html">AWS 官方文件 - AWS CDK</a>
</div>

## 新增 Hooks

{% note info %}
<div style="line-height:2; margin:0; padding:0;">
AWS架構圖提示詞:<br>
1) Analyze the modified CDK files and generate or update AWS service architecture diagrams using the Python diagrams package DSL.<br>
2) Parse the CDK code to identify AWS services, their relationships, and data flow.<br>
3) If the previous diagram not exist, create a visual representation showing the infrastructure components, connections, and dependencies. Include proper grouping for VPCs, subnets, and logical service boundaries.<br>
4) Delete the previous diagram before creating a new one. Output the Python diagrams code that can be executed to generate the architecture diagram.<br>
</div>
{% endnote %}
<div style="margin-top: -15px; margin-bottom: 15px;font-size: 14px; color: #555; text-align: center; font-style: normal; font-family: 'Arial', sans-serif;">
(參考資料: <a href="https://github.com/lyhsiang/AWS-Kiro-Workshops/blob/main/Spec-Coding/Kiro-Spec-Workshop.md" style="color: #555; text-decoration: none;">Kiro Spec Workshop: Hands-On Exercises)
</a>
</div>

## 設定場景
偵測與 AWS 相關的基礎架構檔案的變更，自動使用 AWS Diagram MCP Server，產生或更新 AWS 架構圖。我的專案的基礎架構檔案是統一放在 `infra` 目錄下，因此設定監控 `**/infra/**/*.ts` 及 `**/infra/**/*.py` 檔案。

1. Event: File Saved
2. File path(s) to watch: `**/infra/**/*.ts`、`**/infra/**/*.py`

![kiro-hooks-cdk-architecture-diagram-generator-event-file-saved](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Faws-kiro-build-fillup-using-specification-driven-development-hooks%2Fkiro-hooks-cdk-architecture-diagram-generator-event-file-saved.jpg?alt=media&token=e3879f13-8334-4e03-8264-20f4423d9829)

```
<!-- Instructions for Kiro agent -->
A CDK infrastructure file has been modified. Please:

1. Analyze the modified CDK file to identify:
   - AWS services being used (EC2, Lambda, S3, RDS, VPC, etc.)
   - Service relationships and connections
   - Data flow between components
   - Network architecture (VPCs, subnets, security groups)
   - Logical groupings and boundaries

2. Check if a previous architecture diagram exists in the project (look for .py files using the diagrams package or generated diagram images)

3. If a previous diagram exists, delete it before creating the new one

4. Generate Python code using the diagrams package that:
   - Creates a visual architecture diagram
   - Groups related services (VPCs, subnets, application layers)
   - Shows connections and data flow with arrows
   - Uses appropriate AWS service icons
   - Includes clear labels and descriptions
   - Follows AWS architecture diagram best practices

5. Output the complete Python diagrams code that can be executed to generate the diagram

6. Save the Python code to a file (e.g., `architecture_diagram.py`) and execute it to generate the diagram image

The diagram should be clear, professional, and accurately represent the infrastructure defined in the CDK code.
```

這邊要來分享一個 Kiro 很貼心的地方，自動生成的「File path(s) to watch」設定得相當寬鬆，幾乎把所有可能出現 AWS CDK 程式碼的路徑都涵蓋進來，如 `**/*cdk*.ts`、`**/*cdk*.py`、`**/infra/**/*.ts`、`**/infra/**/*.py`、`**/infrastructure/**/*.ts`、`**/infrastructure/**/*.py`。包含常見命名 `infra` 與 `infrastructure`，甚至可能沒被放到特定資料夾裡都想到了(~~他知道我會亂放?!😂~~)。

![kiro-hooks-cdk-architecture-diagram-generator-execute-hook-4](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Faws-kiro-build-fillup-using-specification-driven-development-hooks%2Fkiro-hooks-cdk-architecture-diagram-generator-execute-hook-4.jpg?alt=media&token=84cbc015-e70a-4cd2-9831-489fd97da6a8)

## 實作成果

我以下是執行 AWS 雲端部署 Spec 的第1個任務，可參考 Kiro 為 AWS 雲端部署「aws-serverless-deployment」所產生的 Spec 文件內容: [Requirements & Design & Task list](https://stellacoding.notion.site/FillUp-29b9a83673d680e39a4bde9f4d54c4d3?pvs=74)。

當 Kiro 偵測到 AWS 相關的基礎架構檔案有變更時，就會自動排程產生或更新 AWS 架構圖。

![kiro-hooks-cdk-architecture-diagram-generator-execute-hook-1](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Faws-kiro-build-fillup-using-specification-driven-development-hooks%2Fkiro-hooks-cdk-architecture-diagram-generator-execute-hook-1.jpg?alt=media&token=010fbd27-7350-462e-95c2-ace81f1ab980)

![kiro-hooks-cdk-architecture-diagram-generator-execute-hook-2](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Faws-kiro-build-fillup-using-specification-driven-development-hooks%2Fkiro-hooks-cdk-architecture-diagram-generator-execute-hook-2.jpg?alt=media&token=a0bfcac7-554f-4c43-a6f0-91abc93f7178)

![kiro-hooks-cdk-architecture-diagram-generator-execute-hook-3](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Faws-kiro-build-fillup-using-specification-driven-development-hooks%2Fkiro-hooks-cdk-architecture-diagram-generator-execute-hook-3.jpg?alt=media&token=7fd03592-1e11-4e64-8a15-9da60dc1c00e)


# 經驗分享

當 Hook 設定為自動觸發時，目前就無法以手動方式執行。因此，如果需要在特定情況下手動觸發，我建議另外建立一個相同設定的 Hook，並將觸發方式改為「Manual Trigger」。這樣就能在需要時隨時手動執行。而考量到 AI 工具更新速度...，我猜這個功能應該很快也會補上(小小許願😄)。

![kiro-hooks-cdk-architecture-diagram-generator-event-manual-1](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Faws-kiro-build-fillup-using-specification-driven-development-hooks%2Fkiro-hooks-cdk-architecture-diagram-generator-event-manual-1.jpg?alt=media&token=aeddbe3a-9553-4d9b-bc67-698582882558)

![kiro-hooks-cdk-architecture-diagram-generator-event-manual-2](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Faws-kiro-build-fillup-using-specification-driven-development-hooks%2Fkiro-hooks-cdk-architecture-diagram-generator-event-manual-2.jpg?alt=media&token=dba3d5bb-4df5-4f74-98c7-5865e9d54e51)

![kiro-hooks-cdk-architecture-diagram-generator-event-manual-3](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Faws-kiro-build-fillup-using-specification-driven-development-hooks%2Fkiro-hooks-cdk-architecture-diagram-generator-event-manual-3.jpg?alt=media&token=6f63b885-a53e-43f5-82ad-d8357fd2192a)

![kiro-hooks-cdk-architecture-diagram-generator-event-manual-final-diagram](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Faws-kiro-build-fillup-using-specification-driven-development-hooks%2Fkiro-hooks-cdk-architecture-diagram-generator-event-manual-final-diagram.jpg?alt=media&token=f4d43d32-2e48-4bf4-9b70-87584d0dad91)

# 總結
本篇文章透過「文件產生器」、「同步翻譯」以及「AWS 架構圖」3個實戰案例，示範 Kiro Hooks 如何成為一個能自動執行重複性工作的自動化引擎，主動在開發過程中偵測特定事件並自動執行動作，確保程式碼與文檔的一致性，並持續協助維護專案品質，真正從「工具」進化為「智慧開發夥伴」。

回顧 Kiro 作為一個 Agentic IDE 的完整生態，可以看見一個具備清晰分工的自動化體系:
- 核心方法｜規格驅動開發(Spec-Driven Development)
定義需求、技術架構、任務，用規格引導 AI 正確開發。
- LLM(大腦)｜推理與行動
理解開發者意圖與程式碼邏輯，並提供程式碼與技術建議。
- MCP(感知)｜存取外部資料
讓 AI 能存取各種資料來源、工具以及工作流程。
- Hooks(反射)｜自動化機制
從被動到「主動行動」，當特定事件發生時自動執行流程。

<div style="max-width:520px; margin:2em auto; padding:1.5em; border:1px solid #ddd; border-radius:10px; background:#fafafa; text-align:center; box-shadow:0 2px 6px rgba(0,0,0,0.08);">
  <p style="font-size:1.1em; margin-bottom:1em;">👇 點此免費訂閱，不錯過任何更新</p>
  <iframe src="https://stellacoding.substack.com/embed" 
          width="480" height="320" 
          style="border:1px solid #EEE; background:white; border-radius:6px;" 
          frameborder="0" scrolling="no"></iframe>
</div>

# AWS Kiro 系列文章

- [【AWS Kiro 實戰】用規格驅動開發喝水記錄應用
先寫規格再讓AI開發，用規格引導AI正確開發](https://estellacoding.github.io/blog/aws-kiro-build-fillup-using-specification-driven-development/)
- [【AWS Kiro 進階】實作 MCP 擴充 AI 能力邊界
設定MCP及實作前端除錯、架構視覺化與AWS部署文件查詢](https://estellacoding.github.io/blog/aws-kiro-build-fillup-using-specification-driven-development-mcp/)
- [【AWS Kiro 進階】實作 Hooks 自動化開發流程
設定Hooks自動觸發更新文件、同步翻譯、AWS架構圖](https://estellacoding.github.io/blog/aws-kiro-build-fillup-using-specification-driven-development-hooks/)