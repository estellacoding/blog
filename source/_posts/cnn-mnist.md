---
title: 自定義 CNN 架構來識別 MNIST 手寫資料集
date: 2024-07-19 11:11:11
updated: 2025-01-08 11:11:11
tags:
  - Deep Learning
  - CNN
  - MNIST
categories: Deep Learning
comments: true
---

本篇文章介紹卷積神經網路(CNN)，並實作了一個自定義的 CNN 模型來識別 MNIST 手寫資料集。
<!-- more -->


# 什麼是 CNN？
卷積神經網路(Convolutional Neural Network, CNN)是一種源自生物大腦視覺皮層神經元運作原理的神經網路。在處理電腦視覺問題方面，CNN 表現出色，如圖像分類、物體檢測、圖像分割等。除此之外，CNN 也被廣泛應用於文本分類等任務。關於什麼是神經網路，請看 [【AutoML】自動化機器學習 - 深度學習介紹 - 什麼是神經網路？它如何學習？](https://estellacoding.github.io/blog/automl-dl-introduction/#%E4%BB%80%E9%BA%BC%E6%98%AF%E7%A5%9E%E7%B6%93%E7%B6%B2%E8%B7%AF%EF%BC%9F%E5%AE%83%E5%A6%82%E4%BD%95%E5%AD%B8%E7%BF%92%EF%BC%9F) 這篇文章。

CNN 由輸入層(Input)、卷積層(Convolution)、池化層(Pooling)、展平層(Flatten)、全連接層(Fully Connected)和輸出層(Output)組成。(可以重複使用多個卷積層與池化層)

![圖3.用CIFAR-10數據集訓練的CIFAR網路模型](https://anstekadi.com/FileUploads/ArticleCKEditor/fd18ca12-30ee-4731-a1e6-31c400dd4f11.svg)
<div style="margin-top: -15px; font-size: 14px; color: #555; text-align: center; font-style: normal; font-family: 'Arial', sans-serif;">
    (資料來源: 
    <a href="https://anstekadi.com/Article/Detail/3309" style="color: #555; text-decoration: none;">
        【技術文章】卷積神經網路簡介：什麼是機器學習？ （一）)
    </a>
</div>


# CNN 的結構
CNN 由以下幾個主要部分組成:
1. 輸入層(Input): 原始圖像數據，通常為像素值矩陣。
2. 卷積層(Convolution)
    - 使用卷積核提取圖像的局部特徵。
    - 通常後接 ReLU 激活函數，引入非線性。
3. 池化層(Pooling)
    - 降低特徵圖維度，減少計算量。
    - 多次堆疊卷積層和池化層，以提取更高級的特徵。
4. 展平層(Flatten): 多維特徵轉換為一維向量。
5. Dropout 層: 通過隨機丟棄神經元來防止過擬合。
5. 全連接層(Fully Connected)
    - 使用 Dense 層進行高層次特徵提取和分類。
    - 通常使用 ReLU 激活函數。
6. 輸出層(Output)
    - 通常使用 Dense 層。
    - 對於多類別分類問題，使用 Softmax 激活函數產生最終的分類概率。

![cnn-explainer](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fcnn-mnist%2Fcnn-explainer.png?alt=media&token=5b280d94-9c6d-473d-af7d-d49dcf5d814e)
<div style="margin-top: -15px; margin-bottom: 10px; font-size: 14px; color: #555; text-align: center; font-style: normal; font-family: 'Arial', sans-serif;">
    (資料來源: 
    <a href="https://poloclub.github.io/cnn-explainer/" style="color: #555; text-decoration: none;">
        CNN Explainer)
    </a>
</div>

關於卷積神經網路視覺化，請看 [CNN Explainer](https://poloclub.github.io/cnn-explainer/)。

關於卷積神經網路模型運作原理，請看 [高中資訊教師黃建庭的教學網站](https://sites.google.com/view/zsgititit/home/ji-qi-xue-xi/convolutional-neural-network-juan-ji-shen-jing-wang-lu-suo-xie-weicnn)。


# 建立 CNN 識別 MNIST
這個 CNN 模型的架構包括:
- 三個卷積層(只有前二個後接池化層)用於提取圖像特徵。
- 一個展平層: 用於將多維特徵圖轉換為一維向量，以便於輸入到全連接層。
- 一個全連接層: 包含 64 個神經元，使用 ReLU 激活函數進行高層次特徵提取和分類。
- 一個 Dropout 層: 隨機丟棄 50% 的神經元防止過擬合。
- 一個輸出層: 包含 10 個神經元，對應於10個類別(0-9)。

```
import tensorflow as tf
from tensorflow.keras import datasets, layers, models, regularizers
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import EarlyStopping
import matplotlib.pyplot as plt

# 載入MNIST數據集
(train_images, train_labels), (test_images, test_labels) = datasets.mnist.load_data()

# 預處理數據
train_images = train_images.reshape((60000, 28, 28, 1)).astype('float32') / 255
test_images = test_images.reshape((10000, 28, 28, 1)).astype('float32') / 255

# 數據增強
datagen = ImageDataGenerator(
    rotation_range=10,
    zoom_range=0.1,
    width_shift_range=0.1,
    height_shift_range=0.1,
    validation_split=0.2  # 在這裡指定驗證集的比例
)

# 使用數據生成器進行訓練和驗證
train_generator = datagen.flow(train_images, train_labels, batch_size=32, subset='training')
validation_generator = datagen.flow(train_images, train_labels, batch_size=32, subset='validation')

# 構建CNN模型
model = models.Sequential()
model.add(layers.Conv2D(32, (3, 3), activation='relu', input_shape=(28, 28, 1), kernel_regularizer=regularizers.l2(0.001)))
model.add(layers.MaxPooling2D((2, 2)))
model.add(layers.Conv2D(64, (3, 3), activation='relu', kernel_regularizer=regularizers.l2(0.001)))
model.add(layers.MaxPooling2D((2, 2)))
model.add(layers.Conv2D(64, (3, 3), activation='relu', kernel_regularizer=regularizers.l2(0.001)))
model.add(layers.Flatten())
model.add(layers.Dense(64, activation='relu'))
model.add(layers.Dropout(0.5))
model.add(layers.Dense(10))

# 查看模型架構
model.summary()

# 編譯和訓練模型
model.compile(optimizer='adam',
              loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
              metrics=['accuracy'])

early_stopping = EarlyStopping(monitor='val_loss', patience=3)
history = model.fit(train_generator, epochs=50, validation_data=validation_generator, callbacks=[early_stopping])

# 評估模型
test_loss, test_acc = model.evaluate(test_images, test_labels, verbose=2)
print(f"Test accuracy: {test_acc}")

# 繪製訓練和驗證的損失和準確度
plt.figure(figsize=(12, 4))

# 準確度圖
plt.subplot(1, 2, 1)
plt.plot(history.history['accuracy'], label='Training Accuracy')
plt.plot(history.history['val_accuracy'], label='Validation Accuracy')
plt.xlabel('Epoch')
plt.ylabel('Accuracy')
plt.legend()
plt.title('Accuracy')

# 損失圖
plt.subplot(1, 2, 2)
plt.plot(history.history['loss'], label='Training Loss')
plt.plot(history.history['val_loss'], label='Validation Loss')
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.legend()
plt.title('Loss')

plt.show()
```
```
Model: "sequential_9"
_________________________________________________________________
 Layer (type)                Output Shape              Param #   
=================================================================
 conv2d_24 (Conv2D)          (None, 26, 26, 32)        320       
                                                                 
 max_pooling2d_16 (MaxPooli  (None, 13, 13, 32)        0         
 ng2D)                                                           
                                                                 
 conv2d_25 (Conv2D)          (None, 11, 11, 64)        18496     
                                                                 
 max_pooling2d_17 (MaxPooli  (None, 5, 5, 64)          0         
 ng2D)                                                           
                                                                 
 conv2d_26 (Conv2D)          (None, 3, 3, 64)          36928     
                                                                 
 flatten_8 (Flatten)         (None, 576)               0         
                                                                 
 dense_16 (Dense)            (None, 64)                36928     
                                                                 
 dropout_1 (Dropout)         (None, 64)                0         
                                                                 
 dense_17 (Dense)            (None, 10)                650       
                                                                 
=================================================================
Total params: 93322 (364.54 KB)
Trainable params: 93322 (364.54 KB)
Non-trainable params: 0 (0.00 Byte)
_________________________________________________________________
Epoch 1/50
1500/1500 [==============================] - 27s 17ms/step - loss: 0.6404 - accuracy: 0.8281 - val_loss: 0.2523 - val_accuracy: 0.9553
Epoch 2/50
1500/1500 [==============================] - 27s 18ms/step - loss: 0.3125 - accuracy: 0.9400 - val_loss: 0.2070 - val_accuracy: 0.9639
Epoch 3/50
1500/1500 [==============================] - 25s 17ms/step - loss: 0.2555 - accuracy: 0.9542 - val_loss: 0.1868 - val_accuracy: 0.9704
Epoch 4/50
1500/1500 [==============================] - 25s 17ms/step - loss: 0.2249 - accuracy: 0.9608 - val_loss: 0.1783 - val_accuracy: 0.9741
Epoch 5/50
1500/1500 [==============================] - 28s 18ms/step - loss: 0.2052 - accuracy: 0.9653 - val_loss: 0.1488 - val_accuracy: 0.9790
Epoch 6/50
1500/1500 [==============================] - 25s 17ms/step - loss: 0.1893 - accuracy: 0.9682 - val_loss: 0.1540 - val_accuracy: 0.9767
Epoch 7/50
1500/1500 [==============================] - 24s 16ms/step - loss: 0.1827 - accuracy: 0.9693 - val_loss: 0.1343 - val_accuracy: 0.9798
Epoch 8/50
1500/1500 [==============================] - 25s 17ms/step - loss: 0.1734 - accuracy: 0.9723 - val_loss: 0.1383 - val_accuracy: 0.9800
Epoch 9/50
1500/1500 [==============================] - 26s 17ms/step - loss: 0.1619 - accuracy: 0.9739 - val_loss: 0.1495 - val_accuracy: 0.9762
Epoch 10/50
1500/1500 [==============================] - 26s 17ms/step - loss: 0.1643 - accuracy: 0.9737 - val_loss: 0.1367 - val_accuracy: 0.9807
313/313 - 1s - loss: 0.0939 - accuracy: 0.9909 - 615ms/epoch - 2ms/step
Test accuracy: 0.9908999800682068
```
![mnist-cnn-accuracy-loss](https://firebasestorage.googleapis.com/v0/b/blog-2222.appspot.com/o/blog%2Fcnn-mnist%2Fmnist-cnn-accuracy-loss.png?alt=media&token=c9100eea-0219-47f5-92cb-cd2020df4a36)
