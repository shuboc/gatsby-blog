---
title: "如何使用 img srcset 讓圖片在 RWD 網頁顯示適當解析度"
tags: [rwd, web browser]
date: "2017-04-27"
---

這篇文章將會教你如何設定 img 的 srcset 屬性，依據螢幕的 pixel density 或是寬度載入適當解析度的圖片，達成圖片的 RWD 效果；另外也會教你如何使用 HTML5 picture 標籤設定不同解析度下的多組圖片。

## 目錄

```toc
```

## TL;DR
{: .no_toc}

1. img `srcset` 可以根據**螢幕的 pixel density** 或是**圖片在螢幕上的實際寬度**，決定要載入哪張圖片。
2. 以螢幕的pixel density區分，適用於圖片大小固定的情況。
3. 以圖片在螢幕上的實際寬度區分，適用於圖片會隨螢幕大小變化的情況。
4. 可以使用 HTML5 picture 元素來達成根據不同的 media query 載入不同組圖片的效果。

## img srcset 屬性

前端在不同裝置間顯示圖片時，經常會遇到一個狀況：

同一張圖片同時需要在桌機與手機版網頁顯示，結果在桌機上很清晰的圖，在手機上看卻很糊；換了一張解析度比較高的圖，結果在手機上的載入速度卻變慢了。

該怎麼讓圖片在不同的裝置上自動載入適合的圖片呢？

`srcset` 可以幫助我們達成這件事！

解決方法是，準備同一張圖不同解析度的版本，並定義 `img` 的 `srcset` 屬性，在不同的條件下載入不同解析度的圖片。

不同圖片的載入條件可以根據：

1. 裝置的 Pixel Density
2. 圖片顯示在裝置的實際寬度

接下來我會詳細介紹，`srcset` 在這兩種情況下分別的使用方式。

## 根據裝置的 Pixel Density 載入不同版本的圖片

首先 `srcset` 可以根據螢幕的 pixel density (單位：dpi, dots per inch) 決定要顯示哪張圖。

### 什麼是 Pixel Density？

Pixel density 用白話一點的說法就是：**單位長度裡面有幾個實體像素**，越高就表示螢幕畫質越細緻。

舉例來說：假設有一張圖片大小是 500px，那麼在 1x 的螢幕上需要用 500 個實體像素去呈現；在 2x 的螢幕上則需要用 1000 個像素去呈現。

截至 2020 年，桌機螢幕的 pixel density 通常是 1x，而中高階的手機通常都有 3x。

### 如何使用 srcset 決定不同 pixel density 下該顯示哪張圖片

舉個例子，如果我們打算同時在桌機版和手機版放一張 500px 寬的圖片，我們可以出 500px 跟 1000px 的版本，分別命名為 pic_1x.jpg 和 pic_2x.jpg。

接著我們可以用 `srcset` 來定義不同 pixel density 時，要載入哪一張圖片，方法如下：

~~~jsx
<img src="pic_1x.jpg" srcset="pic_1x.jpg 1x, pic_2x.jpg 2x" />
~~~

`pic_1x.jpg 1x` 表示 1x 的螢幕時，瀏覽器會載入 pic_1x.jpg；

`pic_2x.jpg 2x` 表示 2x 的螢幕時，瀏覽器會載入 pic_2x.jp。

### 補充：如何計算 pixel density

通常為了方便，我們定義 1x 如下：

> 1x = 觀看距離 28-inch 的 96dpi 螢幕的 pixel density，

則

> 一個螢幕的 pixel density = 這個螢幕跟 96dpi 的螢幕在相同等效距離比較之下的 dpi 的倍率。

接著，我們只要知道螢幕的dpi，就可以計算 pixel density了。

例如：假設 180dpi的手機螢幕，觀看距離是18-inch。

則一個觀看距離 28-inch 的 96dpi 螢幕，在 18-inch 的距離觀看時，等效 pixel density 為 96 * (28/18) = 150 dpi。

所以這個手機螢幕的pixel density = 180/150 = 1.2x。

