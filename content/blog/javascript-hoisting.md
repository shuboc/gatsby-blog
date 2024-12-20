---
title: "JavaScript Hoisting 是什麼？ let, const, var 的差異是什麼？"
tags: ["javascript", "frontend interview"]
date: "2020-07-13"
---

JavaScript 在 ES6 let 和 const 問世之前，都是用 var 來定義變數，但是 var 有許多迥異於其他程式語言的特性，像是使用函式作用域 (function-level scope)，以及具有變數 hoisting 的規則，對於初學者而言非常容易搞錯。這篇文章要告訴你 hoisting 是什麼意思，以及 let const var 的差異，以及區塊作用域 (block-level scope) 和函式作用域 (function-level scope) 的差異。

## 目錄

```toc
```

## TL;DR

這篇文章的重點有兩個：

1. `let` `const` `var` 最主要的差異是：ES6 `let` 和 `const` 以「區塊」作為其作用域 (scope)，而 var 以「函數」作為其作用域。

2. 宣告 `var` 的時候，宣告會被提前至函式作用域的開頭，這個特性又稱為 hoisting。

如果你還不是很熟悉這兩個概念的話，下面會詳細解釋，跟我一起看下去吧！

## ES6 let 和 const 的區塊作用域 (block-level scope)

首先，ES6 的 `let` 和 `const` 的作用域是**區塊作用域 (block-level scope)**。

換句話說，**ES6 的 let 和 const 宣告的變數，只有在「區塊」裡面才看得到**。

這句話是什麼意思呢？我們一起來看下面這個例子。

```JavaScript
{
  let myName = "John";
  console.log(myName); // John
}
console.log(myName); // ReferenceError: myName is not defined
```

首先，大括弧內用 `let` 宣告了一個變數 `myName`，值等於 `"John"`，然後用 `console.log()` 印出 `myName`，結果等於 `"John"`。在大括弧結束後，我們呼叫 `console.log(myName)`，結果瀏覽器拋出 `ReferenceError` 的例外。也就是說，`myName` 這個變數只有在大括弧，也就是區塊內才看得到。離開了這個作用域，這個變數就消失了。

同樣的，**在 `if` / `for` / `while` 的大括號中宣告的 `let` 變數也只存在大括號之中**。

下面的例子中，我們可以看到 `myName` 只存在 `if` 的大括號之間。離開了大括號，瀏覽器便拋出了 `ReferenceError` 例外。

```JavaScript
if (true) {
  let myName = "John";
}
console.log(myName); // ReferenceError: myName is not defined
```

下面的例子中，`i` 只存在 `for` 迴圈的大括號之間。離開了大括號，瀏覽器便拋出 `ReferenceError` 例外：

```JavaScript
for (let i = 0; i < 3; i++) {
  console.log(i); // 0, 1, 2
}
console.log(i); // ReferenceError: i is not defined
```

## var 的函式作用域 (function-level scope)

用 `var` 宣告的變數的作用域是**函式作用域 (function-level scope)**。

換句話說，**用 var 宣告的變數，只有在「函式」裡可以看得到。**

什麼意思呢？我們來看下面這個例子：

```JavaScript
{
  var myName = "John";
}
console.log(myName); // John
```

我們用 `var` 在大括號裡面宣告一個變數 `myName`，並且給他一個值 `"John"`，大括號結束以後呼叫 `console.log(myName)`，結果會印出 `"John"`。

為什麼會這樣呢？我們不是把 `myName` 寫在大括號裡面了嗎？為什麼離開了大括號，`myName` 變數依然存在呢？

原因是 **`var` 宣告的變數的作用域是函式作用域**，換句話說，用 `var` 宣告的變數，只有在定義它的函式裡面可以看得到它，但這裡沒有函式，所以**這裏的 `myName` 是一個 global 變數。**

這段程式碼就等同於我們在最開始宣告了一個 global 的 `myName` 的變數：

