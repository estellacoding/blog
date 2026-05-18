---
title: 機器學習中迴歸模型的效能衡量指標
date: 2024-06-20 11:11:11
updated: 2024-06-23 11:11:11
tags:
  - Machine Learning
  - Regression
  - MSE
  - RMSE
  - MAE
  - R2
categories: Machine Learning
comments: true
---

在 [這篇](https://estellacoding.github.io/blog/automl-introduction/#%E6%A8%A1%E5%9E%8B%E8%A9%95%E4%BC%B0-Model-Evaluation) 文章中有提到模型評估時，機器學習中迴歸模型的效能衡量指標是以模型預測結果與實際結果之間的差異來作為評估。常見的迴歸模型效能衡量指標包括均方誤差(MSE)、均方根誤差(RMSE)、平均絕對誤差(MAE)和決定係數($ R^2 $)。
<!-- more -->

# 均方誤差
均方誤差(Mean Squared Error, MSE)是預測值與實際值之間差異的平方和的平均值。

$$  \text{MSE} = \frac{1}{n} \sum_{i=1}^{n} (y_i - \hat{y}_i)^2 \ $$

- $n$ 是樣本數量​、$y_i $ 是實際值、$\hat{y}_i$ 是預測值。
- MSE 越小，表示模型的預測值與實際值之間的差異越小，模型效能越好。

```
from sklearn.metrics import mean_squared_error
y_true = [3, -0.5, 2, 7]
y_pred = [2.5, 0.0, 2, 8]

# 計算均方誤差(MSE)
mse = mean_squared_error(y_true, y_pred)
print(f"MSE: {mse}")
```
```
MSE: 0.375
```

# 均方根誤差
均方根誤差(Root Mean Squared Error, RMSE)是 MSE 的平方根。

$$ \text{RMSE} = \sqrt{\frac{1}{n} \sum_{i=1}^{n} (y_i - \hat{y}_i)^2} \ $$

- RMSE 越小，表示模型的預測值與實際值之間的差異越小，模型效能越好。

```
import numpy as np

# 計算均方根誤差(RMSE)
rmse = np.sqrt(mse)
print(f"RMSE: {rmse}")
```
```
RMSE: 0.6123724356957945
```

# 平均絕對誤差
平均絕對誤差(Mean Absolute Error, MAE)是預測值與實際值之間差異的絕對值的平均值。

$$ \text{MAE} = \frac{1}{n} \sum_{i=1}^{n} |y_i - \hat{y}_i| \ $$

- MAE 越小，表示模型的預測值與實際值之間的差異越小，模型效能越好。

```
from sklearn.metrics import mean_absolute_error

# 計算平均絕對誤差(MAE)
mae = mean_absolute_error(y_true, y_pred)
print(f"MAE: {mae}")
```
```
MAE: 0.5
```

# 決定係數
決定係數(R-squared, $ R^2 $)表示模型預測的變異程度相對於數據總變異程度的比例。

$$ R^2 = 1 - \frac{\sum_{i=1}^{n} (y_i-\hat{y_i})^2} {\sum_{i=1}^{n} (y_i - \bar{y_i})^2} $$

- $\bar{y_i}$ 是實際值的平均值。
- $ \sum_{i=1}^{n} (y_i-\hat{y_i})^2 $
  - **預測值與實際值平方差之和**
  - 模型未能解釋的變異量
  - 殘差平方和(Residual Sum of Squares, SSR)
  - 殘差變異(Residual Variance)
- $ \sum_{i=1}^{n} (y_i - \bar{y_i})^2 $
  - **實際值與實際值的平均數的平方差之和**
  - 數據的總變異量
  - 總平方和 (Total Sum of Squares, SST)
  - 總變異(Total Variance)
- $ R^2 $ 值介於 0 到 1 之間。
  - ==$ R^2 $ 越接近 1，表示模型解釋變異的能力越強。換句話說，模型能夠準確地預測數據。==
  - 接近 0 則表示模型幾乎不能解釋變異。

```
from sklearn.metrics import r2_score

# 計算決定係數(R²)
r2 = r2_score(y_true, y_pred)
print(f"R2: {r2}")
```
```
R2: 0.9486081370449679
```