詳細的計算方式可以參考 [High DPI Images for Variable Pixel Densities](https://www.html5rocks.com/en/mobile/high-dpi/)。

### 什麼情況適合使用 pixel density 來區分載入圖片的版本？

如果需要圖片寬度在不同的裝置都呈現固定大小（例如：在桌機和手機都要是 500px），用 pixel density 會是個好選擇。

但是實際上在實作 RWD 更常見的情況是：圖片會隨著畫面的大小而等比例縮放，並非固定寬度。

因此，我接下來要介紹的方法會更加實用！

## 根據圖片寬度載入不同版本的圖片

`srcset` 可以根據圖片實際在螢幕上的寬度 (單位：pixel 數) 決定要顯示哪張圖。

這種設定下，瀏覽器不會管你是桌機或是手機螢幕，只會根據實體像素的數量去決定要載入哪張圖片。

舉例來說，我可以準備兩張圖片 pic_500x500.jpg 與 pic_1000x1000.jpg，大小分別是 500px 與 1000px。

接著定義 `srcset` 如下：

~~~jsx
<img
  src="pic_500x500.jpg"
  srcset="pic_500x500.jpg 500w, pic_1000x1000.jpg 1000w"
/>
~~~

那麼桌機螢幕寬度 500px 以下，或是手機螢幕寬度 250px 以下，瀏覽器會下載 pic_500x500.jpg；

而桌機螢幕寬度 1000px 以下，或是手機螢幕寬度 500px 以下，會用 pic_1000x1000.jpg。

### 如何計算寬度 (w)？

`srcset` 的寬度 (w) 的算法是：

> 寬度 = 圖片寬度 (pixel) * Pixel Density，預設圖片寬度 = 100% 的 viewport 寬度。

舉個例子：

1. Viewport = 1000px，1x 的螢幕，圖片寬度 = 1000w。
2. Viewport = 500px，2x 的螢幕，圖片寬度 = 1000w。（因為在 pixel density = 2x 的螢幕上，顯示寬 500px 的圖片實際上需要 1000px）

需要額外注意的是，如果圖片寬度不等於viewport寬度，需透過 `img` 的 `sizes` 屬性提示瀏覽器，細節後述。

### 什麼情況適合使用寬度來區分載入圖片的版本？

適合使用寬度的情況是，圖片寬度會隨螢幕大小變動。這種情況下，比較寬的圖片可以同時滿足低解析度的寬螢幕、和高解析度的小螢幕的使用情境。

### 為圖片指定大小：sizes 屬性

假設已知圖片寬度小於 viewport 寬度，例如：用 CSS 指定圖片樣式 `img { width: 50vw; }`，圖片大小只需要原本的 50% 就能清楚呈現了。

這種情況可以用 `img` 的 `sizes` 屬性提示瀏覽器圖片寬度。

上面的公式可以修改成：

> 圖片寬度 = sizes (vw) * 圖片寬度 (pixel) * Pixel Density

例如：

假設圖片寬度 = 50vw，viewport 寬度 = 400px, 螢幕 pixel density = 2x，則圖片實際寬度 = 400 * 2 * 0.5 = 400w。

~~~jsx
<img
  src="pic_500x500.jpg"
  srcset="pic_500x500.jpg 500w, pic_1000x1000.jpg 1000w"
  sizes="50vw"
/>
~~~

以這個例子來說，只要下載 500x500 的圖就夠用了。

`sizes` 單位可以用 px 或 vw，也支援 media query 的形式：

~~~jsx
<img src="clock-demo-thumb-200.png"
      alt="Clock"
      srcset="clock-demo-thumb-200.png 200w,
          clock-demo-thumb-400.png 400w"
      sizes="(min-width: 600px) 200px, 50vw">
~~~

**注意：只有在 `srcset` 以 w 為單位時才可使用 `sizes`。**

**注意：圖片寬度也得在 CSS 裡定義一次**。`sizes` 只是提示瀏覽器這張圖預計大小，幫助瀏覽器決定該下載哪張圖，而實際圖片的縮放樣式還是靠 CSS。

### 為何需要額外的 sizes 屬性？有 CSS 不就足夠了嗎？

因為瀏覽器資源的載入順序是：下載 HTML -> 解析 HTML -> 下載 CSS -> 解析 CSS，如果在HTML裡定義 `sizes`，可以讓瀏覽器在尚未下載 CSS 之前，預先知道圖片的實際寬度，並決定該下載哪個版本的圖片，避免不必要的頻寬浪費。

## HTML5 &lt;picture&gt;

如果 `srcset` 沒辦法滿足你的需求，那你還可以試試 HTML5 的 `<picture>`！

相較於每個 `<img>` 只能定義一組 `srcset`，每個 `<picture>` 內可以定義多組 `source`，其中每個 `source` 可以各自用 `media` 屬性指定 media query，並且用 `srcset` 定義各自的圖片集。

基本用法如下：

```html
<picture>
    <source media="(min-width: 750px)"
            srcset="images/horses-1600_large_2x.jpg 2x,
                    images/horses-800_large_1x.jpg" />
    <source media="(min-width: 500px)"
            srcset="images/horses_medium.jpg" />
    <img src="images/horses_small.jpg" alt="Horses in Hawaii">
</picture>
```

這個寫法的好處是可以用 media query 更精細地控制要顯示的圖片，例如小螢幕和大螢幕顯示不同的圖片集，並各自針對兩種不同的圖片設置高清和一般的版本。

其他常見的用途包括：

1. 提供同一張圖片的不同版本 (使用 webp，不支援的情況下 fall back to jpg)
2. 針對小螢幕，顯示同一張圖片但細節較少的版本 (例如裁切過後的，或是直式/橫式照片，詳見 art direction problem)

## 結論

這篇文章討論到 `srcset` 可以根據**螢幕的 pixel density** 或是**圖片在螢幕上的實際寬度**，決定要載入哪張圖片。

其中又以**根據實際寬度**載入不同圖片的情況最常用，適用於圖片會隨螢幕大小變化的情況。

最後，如果不同螢幕需要使用不同版本的圖片 (例如：直式/橫式照片)，可以使用 HTML5 picture 元素，根據 media query 載入不同組圖片。

## Reference

* [Responsive Images - Udacity](https://classroom.udacity.com/courses/ud882)
* [High DPI Images for Variable Pixel Densities](https://www.html5rocks.com/en/mobile/high-dpi/)
* [img - MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#Example_4_Using_the_srcset_and_sizes_attributes)
* [&lt;picture&gt;: The Picture element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture)
* [Responsive Images - MDN](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
