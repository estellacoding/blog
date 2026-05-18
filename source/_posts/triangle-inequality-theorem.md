---
title: 三角形成立條件
date: 2025-09-11 11:11:11
updated: 2025-09-11 11:11:11
tags:
  - Math
categories: Math
comments: true
---

你有想過三角形為什麼是「兩邊和大於第三邊」嗎?

<!-- more -->

<style>
/* 外層容器 */
.svg-wrapper{
  display: grid;
  margin: 1.5rem 0;
}

/* 內容欄置中，寬度不超過 1080px */
.svg-wrapper > svg{
  width: min(100%, 1080px);
  height: auto;
  justify-self: center; /* 置中 */
}

/* 若想某一張要全寬滿版，給外層加 full-bleed */
.svg-wrapper.full-bleed > svg{
  width: 100%;
  max-width: none;
}

/* 有些主題對 svg 沒有置中規則，補一條保險 */
.post-body svg{
  display: block;
}
</style>

在幾何學中，並非任意三條線段都能組成一個三角形。

要構成一個真正的三角形，必須滿足一個基本條件: 
> 任意兩邊之和必須大於第三邊。

而這就是著名的 「三角形不等式定理(Triangle Inequality Theorem)」。

# 兩點之間直線最短
在平面幾何中，給定兩點 A 和 C:
- A 和 C 之間的最短距離是 AC。
- 若從 A 出發，先到另一點 B ，再抵達 C ，則路徑長度為 AB+BC。
- 因此我們可以得知 AC ≤ AB + BC

這就是「兩點之間直線最短」原則。

{% raw %}
<div class="svg-wrapper">
  <svg viewBox="0 0 600 200" preserveAspectRatio="xMidYMid meet">
    <defs>
      <pattern id="grid1" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f0f0f0" stroke-width="1"/>
      </pattern>
    </defs>

    <rect width="100%" height="100%" fill="url(#grid1)"/>

    <g transform="translate(50,0)">
      <text x="50"  y="175" text-anchor="middle" fill="#9c27b0" font-weight="bold" font-size="16">A</text>
      <text x="300" y="40"  text-anchor="middle" fill="#ff9800" font-weight="bold" font-size="16">B</text>
      <text x="500" y="175" text-anchor="middle" fill="#4caf50" font-weight="bold" font-size="16">C</text>

      <line x1="50"  y1="150" x2="500" y2="150" stroke="#e91e63" stroke-width="6" stroke-dasharray="8,4"/>
      <text x="275" y="140" text-anchor="middle" fill="#e91e63" font-weight="bold" font-size="14">直線 AC (最短)</text>

      <line x1="50"  y1="150" x2="500" y2="150" stroke="#e91e63" stroke-width="6" stroke-dasharray="8,4"/>
      <line x1="50"  y1="150" x2="500" y2="150" stroke="#e91e63" stroke-width="6" stroke-dasharray="8,4"/>
      <line x1="50"  y1="150" x2="300" y2="50"  stroke="#2196f3" stroke-width="6"/>
      <line x1="300" y1="50"  x2="500" y2="150" stroke="#2196f3" stroke-width="6"/>

      <circle cx="50" cy="150" r="8" fill="#9c27b0"/>
      <circle cx="300" cy="50"  r="8" fill="#ff9800"/>
      <circle cx="500" cy="150" r="8" fill="#4caf50"/>

      <text x="175" y="90"  text-anchor="middle" fill="#2196f3" font-weight="bold" font-size="14">AB</text>
      <text x="400" y="90"  text-anchor="middle" fill="#2196f3" font-weight="bold" font-size="14">BC</text>
      <text x="275" y="25"  text-anchor="middle" fill="#2196f3" font-weight="bold" font-size="14">AB + BC (較長)</text>
    </g>
  </svg>
</div>
{% endraw %}

# 三角形不等式
考慮三角形 △ABC，三邊長分別是:
```
a = AB, b = BC, c = AC
```

根據「兩點最短路徑」原理，我們可以得出三個不等式:
```
a + b > c → AB + BC > AC
b + c > a → BC + AC > AB
a + c > b → AB + AC > BC
```
這就是完整的三角形不等式，換句話說，「任意兩邊之和 > 第三邊」。

# 為什麼不是「≤」?
## 小於的情況
- 若 a + b < c、b + c < a、a + c < b
- 兩邊加起來比第三邊短，怎麼都連不起來，自然無法形成封閉圖形。

