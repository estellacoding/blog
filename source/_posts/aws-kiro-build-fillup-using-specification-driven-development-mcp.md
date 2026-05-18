---
title: 【AWS Kiro 進階】實作 MCP 擴充 AI 能力邊界
date: 2025-11-17 15:00:00
updated: 2025-11-17 15:00:00
tags:
  - Kiro
  - MCP
  - AWS
  - IDE
  - Vibe Coding
  - Spec Coding
categories:
  - Kiro
comments: true
---

上週 [這篇](https://estellacoding.github.io/blog/aws-kiro-build-fillup-using-specification-driven-development/) 一同走過 Kiro 的 Spec Coding 實作流程，理解 Kiro 如何透過明確的規格來生成程式碼，本篇將延伸這個概念，帶你進一步探索 Kiro 的另一個強大能力 MCP Server。

{% note info %}
**什麼是 MCP?**
模型上下文協定(Model Context Protocol)是一種開源標準，將 AI 應用程序連接到外部系統。透過 MCP，可連接到各種資料來源(如本機檔案、資料庫)、工具(如搜尋引擎、計算器)，以及工作流程(如特定用途的提示詞)，讓 AI 應用程式能夠存取關鍵資訊並執行實際任務。
\- [MCP 官方文件](https://modelcontextprotocol.io/docs/getting-started/intro)
{% endnote %}

<!-- more -->

# 前置準備
1. 安裝 [Kiro IDE](https://kiro.dev/downloads)。
2. 安裝 [uv](https://docs.astral.sh/uv/getting-started/installation/)。
3. 具有 S3 和 CloudFront 存取權限的 AWS 帳戶。(用於部署)
4. 安裝並設定好 AWS CLI。(用於部署)
5. 在 Kiro 中打開項目，如`fillup-web`。

## 安裝 uv
```
# 安裝uv
pip install uv
# 更新uv
pip install --upgrade uv
```
```
# 檢查是否已安裝
uv self version
uv 0.9.9 (4fac4cb7e 2025-11-12)
```

{% note info %}
安裝文件可參考 [Astral - Installing uv](https://docs.astral.sh/uv/getting-started/installation/)。
{% endnote %}

## 設定 AWS
### 設定帳戶權限
登入 [AWS 管理主控台](https://aws.amazon.com/tw/console/)，進入 IAM 新增人員後，點擊「新增許可」將該人員加入 `AmazonS3FullAccess` 及 `CloudFrontFullAccess` 這2個權限，另外也需新增該人員的存取金鑰，用於下一步在終端機使用 AWS CLI 時，可輸入金鑰以確認身份。

![aws-iam-add-user-permissions](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Faws-kiro-build-fillup-using-specification-driven-development-mcp%2Faws-iam-add-user-permissions.jpg?alt=media&token=15f6fe29-7ab4-415e-aa28-5080fd195a91)

![aws-iam-add-user-key-1](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Faws-kiro-build-fillup-using-specification-driven-development-mcp%2Faws-iam-add-user-key-1.jpg?alt=media&token=d92c1459-59f8-4d44-89dd-0098dedb27be)

記得在<u>**點擊「完成」前，保存「私密存取金鑰」**</u>，否則離開此畫面就不會再顯示。
![aws-iam-add-user-key-2](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Faws-kiro-build-fillup-using-specification-driven-development-mcp%2Faws-iam-add-user-key-2.jpg?alt=media&token=a2bd4195-d4b5-47c7-8936-e4edfc120b02)

如果真的沒有保存到，因為每個人員只能有2個存取金鑰，所以可以先刪除原本的存取金鑰，然後再點擊「建立存取金鑰」重新建立一個新的存取金鑰就好。
![aws-iam-add-user-key-3](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Faws-kiro-build-fillup-using-specification-driven-development-mcp%2Faws-iam-add-user-key-3.jpg?alt=media&token=b5f2f5f1-926c-4e2e-81f6-620c98fd9e03)

### 安裝 AWS CLI
```
#Windows安裝
msiexec.exe /i https://awscli.amazonaws.com/AWSCLIV2.msi
#macOS安裝
sudo installer -pkg ./AWSCLIV2.pkg -target /

#查看版本
aws --version
aws-cli/2.31.19 Python/3.13.7 Windows/11 exe/AMD64
aws-cli/2.31.37 Python/3.13.9 Darwin/24.6.0 exe/arm64

#設定登入憑證
aws configure
AWS Access Key ID: <your_aws_access_key_id>
AWS Secret Access Key: <your_aws_secret_access_key>
Default region name: ap-northeast-1
Default output format: json

#確認登入身份
aws sts get-caller-identity
{
    "UserId": "<show_your_user_id>",
    "Account": "<show_your_account_id>",
    "Arn": "<show_your_arn>"
}
```

{% note info %}
安裝文件可參考 [AWS CLI](https://docs.aws.amazon.com/zh_tw/cli/latest/userguide/getting-started-install.html)。
{% endnote %}

# MCP Server
本次將安裝並設定這些 MCP，Chrome DevTools 前端除錯、AWS Diagram MCP Server 架構視覺化，以及 AWS Documentation MCP Server 與 AWS CDK MCP Server 部署文件查詢。

{% note info %}
MCP Server 詳細說明可參考 [Kiro Doc - MCP](https://kiro.dev/docs/mcp/)。
AWS 提供的 MCP 清單可參考 [AWS MCP Servers](https://awslabs.github.io/mcp/)。
{% endnote %}

## AWS MCP
### Documentation

{% note primary %}
AWS Documentation MCP Server
適用場景: 查 API 差異、部署步驟、AWS 最佳實踐。
{% endnote %}


|功能項目|說明|
|-|-|
| Read Documentation| 取得 AWS 官方文件內容並轉換為 Markdown 格式。|
| Search Documentation| 使用官方搜尋 API 搜尋 AWS 文件 (僅支援全球區域)。|
| Recommendations| 根據 AWS 文件頁面，提供相關內容推薦 (僅支援全球區域)。|
| Get Available Services List| 取得中國區可用的 AWS 服務清單 (僅限中國區域)。|

{% note info %}
Documentation 詳細說明可參考 [AWS Documentation MCP Server](https://github.com/awslabs/mcp/tree/main/src/aws-documentation-mcp-server)。
{% endnote %}

### Diagram
{% note primary %}
AWS Diagram MCP Server
適用場景: 產生雲端系統架構圖，協助架構審查與文件維護。
{% endnote %}

透過 Python 的 Diagrams 套件生成架構圖，支援的圖表類型包含: 
- AWS 架構圖 (AWS Diagrams)
- 序列圖 (Sequence Diagrams)
- 流程圖 (Flow Diagrams)
- 類別圖 (Class Diagrams)

{% note info %}
AWS Diagram 詳細說明可參考 [AWS Diagram MCP Server](https://github.com/awslabs/mcp/tree/main/src/aws-diagram-mcp-server)。
{% endnote %}


### CDK

{% note primary %}
AWS CDK MCP Server
適用場景: 設計、審查與驗證 AWS 基礎架構、生成安全性檢查報告。
{% endnote %}

|功能項目|說明|
|-|-|
|CDK General Guidance|1.AWS Solutions Constructs與GenAI CDK的架構範本。<br>2.結構化的決策流程。<br>3.CDK Nag與Lambda Powertools提升安全自動化。|
|CDK Nag Integration|1.存取CDK Nag規則。<br>2.解釋CDK Nag規則。<br>3.檢查CDK程式碼中是否包含CDK Nag的忽略規則註解。
|AWS Solutions Constructs|1.搜尋和探索AWS Solutions Constructs模式。<br>2.根據常見架構需求推薦最適合的模式。<br>3.取得AWS Solutions Constructs的官方文件。
|Generative AI CDK Constructs|1.依名稱或類型搜尋GenAI CDK Constructs。<br>2.探索AI/ML的專用架構元件。<br>3.取得生成式AI應用程式的最佳實踐。
|Lambda Layer Documentation Provider|1.查詢Lambda Layers的官方文件。<br>2.取得通用Lambda Layer與Python專用Layer的程式碼範例。<br>3.檢索目錄結構資訊和實作最佳實務。<br>4.與AWS Documentation MCP Server整合。
|Amazon Bedrock Agent Schema Generation|1.建立Bedrock Agent且Action Group需呼叫Lambda可使用。<br>2.簡化Bedrock Agent schema的建立流程。<br>3.自動將程式碼檔案轉換為相容的OpenAPI規格。

{% note info %}
CDK 詳細說明可參考 [AWS CDK MCP Server](https://github.com/awslabs/mcp/tree/main/src/cdk-mcp-server)。
{% endnote %}

## 好用 MCP
### Chrome DevTools
{% note primary %}
Chrome DevTools MCP
適用場景: 前端錯誤偵測與效能診斷、自動擷取畫面、提出修正建議。
{% endnote %}

|功能項目|說明|
|-|-|
|Get performance insights|記錄瀏覽器執行軌跡，提供效能分析與優化建議。|
|Advanced browser debugging|分析網路請求、自動截圖、讀取Console錯誤記錄。|
|Reliable automation|內建Puppeteer控制Chrome執行常用操作，並等待操作結果完成。|

{% note info %}
Chrome DevTools 詳細說明可參考 [Chrome DevTools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp)。
{% endnote %}

### Context7
{% note primary %}
Context7
適用場景: 即時查詢最新官方文件。
{% endnote %}

Context7 MCP 會從官方來源取得最新或對應特定版本的文件與程式碼範例，並直接放入 LLM 的提示詞上下文中，讓模型基於正確版本回答，確保內容即時且避免引用過時資訊。

- 提供符合最新版本的程式碼範例。
- 使用真實存在且對應特定版本的 API 與方法。
- 依最新或特定版本給出精準建議。

{% note info %}
Context7 詳細說明可參考 [Context7 MCP](https://github.com/upstash/context7)。
{% endnote %}



# 實作

## 新增 MCP

點擊「Open MCP Config」。
![kiro-mcp-servers-open-mcp-config](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Faws-kiro-build-fillup-using-specification-driven-development-mcp%2Fkiro-mcp-servers-open-mcp-config.jpg?alt=media&token=e813e7dc-800b-4a04-81cc-dd5c1df346ce)

開啟 `mcp.json` 檔案，可以選擇設定在「User Config」或「Workspace Config」，我選擇設定在「Workspace Config」，因為可以將 VS Code 設定也提交至 GitHub 中。

![kiro-mcp-servers-open-mcp-config-json-file](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Faws-kiro-build-fillup-using-specification-driven-development-mcp%2Fkiro-mcp-servers-open-mcp-config-json-file.jpg?alt=media&token=f34b4cdd-9939-47f8-a9ef-051dbb43d312)

接著將以下 MCP 設定內容貼入 `mcpServers` 區塊中，然後儲存檔案。
- [AWS Documentation MCP Server](https://awslabs.github.io/mcp/servers/aws-documentation-mcp-server)。
- [AWS Diagram MCP Server](https://awslabs.github.io/mcp/servers/aws-diagram-mcp-server)。
- [AWS CDK MCP Server](https://awslabs.github.io/mcp/servers/cdk-mcp-server)。
- [Chrome DevTools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp)。
- [Context7 MCP](https://github.com/upstash/context7)。

```
{
  "mcpServers": {
    "awslabs.aws-documentation-mcp-server": {
      "disabled": false,
      "command": "uvx",
      "args": ["--from", "awslabs.aws-documentation-mcp-server@latest", "awslabs.aws-documentation-mcp-server"],
      "env": {
        "FASTMCP_LOG_LEVEL": "ERROR",
        "AWS_DOCUMENTATION_PARTITION": "aws"
      },
      "autoApprove": []
    },
    "awslabs.aws-diagram-mcp-server": {
      "disabled": false,      
      "command": "uvx",
      "args": ["--from", "awslabs.aws-diagram-mcp-server", "awslabs.aws-diagram-mcp-server"],
      "env": {
        "FASTMCP_LOG_LEVEL": "ERROR"
      },
      "autoApprove": [
        "list_icons",
        "generate_diagram",
        "get_diagram_examples"
      ]
    },    
    "awslabs.cdk-mcp-server": {
      "disabled": false,
      "command": "uvx",
      "args": ["--from", "awslabs.cdk-mcp-server@latest", "awslabs.cdk-mcp-server"],
      "env": {
        "FASTMCP_LOG_LEVEL": "ERROR"
      },
      "autoApprove": [
        "GetAwsSolutionsConstructPattern"
      ]
    },
    "chrome-devtools": {
      "disabled": false,
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"]
    },
    "context7": {
      "disabled": false,
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      "env": {
        "CONTEXT7_API_KEY": "<your_context7_api_key>"
      }
    }  
  }
}
```

成功設定 MCP 則會出現綠色勾勾。
![kiro-mcp-servers-open-mcp-config-success](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Faws-kiro-build-fillup-using-specification-driven-development-mcp%2Fkiro-mcp-servers-open-mcp-config-success.jpg?alt=media&token=79290fad-e061-4025-ad3c-0c786e5627aa)

## 除錯 MCP
如果 MCP 設定錯誤，則會出現紅色叉叉。
![kiro-mcp-servers-debug-1](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Faws-kiro-build-fillup-using-specification-driven-development-mcp%2Fkiro-mcp-servers-debug-1.jpg?alt=media&token=22286d93-8c37-446d-af1f-81bf9558c204)

「Output」視窗中會有錯誤訊息，舉例我這次的錯誤訊息是無法連接到 MCP Server。
```
[warn] [awslabs.aws-documentation-mcp-server] Log from MCP Server: An executable named `awslabs.aws-documentation-mcp-server.exe` is not provided by package `awslabs-aws-documentation-mcp-server`.

[error] [awslabs.aws-documentation-mcp-server] Error connecting to MCP server: MCP error -32000: Connection closed
```

此時可以先點擊「Retry」重新嘗試連接，如果還是無法連接，則可以點擊「Ask Kiro」，Kiro 會自動將錯誤訊息與對應提示詞丟到對話中，直接請 AI 協助分析並解決問題。(太猛👍)

![kiro-mcp-servers-debug-2](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Faws-kiro-build-fillup-using-specification-driven-development-mcp%2Fkiro-mcp-servers-debug-2.jpg?alt=media&token=0982d8ad-a454-4bbd-a5d9-8fc00f29df8c)

然後…問題就直接被解掉了(~~心髒爆擊😂~~)。
![kiro-mcp-servers-debug-3](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Faws-kiro-build-fillup-using-specification-driven-development-mcp%2Fkiro-mcp-servers-debug-3.jpg?alt=media&token=a3f2830c-d22b-4828-9ae3-163283af036f)


## 使用 MCP
### 前端除錯

{% note info %}
提示詞:
啟動前端，使用 Chrome DevTools 測試應用，找出錯誤並修正。
{% endnote %}

自動執行使用者操作，如點擊來重現 bug。
![kiro-mcp-chrome-devtools-mcp-1](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Faws-kiro-build-fillup-using-specification-driven-development-mcp%2Fkiro-mcp-chrome-devtools-mcp-1.jpg?alt=media&token=902b74d6-6292-43e4-9f6f-85c064b2e319)

自動開啟瀏覽器頁面。
![kiro-mcp-chrome-devtools-mcp-2](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Faws-kiro-build-fillup-using-specification-driven-development-mcp%2Fkiro-mcp-chrome-devtools-mcp-2.jpg?alt=media&token=15c5ca3f-6fa3-42f0-ac34-a5bc2461b945)

自動瀏覽器頁面內容截圖。
![kiro-mcp-chrome-devtools-mcp-3](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Faws-kiro-build-fillup-using-specification-driven-development-mcp%2Fkiro-mcp-chrome-devtools-mcp-3.jpg?alt=media&token=a7c509bc-73ab-4667-a1e7-320fa2d25703)

自動檢查 Console 與 Network 請求。
![kiro-mcp-chrome-devtools-mcp-4](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Faws-kiro-build-fillup-using-specification-driven-development-mcp%2Fkiro-mcp-chrome-devtools-mcp-4.jpg?alt=media&token=03949620-7877-4d93-85d7-bcff7a43f832)

最後…總結列出所有已修復的問題(~~心髒爆擊again😂~~)。
![kiro-mcp-chrome-devtools-mcp-5](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Faws-kiro-build-fillup-using-specification-driven-development-mcp%2Fkiro-mcp-chrome-devtools-mcp-5.jpg?alt=media&token=74457a74-b7b1-44ad-9351-0f8acd82d5d6)


### 架構視覺化

我實際執行後發現在產生一般流程圖時，可以正常建立節點與流程關係，不過會沒有對應的圖示。目前還是生成 AWS 雲端架構圖效果較好。

{% note info %}
提示詞:
Generate AWS service architecture diagrams.
{% endnote %}

![kiro-mcp-aws-diagram-mcp](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Faws-kiro-build-fillup-using-specification-driven-development-mcp%2Fkiro-mcp-aws-diagram-mcp.jpg?alt=media&token=2ca1c626-5cc4-4cf0-8193-feedb87a1876)

![kiro-mcp-aws-diagram-mcp-generic-icon](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Faws-kiro-build-fillup-using-specification-driven-development-mcp%2Fkiro-mcp-aws-diagram-mcp-generic-icon.jpg?alt=media&token=fe5b055f-50dd-4794-b91f-ee1cb2516aa4)

### 部署文件查詢

新增 Specs，並輸入部署至 AWS Cloud 的提示詞。

{% note info %}
提示詞:
I have a web-based application need to deploy to AWS Cloud. Create a comprehensive AWS architecture with following high-level requirements:
1\) Must use AWS serverless services, such as Cloudfront, S3, etc..
2\) Follow each service's configuration best practice.
3\) Prefer to use Infrasturce as Code solution to deploy, such as AWS CDK.
{% endnote %}
<div style="margin-top: -15px; margin-bottom: 15px;font-size: 14px; color: #555; text-align: center; font-style: normal; font-family: 'Arial', sans-serif;">
(參考資料: <a href="https://github.com/lyhsiang/AWS-Kiro-Workshops/blob/main/Spec-Coding/Kiro-Spec-Workshop.md" style="color: #555; text-decoration: none;">Kiro Spec Workshop: Hands-On Exercises)
</a>
</div>

跟著 Kiro 逐步引導完成 `requirements.md` 需求文件、`design.md` 技術設計文件，及 `tasks.md` 任務清單文件。詳細可參考 Specs「aws-cloud」所產生的文件內容: [Requirements & Design & Task list](https://stellacoding.notion.site/FillUp-29b9a83673d680e39a4bde9f4d54c4d3?pvs=74)。

當 AI 需要查詢文件時，Kiro 會自動使用 AWS Documentation MCP Server 或 AWS CDK MCP Server 查詢相關 AWS 部署文件內容。
![kiro-mcp-aws-cdk-mcp](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Faws-kiro-build-fillup-using-specification-driven-development-mcp%2Fkiro-mcp-aws-cdk-mcp.jpg?alt=media&token=267c62e2-8102-423f-a54d-70bfd817279a)

重要提醒，若只是測試 AWS 部署，記得要把 AWS 資源清掉，以免漏財!

{% note info %}
提示詞:
Create and execute cleanup procedures:
\- Document all deployed AWS resources.
\- Create cleanup scripts for complete resource removal.
\- Verify all resources are properly deleted.
\- Document any persistent data that needs backup.
\- Create re-deployment procedures for future use.
{% endnote %}
<div style="margin-top: -15px; margin-bottom: 15px;font-size: 14px; color: #555; text-align: center; font-style: normal; font-family: 'Arial', sans-serif;">
(參考資料: <a href="https://github.com/lyhsiang/AWS-Kiro-Workshops/blob/main/Spec-Coding/Kiro-Spec-Workshop.md" style="color: #555; text-decoration: none;">Kiro Spec Workshop: Hands-On Exercises)
</a>
</div>

# 進階概念預告

完成 Kiro 的 MCP 實作之後，下一篇我們將一起解鎖 Agent Hooks。Agent Hooks 是一種事件驅動的自動化機制，能在開發過程中偵測特定事件並自動執行動作。

<div style="max-width:520px; margin:2em auto; padding:1.5em; border:1px solid #ddd; border-radius:10px; background:#fafafa; text-align:center; box-shadow:0 2px 6px rgba(0,0,0,0.08);">
  <p style="font-size:1.1em; margin-bottom:1em;">👇 點此免費訂閱，不錯過任何更新</p>
  <iframe src="https://stellacoding.substack.com/embed" 
          width="480" height="320" 
          style="border:1px solid #EEE; background:white; border-radius:6px;" 
          frameborder="0" scrolling="no"></iframe>
</div>