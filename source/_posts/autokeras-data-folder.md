---
title: 【AutoKeras】準備資料集及資料夾結構
date: 2024-07-09 11:11:11
updated: 2024-07-17 11:11:11
tags:
  - AutoML
  - AutoKeras
  - Machine Learning
  - Deep Learning
categories: AutoML
comments: true
---

一般訓練模型時，會將資料集切割成 3 部份，訓練集(train)、驗證集(validation)與測試集(test)。在訓練階段，AutoKeras 會使用訓練集來訓練模型，並使用驗證集來評估訓練表現。當模型訓練完成，我們就會使用測試集做模型的評估。

在本篇中，我們會介紹該如何準備資料集以及資料夾的結構，以便 AutoKeras 能夠正確地讀取數據。
<!-- more -->

# 未拆分訓練及測試資料集
原始資料並未區分訓練資料集及測試資料集。我簡單收集一些門的圖片，來當作範例，目的是訓練一個辨識開門和關門狀態的圖像分類模型。

## 資料夾結構
開門跟關門各 23 張圖片。
- 圖片統一切成 512x768。
  - 使用批次切圖好用工具: [BIRME](https://www.birme.net/?target_height=768)。
- 也可將圖片統一去背(這次的資料集我沒去背)。
  - 使用批次去背好用工具: [Pixian.AI](https://pixian.ai/free)。
```
door_dataset/
    ├── open/
    │   ├── open_image (1).jpg
    │   ├── open_image (2).jpg
    |   ├── ...
    ├── close/
    │   ├── close_image (1).jpg
    │   ├── close_image (2).jpg
    |   ├── ...
```

## 訓練模型
### 拆分資料集
原始資料並未區分訓練資料集及測試資料集，因為 AutoKeras 沒有自動拆分訓練集和測試集的功能，所以這邊我們會先用 `train_test_split` 的方式分配 20% 給測試集，80% 給訓練集。

```
import os
import numpy as np
from sklearn.model_selection import train_test_split
import tensorflow as tf
import autokeras as ak

# 定義資料路徑及資料集類別
data_dir = '/autokeras/dooropenornot/door_dataset'
classes = ['open', 'close']

# 將所有圖像文件的路徑和對應的標籤保存到image_paths和labels列表
image_paths = []
labels = []
for label, class_name in enumerate(classes):
    class_dir = os.path.join(data_dir, class_name)
    for filename in os.listdir(class_dir):
        if filename.endswith('.jpg') or filename.endswith('.png'):
            image_path = os.path.join(class_dir, filename)
            image_paths.append(image_path)
            labels.append(label)

# 將圖像路徑和標籤轉換為Numpy陣列
image_paths = np.array(image_paths)
labels = np.array(labels)

# 使用train_test_split進行切割，並分配20%的測試集
train_paths, test_paths, train_labels, test_labels = train_test_split(image_paths, labels, test_size=0.2, random_state=0)

# 將圖像路徑和標籤轉換為TensorFlow數據集及資料預處理
def paths_to_dataset(image_paths, labels, batch_size=32, img_size=(512, 768)):
    # 生成圖像資料集
    path_ds = tf.data.Dataset.from_tensor_slices(image_paths)
    # map將以下操作應用到資料集中的每一個圖像路徑
    image_ds = path_ds.map(lambda x: tf.image.convert_image_dtype(
                # 調整圖像大小並解碼JPEG圖像文件確保有3通道(RGB)
                tf.image.resize(tf.image.decode_jpeg(tf.io.read_file(x), channels=3),img_size),
                # 將圖像轉換為浮點數格式
                dtype=tf.float32),
                # 允許TensorFlow自動調整並行計算的數量
                num_parallel_calls=tf.data.AUTOTUNE)
    # 生成標籤的資料集
    label_ds = tf.data.Dataset.from_tensor_slices(labels)
    # 將圖像和標籤資料集結合起來
    image_label_ds = tf.data.Dataset.zip((image_ds, label_ds))
    return image_label_ds.batch(batch_size).prefetch(tf.data.AUTOTUNE)

# 創建訓練和測試資料集
train_dataset = paths_to_dataset(train_paths, train_labels)
test_dataset = paths_to_dataset(test_paths, test_labels)
```

### 開始訓練

`clf.fit` 這個方法可接受一個 `tf.data.Dataset` 對象作為輸入，其中包含了特徵和標籤。
- `train_dataset`
  - 是一個 TensorFlow 的 tf.data.Dataset 對象，包含了以下內容：
    - 圖像數據：每個批次的圖像已經被調整為指定大小(512x768)和類型(float32)。
    - 標籤數據：每個圖像對應的標籤，表示該圖像屬於哪一個類別(open 或 close)。
  - 由圖像數據和標籤數據組合而成，已經經過預處理，準備可直接用於訓練模型。
- `validation_split` 可以自動從 train_dataset 中拆分出驗證集。
  - 這邊設定自動拆分訓練數據集中的 20% 給驗證集。

```
# 使用訓練數據集訓練模型
clf = ak.ImageClassifier(max_trials=1, overwrite=True)
clf.fit(train_dataset, epochs=20, validation_split=0.2)
```

### 評估模型
```
# 評估模型
results = clf.evaluate(test_dataset)
print(f'Test accuracy: {results[1] * 100:.2f}%')
```

```
Trial 1 Complete [00h 00m 58s]
val_loss: 0.006366312969475985

Best val_loss So Far: 0.006366312969475985
Total elapsed time: 00h 00m 58s
Epoch 1/20
2/2 ━━━━━━━━━━━━━━━━━━━━ 9s 5s/step - accuracy: 0.6568 - loss: 2.5105
Epoch 2/20
2/2 ━━━━━━━━━━━━━━━━━━━━ 1s 45ms/step - accuracy: 0.8042 - loss: 23.4325 
Epoch 3/20
2/2 ━━━━━━━━━━━━━━━━━━━━ 1s 45ms/step - accuracy: 0.6274 - loss: 35.7981 
Epoch 4/20
2/2 ━━━━━━━━━━━━━━━━━━━━ 1s 45ms/step - accuracy: 0.8527 - loss: 5.8178 
Epoch 5/20
2/2 ━━━━━━━━━━━━━━━━━━━━ 1s 45ms/step - accuracy: 0.8232 - loss: 5.4080 
Epoch 6/20
2/2 ━━━━━━━━━━━━━━━━━━━━ 1s 45ms/step - accuracy: 0.7054 - loss: 6.8755 
Epoch 7/20
2/2 ━━━━━━━━━━━━━━━━━━━━ 1s 45ms/step - accuracy: 0.9116 - loss: 2.1426 
Epoch 8/20
2/2 ━━━━━━━━━━━━━━━━━━━━ 1s 45ms/step - accuracy: 0.8527 - loss: 2.7294 
Epoch 9/20
2/2 ━━━━━━━━━━━━━━━━━━━━ 1s 45ms/step - accuracy: 0.9705 - loss: 0.5502 
Epoch 10/20
2/2 ━━━━━━━━━━━━━━━━━━━━ 1s 45ms/step - accuracy: 0.9705 - loss: 0.1314 
Epoch 11/20
2/2 ━━━━━━━━━━━━━━━━━━━━ 1s 45ms/step - accuracy: 1.0000 - loss: 3.2655e-04 
Epoch 12/20
2/2 ━━━━━━━━━━━━━━━━━━━━ 1s 44ms/step - accuracy: 1.0000 - loss: 0.0066 
Epoch 13/20
2/2 ━━━━━━━━━━━━━━━━━━━━ 1s 44ms/step - accuracy: 1.0000 - loss: 2.6659e-04 
Epoch 14/20
2/2 ━━━━━━━━━━━━━━━━━━━━ 1s 45ms/step - accuracy: 1.0000 - loss: 1.8218e-04 
Epoch 15/20
2/2 ━━━━━━━━━━━━━━━━━━━━ 1s 44ms/step - accuracy: 1.0000 - loss: 0.0110 
Epoch 16/20
2/2 ━━━━━━━━━━━━━━━━━━━━ 1s 44ms/step - accuracy: 1.0000 - loss: 1.9862e-04 
Epoch 17/20
2/2 ━━━━━━━━━━━━━━━━━━━━ 1s 44ms/step - accuracy: 1.0000 - loss: 0.0049 
Epoch 18/20
2/2 ━━━━━━━━━━━━━━━━━━━━ 1s 44ms/step - accuracy: 1.0000 - loss: 0.0070 
Epoch 19/20
2/2 ━━━━━━━━━━━━━━━━━━━━ 1s 44ms/step - accuracy: 1.0000 - loss: 0.0031 
Epoch 20/20
2/2 ━━━━━━━━━━━━━━━━━━━━ 1s 44ms/step - accuracy: 1.0000 - loss: 0.0013 
/usr/local/lib/python3.10/dist-packages/keras/src/saving/saving_lib.py:576: UserWarning: Skipping variable loading for optimizer 'adam', because it has 2 variables whereas the saved optimizer has 14 variables. 
  saveable.load_own_variables(weights_store.get(inner_path))
1/1 ━━━━━━━━━━━━━━━━━━━━ 4s 4s/step - accuracy: 0.3333 - loss: 24.7054
Test accuracy: 33.33%
```

# 有拆分訓練及測試資料集
原始資料有區分訓練資料集及測試資料集。延用門的圖片來當作範例，目的是訓練一個辨識開門和關門狀態的圖像分類模型。

## 資料夾結構
開門跟關門各 23 張圖片。
- 訓練集各 20 張。
- 測試集各 3 張。
- 圖片統一切成 512x768。
- 也可將圖片統一去背(這次的資料集我沒去背)。

```
door_images/
    ├── train/
    │   ├── open/
    │   │   ├── open_image (1).jpg
    │   │   ├── open_image (2).jpg
    │   │   ├── ...
    │   ├── close/
    │   │   ├── close_image (1).jpg
    │   │   ├── close_image (2).jpg
    │   │   ├── ...
    ├── test/
    │   │   ├── open_image (1).jpg
    │   │   ├── open_image (2).jpg
    │   │   ├── ...
    │   ├── close/
    │   │   ├── close_image (1).jpg
    │   │   ├── close_image (2).jpg
    │   │   ├── ...
```

## 訓練模型
### 訓練資料集
```
import autokeras as ak

train_dataset = ak.image_dataset_from_directory(
    directory="/autokeras/dooropenornot/door_images/train",
    batch_size=32,
    color_mode="rgb",
    image_size=(512, 768),
    interpolation="bilinear",
    shuffle=True,
    seed=123,
    validation_split=0.2,  # 訓練資料中分出20%作為驗證資料
    subset="training",  # 指定這是訓練資料集
)
```
### 驗證資料集
```
validation_dataset = ak.image_dataset_from_directory(
    directory="/autokeras/dooropenornot/door_images/train",
    batch_size=32,
    color_mode="rgb",
    image_size=(512, 768),
    interpolation="bilinear",
    shuffle=True,
    seed=123,
    validation_split=0.2,  # 訓練資料中分出20%作為驗證資料
    subset="validation",  # 指定這是驗證資料集
)
```
### 測試資料集
```
test_dataset = ak.image_dataset_from_directory(
    directory="/autokeras/dooropenornot/door_images/test",
    batch_size=32,
    color_mode="rgb",
    image_size=(512, 768),
    interpolation="bilinear",
    shuffle=False,  # 測試資料集通常不進行隨機打亂
)
```

### 開始訓練
```
# 使用訓練數據集訓練模型
clf = ak.ImageClassifier(max_trials=1, overwrite=True)
clf.fit(train_dataset, epochs=20, validation_data=validation_dataset)
```

### 評估模型
```
# 評估模型
results = clf.evaluate(test_dataset)
print(f'Test accuracy: {results[1] * 100:.2f}%')
```

```
Trial 1 Complete [00h 00m 18s]
val_loss: 9.174785614013672

Best val_loss So Far: 9.174785614013672
Total elapsed time: 00h 00m 18s
Epoch 1/20
1/1 ━━━━━━━━━━━━━━━━━━━━ 4s 4s/step - accuracy: 0.3125 - loss: 0.7639 - val_accuracy: 0.3750 - val_loss: 53.8927
Epoch 2/20
1/1 ━━━━━━━━━━━━━━━━━━━━ 1s 892ms/step - accuracy: 0.6875 - loss: 15.6912 - val_accuracy: 0.6250 - val_loss: 30.3365
Epoch 3/20
1/1 ━━━━━━━━━━━━━━━━━━━━ 1s 892ms/step - accuracy: 0.4688 - loss: 68.5761 - val_accuracy: 0.7500 - val_loss: 9.9265
Epoch 4/20
1/1 ━━━━━━━━━━━━━━━━━━━━ 1s 885ms/step - accuracy: 0.7188 - loss: 21.2025 - val_accuracy: 0.5000 - val_loss: 57.8084
Epoch 5/20
1/1 ━━━━━━━━━━━━━━━━━━━━ 1s 891ms/step - accuracy: 0.7812 - loss: 4.1379 - val_accuracy: 0.3750 - val_loss: 85.0034
Epoch 6/20
1/1 ━━━━━━━━━━━━━━━━━━━━ 1s 899ms/step - accuracy: 0.5938 - loss: 16.0069 - val_accuracy: 0.5000 - val_loss: 71.4405
Epoch 7/20
1/1 ━━━━━━━━━━━━━━━━━━━━ 1s 903ms/step - accuracy: 0.7188 - loss: 8.5391 - val_accuracy: 0.5000 - val_loss: 46.6660
Epoch 8/20
1/1 ━━━━━━━━━━━━━━━━━━━━ 1s 903ms/step - accuracy: 0.9062 - loss: 2.0680 - val_accuracy: 0.5000 - val_loss: 23.5071
Epoch 9/20
1/1 ━━━━━━━━━━━━━━━━━━━━ 1s 903ms/step - accuracy: 0.9062 - loss: 1.1950 - val_accuracy: 0.6250 - val_loss: 16.5532
Epoch 10/20
1/1 ━━━━━━━━━━━━━━━━━━━━ 1s 913ms/step - accuracy: 0.8750 - loss: 2.0497 - val_accuracy: 0.6250 - val_loss: 12.8027
Epoch 11/20
1/1 ━━━━━━━━━━━━━━━━━━━━ 1s 880ms/step - accuracy: 0.8125 - loss: 1.9177 - val_accuracy: 0.6250 - val_loss: 10.8362
Epoch 12/20
1/1 ━━━━━━━━━━━━━━━━━━━━ 1s 888ms/step - accuracy: 0.8750 - loss: 0.7810 - val_accuracy: 0.6250 - val_loss: 9.9752
Epoch 13/20
1/1 ━━━━━━━━━━━━━━━━━━━━ 1s 891ms/step - accuracy: 0.9688 - loss: 0.1694 - val_accuracy: 0.6250 - val_loss: 9.8573
Epoch 14/20
1/1 ━━━━━━━━━━━━━━━━━━━━ 1s 877ms/step - accuracy: 0.9688 - loss: 0.0562 - val_accuracy: 0.6250 - val_loss: 10.8239
Epoch 15/20
1/1 ━━━━━━━━━━━━━━━━━━━━ 1s 906ms/step - accuracy: 1.0000 - loss: 0.0018 - val_accuracy: 0.5000 - val_loss: 14.1877
Epoch 16/20
1/1 ━━━━━━━━━━━━━━━━━━━━ 1s 900ms/step - accuracy: 1.0000 - loss: 1.8825e-05 - val_accuracy: 0.5000 - val_loss: 19.9622
Epoch 17/20
1/1 ━━━━━━━━━━━━━━━━━━━━ 1s 885ms/step - accuracy: 0.9688 - loss: 0.2689 - val_accuracy: 0.5000 - val_loss: 19.7217
Epoch 18/20
1/1 ━━━━━━━━━━━━━━━━━━━━ 1s 888ms/step - accuracy: 1.0000 - loss: 0.0233 - val_accuracy: 0.5000 - val_loss: 17.1762
Epoch 19/20
1/1 ━━━━━━━━━━━━━━━━━━━━ 1s 884ms/step - accuracy: 0.9688 - loss: 0.0389 - val_accuracy: 0.5000 - val_loss: 14.0285
Epoch 20/20
1/1 ━━━━━━━━━━━━━━━━━━━━ 1s 876ms/step - accuracy: 1.0000 - loss: 0.0157 - val_accuracy: 0.5000 - val_loss: 10.7696
1/1 ━━━━━━━━━━━━━━━━━━━━ 3s 3s/step - accuracy: 0.8333 - loss: 8.3459
Test accuracy: 83.33%
```