> 範例: a=3, b=4, c=10 → a+b=7 < 10

{% raw %}
<div class="svg-wrapper">
  <svg viewBox="0 0 500 250" preserveAspectRatio="xMidYMid meet">
    <defs>
      <pattern id="grid2" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f0f0f0" stroke-width="1"/>
      </pattern>
    </defs>

    <rect width="100%" height="100%" fill="url(#grid2)"/>

    <g transform="translate(50,0)">
      <line x1="50" y1="150" x2="350" y2="150" stroke="#ff6b6b" stroke-width="6" stroke-linecap="round"/>
      <text x="200" y="175" text-anchor="middle" fill="#ff6b6b" font-weight="bold" font-size="16">c = 10</text>

      <line x1="50" y1="150" x2="110" y2="90" stroke="#4ecdc4" stroke-width="6" stroke-linecap="round"/>
      <text x="60" y="80" text-anchor="middle" fill="#4ecdc4" font-weight="bold" font-size="16">a = 3</text>

      <line x1="350" y1="150" x2="290" y2="90" stroke="#45b7b8" stroke-width="6" stroke-linecap="round"/>
      <text x="340" y="80" text-anchor="middle" fill="#45b7b8" font-weight="bold" font-size="16">b = 4</text>

      <line x1="110" y1="90" x2="290" y2="90" stroke="#ff6b6b" stroke-width="6" stroke-dasharray="8,4"/>
      <text x="201" y="80" text-anchor="middle" fill="#ff6b6b" font-weight="bold" font-size="14">空隙，無法連接！</text>

      <circle cx="50" cy="150" r="8" fill="#333"/>
      <circle cx="350" cy="150" r="8" fill="#333"/>
      <circle cx="110" cy="90" r="8" fill="#4ecdc4"/>
      <circle cx="290" cy="90" r="8" fill="#45b7b8"/>
    </g>
  </svg>
</div>
{% endraw %}


## 等於的情況
- 若 a + b = c、b + c = a、a + c = b
- 三個點會落在同一直線上，三角形退化成一條線段，面積 = 0，不算三角形。

> 範例: a=4, b=6, c=10 → a+b=10 = 10

{% raw %}
<div class="svg-wrapper">
  <svg viewBox="0 0 500 250" preserveAspectRatio="xMidYMid meet">
    <defs>
      <pattern id="grid3" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f0f0f0" stroke-width="1"/>
      </pattern>
    </defs>

    <rect width="100%" height="100%" fill="url(#grid3)"/>

    <g transform="translate(50,0)">
      <!-- 左邊線段 A -->
      <line x1="10" y1="150" x2="200" y2="150"
            stroke="#4ecdc4" stroke-width="8" stroke-linecap="round"/>

      <!-- 右邊線段 B -->
      <line x1="200" y1="150" x2="400" y2="150"
            stroke="#45b7b8" stroke-width="8" stroke-linecap="round"/>

      <!-- 端點 -->
      <circle cx="10"  cy="150" r="10" fill="#333"/>
      <circle cx="400" cy="150" r="10" fill="#333"/>

      <!-- 中點 -->
      <circle cx="200" cy="150" r="10" fill="#ffa726"/>

      <!-- 文字 -->
      <text x="100" y="120" text-anchor="middle" fill="#4ecdc4" font-weight="bold" font-size="22">a = 4</text>
      <text x="300" y="120" text-anchor="middle" fill="#45b7b8" font-weight="bold" font-size="22">b = 6</text>
      <text x="200" y="185" text-anchor="middle" fill="#ff6b6b" font-weight="bold" font-size="22">c = 10</text>
      <text x="200" y="215" text-anchor="middle" fill="#ffa726" font-weight="bold" font-size="16">三點共線，面積 = 0！</text>
    </g>
  </svg>
</div>
{% endraw %}


## 大於的情況
- 若 a + b > c、b + c > a、a + c > b
- 三邊才能首尾相接，形成一個真正有面積的三角形。

> 範例: a=6, b=8, c=10 → a+b=14 > 10

