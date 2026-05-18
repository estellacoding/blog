---
title: LeetCode題解析時間複雜度
date: 2025-09-25 11:11:11
updated: 2025-09-25 11:11:11
tags:
  - Complexity
  - Time Complexity
categories: Complexity
comments: true
---

上週 [這篇](https://estellacoding.github.io/blog/evaluate-algorithm-performance/) 一同理解了為什麼需要複雜度分析之後，本篇我們將一起透過 LeetCode 題目，逐步分析時間複雜度，看看不同複雜度在演算法實戰中的應用情境。

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
</style>

# O(1)

> O(1) is holy. - Hamid Tizhoosh

以LeetCode的 [231.Power of Two](https://leetcode.com/problems/power-of-two/description/) 來說明。

```
class Solution(object):
    def isPowerOfTwo(self, n):
        """
        :type n: int
        :rtype: bool
        """
        return n>0 and n&(n-1)==0

print(Solution().isPowerOfTwo(16)) #True
print(Solution().isPowerOfTwo(3))  #False
```

<div class="callout">
  <span class="callout-icon">💡</span>
<strong>2的n次方數字在二進位時只會有一個1</strong><br>
14 → 01110₂<br>
15 → 01111₂<br>
2<sup>4</sup> = 16 → 10000₂
</div>

## 分析複雜度
### 時間複雜度是 O(1)
- n>0 #一次比較 → O(1)
- (n-1) #一次減法 → O(1)
- n&(n-1)==0 #一次位元運算 → O(1)
- 所以時間複雜度 = O(1) + O(1) + O(1) = O(1)

### 空間複雜度是 O(1)
- 只用了幾個變數: `(n-1)`、`n&(n-1)`、布林值
- 沒有使用與輸入規模 n 成長相關的額外資料空間
- 所以空間複雜度 = O(1)

# O(log n)
以LeetCode的 [69.Sqrt(x)](https://leetcode.com/problems/sqrtx/description/) 來說明。

```
class Solution(object):
    def mySqrt(self, x):
        if x < 2:
            return x
       
        left, right = 1, x // 2
        while left <= right:
            mid = (left + right) // 2
            square = mid * mid
           
            if square == x:
                return mid
            elif square < x:
                left = mid + 1
            else:
                right = mid - 1
       
        return right

print(Solution().mySqrt(8)) #2
print(Solution().mySqrt(4)) #2
print(Solution().mySqrt(1)) #1
```

## 分析複雜度
### 時間複雜度是 O(log n)
- 每次把搜尋區間 [left, right] 對半縮小
- 初始搜尋區間: [1, x//2]，大小約為 x/2
- 第 1 次迭代後: 區間縮小一半 → x/4
- 第 2 次迭代後: 區間再縮小一半 → x/8
- 第 k 次迭代後: x/2<sup>(k+1)</sup> ≈ 1 → 2<sup>(k+1)</sup> = x → k = log₂(x)-1 → ≈ 需要 log₂(x) 次迭代
- 所以時間複雜度 = O(log n)

### 空間複雜度是 O(1)
- 只用了幾個變數: `left`, `right`, `mid`
- 沒有使用與輸入規模 n 成長相關的額外資料空間
- 所以空間複雜度 = O(1)

# O(n)
以LeetCode的 [1.Two Sum](https://leetcode.com/problems/two-sum/description/) 來說明。

```
class Solution(object):
    def twoSum(self, nums, target):
        """
        :type nums: List[int]
        :type target: int
        :rtype: List[int]
        """
        d = {}
        for i,v in enumerate(nums):
            diff=target-v
            if diff in d:
                return [d[diff],i]
            d[v]=i

nums = [2,7,11,15]
target = 9
Solution().twoSum(nums, target) #[0, 1]
```

## 分析複雜度
### 時間複雜度是 O(n)
- 迴圈跑 n 次 `(n = len(nums))` → O(n)
- 每次迭代內的操作:
  - 計算 `diff = target - v` → O(1)
  - 查詢 `diff in d` → O(1)
  - 插入 `d[v] = i` → O(1)
- 所以時間複雜度 = O(n)

### 空間複雜度是 O(n)
- 只用了幾個變數: `i`、`v`、`diff`
- 使用了一個字典 d → O(n)
- 所以空間複雜度 = O(n)

# O(n²)
以LeetCode的 [1.Two Sum](https://leetcode.com/problems/two-sum/description/) 來說明。

```
class Solution(object):
    def twoSum(self, nums, target):
        """
        :type nums: List[int]
        :type target: int
        :rtype: List[int]
        """
        for i in range(len(nums)):
          for j in range(i+1, len(nums)):
            if nums[i]+nums[j]==target:
              return [i,j]

nums = [2,7,11,15]
target = 9
Solution().twoSum(nums, target) #[0, 1]
```

## 分析複雜度
### 時間複雜度是 O(n²)
- 當 i=0 → j 從 1 到 n-1，要跑 **n-1 次**
- 當 i=1 → j 從 2 到 n-1，要跑 **n-2 次**
…
- 當 i=n-2 → j 只剩 n-1，要跑 **1 次**
- 當 i=n-1 → j 沒有值，要跑 **0 次**
- 總執行次數 = (n-1) + (n-2) + … + 1 = n(n-1)/2 ≈ O(n²)
- 所以時間複雜度 = O(n²)

### 空間複雜度是 O(1)
- 只用了幾個變數: `i`、`j` 和`list [i, j]`
- 沒有使用與輸入規模 n 成長相關的額外資料空間
- 所以空間複雜度 = O(1)

# 進階概念預告🔜
在理解了時間複雜度之後，下一篇我們將一起解鎖:
- 透過 LeetCode 題目，逐步分析空間複雜度
- 看看不同複雜度在演算法實戰中的應用情境

準備好再來點 LeetCode 了嗎?


<div style="max-width:520px; margin:2em auto; padding:1.5em; border:1px solid #ddd; border-radius:10px; background:#fafafa; text-align:center; box-shadow:0 2px 6px rgba(0,0,0,0.08);">
  <p style="font-size:1.1em; margin-bottom:1em;">👇 點此免費訂閱，不錯過任何更新</p>
  <iframe src="https://stellacoding.substack.com/embed" 
          width="480" height="320" 
          style="border:1px solid #EEE; background:white; border-radius:6px;" 
          frameborder="0" scrolling="no"></iframe>
</div>