---
title: 什麼是張量(Tensor)?
date: 2024-07-08 11:11:11
updated: 2025-01-08 11:11:11
tags:
  - Machine Learning
  - Deep Learning
  - Tensor
categories: Machine Learning
comments: true
---

無論是哪種類型的數據(如數值、文字、圖像、音頻)，在進入機器學習模型之前，這些數據都會經過適當的預處理轉換成數值形式，然後進一步轉換成張量(Tensor)供模型使用。
<!-- more -->

張量(Tensor)為機器學習框架中處理和運算數據的基本單位。
- 張量為多維數組(multidimensional array)，能夠**靈活地表示不同類型和不同維度的數據**，可以表示純量(0D張量)、向量(1D張量)、矩陣(2D張量)及更高維度的數據結構。
- 深度學習框架(如 TensorFlow 和 PyTorch)設計用來高效地處理張量。**張量運算可以被分解成許多小的計算單元，這些單元可以在 GPU 上並行執行多個運算任務，加速計算過程**。

這裡我將用房屋數據來舉例每種張量的概念，以幫助我們更好地理解張量的意思。~~(不然3d,4d用程式呈現是出現一堆矩陣我看起來跟2d都一樣暈啊)~~

# 純量(Scalar)
- 0D 張量
- 0 維
- 0 軸(Axis)
- 單一數值
- 例如，一個房屋的價格(美元)
```
import tensorflow as tf

# 單一房屋的價格(美元)
price = tf.constant(250000)
print(price)

# 檢查張量的形狀
price_shape = price.shape
# 檢查軸(維度)數量
num_axes = len(price_shape)

print(f"張量的形狀: {price_shape}")
print(f"軸(維度)數量: {num_axes}")
```
```
tf.Tensor(250000, shape=(), dtype=int32)
張量的形狀: ()
軸(維度)數量: 0
```

![tensor-scalar](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Ftensor%2Ftensor-scalar.png?alt=media&token=c468a24f-912c-41ec-8d46-3ecec9791d28)

# 向量(Vector)
- 1D 張量
- 1 維陣列
- 1 軸
- 多個數值構成的 1 維陣列
- 例如，一個房屋的所有特徵，例如面積(平方英尺)、房間數、價格(美元)
```
import tensorflow as tf
# 一個房屋的所有特徵，例如面積(平方英尺)、房間數、價格(美元)。
house_features = tf.constant([1200, 3, 250000])
print(house_features)

# 檢查張量的形狀
price_shape = house_features.shape
# 檢查軸(維度)數量
num_axes = len(price_shape)

print(f"張量的形狀: {price_shape}")
print(f"軸(維度)數量: {num_axes}")
```
```
tf.Tensor([  1200      3 250000], shape=(3,), dtype=int32)
張量的形狀: (3,)
軸(維度)數量: 1
```

![tensor-vector](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Ftensor%2Ftensor-vector.png?alt=media&token=16917919-0ed2-4064-b735-27371f585c96)

# 矩陣(Matrix)
- 2D 張量
- 2 維陣列
- 2 軸
- 多個向量構成的 2 維陣列
- 例如，房屋數據集的 3 個樣本，每個樣本有多個特徵
```
import tensorflow as tf
# 房屋數據集的3個樣本
house_table_data = tf.constant([
    # 第一個房屋樣本
    [1200, 3, 250000],

    # 第二個房屋樣本
    [1500, 4, 350000],

    # 第三個房屋樣本
    [900, 2, 200000]
])
print(house_table_data)

# 檢查張量的形狀
price_shape = house_table_data.shape
# 檢查軸(維度)數量
num_axes = len(price_shape)

print(f"張量的形狀: {price_shape}")
print(f"軸(維度)數量: {num_axes}")
```
```
tf.Tensor(
[[  1200      3 250000]
 [  1500      4 350000]
 [   900      2 200000]], shape=(3, 3), dtype=int32)
張量的形狀: (3, 3)
軸(維度)數量: 2
```

![tensor-matrix](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Ftensor%2Ftensor-matrix.png?alt=media&token=d4e2f195-8f84-44b6-bdff-84b40f3dc89a)

# 3D 張量(3D Tensor)
- 3D 張量
- 3 維陣列
- 3 軸
- 多個 2D 矩陣構成的陣列
- 例如，一張 16x16 的彩色房屋圖片，每個像素點有 RGB 3個通道
<div style="display: flex; align-items: center;">
    <img src="https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Ftensor%2Fhouse.png?alt=media&token=5ea58c2b-5e7d-46d7-af0c-668e0a42b86d" alt="16*16-house" style="height: auto; width: auto; max-width: 100px; max-height: 100px;">
</div>

