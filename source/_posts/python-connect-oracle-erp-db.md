---
title: Python 連線 Oracle ERP 資料庫教學
date: 2025-02-20 11:11:11
updated: 2025-02-20 11:11:11
tags:
  - Oracle
  - ERP
  - PL/SQL
  - Python
categories: Oracle
comments: true
---

本教學將帶你一步步使用 Python 連線 Oracle ERP 資料庫，從環境準備到實作完整程式碼，一次到位！連線的程式碼不複雜，但我某一個資料庫卻一直連線失敗，花了一周時間各種排查連線失敗的問題，最後發現問題是在 Oracle Instant Client 版本!

<!-- more -->

# 確認Oracle版本
可以使用任何 Oracle 連線工具，例如 SQL*Plus、PL/SQL Developer，或是其他資料庫管理工具來查詢目前電腦中 Oracle 資料庫版本的資訊。
```
SELECT * FROM v$version;
```
執行後，你會看到類似以下的輸出結果:
```
BANNER
--------------------------------------------------------------------------
Oracle Database 11g EE Extreme Perf Release 11.2.0.4.0 - 64bit Production
PL/SQL Release 11.2.0.4.0 - Production
...
```
在 BANNER 欄位中，可以看到 Oracle 資料庫的詳細版本資訊，我電腦上的版本是 11.2.0.4.0，所以下一步要下載相對應的 Oracle Instant Client 版本。

![plsql-developer-check-sql-version](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fpython-connect-oracle-erp-db%2Fplsql-developer-check-sql-version.jpg?alt=media&token=130c867a-4b52-4d54-b8d2-962b2e6e0bf0)


# 下載Client

1. 官方下載頁面: [Oracle Instant Client Downloads](https://www.oracle.com/database/technologies/instant-client/downloads.html)
2. 選擇對應作業系統版本(我是 Windows x64): [Oracle Instant Client Downloads for Microsoft Windows (x64) 64-bit](https://www.oracle.com/database/technologies/instant-client/winx64-64-downloads.html)
3. 找到 Version 11.2.0.4.0
![oracle-instant-client-version-11-2](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fpython-connect-oracle-erp-db%2Foracle-instant-client-version-11-2.jpg?alt=media&token=782d68f0-5bda-42ef-8dde-c49760375280)
4. 下載兩個套件
   - Instant Client Package - Basic
   - Instant Client Package - SQL*Plus
5. 解壓縮資料夾
6. 將2個資料夾中的所有檔案合併到同一個目錄下 `C:\oracle\instantclient_11_2`

目錄結構應如下:
```
C:\oracle\
└── instantclient_11_2/
    ├── oci.dll      # 核心連接庫
    ├── sqlplus.exe  # SQL*Plus工具
    └── ...
```
{% note info %}
若資料庫版本為 11.2.0.4.0，Client 版本也使用相同版本。
{% endnote %}

# 安裝套件
```
pip install oracledb pyyaml sqlalchemy
```
```
import oracledb
import yaml
from sqlalchemy import create_engine
```
套件名稱|用途
-|-
oracledb|連線 Oracle 資料庫的核心驅動程式
pyyaml|使用 YAML 檔案來儲存資料庫的敏感資訊
sqlalchemy|SQL ORM 來建立資料庫連線

# 設定連線帳密
為了安全地管理資料庫連線資訊，我建立了 `credentials.yml`，將帳號、密碼、主機等敏感資訊儲存在這檔案中，而不是直接寫在 Python 程式碼裡。

請將 `your_db_username`, `your_db_password`, `your_db_host`, `your_db_service_name` 替換成你實際的資料庫連線資訊。請務必妥善保管 credentials.yml 檔案，避免洩露敏感資訊。通常會將此檔案加入 `.gitignore`，防止被提交到版本控制系統。

```
database:
  username: "your_db_username"         # Oracle 資料庫使用者名稱
  password: "your_db_password"         # Oracle 資料庫密碼
  host: "your_db_host"                 # Oracle 資料庫主機名稱或 IP 位址
  port: 1521                           # Oracle 資料庫 Port，預設為 1521
  service_name: "your_db_service_name" # Oracle 資料庫 Service Name (或 SID)
```

# 完整程式碼
我們將整合以上步驟，撰寫完整的 Python 程式碼來連線 Oracle ERP 資料庫。
```
import oracledb
import yaml
from sqlalchemy import create_engine

# 讀取YAML檔案
def load_credentials(file_path="credentials.yml"):
    with open(file_path, "r", encoding="utf-8") as file:
        return yaml.safe_load(file)

# 初始化 Oracle Instant Client
oracledb.init_oracle_client(lib_dir=r"C:\oracle\instantclient_11_2")

# 載入資料庫憑證
credentials = load_credentials()
db = credentials["database"]

# 建立連線字串
# 連線字串格式: oracle+oracledb://<username>:<password>@<host>:<port>/?service_name=<service_name>
# 例如: oracle+oracledb://admin:admin@erpdb.example.com:1521/?service_name=ERPDB
db_url = f"oracle+oracledb://{db['username']}:{db['password']}@{db['host']}:{db['port']}/?service_name={db['service_name']}"

# 嘗試建立連線
try:
    engine = create_engine(db_url)
    print(f"✅ 成功連線至資料庫！")
except oracledb.DatabaseError as e:
    error, = e.args
    print(f"❌ 資料庫連線失敗！錯誤碼: {error.code}, 訊息: {error.message}")
except Exception as e:
    print(f"❌ 發生未知錯誤: {e}")
```
執行 Python 程式碼，如果一切順利，你應該會看到`✅ 成功連線至資料庫！`的訊息。
![python-connect-oracle-erp-db-successful](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fpython-connect-oracle-erp-db%2Fpython-connect-oracle-erp-db-successful.jpg?alt=media&token=fd5e06a8-a72a-4af5-8eb4-0d385a2d9daf)

# 處理錯誤訊息
錯誤訊息|解決方法
-|-
`ORA-12699: Native service internal error occurred.`| 將 Oracle Instant Client 版本換成 11.2.0.4.0。|
`ORA-12505: Cannot connect to database. SID ERPDB is not registered with the listener at host...`|表示 Listener 上沒有SID 為 ERPDB，改用 `service_name="ERPDB"`。|
`ORA-00911: invalid character`|在 Python 執行 SQL 時，不需要結尾帶分號。|
`DPY-3010: connections to this database server version are not supported by python-oracledb in thin mode`|Oracle 版本是 `11` 或更舊，必須使用 Thick Mode，需要使用 Oracle Instant Client。若是 `12` 或更新，則可以使用 Thin Mode，就不需要使用 Oracle Instant Client。|
`UserWarning: pandas only supports SQLAlchemy connectable (engine/connection) or database string URI or sqlite3 DBAPI2 connection. Other DBAPI2 objects are not tested. Please consider using SQLAlchemy.`|使用 SQLAlchemy 建立資料庫連線，可也可忽略該警告，大部分情況下功能是正常的。|


# 總結
恭喜你成功完成使用 Python 連線至 Oracle ERP 資料庫的過程！透過本篇文章的教學，相信你已經掌握了基本的連線方式，並能夠順利存取與操作資料庫中的資料，接下來就可以開始進行更進一步的資料處理與應用。如果在實作過程中遇到任何問題，歡迎隨時留言討論，我會盡力協助你解決問題！