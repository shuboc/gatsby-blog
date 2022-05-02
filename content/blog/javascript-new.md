---
layout: post
title: "JavaScript new 運算子及建構函式的用法"
tags: ["javascript", "frontend interview"]
last_modified_at: 2020/10/15
date: "2016-04-23"
---

JavaScript 中可以使用 JavaScript new 運算子及建構函式建立物件。定義建構函式的必要步驟：1. 宣告建構函式 2. 在建構函式中，將物件屬性定義在 this 上 3. 將物件方法定義在建構式的 prototype 屬性裡 4. 用 new 運算子呼叫建構函式。JavaScript 中也可以使用 Object.create() 方法建立物件。

## 目錄

```toc
```

## JavaScript new 運算子和建構函式 (Function Constructor)

在 JavaScript 中可以使用 `new` 運算子搭配建構函式 (function constructor) 建立新物件。

建構函式 (function constructor) 是一個用來創造新物件的函式，需要和 `new` 運算子一起搭配使用。

舉例來說，假設現在要用 `Cat()` 建構函式創造新物件，我們需要搭配 `new` 運算子一起呼叫建構函式 `Cat()`，呼叫 `Cat()` 時可以傳入參數：

~~~jsx
var kitty = new Cat("Kitty");
~~~

## 在 this 上定義物件屬性

如果要定義物件的屬性，需要在建構函式中修改 `this` 的屬性 (property)。在建構函式中，`this` 代表我們要創造的新物件。

舉例來說，假設物件需要有 `name` 屬性，我們需要將建構函式的 `name` 參數指定給 `this.name`。我們可以定義 `Cat` 建構式如下：

~~~jsx
// Constructor
function Cat(name) {
	this.name = name;
}
~~~

搭配 new 運算子呼叫建構函式時，將 `"Kitty"` 當作建構函式的參數傳入，則新物件的 `name` 屬性即為 `"Kitty"`。我們可以呼叫 `kitty.name` 來驗證：

~~~jsx
var kitty = new Cat("Kitty");
console.log(kitty.name) // Kitty
~~~

## 在 prototype 上定義物件方法

要定義物件方法，需要將物件方法宣告在建構函式的 `prototype` 屬性裡。建構函式的 `prototype` 屬性，就是新物件的 prototype。

舉例來說，如果 `Cat` 建構函式產生的物件都要有 `speak()` 方法，我們可以定義 `Cat.prototype.speak()`：

~~~jsx
// Define 'speak' method for Cat objects
Cat.prototype.speak = function() {
	console.log(this.name + ": meow!");
};
~~~

接著用 `new` 運算子呼叫建構函式創造新物件，就可以在新物件上呼叫 `speak()` 方法：

~~~jsx
var kitty = new Cat("Kitty");
kitty.speak(); // Kitty: meow!
~~~

## 原型繼承 (Prototypal Inheritance)

要了解 new 和建構函式的運作原理，首先我們要了解何謂原型繼承 (prototypal inheritance)。

原型繼承的意思是，JavaScript 中每個物件都有個 prototype 屬性，物件能夠繼承 prototype 上的屬性或方法。這個機制可以讓我們產生繼承自同一個 prototype 的多個物件，達到代碼復用的效果。

想知道 prototype 更詳細的原理可以看這篇[JavaScript Prototype (原型) 是什麼？](/javascript-prototype)

## 用 new 運算子呼叫建構函式時，背後發生了什麼事？

當我們用 new 運算子呼叫建構函式 `new Cat("Kitty")` 的時候，JavaScript 引擎在背後做了幾件事:

1. 建立新物件。
2. 將新物件的 prototype 指定為建構函式的 `prototype` 屬性。以上面的例子來說就是 `Cat.prototype`。
3. 將新物件綁定到 `this` 物件，並呼叫建構函式。
4. 在不特別指定 `return` 值的情況下，回傳剛創造的新物件。

因為新物件的原型是 `Cat.prototype`，所以新物件可以呼叫定義在 `Cat.prototype` 上的 `speak()` 方法。

## 使用 new 運算子與建構函式容易犯的錯誤

建構式必須和 `new` 運算子搭配使用，但萬一我們忘了 `new`，直接呼叫建構函式：

~~~jsx
var kitty = Cat("kitty");
~~~

此時並不會有任何錯誤或警告，`this` 會直接綁定全域變數，有可能會導致很難察覺的 bug!

## 用 Object.create() 創造新物件

ES5 中提供了 `Object.create()` 的方法，用途是創造新物件，並令其 prototype 等於第一個被傳入的參數。

例如，我們想要創造很多貓物件，所以我們先創造一個物件 `cat` 來當作 prototype，裡面定義了 `speak()` 方法：

~~~jsx
var cat = {
	speak: function() {
		console.log(this.name + ": meow!");
	}
};
~~~

當我們呼叫 `Object.create(cat)` 時，回傳的新物件的 prototype 就是 `cat`。

~~~jsx
// Create a new cat
var kitty = Object.create(cat);
kitty.name = "Kitty";
kitty.speak(); // Kitty: meow!
~~~

雖然 `kitty` 本身沒有定義 `speak()` 方法，但它的 prototype (也就是 `cat` 物件) 定義了 `speak()` 方法，於是可以成功呼叫。

使用 `Object.create()` 的好處是，省去了可能會忘記用 `new` 呼叫建構式的風險。

## Object.create() 的 polyfill

被傳進作為參數的物件，將會被當成新物件的原型物件。所以 `Object.create()` 的 polyfill 可以這樣寫：

~~~jsx
if (!Object.create) {
	Object.create = function(o) {
		function F() {}
		F.prototype = o;
		return new F();
	};
}
~~~

其中 `F()` 是建構函式，將建構函式的 `prototype` 設為傳入的物件 `o`，並且由 `new` 運算子呼叫建構函式，產生新物件。

參考：[Object.create() polyfill - MDN](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Object/create#polyfill)

## 結論

JavaScript 中可以用建構函式搭配 new 運算子，或是 ES5 的 `Object.create()` 來創造新物件。

定義建構函式的必要步驟：

1. 宣告建構函式。
2. 在建構函式中，將物件屬性定義在 `this` 上。
3. 將物件方法定義在建構式的 `prototype` 屬性裡。
4. 用 `new` 運算子呼叫建構函式。

使用 `Object.create(obj)` 方法創造的新物件，將繼承自 `obj`。

## 參考資料

* [new operator - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new)
* [Object.create() - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create)
* [Object Creation - Programming JavaScript Application](http://chimera.labs.oreilly.com/books/1234000000262/ch03.html#object_creation)
* [Constructor, operator "new" - javascript.info](https://javascript.info/constructor-new)