```JavaScript
var myName;
{
  myName = "John";
}
console.log(myName); // John
```

簡單的說，**用大括弧將一個用 `var` 宣告的變數包起來，並沒有辦法讓它變成一個區域變數**

同樣的原理也適用於 `for` / `while` / `if`。**在 `for` / `while` / `if` 內宣告的 `var` 變數，並不會變成一個區域變數。**

下面的例子中，在 `if` 內用 `var` 宣告的變數，也會變成 global 變數。在 `if` 結束之後，`myName` 的值依然是 `"John"`：

```JavaScript
if (true) {
  var myName = "John";
}
console.log(myName); // John
```

在 for 迴圈宣告的 `var` 變數 `i` ，在 for 迴圈結束之後依然存在，其值等於 3：

```JavaScript
for (var i = 0; i < 3; ++i) {
  console.log(i) // 0, 1, 2
}
console.log(i); // 3
```

事實上 `myName` 和 `i` 都是 global 變數，上面那兩段程式碼等義於下面這兩段程式碼：

```JavaScript
var myName;
if (true) {
  myName = "John";
}
console.log(myName); // John
```

```JavaScript
var i;
for (i = 0; i < 3; ++i) {
  console.log(i) // 0, 1, 2
}
console.log(i); // 3
```

那要如何讓 `var` 變成一個區域變數呢？答案是需要用一個函式把它包起來。

**當我們在一個函式內用 var 宣告變數，這個變數就會變成一個區域變數，只存在此函式中。**

讓我用下面這個例子來說明：

```JavaScript
function printName() {
  var myName = "John";
  console.log(myName);
}
printName(); // John
console.log(myName); // ReferenceError: myName is not defined
```

我們在 `printName()` 函式裡面用 `var` 宣告了變數 `myName`，然後呼叫 `console.log(myName)` 把它印出來。

當我們呼叫 `printName()` 的時候，由於 `myName` 宣告在 `printName()` 函式之中，所以我們在 `printName()` 函式裡面可以看得到 `myName`，會印出 `"John"`。

但是當我們在 global scope 要印出 `myName` 的時候，因為 `myName` 只存在 `printName()` 裡，global scope 裏面是找不到這個變數的，所以瀏覽器會拋出 `ReferenceError`例外。

## var 可以重複宣告

接著要來介紹 `var` 和 ES6 `let` / `const` 很不一樣的地方，也就是「`var` 可以重複宣告」。這是什麼意思呢？

如果用 `let` 宣告變數的話，同一個大括弧裡面只能宣告一次，第二次宣告就會拋出例外：

```JavaScript
let myName = "John";
let myName = "Kevin"; // Uncaught SyntaxError: Identifier 'myName' has already been declared
```

非常地符合直覺，對吧？相反地，用 `var` 有個神奇特性，就是可以重複宣告。

**當使用 var 宣告一個已經被宣告過的 var 變數時，這個宣告會被忽略。**

我們來看下面這個例子：

```JavaScript
var myName = "John";
var myName = "Kevin";
var myName;
console.log(myName); // Kevin
```

可以看到第一行用 `var` 宣告了一個 `myName` 變數，並給他初始值 `"John"`；第二行重複宣告了 `myName`，並且也給它一個值 `"Kevin"`，這邊會怎麼運作呢？

答案是第二行的 `var myName;` 宣告會被忽略，但是 `myName = "Kevin";` 的動作還是會執行。

第三行又宣告了 `var myName;`，但沒有給它任何值；這裏發生的事情是：宣告會被直接略過，同時因為這裏並沒有給它一個新值，所以並不會讓它的值變成 `undefined`。(這裏非常 tricky!)

上面那段程式碼等同於：

```JavaScript
var myName = "John";
myName = "Kevin";
console.log(myName); // Kevin
```

## var 可以在使用之後才被宣告

