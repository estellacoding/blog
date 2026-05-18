---
title: 搞懂慣例式提交
date: 2025-08-14 11:11:11
updated: 2025-08-14 11:11:11
tags:
  - Conventional Commits
  - Github
categories: GitHub
comments: true
---

用了一陣子的 GitHub Copilot 的「自動產生提交訊息」功能後(大腦外包給AI 😆)，不過有時還是想要手動微調提交訊息，所以想要了解所有的提交類型，以便可以微調提交訊息。

<!-- more -->
還不知道這個功能的小拉粉們，也可以順便看一下 [這篇](https://estellacoding.github.io/blog/github-copilot-vscode-ai-conventional-commit/)，教你怎麼在 VS Code 讓 GitHub Copilot 自動生成符合慣例式提交規範的訊息。

先分享一張經典的 git commit 漫畫插圖，有位工程師常常用「small changes」當提交訊息，被同事提醒「請寫有意義的訊息」，結果他很認真地提交了一段的詩 😆:

> What is life if full of care. If we have no time to stand and stare... — William Henry Davies 

![conventional-commit-type-workchronicles](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fconventional-commit-type%2Fconventional-commit-type-workchronicles.png?alt=media&token=d4e08077-1941-4ab0-b157-9bab5757f22b)

雖然這段詩文很發人省思(~~那我上班的意義是🧐?~~)，但顯然不是一個好的提交訊息。真正的「有意義」提交訊息，應該是清晰、結構化且語意明確的，能快速理解改了什麼、為什麼改，以及影響範圍。(未來的你一定會感謝現在寫下清楚提交訊息的自己 🥹)。

# 慣例式提交是什麼?
> 核心目標: 讓提交訊息同時具備「人類可讀」與「機器可解析」的語意。

[慣例式提交(Conventional Commits)](https://www.conventionalcommits.org/zh-hant/v1.0.0/)是一套標準化的 git 提交訊息格式，讓提交訊息具備「人類可讀」與「機器可解析」的結構。一方面能提升團隊協作、一致性，另一方面也能驅動自動化工具，如自動生成 changelog、SemVer 版本判讀與 CI/CD 流程等。

# 格式結構(Syntax)
- type(必填): 代表此次提交的目的，如 feat、fix等。
- scope(可選): 以括號標註影響範圍，例如 feat(api): ...。
- description(必填): 簡潔描述此次提交的變更。
- body(可選): 詳述變更內容、原因等。
- footer(可選): 可用於 BREAKING CHANGE、關閉 issue。

提交訊息一般包含以下三大區段:
```
type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

# 常見提交類型
## 核心類型
### feat
新增功能(feature)。
```
feat: add dark mode toggle

feat(profile): enable avatar upload
```
### fix
修正 bug。
```
fix: prevent crash when email is empty

fix(ui): align button on mobile
```

### BREAKING CHANGE 或 !
不相容的重大變更。
```
feat(api)!: change user ID from string to number

BREAKING CHANGE: User ID field type has changed from string to number. 
Clients must update their schema and related code to handle numeric IDs.
```

## 其他常見類型

### docs
文件變更，如README、註解等。
```
docs: update installation guide

docs(api): add example for /users
```

### style
格式調整，如空白、縮排。
```
style: remove trailing commas

style(lint): enforce ESLint rules
```

### chore
日常維護任務，如.gitignore、更新腳本。
```
chore: update .gitignore

chore(release): prepare v1.5.0
```

### ci
CI/CD 流程設定，如GitHub Actions、pipeline等。
```
ci: add caching to build job

ci(circleci): enable docker layer caching
```

### build
建置或套件變更，如webpack、package.json、Dockerfile。
```
build: upgrade to Webpack 5

build(deps): pin lodash to v4.17.21
```

### refactor
重構程式碼，不影響功能行為，如拆分函數、模組化、命名優化。
```
refactor: simplify auth middleware

refactor(utils): replace with native methods
```

### perf
優化效能，如減少執行時間、降低記憶體使用。
```
perf: cache database queries

perf(list): virtualize long list rendering
```

### test
新增或修改測試，如單元測試、E2E、測試修復。
```
test: add coverage for login flow

test(e2e): fix flaky checkout test
```

# 判斷流程圖
![conventional-commit-type-mermaid](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fconventional-commit-type%2Fconventional-commit-type-mermaid.png?alt=media&token=52293308-b2d5-4016-934a-e6b682bd30ff)

# 實務建議

1. 標註重大變更: 遇到不相容修改，使用BREAKING CHANGE 或 !。
2. 一次提交只做一件事: 每個提交聚焦單一變更，方便日後追蹤與回溯。
3. 合理使用範圍(scope): 範圍標註不必過細，重點是保持易讀。

# 用錯提交類型該怎麼辦?

## 修改最後一次提交訊息
```
# 1) 直接覆寫訊息
git commit --amend -m "fix: FILTERED_ENTITIES"

# 2)(若已推到遠端)安全強推
git push --force-with-lease
```

## 修改前幾次提交訊息
```
# 1) 設定git編輯器
git config --global core.editor "code --wait"

# 2) 以最近3筆為例
git rebase -i HEAD~3

# 3) 編輯訊息
# 把目標那行的`pick`改成`reword`(或r)
# 會再開一次編輯器讓你改成正確內容

# 4) 繼續完成rebase
git rebase --continue
(git rebase --skip)

# 5) (若已推到遠端)安全強推
git push --force-with-lease

# 6) 放棄本次rebase
git rebase --abort
```

# 結論

掌握慣例式提交能更好地運用 GitHub Copilot 的自動提交功能，讓未來的你感謝現在的自己 🥹，還能有效提升團隊的開發效率。熟悉這些規範後，就能在 AI 生成的基礎上做出更精準的調整，讓每個提交都能清楚傳達變更的意圖囉。


