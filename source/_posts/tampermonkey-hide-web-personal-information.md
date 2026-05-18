---
title: 用篡改猴隱藏網頁中隱私資訊
date: 2025-04-14 11:11:11
updated: 2025-04-14 11:11:11
tags:
  - Tampermonkey
  - JavaScript
  - GitHub
categories: JavaScript
comments: true
---

本篇分享如何用篡改猴來隱藏網頁中的隱私資訊。

<!-- more -->

# 安裝擴充套件
前往安裝 [篡改猴](https://chromewebstore.google.com/detail/%E7%AF%A1%E6%94%B9%E7%8C%B4/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=zh-TW)。

# 功能說明
隱藏 GitHub 的 [付款資訊](https://github.com/settings/billing/payment_information) 頁的個人資訊。

- 頁面載入後自動把付款資訊區塊模糊。
- 點一下這個區塊就會解除模糊。
- 再點一下這個區塊就會重新模糊。
- 滑鼠會變成「可點擊」的樣式。

![tampermonkey-hide-web-info-script](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Ftampermonkey-hide-web-personal-information%2Ftampermonkey-hide-web-info-script.jpg?alt=media&token=0104d410-1ce4-40d5-b6fe-f9faaf09c931)

# 完整程式碼
將以下程式碼貼到篡改猴的腳本中，並儲存與啟用即可。
```
// ==UserScript==
// @name         GitHub Payment Info Blur Toggle
// @namespace    http://tampermonkey.net/
// @version      2025-04-14
// @description  Blur GitHub payment info and toggle by click
// @author       Stella
// @match        https://github.com/settings/billing/payment_information
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const selectors = [
        '.js-user-personal-profile-summary',
    ];

    // 插入模糊樣式
    const style = document.createElement('style');
    style.innerHTML = `
        .tm-blur {
            filter: blur(5px);
            transition: filter 0.3s ease-in-out;
            cursor: pointer;
        }
        .tm-blur.revealed {
            filter: none;
        }
    `;
    document.head.appendChild(style);

    // 套用模糊 + 點擊事件
    function applyBlurToggle() {
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.classList.add('tm-blur');
                el.addEventListener('click', () => {
                    el.classList.toggle('revealed');
                });
            });
        });
    }

    // 一進入頁面立即處理
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyBlurToggle);
    } else {
        applyBlurToggle();
    }
})();
```
