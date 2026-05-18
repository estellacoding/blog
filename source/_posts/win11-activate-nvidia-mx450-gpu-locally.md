---
title: Win11 本地端啟動 NVIDIA MX450 GPU 的詳細步驟
date: 2024-07-01 11:11:11
updated: 2024-07-01 11:11:11
tags:
  - Deep Learning
  - NVIDIA
  - MX450
  - GPU
  - CUDA
  - cuDNN
  - Tensorflow
  - Pytorch
  - Anaconda
  - Jupyter Notebook
categories: GPU
comments: true
---

本文詳細介紹了在 Windows 11 上啟用 NVIDIA MX450 GPU 的步驟，包括確認基本軟硬體、安裝 CUDA 和 cuDNN、驗證 TensorFlow 和 PyTorch 是否可使用 GPU。
<!-- more -->

# 確認基本軟硬體

## 確認顯卡
Win + R，會出現「執行」對話框。輸入 `control /name Microsoft.DeviceManager` 可進入裝置管理員，最下方展開顯示卡，就會出現電腦的顯示卡型號。
![1-device-manager-graphics-card](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fmx450-gpu%2F1-device-manager-graphics-card.png?alt=media&token=b37c169a-e958-42de-b47b-c01b86cd3772)

## 確認 Windows 版本
Win + R，會出現「執行」對話框。輸入 `winver` 可檢查 Windows 版本。
![2-winver-win-version](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fmx450-gpu%2F2-winver-win-version.png?alt=media&token=de418370-a1d6-4245-9aed-ec73d528c27c)

## 確認顯卡支援 CUDA
因為深度學習的框架，如 TensorFlow 和 PyTorch，都是使用 NVIDIA 的 CUDA 技術來加速運算。因此，需要初步確認電腦上的顯示卡是否支援 CUDA。

