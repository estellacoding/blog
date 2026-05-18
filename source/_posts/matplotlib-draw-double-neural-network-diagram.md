---
title: 用 Matplotlib 畫出簡單的雙層神經網路
date: 2024-06-26 11:11:11
updated: 2024-07-16 11:11:11
tags:
  - Python
  - Matplotlib
  - Deep Learning
  - Neural Networks
categories: Deep Learning
comments: true
---

Matplotlib 是一個強大的數據可視化工具，不僅可以用來繪製各種圖表，還能用來繪製複雜的結構圖，如神經網路圖。在這篇文章中，我們將展示如何用 Matplotlib 畫出一個簡單的雙層神經網路。
<!-- more -->

![double-layer-neural-network-diagram](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fautoml-dl-introduction%2Fdouble-layer-neural-network-diagramv1.png?alt=media&token=f8f4d274-c5e4-4b2f-9e0e-f5d08fdbfef2)
<div style="margin-top: -15px; font-size: 14px; color: #555; text-align: center; font-style: normal; font-family: 'Arial', sans-serif;">簡單的雙層網路</div>

# 導入所需模組
```
import matplotlib.pyplot as plt
import matplotlib.patches as patches
```

# 定義節點和層
```
input_nodes = ['Input 1', 'Input 2', 'Input 3']
hidden_nodes = ['Hidden 1', 'Hidden 2', 'Hidden 3', 'Hidden 4']
output_nodes = ['Output']
```

# 設定節點位置
使用字典來定義每個節點在圖形中的位置，這樣我們可以準確地在圖上繪製出節點。
```
pos = {
    'Input 1': (0, 3),
    'Input 2': (0, 2),
    'Input 3': (0, 1),
    'Hidden 1': (2, 4),
    'Hidden 2': (2, 3),
    'Hidden 3': (2, 2),
    'Hidden 4': (2, 1),
    'Output': (4, 2.5)
}
```

# 創建圖形和座標軸
使用 Matplotlib 創建一個新的圖形和座標軸，並設定圖形的大小。
```
fig, ax = plt.subplots(figsize=(10, 6))
```

# 繪製節點和連接
## 繪製輸入層節點和連接
```
for node in input_nodes:
    ax.add_patch(plt.Circle(pos[node], 0.1, color='lightblue', ec='black', zorder=3))
    plt.text(pos[node][0] - 0.7, pos[node][1], node, fontsize=12, ha='right', va='center')
    ax.arrow(pos[node][0] - 0.6, pos[node][1], 0.35, 0, head_width=0.05, head_length=0.1, fc='black', ec='black', length_includes_head=True)
```

## 繪製隱藏層節點
```
for node in hidden_nodes:
    ax.add_patch(plt.Circle(pos[node], 0.1, color='lightgreen', ec='black', zorder=3))
```

## 繪製輸出層節點和連接
```
for node in output_nodes:
    ax.add_patch(plt.Circle(pos[node], 0.1, color='lightcoral', ec='black', zorder=3))
    plt.text(pos[node][0] + 0.8, pos[node][1], 'Output', fontsize=12, ha='left', va='center')
    ax.arrow(pos[node][0] + 0.2, pos[node][1], 0.5, 0, head_width=0.05, head_length=0.1, fc='black', ec='black', length_includes_head=True)
```

# 繪製虛線箭頭連接
我們需要在輸入層和隱藏層之間，以及隱藏層和輸出層之間繪製虛線箭頭，以表示節點之間的連接。
```
for input_node in input_nodes:
    for hidden_node in hidden_nodes:
        ax.annotate("", xy=(pos[hidden_node][0], pos[hidden_node][1]), xytext=(pos[input_node][0], pos[input_node][1]),
                    arrowprops=dict(arrowstyle="->", linestyle="--", color='gray'))
```

# 輸入層和隱藏層間權重
```
plt.text(1, 3.7, 'weights', fontsize=10, color="gray", ha='center', va='center', rotation=25)
```

# 隱藏層和輸出層間箭頭
```
for hidden_node in hidden_nodes:
    for output_node in output_nodes:
        ax.annotate("", xy=(pos[output_node][0], pos[output_node][1]), xytext=(pos[hidden_node][0], pos[hidden_node][1]),
                    arrowprops=dict(arrowstyle="->", linestyle="--", color='gray'))
```

# 繪製矩形框和標籤
我們在每個層的周圍添加矩形框並標註層名稱，以便更清晰地展示神經網路的結構。
```
input_rect = patches.Rectangle((-0.5, 0.5), 1, 3, linewidth=1, edgecolor='black', facecolor='none')
hidden_rect = patches.Rectangle((1.5, 0.5), 1, 4, linewidth=1, edgecolor='black', facecolor='none')
output_rect = patches.Rectangle((3.5, 2), 1, 1, linewidth=1, edgecolor='black', facecolor='none')

ax.add_patch(input_rect)
ax.add_patch(hidden_rect)
ax.add_patch(output_rect)

plt.text(-0.05, 3.8, 'Input Layer', fontsize=12, ha='center')
plt.text(2, 4.8, 'Hidden Layer', fontsize=12, ha='center')
plt.text(4.1, 3.3, 'Output Layer', fontsize=12, ha='center')
```