另外一個關於 `var` 的神奇特性是：**用 var 宣告的變數可以「先使用，後宣告」。** 什麼意思呢？

我們來看這個例子，在函式的第一行就直接使用 `myName` 變數，直到第三行才宣告 `myName` 變數，這樣是完全合法的：

```JavaScript
function printName() {
  myName = "John";
  console.log(myName);
  var myName;
}
printName(); // John
```

甚至我們把宣告 `myName` 放在不會被執行到的 `if` 裡面也是合法的！

```JavaScript
function printName() {
  myName = "John";
  if (false) {
    var myName;
  }
  console.log(myName);
}
printName(); // John
```

只要有宣告 `var` 變數，則不管先使用或是先宣告，都是合法的。反之，如果完全沒有宣告，就會有錯誤。

如果是 ES6 `let` 或 `const`，則一定要先宣告才能使用。

## JavaScript Hoisting (提升)

關於 var 可以「重複宣告」以及「先使用後宣告」，你可能會很好奇，這樣為什麼會對？畢竟這違反我們對一般程式語言的認知。

其實這是因為：**在 JavaScript 中，不管你在函數中的哪一行用 var 宣告變數，一律視為在函數的第一行宣告。**

因為宣告都會被拉到最頂端的關係，前面兩個例子和下面這個寫法等義：

```JavaScript
function printName() {
  var myName;
  myName = "John";
  console.log(myName);
}
printName(); // John
```

也就是說，不論你宣告 `var` 變數的位置在哪，宣告的動作一律都會被「抬升」到函式的最頂端，這個特性就叫做 **hoisting (提升)**。

要注意的是，**只有「宣告」這個動作有 hoisting (提升) 的特性，賦值 (把值指定給變數) 的動作不會 hoisting。**

讓我們看看下面這個例子：

```JavaScript
function printName() {
  console.log(myName); // undefined
  var myName = "John";
  console.log(myName); // John
}
printName();
```

宣告 `myName` 的動作會被提升 (hoist) 至函式的最開始，剛宣告完的 `myName` 的值會是 `undefined`，因為我們沒有給他初始值。

接著第一行印出 `myName` 的結果會是 `undefined`，因為第二行 `myName = "John"` 的動作並沒有跟著提升 (hoist)，而是在他原本的位置（第二行），所以第二行執行完它的值才會變成 `"John"`。

到了第三行，`myName` 印出來的值才會是 `"John"`。

所以上面這段程式等同於：

```JavaScript
function printName() {
  var myName;
  console.log(myName); // undefined
  myName = "John";
  console.log(myName); // John
}
printName();
```

## 函式的 hoisting

函式也有 hoisting 喔。為什麼函式要有 hoisting? 這樣做的好處是，你可以在呼叫函式前使用它。

這是我們心目中理想的程式碼狀態，也就是先定義完一個函式以後再呼叫它：

```JavaScript
function printName() {
  console.log("John");
}

printName(); // John
```

但是因為函式也有 hoisting 的特性，所有的函式宣告都會被提升到最前面，所以以下的寫法是合法的：

```JavaScript
printName(); // John

function printName() {
  console.log("John");
}
```

這個特性可以解決一個問題，也就是兩個函數需要互相呼叫彼此的狀態，也就是 `A()` 裡面會呼叫到 `B()`，而 `B()` 裡面會呼叫的 `A()` 的遞迴狀況。

```JavaScript
function isEven(n) {
  if (n === 0) return true;
  return isOdd(n - 1);
}

function isOdd(n) {
  if (n === 0) return false;
  return isEven(n - 1);
}

isEven(10); // true
```

## 用 IIFE (Immediately-Invoked Function Expressions) 模擬區塊作用域 (block-level scope)

古時候還沒有 ES6 `let` 和 `const` 的時候，人們需要一個方法模擬區塊作用域 (block-level scope)，於是人們就發明了 IIFE (Immediately-Invoked Function Expressions，立即調用函數表達式)，這裏為求方便起見統一稱之為 IIFE。

