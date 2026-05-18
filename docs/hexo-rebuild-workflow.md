# Hexo 強制重建流程

記錄改主題或 tag plugin 後,如何正確地清掉舊產出並重建,避免改了沒生效。

## 關鍵原則

**先停掉正在跑的 `hexo s`,再執行 clean。**

若 server 還在跑,`hexo clean` 可能無法真正清掉 `public/`,導致 `hexo s` 一直吃舊產出。

## 正確流程

```bash
# 1. 在跑 hexo s 的 terminal 按 Ctrl+C 停掉
# 2. 在 blog 目錄執行:
hexo clean && hexo generate && hexo server
```

縮寫:

```bash
hexo cl && hexo g && hexo s
```

> `hexo c` = `clean`、`hexo g` = `generate`、`hexo s` = `server`

## 三個常用組合

| 情境 | 指令 |
|---|---|
| 改文章內容 (md/設定) | `hexo s` 通常會自動 reload,不用重來 |
| 改主題 stylus / css | `hexo cl && hexo s` (clean 就夠) |
| 改主題 `.js` / 設定 / tag plugin | 停 server → `hexo cl && hexo g && hexo s` |

## 加進 package.json 一鍵跑

在 `package.json` 的 `scripts` 加:

```json
"scripts": {
  "build": "hexo generate",
  "clean": "hexo clean",
  "deploy": "hexo deploy",
  "server": "hexo server",
  "fresh": "hexo clean && hexo generate && hexo server"
}
```

之後 `npm run fresh` 即可,但**前提一樣**: 要先 Ctrl+C 停掉舊的 server。

## 確認真的有重產的小技巧

```bash
ls -la public/index.html
```

看 mtime 是不是剛剛的時間。如果還是舊的,代表 clean 沒生效 — 通常就是 server 還活著佔著檔。

## 暴力大絕 (Ctrl+C 沒殺乾淨時)

如果改完主題重啟還是看到舊樣式,先確認沒有殘留的 hexo 進程:

```bash
pkill -f hexo            # 殺光所有 hexo 行程
rm -f db.json            # 砍掉 hexo 的快取資料庫
hexo clean && hexo generate && hexo server
```

這招用在: Ctrl+C 沒真的停掉、或多個 terminal 都各自開過 hexo s 的時候。

## 驗證 server 真的送新內容

肉眼看不出來時,直接比較 disk 跟 HTTP 回應:

```bash
diff <(curl -s http://localhost:4000/blog/your-post/) public/your-post/index.html
```

沒輸出 = 一致。有 diff = server 還在 cache 舊版,需要重啟。
