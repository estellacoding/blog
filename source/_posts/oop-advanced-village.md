---
title: 學物件導向進階篇
date: 2025-09-04 11:11:11
updated: 2025-09-04 11:11:11
tags:
  - OOP
categories: OOP
comments: true
---

還記得 [上篇](https://estellacoding.github.io/blog/oop-newbie-village/) 我們用「用狗狗冒險遊戲🐶」理解類別和物件嗎?

- 類別(Class) = 狗狗角色模板
- 建構子(Constructor) = 狗狗初始能力值
- 物件(Object) = 玩家的狗狗角色
  
來到進階篇，我們要解鎖 OOP 的四大核心機制: 繼承、封裝、多型、抽象。

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


# 什麼是繼承?
> **繼承(Inheritance)就是狗狗專屬技能。**
> 
所有狗狗玩家都繼承自「狗狗角色模板」的基礎能力，再加上自己專屬特色技能。

```
# 狗狗角色模板的基礎能力
class Dog:
   def __init__(self, name):
       self.name = name
       self.level = 1
       self.hp = 100
       self.exp = 0
  
   def bark(self):
       print(f"{self.name} 汪汪叫！")
  
   def level_up(self):
       self.level += 1
       self.hp += 20

# 哈士奇(繼承基礎+哈士奇專精能力)
class Husky(Dog):
   def __init__(self, name):
       super().__init__(name)  # 繼承基礎屬性
       self.endurance = 25     # 哈士奇專屬:耐力
       self.cold_resistance = 20
  
   def howl(self): # 哈士奇專屬
       print(f"{self.name} 發出嗷嗚嗚！耐力提升！")

# 黃金獵犬(繼承基礎+黃金獵犬專精能力)
class Golden(Dog):
   def __init__(self, name):
       super().__init__(name)
       self.friendliness = 30 # 黃金獵犬專屬:親和力
       self.intelligence = 25
  
   def fetch(self): # 黃金獵犬專屬
       print(f"{self.name} 快樂地撿球回來！智力提升！")

# 柴犬(繼承基礎+柴犬專精能力)
class Shiba(Dog):
   def __init__(self, name):
       super().__init__(name)
       self.agility = 20 # 柴犬專屬:敏捷
       self.independence = 15
  
   def spin_attack(self): # 柴犬專屬
       print(f"{self.name} 施展柴犬旋風攻擊！敏捷提升！")

# 創建不同品種的狗狗
husky = Husky("雪球")
golden = Golden("金金")
shiba = Shiba("小柴")

# 每隻狗都有基礎能力(從Dog繼承)
husky.bark()      # 雪球 汪汪叫！
golden.level_up() # 金金 升級了！現在是 2 級！

# 每個玩家狗狗也各有專屬能力
husky.howl()          # 雪球 發出嗷嗚嗚！耐力提升！
golden.fetch()        # 金金 快樂地撿球回來！智力提升！
shiba.spin_attack()   # 小柴 施展柴犬旋風攻擊！敏捷提升！
```

# 什麼是封裝?
> **封裝(Encapsulation)就是狗狗的機密屬性。**

狗狗的有些資訊是需要被保護的重要資料，不是所有人都能看到或修改的，例如：耐力、健康值等，只能透過安全方式來操作。

## 3種封裝方式
1. `public`: 公開屬性，任何地方都能存取與修改，例如`name`,`hp`。
2. `_protected`: 約定受保護屬性，代表「內部使用為主」，雖然外部仍能存取，但建議不要直接修改，例如`_level`。
3. `__private`: 完全私有屬性，雙底線避免外部直接存取，正確做法是透過安全方法來修改，例如`__stamina`、`__health`。

```
class Dog:
   def __init__(self, name):
       self.name = name
       self._level = 1 # 約定受保護屬性(Protected)
       self.hp = 100
       self.__stamina = 50    # 私有屬性(Private):耐力
       self.__health = 100    # 私有屬性(Private):健康值
  
   # 公開方法:查看血量
   def show_status(self):
       print(f"{self.name} Lv.{self._level} - HP:{self.hp}")
  
   # 安全方法:餵食可以恢復耐力
   def feed(self, food):
       if food == "肉骨頭":
           self.__stamina += 10
           print(f"{self.name} 吃了肉骨頭！耐力回復 +10")
       else:
           print(f"{self.name} 不喜歡 {food}...")
  
   # 安全方法:獸醫檢查才能修改健康值
   def vet_check(self, new_health, is_vet=False):
       if is_vet:
           self.__health = new_health
           print(f"🐾 獸醫更新 {self.name} 的健康值為 {self.__health}")
       else:
           print("❌ 只有獸醫能修改健康值！")


husky = Dog("雪球")

# 1.Public:可直接存取
print(husky.name) # 雪球
print(husky.hp) # 100

# 2. Protected:可存取但不建議
print(husky._level) # 1

# 3-1. Private:不能直接存取
# print(husky.__stamina) # AttributeError
# 3-2. Private:強行存取
print(husky._Dog__stamina) # 50

# 4. 建議用安全方法操作
husky.show_status() # 雪球 Lv.1 - HP:100
husky.feed("肉骨頭") # 雪球 吃了肉骨頭！耐力回復 +10
husky.vet_check(120, is_vet=True) # 🐾 獸醫更新 雪球 的健康值為 120
```

# 什麼是多型?

> **多型(Polymorphism)就是狗狗的獨特風格。**

所有狗狗都會「叫()」，但每種狗狗表現方式不同。

```
class Dog:
   def __init__(self, name):
       self.name = name
       self.hp = 100
   def make_sound(self):  # 基礎叫聲
       print(f"{self.name}: 汪汪!")

# 不同品種的獨特叫聲
class Husky(Dog):
   def make_sound(self):
       print(f"{self.name}: Awoooooo!")

class Golden(Dog):
   def make_sound(self):
       print(f"{self.name}: 汪！汪！")

class Poodle(Dog):
   def make_sound(self):
       print(f"{self.name}: 汪汪～")

# 建立玩家的狗狗角色
husky = Husky("雪球")
golden = Golden("金金")
poodle = Poodle("捲捲")

# 呼叫玩家的狗狗叫聲
husky.make_sound()   # 雪球: Awoooooo!
golden.make_sound()  # 金金: 汪！汪！
poodle.make_sound()  # 捲捲: 汪汪～
```

# 什麼是抽象?

> **抽象(Abstraction)就是狗狗的技能規範。**

狗狗角色模板只定義「要做什麼」，不強制寫「怎麼做」，留給玩家狗狗自行實作。

```
from abc import ABC, abstractmethod

# 規範所有狗狗都要有make_sound()
class AbstractDog(ABC):
   def __init__(self, name):
       self.name = name

   @abstractmethod
   def make_sound(self): # 只定義介面不實作
       pass

class Husky(AbstractDog):
   def make_sound(self):
       print(f"{self.name}: Awoooooo!")

class Golden(AbstractDog):
   def make_sound(self):
       print(f"{self.name}: 汪！汪！")

class Poodle(AbstractDog):
   def make_sound(self):
       print(f"{self.name}: 汪汪～")

# 建立玩家的狗狗角色
husky = Husky("雪球")
golden = Golden("金金")
poodle = Poodle("捲捲")

# 呼叫玩家的狗狗叫聲
husky.make_sound()   # 雪球: Awoooooo!
golden.make_sound()  # 金金: 汪！汪！
poodle.make_sound()  # 捲捲: 汪汪～
```

# 總結

在學物件導向系列中，我們學會了:
- 🎨 用「類別」設計角色模板
- ⭐ 用「建構子」設定初始能力值
- 🐶 用「物件」創造無數獨立角色
- 🧬 用「繼承」擴展角色技能
- 🔒 用「封裝」保護機密屬性
- 🎭 用「多型」創造豐富角色行為
- 🧩 用「抽象」規範角色技能

![oop-advanced-village-concept-table](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Foop-advanced-village%2Foop-advanced-village-concept-table.png?alt=media&token=926150a8-5fbb-4f07-add6-9dd021f22f62)