{% raw %}
<div class="svg-wrapper">
  <svg viewBox="0 0 540 320" preserveAspectRatio="xMidYMid meet">
    <defs>
      <pattern id="grid4" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f0f0f0" stroke-width="1"/>
      </pattern>
    </defs>

    <!-- 格線滿整個 viewBox -->
    <rect width="100%" height="100%" fill="url(#grid4)"/>

    <!-- 內容整體右移，讓圖在視窗中置中顯示 -->
    <g transform="translate(70,0)">
      <!-- 三角形填色（淡綠） -->
      <polygon points="20,260 380,260 200,70" fill="rgba(102,187,106,0.18)" />

      <!-- 三邊 -->
      <line x1="20"  y1="260" x2="380" y2="260" stroke="#ff6b6b" stroke-width="6" stroke-linecap="round"/>
      <line x1="20"  y1="260" x2="200" y2="70"  stroke="#2fb2ab" stroke-width="6" stroke-linecap="round"/>
      <line x1="380" y1="260" x2="200" y2="70"  stroke="#2fb2ab" stroke-width="6" stroke-linecap="round"/>

      <!-- 端點 -->
      <circle cx="20"  cy="260" r="8" fill="#333"/>
      <circle cx="380" cy="260" r="8" fill="#333"/>
      <circle cx="200" cy="70"  r="8" fill="#333"/>

      <!-- 標籤 -->
      <text x="30" y="145" text-anchor="middle" fill="#2fb2ab" font-weight="700" font-size="28">a = 6</text>
      <text x="365" y="145" text-anchor="middle" fill="#2fb2ab" font-weight="700" font-size="28">b = 8</text>
      <text x="200" y="298" text-anchor="middle" fill="#ff6b6b" font-weight="700" font-size="28">c = 10</text>
    </g>
  </svg>
</div>
{% endraw %}


# 總結
三角形成立的必要條件是:
- 兩邊和 < 第三邊 → 無法封閉，無法形成三角形。
- 兩邊和 = 第三邊 → 退化為直線，面積 = 0。
- 兩邊和 > 第三邊 → 能形成真正的三角形。

也因此，三角形不等式是「任意兩邊之和必須大於第三邊」。