由於我在 [NVIDIA 官方 GPU 支援 CUDA 列表](https://developer.nvidia.com/cuda-gpus) 中並沒有找到 MX450。

不過經過多方資料的查詢，[wiki CUDA GPUs supported](https://en.wikipedia.org/wiki/CUDA#GPUs_supported) 有看到 MX450，且 NVIDIA 官方 [GeForce MX450](https://www.nvidia.com/zh-tw/geforce/gaming-laptops/mx-450/) 產品介紹，是有寫到支援 NVIDIA GPU Boost。

初步判斷，MX450 應該有支援 CUDA 吧!(~~請宇宙給我一個更強大的 GPU 主機讓我玩~~)，我們就繼續更進一步的安裝驗證來確認是否真的有支援 CUDA!

# 安裝 CUDA 和 cuDNN
## 安裝 NVIDIA 控制面板
先確認電腦有安裝 [NVIDIA Control Panel](https://apps.microsoft.com/detail/9nf8h0h7wmlt?rtc=1&hl=zh-tw&gl=TW)。

### CUDA 最高支援版本
打開 NVIDIA Control Panel，點選左下角「系統資訊」，再點選「元素」，就可看到 CUDA 版本。
![3-nvidia-control-panel-cuda-version](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fmx450-gpu%2F3-nvidia-control-panel-cuda-version.png?alt=media&token=c96f58e1-cd0d-41cc-85a0-d990adefdb80)

我目前是 NVIDIA CUDA 12.2.147 driver，==但並不是安裝這個版本的 CUDA，而是要根據 `tensorflow_gpu-2.10.0` 支援的版本安裝相對應的 CUDA 和 cuDNN==。

## 安裝 NVIDIA 驅動程式
安裝 [GeForce Experience](https://www.nvidia.com/zh-tw/geforce/drivers/)。GeForce Experience 會自動偵測電腦的驅動程式版本，並自動下載相對應的驅動程式。(其實可以手動下載驅動程式，但我手動下載發生顯卡不見及`nvidia-smi.exe`不在原本的該在的位置，所以後來我就還是安裝 GeForce Experience了)。~~(Win 總是會帶給我很多驚嚇)~~。

打開 GeForce Experience，並下載 NVIDIA 驅動程式。這是所有步驟中最耗時的一步。~~(又想到這過程我因為一直檢查不到 GPU 而來來回回，砍掉重來的血淚QQ)~~
![4-geforce-experience-nvidia-driver](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fmx450-gpu%2F4-geforce-experience-nvidia-driver.png?alt=media&token=59a853bb-e790-4c63-bba7-3e65568edb58)

### 確認驅動程式版本
打開 NVIDIA Control Panel，點選左下角「系統資訊」，再點選「顯示」，就可看到驅動程式版本。
![5-nvidia-control-panel-driver-version](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fmx450-gpu%2F5-nvidia-control-panel-driver-version.png?alt=media&token=6f3c2068-c506-4117-ac2a-cc8d6035ecf4)

## 安裝 CUDA
CUDA 安裝版本要非常注意!我一開始誤會要安裝 [目前電腦的 CUDA 版本 - 12.2]()，但後來發現當要使用 `tensorflow_gpu-2.10.0` 時又會一直爆出 CUDA 版本錯誤。所以最好先確認 `tensorflow_gpu-2.10.0` 支援的 Python、CUDA 和 cuDNN 的版本。

| TensorFlow 版本         | Python 版本  | cuDNN | CUDA 版本 |
|-------------------------|-------------|-------|-----------|
| tensorflow_gpu-2.10.0   | 3.7-3.10    | 8.1   | 11.2      |

{% note info %}
先查詢 [TensorFlow GPU 版本及相關資訊](https://tensorflow.google.cn/install/source_windows?hl=en#gpu)
{% endnote %}

所以我要安裝 CUDA 11.2 版本，前往 [CUDA Toolkit 11.2 Downloads](https://developer.nvidia.com/cuda-11.2.0-download-archive?target_os=Windows&target_arch=x86_64&target_version=10&target_type=exenetwork)，點擊 Windows x86_64 10 network 版本，下載 `cuda_11.2.0_win10_network` 安裝檔案。

由於 CUDA 11.2 版本沒有 win 11 可供選擇，所以我也只能選擇 win 10，結果是OK的，我是有成功安裝 CUDA 11.2 版本在 win 11 下~

![6-cuda_11.2.0_win10_network](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fmx450-gpu%2F6-cuda_11.2.0_win10_network.png?alt=media&token=02811d21-ef7b-414e-a81d-7a8765d80861)

安裝好的 CUDA 檔案會放在 `C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v11.2`。

NVIDIA 官方安裝流程請看 [CUDA Installation Guide for Microsoft Windows](https://docs.nvidia.com/cuda/cuda-installation-guide-microsoft-windows/index.html)。

## 安裝 cuDNN
下載 cuDNN 前要先登入 NVIDIA 會員。前往 [cuDNN Archive](https://developer.nvidia.com/rdp/cudnn-archive)，找到cudnn 8.1 版本，「Download cuDNN v8.1.0 (January 26th, 2021), for CUDA 11.0,11.1 and 11.2」，點擊「cuDNN Library for Windows (x86)」，下載 `cudnn-11.2-windows-x64-v8.1.0.77` zip檔案。

![7-cuDNN-v8.1-for-cuda-v11.2-win-x86](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fmx450-gpu%2F7-cuDNN-v8.1-for-cuda-v11.2-win-x86.png?alt=media&token=00bc37b8-0d56-4912-a32b-c1b924dc22ea)

- 解壓縮此檔案，將資料夾內容複製至 `C:\tools\cuda`。
- 複製此資料夾中的 `bin\cudnn*.dll` 到 `C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v11.2\bin`。
- 複製此資料夾中的 `include\cudnn*.h` 到 `C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v11.2\include`。
- 複製此資料夾中的 `lib\x64\cudnn*.lib` 到 `C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v11.2\lib\x64`。
- 將以下 CUDA 和 cuDNN 目錄新增至環境變數 PATH。
  - `C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v11.2\bin`。
  - `C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v11.2\include`。
  - `C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v11.2\extras\CUPTI\lib64`。
  - `C:\tools\cuda\bin`。
- 重開機以啟動新的環境變數。

![8-cuda-cudnn-add-to-environment-variable-path](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fmx450-gpu%2F8-cuda-cudnn-add-to-environment-variable-path.png?alt=media&token=22913db0-40d0-4abb-a1b3-cc0b3a74d166)

NVIDIA 官方安裝流程請看 [Installing cuDNN on Windows](https://docs.nvidia.com/deeplearning/cudnn/latest/installation/windows.html)。

TensorFlow 官方環境變數說明請看 [TensorFlow Windows 設定環境變數](https://www.tensorflow.org/install/gpu?hl=zh-tw#windows_setup)。

## 檢查是否安裝成功
`nvcc -V` 查看 CUDA 版本 和 `nvidia-smi` 查看 GPU 狀態。

![9-nvcc-nvidia-smi](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fmx450-gpu%2F9-nvcc-nvidia-smi.png?alt=media&token=edd433a1-d26f-469a-8afe-094e99ff0044)

# 驗證 TensorFlow 可用 GPU
## conda 建立虛擬環境

下載並安裝 [Anaconda](https://www.anaconda.com/download)。

打開 Anaconda Prompt，Anaconda Prompt 就是 Anaconda 版的 CMD 命令提示窗。

建立並啟動一個名稱為 tf-env 的虛擬環境，並指定 python 版本為 3.9。
```
conda create -n tf-env python=3.9
(base) C:\Users\stella.dai>conda activate tf-env
(tf-env) C:\Users\stella.dai>
```
## 安裝 TensorFlow
```
pip install tensorflow-gpu==2.10.0
```

## 啟動 Python
一行一行輸入以下指令。
```
python
import tensorflow as tf
tf.config.list_physical_devices('GPU')
```

![10-tensorflow-config-list-physical-devices](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fmx450-gpu%2F10-tensorflow-config-list-physical-devices.png?alt=media&token=2fdcc098-ef5d-484a-90d6-2a3e81e863af)

## 使用 Jupyer Notebook
安装 Jupyter Notebook。
```
conda install jupyter
```
安裝 ipykernel，並將虛擬環境 tf-env 配置給 Jupyter Notebook 中名稱為 tf-env 的 Kernel。
```
conda install ipykernel
python -m ipykernel install --user --name tf-env --display-name "tf-env"
```
啟動 Jupyter Notebook。
```
jupyter notebook
```
開啟一個新的瀏覽器網頁，進入任一資料夾，點選右上角的「New」按鈕，並從選單中選擇 Kernel `tf-env`。即可在新建立 Notebook 中輸入程式碼，並能將程式碼分割到不同的 cell 中查看執行結果。

![11-tensorflow-device-lib-list-local-devices](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fmx450-gpu%2F11-tensorflow-device-lib-list-local-devices.png?alt=media&token=3491c3df-72ec-4744-bf7d-10df9b7ed42f)

```
from tensorflow.python.client import device_lib
print(device_lib.list_local_devices())
```
有列出 GPU 設備，表示目前虛擬環境中能讓 TensorFlow 使用 GPU 進行運算。
- `/device:CPU:0`: 表示找到一個 CPU 裝置。
- `/device:GPU:0`: 表示找到一個 GPU 設備，名稱為 NVIDIA GeForce MX450。
```
[name: "/device:CPU:0"
device_type: "CPU"
memory_limit: 268435456
locality {
}
incarnation: 4306435837471063751
xla_global_id: -1
, name: "/device:GPU:0"
device_type: "GPU"
memory_limit: 1293385524
locality {
  bus_id: 1
  links {
  }
}
incarnation: 13913348171336601457
physical_device_desc: "device: 0, name: NVIDIA GeForce MX450, pci bus id: 0000:01:00.0, compute capability: 7.5"
xla_global_id: 416903419
]
```

# 驗證 Pytorch 可用 GPU
## conda 建立虛擬環境
打開 Anaconda Prompt。
建立並啟動一個名稱為 torch-env 的虛擬環境，並指定 python 版本為 3.9。
```
conda create -n torch-env python=3.9
(base) C:\Users\stella.dai>conda activate torch-env
(torch-env) C:\Users\stella.dai>
```
## 安裝 Pytorch
PyTorch 的[官方網站](https://pytorch.org/) 取得最新的不同作業系統、Python 版本和 CUDA 版本的安裝指令。
```
conda install pytorch torchvision torchaudio pytorch-cuda=11.8 -c pytorch -c nvidia
```
## 啟動 Python
一行一行輸入以下指令。
```
python
import torch
torch.cuda.is_available()
```

![12-torch-cuda-is-available.png](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fmx450-gpu%2F12-torch-cuda-is-available.png?alt=media&token=894d5b60-036d-44e2-bb54-b54313c93eb5)

## 使用 Jupyer Notebook
安装 Jupyter Notebook。
```
conda install jupyter
```
安裝 ipykernel，並將虛擬環境 torch-env 配置給 Jupyter Notebook 中名稱為 torch-env 的 Kernel。
```
conda install ipykernel
python -m ipykernel install --user --name torch-env --display-name "torch-env"
```
啟動 Jupyter Notebook。
```
jupyter notebook
```
開啟一個新的瀏覽器網頁，進入任一資料夾，點選右上角的「New」按鈕，並從選單中選擇 Kernel `torch-env`。

![13-torch-cuda-is-available](https://firebasestorage.googleapis.com/v0/b/stellacoding1111.appspot.com/o/article%2Fmx450-gpu%2F13-torch-cuda-is-available.png?alt=media&token=372a098e-f226-4676-ae8f-d964afa39d0d)

```
import torch
torch.cuda.is_available()
```
True 表示目前虛擬環境中能讓 Pytorch 使用 GPU 進行運算。
```
True
```

# 總結
分享我砍掉重來超過10幾次的小提醒:
- TensorFlow 和 Pytorch 的虛擬環境分開。
TensorFlow 和 Pytorch 不要共用虛擬環境，不然 TensorFlow 會一直偵測不到 GPU。Pytorch 用 CUDA 12, 11.8 都很容易偵測到 GPU，但 TensorFlow 用官方推薦的 CUDA 版本後才成功。
- 顯卡不見重裝 NVIDIA 驅動就會回來。
電腦被我玩到顯卡不見XD，但好險重新安裝 NVIDIA 驅動，就又會顯示在「裝置管理員的顯示卡」及「工作管理員的效能」上面了。
- `nvidia-smi.exe` 也可能被安裝在 `C:\Windows\System32`。
原本 `nvidia-smi.exe` 應該是被自動安裝在 `C:\Program Files\NVIDIA Corporation\NVSMI`，但可能也是被我玩壞了，找了一堆資料都說如果沒有 NVSMI，可能是驅動沒裝或沒更新或沒裝好，所以我只好反復解除安裝、重新安裝，但都還是沒有這個資料夾 NVSMI 了QQ，但好在我終於在 [這篇](https://stackoverflow.com/questions/57100015/how-do-i-run-nvidia-smi-on-windows) 裡看到有人分享 `nvidia-smi.exe` 也會出現在 `C:\Windows\System32`。再把 `C:\Windows\System32` 加入環境變數 PATH 中，就又可以使用 `nvidia-smi` 這個指令了。

其他參考資料請看:
- [【機器學習】AutoKeras環境安裝實作-GPU版本](https://medium.com/@pearl3904/%E6%A9%9F%E5%99%A8%E5%AD%B8%E7%BF%92-autokeras%E7%92%B0%E5%A2%83%E5%AE%89%E8%A3%9D%E5%AF%A6%E4%BD%9C-gpu%E7%89%88%E6%9C%AC-4ba021e28bb6)
- [Pytorch-gpu安装（CUDA11.1 + MX450 + Win10）](https://blog.csdn.net/weixin_44109827/article/details/124524256)
- [在Win10/11 建立Tensorflow GPU訓練環境20230605](https://hackmd.io/@jerrychu/S1QvFG98h)



