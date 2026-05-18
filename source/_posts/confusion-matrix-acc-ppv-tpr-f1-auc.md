---
title: 看了就被混淆的混淆矩陣及相關效能衡量指標
date: 2024-06-19 11:11:11
updated: 2024-08-07 11:11:11
tags:
  - Machine Learning
  - Classification
  - Confusion Matrix
  - Accuracy
  - Precision
  - Recall
  - F1 Score
  - AUC
categories: Machine Learning
comments: true
---

本文介紹機器學習分類模型中的效能衡量指標，重點講解了混淆矩陣(Confusion Matrix)，及其相關的各種效能衡量指標，在 [這篇](https://estellacoding.github.io/blog/automl-introduction/#%E6%A8%A1%E5%9E%8B%E8%A9%95%E4%BC%B0-Model-Evaluation) 文章中提到模型評估時，機器學習中分類模型的效能衡量指標是以預測值和實際值的正確程度來作為評估。常見的分類模型效能衡量指標包括預測準確率(Accuracy)、精確率(Precision)、召回率(Recall)、F1 Score 或 AUC。
<!-- more -->

# 混淆矩陣
混淆矩陣(Confusion Matrix)也稱為誤差矩陣，是可視化演算法性能的視覺化工具。
- 通常用是監督學習演算法，特別是統計分類問題中。
- 在無監督學習中，它通常被稱為匹配矩陣。

| Confusion Matrix       | Actual Positive     | Actual Negative      |
|:----------------------:|:-------------------:|:-------------------:|
| **Predicted Positive** | TP<br>True Positive | FP<br>False Positive|
| **Predicted Negative** | FN<br>False Negative| TN<br>True Negative |

混淆矩陣可以用字母記憶:
- 開頭是預測正確或錯誤。
   - ==開頭是T，表示預測與實際一致，即預測正確==。
   - 開頭是F，表示預測與實際不一致，即預測錯誤。
- 第二個字母是預測結果。
  - ==第二個字母是P，表示預測是Yes==。
  - 第二個字母是N，表示預測是No。

所以這4種各代表的意思是:
- TP: True Positive，預測正確，預測是Yes -> 則實際是Yes。
- TN: True Negative，預測正確，預測是No -> 則實際是No。
- FP: False Positive，預測錯誤，預測是Yes -> 則實際是No。
- FN: False Negative，預測錯誤，預測是No -> 則實際是Yes。

| 混淆矩陣   | 實際 Yes   | 實際 No    |
|:---------:|:---------:|:---------:|
| **預測 Yes**| TP: 預測Yes，實際Yes<br>預測陽性，實際陽性<br>有病的人，並被判有病 | FP: 預測Yes，實際No<br>預測陽性，實際陰性<br>沒病的人，但被判有病 |
| **預測 No** | FN: 預測No，實際Yes<br>預測陰性，實際陽性<br>有病的人，但被判沒病  | TN: 預測No，實際No<br>預測陰性，實際陰性<br>沒病的人，並被判沒病  |

雖然你可能已經被混淆，~~但不要放棄未來成為資料科學家光明的錢途~~。我們可以用 sklearn.metrics 中的 confusion_matrix 來計算混淆矩陣。(至少不用自己寫混淆矩陣的程式XD)

```
from sklearn.metrics import confusion_matrix

actual = [1, 1, 0, 1, 0, 0, 1, 0, 0, 0]
predicted = [1, 0, 0, 1, 0, 0, 1, 1, 1, 0]
tn, fp, fn, tp = confusion_matrix(actual, predicted).ravel()

print(f"True Positive: {tp}")
print(f"True Negative: {tn}")
print(f"False Positive: {fp}")
print(f"False Negative: {fn}")
```
```
True Positive: 3
True Negative: 4
False Positive: 2
False Negative: 1
```

理解完混淆矩陣後，接著來看混淆矩陣延伸出的各種效能衡量指標。

![confusion-matrix-formula](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fconfusion-matrix%2Fconfusion-matrix-formula.png?alt=media&token=d979d102-48d7-48f3-bb32-afee397fc9d0)
<div style="margin-top: -15px; font-size: 14px; color: #555; text-align: center; font-style: normal; font-family: 'Arial', sans-serif;">
    (資料來源: 
    <a href="https://ycc.idv.tw/confusion-matrix.html" style="color: #555; text-decoration: none;">
        如何辨別機器學習模型的好壞？秒懂Confusion Matrix)
    </a>
</div>

# 準確率
準確率(Accuracy)是指正確預測的樣本數佔總預測樣本數的比值。
$$ \text{Accuracy} = \frac{tp + tn}{tp + fp + fn + tn} $$

```
from sklearn.metrics import accuracy_score
# 計算準確率
accuracy = accuracy_score(actual, predicted)
print(f"Accuracy: {accuracy:.2f}")
```
```
Accuracy: 0.70
```

# 精確率
精確率(Precision)是指正確預測的正樣本數佔所有預測爲正樣本的數量的比值。
$$ \text{Precision} = \frac{tp}{tp + fp} $$

- 高精確率: 模型預測為正樣本中，大部分是實際為正的。表示誤報(False Positive)較少。
- 低精確率: 模型預測為正樣本中，有很多是實際為負的。表示誤報(False Positive)較多。

```
from sklearn.metrics import precision_score
# 計算精確率
precision = precision_score(actual, predicted)
print(f"Precision: {precision:.2f}")
```
```
Precision: 0.60
```

# 召回率
召回率(Recall)是正確預測的正樣本數佔真實正樣本總數的比值。也可稱敏感度(Sensitivity)。
$$ \text{Recall} = \frac{tp}{tp + fn} $$

- 高召回率: 實際為正樣本中，大部分都被模型正確預測為正。表示漏報(False Negative)較少。
- 低召回率: 實際為正樣本中，很多沒有被模型正確預測為正。表示漏報(False Negative)較多。

在解讀 Precision 和 Recall 時，需要根據需求選擇合適指標，才能更好地優化模型性能。
- 如果錯誤預測的成本很高，則應該更注重 Precision。
- 如果漏報的成本很高，則應該更注重 Recall。

```
from sklearn.metrics import recall_score
# 計算召回率
recall = recall_score(actual, predicted)
print(f"Recall: {recall:.2f}")
```
```
Recall: 0.75
```

# F1 Score
在一些應用場景中，我們需要權衡精確率和召回率，因此會使用到 F1 Score。
- F1 Score 是精確率和召回率的調和平均數，常用於綜合評估模型的性能。
- F1 Score 介於 0 和 1 之間，值越大表示模型的整體性能越好。

$$ \text{F1 Score} = \frac{2}{ \frac{1}{Precison} + \frac{1}{Recall} } $$

```
from sklearn.metrics import f1_score
# 計算F1 Score
f1 = f1_score(actual, predicted)
print(f"F1 Score: {f1:.2f}")
```
```
F1 Score: 0.67
```

# 特異度
特異度(Specificity)是指正確預測的負樣本數佔實際負樣本總數的比率。
$$ \text{Specificity} = \frac{tn}{fp + tn} $$

```
# 計算特異度
specificity = tn / (tn + fp)
print(f"Specificity: {specificity:.2f}")
```
```
Specificity: 0.67
```

# AUC
AUC(Area Under Curve) 是指 ROC(Receiver Operator Characteristic Curve) 曲線下的面積。
- ROC 曲線以 False Positive Rate (FPR) 為 X 軸，以 True Positive Rate (TPR) 為 Y 軸。
- AUC 值介於 0 和 1 之間，值越大表示模型的正確率越高。
  - AUC = 1，代表分類器非常完美。
  - AUC > 0.5，代表分類器分類效果優於隨機猜測，模型有預測價值。
  - AUC = 0.5，代表分類器分類效果與隨機猜測相同，模型無預測價值。
  - AUC < 0.5，代表分類器分類效果比隨機猜測差。
```
from sklearn.metrics import roc_curve, auc
# 計算 AUC
fpr, tpr, thresholds = roc_curve(actual, predicted)
roc_auc = auc(fpr, tpr)
print(f'AUC Score: {roc_auc:0.2f}')
```
```
AUC Score: 0.71
```