{% raw %}
<div class="triangle-interactive" style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; border: 2px solid #e9ecef;">
  <h2 style="text-align: center; color: #495057; margin-bottom: 20px;">互動實驗</h2>
  <p style="text-align: center; color: #495057; margin-bottom: 20px;">調整邊長看是否能形成三角形?</p>

  <div class="controls" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
    <div class="slider-container" style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
        <span style="font-weight: 600;">邊 a (AB)</span>
        <span id="valueA" style="font-weight: bold; color: #ff6b6b;">10</span>
      </div>
      <input type="range" id="sliderA" min="1" max="20" value="10" style="width: 100%; height: 6px; background: linear-gradient(to right, #ff6b6b, #ff6b6b); border-radius: 3px; outline: none; -webkit-appearance: none;">
    </div>
    <div class="slider-container" style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
        <span style="font-weight: 600;">邊 b (BC)</span>
        <span id="valueB" style="font-weight: bold; color: #4ecdc4;">3</span>
      </div>
      <input type="range" id="sliderB" min="1" max="20" value="3" style="width: 100%; height: 6px; background: linear-gradient(to right, #4ecdc4, #4ecdc4); border-radius: 3px; outline: none; -webkit-appearance: none;">
    </div>
    <div class="slider-container" style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
        <span style="font-weight: 600;">邊 c (AC)</span>
        <span id="valueC" style="font-weight: bold; color: #45b7b8;">4</span>
      </div>
      <input type="range" id="sliderC" min="1" max="20" value="4" style="width: 100%; height: 6px; background: linear-gradient(to right, #45b7b8, #45b7b8); border-radius: 3px; outline: none; -webkit-appearance: none;">
    </div>
  </div>
  
  <div id="resultDisplay" style="background: white; padding: 15px; border-radius: 8px; text-align: center; font-weight: 600; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-bottom: 20px;">
    <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: #ff6b6b; margin-right: 8px;"></span>
    b + c = 7 < a = 10 → 無法形成三角形
  </div>

  <style>
    /* WebKit browsers (Chrome, Safari) */
    input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #4ecdc4;
      cursor: pointer;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
      transition: all 0.3s;
    }
    
    input[type="range"]::-webkit-slider-thumb:hover {
      background: #45b7b8;
      transform: scale(1.1);
    }
    
    /* Firefox */
    input[type="range"]::-moz-range-thumb {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #4ecdc4;
      cursor: pointer;
      border: none;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    }
    
    /* 響應式設計 */
    @media (max-width: 768px) {
      .controls {
        grid-template-columns: 1fr !important;
      }
    }

  .triangle-interactive h2{
    border: none !important;        /* 有些主題用 border-bottom 畫線 */
    box-shadow: none !important;    /* 有些主題用陰影當分隔 */
    padding-bottom: 0 !important;
    margin: 0 0 8px !important;     /* 縮小與下一行的距離 */
  }

  /* 有些主題用偽元素畫線 */
  .triangle-interactive h2::after,
  .triangle-interactive h2::before{
    content: none !important;
    display: none !important;
    height: 0 !important;
    border: 0 !important;
    background: none !important;
  }

  /* 若主題在 h2 後面插入 <hr> 分隔線 */
  .triangle-interactive h2 + hr{
    display: none !important;
  }

  /* 調整副標與上下距離 */
  .triangle-interactive > p{
    margin: 4px 0 20px !important;  /* 上縮小、下也縮小 */
  }

  </style>

  <script>
    (function() {
      const sliderA = document.getElementById('sliderA');
      const sliderB = document.getElementById('sliderB');
      const sliderC = document.getElementById('sliderC');
      const valueA = document.getElementById('valueA');
      const valueB = document.getElementById('valueB');
      const valueC = document.getElementById('valueC');
      const resultDisplay = document.getElementById('resultDisplay');

      function updateDisplay() {
        const a = parseInt(sliderA.value);
        const b = parseInt(sliderB.value);
        const c = parseInt(sliderC.value);
        
        valueA.textContent = a;
        valueB.textContent = b;
        valueC.textContent = c;
        
        // 檢查三角形不等式：a+b>c, b+c>a, a+c>b
        const condition1 = a + b > c;  // AB + BC > AC
        const condition2 = b + c > a;  // BC + AC > AB
        const condition3 = a + c > b;  // AB + AC > BC
        
        let status, message, indicator;
        
        if (condition1 && condition2 && condition3) {
          status = 'success';
          indicator = '<span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: #66bb6a; margin-right: 8px;"></span>';
          message = `✅ 能形成三角形！<br><small style="font-size: 0.9rem; color: #666;">a+b=${a+b}>c=${c} ✓, b+c=${b+c}>a=${a} ✓, a+c=${a+c}>b=${b} ✓</small>`;
        } else {
          // 找出不滿足的條件
          let failedConditions = [];
          if (!condition1) {
            if (a + b === c) {
              status = 'degenerate';
              indicator = '<span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: #ffa726; margin-right: 8px;"></span>';
              failedConditions.push(`a+b=${a+b}=c=${c} → 退化為直線`);
            } else {
              status = 'fail';
              indicator = '<span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: #ff6b6b; margin-right: 8px;"></span>';
              failedConditions.push(`a+b=${a+b}<c=${c}`);
            }
          }
          if (!condition2) {
            if (b + c === a) {
              if (status !== 'fail') {
                status = 'degenerate';
                indicator = '<span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: #ffa726; margin-right: 8px;"></span>';
              }
              failedConditions.push(`b+c=${b+c}=a=${a} → 退化為直線`);
            } else {
              status = 'fail';
              indicator = '<span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: #ff6b6b; margin-right: 8px;"></span>';
              failedConditions.push(`b+c=${b+c}<a=${a}`);
            }
          }
          if (!condition3) {
            if (a + c === b) {
              if (status !== 'fail') {
                status = 'degenerate';
                indicator = '<span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: #ffa726; margin-right: 8px;"></span>';
              }
              failedConditions.push(`a+c=${a+c}=b=${b} → 退化為直線`);
            } else {
              status = 'fail';
              indicator = '<span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: #ff6b6b; margin-right: 8px;"></span>';
              failedConditions.push(`a+c=${a+c}<b=${b}`);
            }
          }
          
          const statusText = status === 'fail' ? '❌ 無法形成三角形' : '⚠️ 退化為直線';
          message = `${statusText}<br><small style="font-size: 0.9rem; color: #666;">${failedConditions.join(', ')}</small>`;
        }
        
        resultDisplay.innerHTML = indicator + message;
      }

      sliderA.addEventListener('input', updateDisplay);
      sliderB.addEventListener('input', updateDisplay);
      sliderC.addEventListener('input', updateDisplay);
      
      // 初始化顯示
      updateDisplay();
    })();
  </script>
</div>
{% endraw %}