## 圖片像素資訊
```
from PIL import Image

# 載入圖像
image_path = './house.png'
image = Image.open(image_path)

# 獲取圖像的寬度和高度
width, height = image.size
print(f"圖像的寬度：{width} 像素")
print(f"圖像的高度：{height} 像素")

# 將圖像轉換為Numpy數組
import numpy as np

image_array = np.array(image)
print(f"圖像的形狀：{image_array.shape}")
num_axes = image_array.ndim
print(f"圖像的軸(維度)數量: {num_axes}")

# 印出左上角1x1的像素RGB值(X=0, Y=0)
print(f"左上角1x1的像素RGB值(X=0, Y=0): {image_array[0, 0, :]}")
```
```
圖像的寬度：16 像素
圖像的高度：16 像素
圖像的形狀：(16, 16, 4)
圖像的軸(維度)數量: 3
左上角1x1的像素RGB值(X=0, Y=0): [255 255 255   0]
```

圖形的形狀為 `(16, 16, 4)` 的 3D 張量。
- `16` 表示圖像的寬度和高度，即圖像是 `16x16` 像素。
- `4` 表示圖像的通道數量，即紅色R、綠色G、藍色B 和 Alpha 通道A。
- 每個通道都是一個 2D 矩陣:
  - 每個 2D 矩陣的形狀為 `(16, 16)`，表示特定顏色通道的像素值矩陣。
  - 每個像素的顏色值由 `4` 個通道值(RGBA)組成。
- 左上角 1x1 的像素RGB值:
   - 左上角 `(0, 0)` 像素的 RGB 值是 `[255, 255, 255, 0]`。
   - 即紅色、綠色和藍色通道的值都是 `255`。
   - 第 4 個值 `0` 是 Alpha 通道的值，表示透明度。`0` 表示完全透明，`255` 表示完全不透明。

## 圖片像素 3D 圖
```
import numpy as np
from PIL import Image
import plotly.graph_objs as go
from plotly.subplots import make_subplots

# 準備數據
x, y = np.meshgrid(range(width), range(height))
x = x.flatten()
y = y.flatten()

# 設置Z值為每個像素的RGB值
z_r = image_array[:, :, 0].flatten() # R值
z_g = image_array[:, :, 1].flatten() # G值
z_b = image_array[:, :, 2].flatten() # B值

# 將顏色值轉換為plotly可用的格式
colors = ['rgb({}, {}, {})'.format(r, g, b) for r, g, b in image_array[:, :, :3].reshape(-1, 3)]

# 創建3D散點圖
fig = make_subplots(rows=1, cols=3,
                    specs=[[{'type': 'scatter3d'}, {'type': 'scatter3d'}, {'type': 'scatter3d'}]],
                    subplot_titles=('Red Channel', 'Green Channel', 'Blue Channel'))

trace_r = go.Scatter3d(
    x=x,
    y=y,
    z=z_r,
    mode='markers',
    marker=dict(
        size=3,
        color=colors,
    )
)

trace_g = go.Scatter3d(
    x=x,
    y=y,
    z=z_g,
    mode='markers',
    marker=dict(
        size=3,
        color=colors,
    )
)

trace_b = go.Scatter3d(
    x=x,
    y=y,
    z=z_b,
    mode='markers',
    marker=dict(
        size=3,
        color=colors,
    )
)

fig.add_trace(trace_r, row=1, col=1)
fig.add_trace(trace_g, row=1, col=2)
fig.add_trace(trace_b, row=1, col=3)

fig.update_layout(height=600, width=1800, title_text="圖片像素3D圖")

fig.show()
```
![tensor-3d-1](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Ftensor%2Ftensor-3d-1.png?alt=media&token=1244fb03-dc71-4f70-9dc1-4cd429d190c0)

![tensor-3d-2](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Ftensor%2Ftensor-3d-2.png?alt=media&token=35773696-cd2a-4c9e-9c66-e631fe270285)

# 4D 張量(4D Tensor)
- 4D 張量
- 4 維陣列
- 4 軸
- 多個 3D 張量構成的陣列
- 例如，一個 11 幀的房屋影片，每幀為一張 3D 彩色圖片

<div style="text-align: center;">
    <video width="1920" controls>
        <source src="https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Ftensor%2Fhouse.mp4?alt=media&token=298e96a8-1abd-4126-92e5-24af92e1e66b" type="video/mp4">
    </video>
</div>

```
import cv2
from google.colab.patches import cv2_imshow
import numpy as np

# 載入影片文件
video_path = './house.mp4'
cap = cv2.VideoCapture(video_path)

# 獲取影片的幀數和幀率
frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
fps = cap.get(cv2.CAP_PROP_FPS)
print(f"影片的幀數：{frame_count}")
print(f"影片的幀率：{fps}")

# 逐幀讀取並處理影片
frames = []
while True:
    ret, frame = cap.read()

    if not ret:
        break  # 如果影片讀取結束，退出循環

    # 將每一幀轉換為NumPy數組並添加到frames列表中
    frame_array = np.array(frame)
    frames.append(frame_array)

    # 按下 q 鍵退出
    if cv2.waitKey(25) & 0xFF == ord('q'):
        break

# 釋放資源
cap.release()

# 將frames列表轉換為NumPy數組，可以查看每一幀的具體內容
frames_array = np.array(frames)
print(f"影片的形狀：{frames_array.shape}")
print(f"影片的軸(維度)數量: {frames_array.ndim}")
```
```
影片的幀數：11
影片的幀率：30.0
影片的形狀：(11, 1080, 1920, 3)
影片的軸(維度)數量: 4
```