IIFE 就是宣告一個函式把你要做的事包起來，然後馬上執行。

舉例來說，一個 IIFE 長得會像這樣：

```JavaScript
(function() {
  var myName = "John";
  console.log(myName); // John
})();

console.log(myName); // Uncaught ReferenceError: myName is not defined
```

上面的例子中，因為 `myName` 被包在一個函式裡面，所以它並不是一個 global 變數；它的作用域僅限於函式內部。所以global scope 看不到 `myName` 變數。

IIFE 在過去某些情況下很有用，例如我們想利用一個 `for` 迴圈每隔一秒分別印出0, 1, 2：

```JavaScript
for (var i = 0; i < 3; ++i) {
  setTimeout(() => {
    console.log(i); // 3, 3, 3
  }, i * 1000)
}
```

這樣寫是錯的，會每個一秒印出一個3。因為根據 hoisting 的原則，`i` 會是一個 global 變數。上面的程式碼等同於：

```JavaScript
var i;
for (i = 0; i < 3; ++i) {
  setTimeout(() => {
    console.log(i); // 3, 3, 3
  }, i * 1000)
}
```

這個時候 IIFE 就很好用了，因為它可以用來捕捉環境中的變數，複製一份讓它變成一個區域變數：

```JavaScript
for (var i = 0; i < 3; ++i) {
  (function(j) {
    setTimeout(() => {
      console.log(j); // 0, 1, 2
    }, j * 1000)
  })(i);
}
```

這邊我們使用一個 IIFE，它接受一個變數 `j` 當作參數，緊接著我們立刻將 `i` 傳進去當作參數呼叫它。每一次 IIFE 都產生了一個區域變數 `j`，值分別是 0, 1, 2。

當然現在我們有 ES6 `let` 和 `const`，我們可以很輕易的解決這個問題：

```JavaScript
for (let i = 0; i < 3; ++i) {
  setTimeout(() => {
    console.log(i); // 0, 1, 2
  }, i * 1000)
}
```

> 關於更多 IIFE 的應用，可以參考我的另一篇文章：[JavaScript Closure (閉包)](/javascript-closure#%E5%88%A9%E7%94%A8-iife-immediately-invoked-function-expression-%E7%94%A2%E7%94%9F%E7%8D%A8%E7%AB%8B%E7%9A%84%E7%92%B0%E5%A2%83)

## 總結

複習一下這篇文章的兩個重點：

1. `let`, `const` 和 `var` 最主要的差異是：ES6 `let` 和 `const` 以「區塊」作為其作用域 (scope)，而 `var` 以「函數」作為其作用域。

2. 宣告 `var` 的時候，宣告會被提前至函式作用域的開頭，這個特性又稱為 hoisting。

Hoisting 這個特性是 JavaScript 相對於其他程式語言滿不一樣的地方，對於第一次接觸的人要理解確實是有些困難，好在 ES6 `let` 和 `const` 出現之後，就沒有這麼多神奇的特性需要去硬記了，但是工作中偶爾會遇到上古時代寫的舊 script，或是瀏覽器支援性必須要很高的程式碼 (2020了還有人在用 IE9 嗎？)，理解 `var` 的機制還是非常有幫助的。

如果你想要了解更多 hoisting 背後的機制，還有 JavaScript 底層到底是怎麼運作的，推薦大家去看這篇[我知道你懂 hoisting，可是你了解到多深？](https://blog.techbridge.cc/2018/11/10/javascript-hoisting/)，相信會有更近一步的了解。

## Reference

* [提升（Hoisting） - MDN](https://developer.mozilla.org/zh-TW/docs/Glossary/Hoisting)
* [The old "var" - javascript.info](https://javascript.info/var)
* [我知道你懂 hoisting，可是你了解到多深？](https://blog.techbridge.cc/2018/11/10/javascript-hoisting/)