# 設置圖形邊界和外觀
```
ax.set_xlim(-1, 5)
ax.set_ylim(0, 5.5)
ax.set_aspect('equal')
ax.axis('off')
```

# 顯示圖形
```
plt.show()
```

# 完整範例程式碼
```
# 導入所需模組
import matplotlib.pyplot as plt
import matplotlib.patches as patches


# 定義節點和層
input_nodes = ['Input 1', 'Input 2', 'Input 3']
hidden_nodes = ['Hidden 1', 'Hidden 2', 'Hidden 3', 'Hidden 4']
output_nodes = ['Output']


# 設定節點位置
pos = {
    'Input 1': (0, 3),
    'Input 2': (0, 2),
    'Input 3': (0, 1),
    'Hidden 1': (2, 4),
    'Hidden 2': (2, 3),
    'Hidden 3': (2, 2),
    'Hidden 4': (2, 1),
    'Output': (4, 2.5)
}

# 創建圖形和座標軸
fig, ax = plt.subplots(figsize=(10, 6))

# 繪製節點和連接
## 繪製輸入層節點和連接
for node in input_nodes:
    ax.add_patch(plt.Circle(pos[node], 0.1, color='lightblue', ec='black', zorder=3))
    plt.text(pos[node][0] - 0.7, pos[node][1], node, fontsize=12, ha='right', va='center')
    ax.arrow(pos[node][0] - 0.6, pos[node][1], 0.35, 0, head_width=0.05, head_length=0.1, fc='black', ec='black', length_includes_head=True)

## 繪製隱藏層節點
for node in hidden_nodes:
    ax.add_patch(plt.Circle(pos[node], 0.1, color='lightgreen', ec='black', zorder=3))

## 繪製輸出層節點和連接
for node in output_nodes:
    ax.add_patch(plt.Circle(pos[node], 0.1, color='lightcoral', ec='black', zorder=3))
    plt.text(pos[node][0] + 0.8, pos[node][1], 'Output', fontsize=12, ha='left', va='center')
    ax.arrow(pos[node][0] + 0.2, pos[node][1], 0.5, 0, head_width=0.05, head_length=0.1, fc='black', ec='black', length_includes_head=True)

# 繪製虛線箭頭連接
for input_node in input_nodes:
    for hidden_node in hidden_nodes:
        ax.annotate("", xy=(pos[hidden_node][0], pos[hidden_node][1]), xytext=(pos[input_node][0], pos[input_node][1]),
                    arrowprops=dict(arrowstyle="->", linestyle="--", color='gray'))

# 在輸入層和隱藏層之間添加權重標籤
plt.text(1, 3.7, 'weights', fontsize=10, color="gray", ha='center', va='center', rotation=25)

# 繪製隱藏層和輸出層之間的箭頭連接
for hidden_node in hidden_nodes:
    for output_node in output_nodes:
        ax.annotate("", xy=(pos[output_node][0], pos[output_node][1]), xytext=(pos[hidden_node][0], pos[hidden_node][1]),
                    arrowprops=dict(arrowstyle="->", linestyle="--", color='gray'))

# 添加矩形框和標籤
input_rect = patches.Rectangle((-0.5, 0.5), 1, 3, linewidth=1, edgecolor='black', facecolor='none')
hidden_rect = patches.Rectangle((1.5, 0.5), 1, 4, linewidth=1, edgecolor='black', facecolor='none')
output_rect = patches.Rectangle((3.5, 2), 1, 1, linewidth=1, edgecolor='black', facecolor='none')

ax.add_patch(input_rect)
ax.add_patch(hidden_rect)
ax.add_patch(output_rect)

plt.text(-0.05, 3.8, 'Input Layer', fontsize=12, ha='center')
plt.text(2, 4.8, 'Hidden Layer', fontsize=12, ha='center')
plt.text(4.1, 3.3, 'Output Layer', fontsize=12, ha='center')

# 設置圖形邊界和
ax.set_xlim(-1, 5)
ax.set_ylim(0, 5.5)
ax.set_aspect('equal')
ax.axis('off')

# 顯示圖形
plt.show()
```

![double-layer-neural-network-diagram](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fautoml-dl-introduction%2Fdouble-layer-neural-network-diagramv1.png?alt=media&token=f8f4d274-c5e4-4b2f-9e0e-f5d08fdbfef2)
<div style="margin-top: -15px; font-size: 14px; color: #555; text-align: center; font-style: normal; font-family: 'Arial', sans-serif;">一個簡單的雙層網路就完成囉!</div>