影片的形狀為 `(11, 1080, 1920, 3)` 的 4D 張量。
- `11` 表示影片的幀數(frames)。
- `1080` 表示每幀圖像的高度(像素)。
- `1920` 表示每幀圖像的寬度(像素)。
- `3` 表示圖像的通道數量，即紅色R、綠色G、藍色B。
- 每幀圖像都是一個 3D 張量。
   - 每個 3D 張量的形狀為 `(1080, 1920, 3)`，表示圖像的高度、寬度和顏色通道。
   - 每個 2D 張量的形狀為 `(1080, 1920)`，表示特定顏色通道的像素值矩陣。
   - 每個像素的顏色值由 `3` 個通道值(RGB)組成。


# 常見 QA
## 矩陣行列怎麼區分?
- 在台灣，橫向稱為列，縱向稱為行(欄)。
- 在大陸，橫向稱為行，縱向稱為列。~~(超過負荷已登出)~~

我個人是記 row(列) 跟 column(欄)，不然中文容易會被搞亂。
- Row:「Row」裡有「o」，就像一個橫著的圓圈(橫向)。
- Column: 「Column」裡有「l」，就像一根直線(縱向)。

![tensor-array-row-column](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Ftensor%2Ftensor-array-row-column.png?alt=media&token=50aabd67-47dd-481d-87de-e9430a2fd318)
<div style="margin-top: -15px; margin-bottom: 10px; font-size: 14px; color: #555; text-align: center; font-style: normal; font-family: 'Arial', sans-serif;">
    (資料來源: 
    <a href="https://www.geeksforgeeks.org/order-of-matrix/" style="color: #555; text-decoration: none;">
        What is Order of Matrix?)
    </a>
</div>

那如何寫成矩陣呢?先看 Row，再看 Col。有 4 Row，而每一個 Row 裡有 5 個值(Col)。
```
np.array([
    [-2,  7, 11,  0,  3], # 第一個 Row
    [19, 22, -8, 19, 21], # 第二個 Row
    [ 4, 16, 24, 12,  1], # 第三個 Row
    [31, 27,  9, 43, -18] # 第四個 Row
])
```

## 3維向量跟3D張量怎麼區分?
```
import numpy as np

# 3維向量(3-dimensional vector），有1個軸，軸上有3個元素
vector = np.array([1, 2, 3])

print(f"張量的形狀: {vector.shape}")
print(f"軸(維度)數量: {vector.ndim}")
```
```
張量的形狀: (3,)
軸(維度)數量: 1
```

```
import numpy as np

# 3D張量(3D tensor)，有3個軸
# 3個2D張量，每個2D張量有2個軸，每個軸上有2個元素
tensor_3d = np.array([
    [[1, 2], [3, 4]], 
    [[5, 6], [7, 8]], 
    [[9, 10], [11, 12]]
])

print(f"張量的形狀: {tensor_3d.shape}")
print(f"軸（維度）數量: {tensor_3d.ndim}")
```
```
張量的形狀: (3, 2, 2)
軸（維度）數量: 3
```

## TensorFlow和NumPy產生張量不同點?
| 特點         | TensorFlow              | NumPy                    |
|-------------|-------------------------|------------------------- |
| 適用場景      | 機器學習模型構建、訓練和推理 | 科學計算、數據分析、矩陣運算 |
| 支援 GPU 加速 | 是                       | 否                      |
| 產生張量      | `tf.constant`           | `np.array`               |


# 結論
![tensor-figure](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Ftensor%2Ftensor-figure.png?alt=media&token=59623cc0-2c67-49c4-9ccf-cd8cd25df167)
<div style="margin-top: -15px; font-size: 14px; color: #555; text-align: center; font-style: normal; font-family: 'Arial', sans-serif;">
    (參考來源: 
    <a href="https://medium.com/hunter-cheng/%E6%A9%9F%E4%BD%95%E7%82%BA%E5%BC%B5%E9%87%8F-tensor-%E4%B8%89%E5%88%86%E9%90%98%E5%9C%96%E8%A7%A3%E9%A1%9E%E7%A5%9E%E7%B6%93%E7%B6%B2%E8%B7%AF%E5%9F%BA%E6%9C%AC%E8%B3%87%E6%96%99%E7%B5%90%E6%A7%8B-ab0ccd115aff" style="color: #555; text-decoration: none;">
        何為張量(Tensor)？三分鐘圖解類神經網路基本資料結構)
    </a>
</div>

- 0D 張量(純量): 一個單一的數值，例如 `1`。
- 1D 張量(向量): 一維陣列，例如 `[1, 2, 3, 4]`。
- 2D 張量(矩陣): 二維陣列，例如 `[[1, 5], [2, 6], [3, 7], [4, 8]]`。
- 3D 張量: 三維陣列，由多個矩陣組成，例如 `[[[1, 5], [2, 6], [3, 7], [4, 8]], ...]`。
- 4D 張量: 四維陣列，由多個 3D 張量組成，例如 `(11, 1080, 1920, 3)`。
- 5D 張量: 五維陣列，由多個 4D 張量組成，用於表示更高維度的數據結構。