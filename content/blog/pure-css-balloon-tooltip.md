---
layout: post
title: "CSS 氣泡提示框 (tooltip/speech bubble/bubble with arrow/balloon)"
tags: [css]
date: "2016-05-08"
---

前端元件hover的時候顯示氣泡提示框(tooltip/balloon)是常見的效果，也有許多現成的library如[Balloon.css](https://kazzkiq.github.io/balloon.css/)可用。這篇教學教你如何用純CSS手刻。

<p data-height="210" data-theme-id="0" data-slug-hash="pydPWd" data-default-tab="result" data-user="shubochao" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/shubochao/pen/pydPWd/">css-balloon</a> by Shubo Chao (<a href="http://codepen.io/shubochao">@shubochao</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

## 目錄

```toc
```

## 氣球的形狀

氣球的形狀怎麼做？其實可以把它看成一個三角形（突出的尖端）加一個有圓角的方形（本體），用純CSS的話可以用:before虛擬元素做出三角形，:after做出方形。

三角形：設定上方邊界的顏色及寬度(三角形的高，8px)，下方無邊界，左右邊界設定透明及寬度（三角形的底，8px + 8px = 16px）：

~~~css
&:before {
  content: "";
  border-top: solid 8px $balloon-color;
  border-left: solid 8px transparent;
  border-right: solid 8px transparent;
}
~~~

氣球的本體：利用`content`屬性秀出文字內容，`attr(balloon-data)`會去讀元素的`balloon-data`屬性。

~~~css
&:after {
  content: attr(balloon-data);
}
~~~

可以直接在html元素裡用`balloon-data`屬性設定氣球的文字內容：

~~~markup
<button
  class="button balloon"
  balloon-data="Hello."> <!-- Balloon content -->
  Hover me!
</button>
~~~

## 如何定位

讓氣球相對於按鈕定位：調整`position`屬性，利用`absolute`元素的定位，是相對於他所處上層容器的特性，來達到相對定位的效果。參考：[關於 position 屬性](http://zh-tw.learnlayout.com/position.html)

~~~css
.balloon {
  position: relative;
  &:before, &:after {
    position: absolute;
    ...
  }
  ...
}
~~~

調整氣球位於按鈕上方並水平置中：調整`left`和`transform`屬性。參考：[How to center a “position: absolute” element](http://stackoverflow.com/questions/8508275/how-to-center-a-position-absolute-element)。

> Adding top/left of 50% moves the top/left margin edge of the element to the middle of the parent, and translate() function with the (negative) value of -50% moves the element by the half of its size. Hence the element will be positioned at the middle.

~~~css
&:before, &:after {
  bottom: 100%;
  left: 50%;
  transform: translate(-50%, 0);
}
~~~

## Hover效果

hover前後改變`opacity`屬性並設定轉場效果：

~~~css
&:before, &:after {
  transition: all 0.18s ease-out 0.18s;
  opacity: 0;
}

&:hover:before, &:hover:after {
  opacity: 1;
}
~~~

## 心得

最後的成品：

<p data-height="210" data-theme-id="0" data-slug-hash="pydPWd" data-default-tab="result" data-user="shubochao" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/shubochao/pen/pydPWd/">css-balloon</a> by Shubo Chao (<a href="http://codepen.io/shubochao">@shubochao</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

CSS真是博大精深啊，光是一個常見的氣球也用到不少技巧！像是

* `before`, `after`虛擬元素
* `position: absolute;`
* CSS transform等。

參考資料：

* [Balloon.css](https://kazzkiq.github.io/balloon.css/)
* [關於 position 屬性](http://zh-tw.learnlayout.com/position.html)
* [How to center a “position: absolute” element](http://stackoverflow.com/questions/8508275/how-to-center-a-position-absolute-element)
