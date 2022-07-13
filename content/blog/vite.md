---
title: "初探 Vite: 主打超快速的 dev server"
tags: ["vue"]
date: "2022-07-13"
---

Vite 是一個 no-bundle 原生 ESM dev server，特色是能夠快速啟動 dev server 和高效率的 HMR (Hot Module Replacement)。

## 目錄

```toc
```

## Why Vite?

現存開發工具的瓶頸：啟動時間過長，HMR 也需要數秒。Vite 是為了解決這些問題而生的。

### 啟動時間過長

Vite 將 module 分成 dependencies 和 source code 兩類，來改進 dev server 的啟動時間。

* Dependencies: prebuild with esbuild (esbuild 是用 go 寫的，比一般以 JS 寫的 bundler 快10 - 100倍)。
* Source code: JSX, CSS 特色是經常變動 -> 用原生 ESM，讓瀏覽器接管打包工具的工作。

### 緩慢更新

HMR 速度隨著 app 增長而減慢。 解決方案: 用原生 ESM。

## Production 打包用 Rollup

ESM 效能仍然不佳 (因為 nested import 帶來額外的 round trip)，最好還是 bundle JS 並使用 tree-shaking + lazy loading + common chunk splitting (for better caching) 等技巧。

Rollup 相比 esbuild 還是比較成熟，有 code splitting 和 CSS 的一些處理。

## 與 Snowpack 的比較

Snowpack 也是一個與 Vite 非常相似的 no-bundle 原生 ESM dev server。

主要的差別在於：

1. Production build: Snowpack 可選不同 bundler (webpack, rollup, esbuild)，Vite 則和 rollup 深度整合。Vite 支援各種功能：
    * Multi-page support
    * Library mode
    * 自動 CSS Code-Splitting
    * Optimized async chunk loading
    * Legacy mode plugin
2. 更快的 dependency pre-bundling (用 esbuild)
3. Monorepo 支援 (Yarn, Yarn 2, PNPM 等)
4. CSS preprocessor (Sass, Less)
5. 支援 Vue (作者本身也是 Vue 的作者)

## 結論

Vite 類似於 snowpack，都適用在本地開發端採用原生 ESM 的策略來避開打包這個花時間的步驟，讓本地端的開發速度變快，但在 production 還是無可避免的會完整打包。

雖然是為了 Vue 而開發的，但同時支援 React 這點我覺得滿好的，如果自己要寫小專案會想嘗試看看。

## 參考資料

[Vite](https://vitejs.dev/)

[Vite 怎麼能那麼快？從 ES modules 開始談起](https://blog.techbridge.cc/2020/08/07/vite-and-esmodules-snowpack/)

[Day_05 : 讓 Vite 來開啟你的Vue 之 前進Vite](https://ithelp.ithome.com.tw/articles/10266460)