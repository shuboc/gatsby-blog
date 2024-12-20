---
title: "DOM 元素尺寸與位置：clientHeight, clientWidth, offsetHeight, offsetWidth, scrollHeight, scrollWidth, scrollTop, scrollLeft 詳解"
tags: ["javascript", "web browser"]
date: "2019-12-14"
---

本文詳細介紹 JavaScript 中常用的 DOM 元素尺寸和位置屬性，包括 clientHeight, clientWidth, offsetHeight, offsetWidth, scrollHeight, scrollWidth, scrollTop, scrollLeft 等，以及它們的區別和應用。讓您在實際應用中能輕鬆運用這些屬性！

## 目錄

```toc
```

## TL;DR

![Size Cheatsheet](./size-cheatsheet.png)

來源：[Element size and scrolling - javascript.info](https://javascript.info/size-and-scroll)。

## 元素的寬度與高度

關於元素的寬度和高度，有三組屬性可以使用，分別是`offsetWidth`, `offsetHeight`，`clientWidth`, `clientHeight`，及`scrollWidth`, `scrollHeight`。雖然名字很像，但是意義卻略有不同！下面就讓我們來看看這三組屬性的差別。

### `offsetWidth`, `offsetHeight`

`offsetWidth`/`offsetHeight` 是「元素本身」的寬度/高度，並完整了包含了邊界、捲軸及padding。

![offsetWidth/offsetHeight](./dimensions-offset.png)

圖片來源：[Determining the dimensions of elements - MDN](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model/Determining_the_dimensions_of_elements)

### `clientWidth`, `clientHeight`

`clientWidth`, `clientHeight` 是元素所包含的「子元素」的寬度及高度，其中包含了padding，但不包含邊界及捲軸。

![clientWidth, clientHeight](./dimensions-client.png)

圖片來源：[Determining the dimensions of elements - MDN](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model/Determining_the_dimensions_of_elements)

### `scrollWidth`, `scrollHeight`

`scrollWidth`/`scrollHeight` 也是元素所包含的「子元素」的「完整」寬度和高度，其中包含了超出捲軸之外的部分的寬度與高度。在沒有捲軸的情況下，這個值就等於 `clientWidth`/`clientHeight`。

> 結論：在計算寬度或高度之前，可以先問問自己：邊界 (border) 及捲軸的寬度/高度需要被包含在內嗎？再決定要用上述哪個屬性。

## 元素的相對位置

關於元素的相對位置，同樣也有三組屬性可以使用，分別是 `offsetLeft`, `offsetTop`，`clientLeft`, `clientTop`，及 `scrollLeft`, `scrollTop`。

### `offsetLeft`, `offsetTop`

`offsetLeft`/`offsetTop` 是元素本身相對於母元素的水平/垂直距離。

### `clientLeft`, `clientTop`

`clientLeft`/`clientTop` 是元素本身內外的水平/垂直距離，也就是左邊/上面的邊界寬度。（但要注意文字右到左時，左邊有捲軸的情況下，也會包含捲軸寬度）

### `scrollLeft`, `scrollTop`

* `scrollLeft`/`scrollTop` 是「內容」被捲動的距離，也就是內容頂端和捲軸頂端的相對距離。**這個屬性很常用到，一定要跟他很熟！**

## 使用 document.documentElement 取得整個文件的寬度與高度

如果我們想要取得整個文件的寬度/高度，該怎麼做呢？我們可以用  `document.documentElement` 這個特殊的DOM node，他對應到 `<html>` 這個 tag。

上述原則同樣適用於 `document.documentElement`，但是相較一般的DOM node，額外多了一些tricky之處，需要特別注意。

* `clientWidth`/`clientHeight` 是文件「不包括捲軸」的寬度/高度；`document.documentElement` 還有另一組特殊的屬性 `innerWidth`/`innerHeight`，是文件「包括捲軸」的寬度/高度。
* 文件的完整寬度/高度（包含捲軸之外部分），考慮到瀏覽器相容性的問題，不能用 `scrollWidth`/`scrollHeight`，而要用

```JavaScript
let scrollHeight = Math.max(
  document.body.scrollHeight, document.documentElement.scrollHeight,
  document.body.offsetHeight, document.documentElement.offsetHeight,
  document.body.clientHeight, document.documentElement.clientHeight
);
```

* 目前捲軸的捲動高度，理論上可以用 `scrollWidth`/`scrollTop`，但是因為瀏覽器相容性的問題，還是改用相容性更佳的 `window.pageXOffset`/`pageYOffset` 比較保險。

## 使用 getComputedStyle() 取得元素的寬度與高度

還有另一種方法可以取得元素的寬高資訊，那就是用`getComputedStyle()` 這個 API 取得元素的CSS，然後我們就可以用 `getComputedStyle(elem).width` 取得寬度。

但實務上並不推薦這麼做，有幾個原因：

1. `width` 會隨著 `box-sizing` 這個屬性的改變而有不同的計算方式。舉例而言，同樣是 `width: 300px; padding: 12px;`，當 `box-sizing: content-box;` 時，實際寬度除了內容本身的 300px ，還會外加 padding 12 * 2，一共 324px，而 `box-sizing: border-box;` 的時候，實際寬度就會只有 300px。
2. 同上，300px也可能會包含了捲軸的寬度，但可能我們想要的是不包含捲軸的寬度 (應用`clientWidth`)。
3. 值可能會是 `12px` 或是 `auto` 這類的字串

## 常見應用

### 無限捲動 (Infinite Scroll)

前端經常實作的其中一個功能就是無限捲動，當捲軸捲到接近底部的時候，向server端要更多資料。

所以我們必須知道「內容底端距離捲軸底端的距離」。雖然我們已經知道「內容頂端與捲軸頂端的距離」是 `elem.scrollTop`，但很遺憾的是並沒有`elem.scrollBottom` 這個屬性，

幸好我們可以很容易地算出來「內容底端距離捲軸底端的距離」＝ `elem.scrollHeight - elem.scrollTop - elem.clientHeight`，因為完整內容高度 (`scrollHeight`) = 內容頂端與捲軸頂端的距離 (`scrollTop`) + 捲軸本身高度 (`clientHeight`) + 內容底端與捲軸底端的距離。

### 計算捲軸的寬度

我們會需要利用容器和內容的寬度去計算。捲軸的寬度＝內容的完整寬度 (`child.offsetWidth`) 減去內容實際的寬度 (`parent.clientWidth`)

## 參考資料

* [Determining the dimensions of elements - MDN](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model/Determining_the_dimensions_of_elements)
* [Element size and scrolling - javascript.info](https://javascript.info/size-and-scroll)
