---
title: 學物件導向新手村
date: 2025-08-28 11:11:11
updated: 2025-08-28 11:11:11
tags:
  - OOP
categories: OOP
comments: true
---

還在被物件導向搞得頭昏腦脹嗎？🤯
「什麼是類別？什麼是物件？」 

<!-- more -->

<style>
.callout {
  border: 1px solid #eee;
  padding: 1em;
  background: #eef7fa;
  margin: 1em 0;
}
.callout-icon {
  font-weight: bold;
  margin-right: 8px;
}

/* 僅壓縮 compact-list 區塊內「數字項 + 子彈點」的縱向間距 */
.compact-list li > p { margin-bottom: 0.25em; }

/* 讓 ol/ul 本身上下距離更緊湊一些（只在此區塊） */
.compact-list ol,
.compact-list ul { margin-top: 0.3em; margin-bottom: 0.5em; }

/* 每個數字項目之間再收一點 */
.compact-list ol > li { margin-bottom: 0.4em; }
</style>

別擔心！這篇我想用最直覺的方式，來幫助你理解物件導向程式設計(Object-Oriented Programming，簡稱OOP) 的核心概念，把 OOP 變成一款「狗狗冒險遊戲」🎮，讓你輕鬆搞懂類別、物件、繼承、封裝、多型。準備好跟我一起進入「狗狗冒險遊戲」了嗎? 

# 為什麼要用 OOP?
想像你要管理上萬「狗狗」角色...

## ❌ 不用 OOP 的災難
每隻狗狗都要各自定義變數與函式，程式碼超難維護。
```
# 記住每隻狗狗的所有資料
dog1_name = "Husky"
dog1_color = "黑白色"
dog1_weight = 25

dog2_name = "Golden"
dog2_color = "金色"
dog2_weight = 30

# 想讓狗狗叫，要寫很多重複函數
def dog1_bark():
  print(f"{dog1_name} 正在汪汪叫！")
def dog2_bark():
  print(f"{dog2_name} 正在汪汪叫！")

dog1_bark() # Husky 正在汪汪叫！
dog2_bark() # Golden 正在汪汪叫！

# 當有10000隻狗時... 😱
```

## ⭕ 用 OOP 的好處
只需要寫一次「狗狗角色模板」，就能生出無數角色。

```
# 只需要統一寫一次狗狗角色模板
class Dog:
    def __init__(self, name, color, weight):
        self.name = name
        self.color = color
        self.weight = weight
   
    def bark(self):
        print(f"{self.name} 正在汪汪叫！")

# 輕鬆創造和管理多隻狗狗
dogs = [
    Dog("Husky", "黑白色", 25),
    Dog("Golden", "金色", 30),
]

# 讓所有狗狗一起叫
for dog in dogs:
    dog.bark()
# Husky 正在汪汪叫！
# Golden 正在汪汪叫！
```

# 什麼是類別?
> **類別(Class)就是狗狗角色模板。**

想像你正在設計一款「狗狗冒險遊戲」，正在定義「狗狗」這個角色，而你會怎麼定義?
**有哪些基礎屬性?**
→ 屬性(Attributes)
→ 等級、血量、攻擊力、防禦力
**能做哪些動作?**
→ 方法(Methods)
→ 攻擊、升級、使用技能
**角色的初始設定?**
→ 建構子(Constructor)
→ 等級 1、血量 100、基礎裝備

```
class Dog:
    def __init__(self, name): # 建構子
        # 屬性
        self.name = name # 狗狗名稱
        self.level = 1 # 初始等級
        self.hp = 100 # 初始血量
        self.exp = 0 # 初始經驗值
   
    def bark(self): # 基礎技能
        print(f"{self.name} 汪汪叫！")
   
    def level_up(self): # 升級機制
        self.level += 1
        self.hp += 20
        print(f"{self.name} 升級了！現在是 {self.level} 級！")
```

# 什麼是建構子?
> **建構子(Constructor)就是設定角色初始能力值。**
> 
```
class Dog:
   def __init__(self, name): # 建構子
       # 屬性
       self.name = name # 狗狗名稱
       self.level = 1 # 初始等級
       self.hp = 100 # 初始血量
       self.exp = 0 # 初始經驗值

husky = Dog("雪球")
print(husky.level) # 1
print(husky.hp)    # 100
```

# 什麼是物件?
> **物件(Object)就是玩家的狗狗角色。**

當狗狗角色模板設計完成後，玩家就可以根據狗狗角色模板，實際創建自己在遊戲中的狗狗角色！比如其中一隻叫做 Husky，而它有自己的等級、血量和經驗值等。
```
# 根據Dog類別創造具體的狗狗物件
husky = Dog("Husky")
golden = Dog("Golden")
buddy = Dog("Buddy")

# 每隻狗狗都有自己的特徵
print(f"{husky.name} 等級：{husky.level}") # Husky 等級：1
print(f"{golden.name} 血量：{golden.hp}") # Golden 血量：100

# 每隻狗狗都可以執行相同的行為
husky.bark() # Husky 汪汪叫！
buddy.level_up() # Buddy 升級了！現在是 2 級！
```

# 簡單記憶法
<div class="callout">
  <span class="callout-icon">💡</span>
狗狗角色模板🎨 → 狗狗初始能力值⭐ → 玩家的狗狗角色🐶<br>
</div>

<div class="callout">
<span class="callout-icon">1️⃣</span>狗狗角色模板 = 類別(Class)<br>
<span class="callout-icon">2️⃣</span>狗狗初始能力值 = 建構子(Constructor)<br>
<span class="callout-icon">3️⃣</span>玩家的狗狗角色 = 物件(Object)
</div>

<div class="compact-list">

1. 類別(Class)
   - 狗狗角色模板
   - 定義狗狗角色「有」哪些屬性和技能
   - 只是設計藍圖，不是真的角色

2. 建構子(Constructor)
   - 狗狗初始能力值
   - 設定狗狗的基礎能力數值

3. 物件(Object)
   - 玩家的狗狗角色
   - 根據角色模板所建立的實際玩家的角色
   - 每隻狗都有獨立的屬性與技能特色
</div>

# 進階概念預告
掌握了類別和物件後，下篇會繼續解鎖以下概念:
- 繼承(Inheritance) → 哈士奇、黃金獵犬如何繼承狗狗的基礎能力?
- 封裝(Encapsulation) → 如何防止別人亂改狗狗的屬性?
- 多型(Polymorphism) → 每隻狗狗叫聲都不一樣?

