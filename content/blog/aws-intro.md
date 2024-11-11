---
title: "AWS Cloud Practitioner Essentials 筆記: 簡介"
tags: ["aws"]
date: "2024-11-11"
---

## 什麼是 Cloud Computing?

AWS 對 cloud computing 正式的定義是：

> Cloud computing is the on-demand delivery of IT resources over the internet with pay-as-you-go pricing.

On-demand delivery 表示有需要的時候隨時都可以跑一台虛擬機器起來，而 pay-as-you-go pricing 表示使用者用多少就付多少。

## 三種 Cloud Computing 的 Deployment models

1. Cloud-based deployment: 應用的 server, DB, networking 全部在雲端。
2. On-premise deployment: 應用跑在傳統的資料中心上。
3. Hybrid deployment: 以上兩者的結合，可能是因為法規、或是 legacy 應用難以遷移至雲端，但還是想要享受雲端的好處。

## Cloud computing 的好處

### 用變動成本取代固定成本

不需要預先買好資料中心和伺服器，只需要用多少付多少。

### 不須付出營運和維護 data center 的成本

減少維護 infra 跟 server 的金錢和時間。

### 不需預測 capacity

不需要事先預測使用量高低，有需要的時候隨時可以 scale in or out。

### 受惠規模經濟 (economies of scale)

大量的顧客可以產生規模經濟，讓 AWS 這樣的雲端服務提供者得以用實惠的價格提供給使用者。

### 更高的彈性和速度

雲端解決方案比起傳統 on-premise 更容易取得資源。

### 快速部署至全球

雲端解決方案容易快速部署到世界各地，以低延遲 (latency) 服務世界各地的使用者。

## Reference

[AWS Cloud Practitioner Essentials](https://aws.amazon.com/tw/training/learn-about/cloud-practitioner/)