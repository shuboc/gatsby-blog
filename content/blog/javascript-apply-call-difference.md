---
title: "[教學] 如何使用 JavaScript 的 call 和 apply"
tags: ["javascript", "frontend interview"]
date: "2024-02-15"
---

這篇教學會介紹 JavaScript 中 apply() 和 call() 的使用方法，以及運用到 apply() 和 call() 的應用，包括 Call Forwarding、Cache 和 Method Borrowing。

## 目錄

```toc
```

## JavaScript apply()

JavaScript 中 `apply()` 是 Function 物件的一個方法，用法是：

```jsx
someFunction.apply(context, arguments)
```

其中 `context` 是呼叫這個 function 所使用的 `this` 值，而 `arguments` 則是呼叫這個 function 時的參數。

舉個例子，一般來說我們要呼叫一個 function 時，我們會這麼寫：

```js
someFunction(1, 2, 3);
```

其實我們也可以用 `apply()` 達成同樣的效果，用法如下：

```jsx
someFunction.apply(undefined, [1, 2, 3]);
```

### JS apply() 的 context 參數

那當我們需要指定 function 的 `this` 時怎麼辦呢？舉例來說，當我們呼叫一個物件的方法時，`this` 會等於物件本身：

```js
obj.someFunction(1, 2, 3) // this === obj
```

這個時候我們就需要指定 `apply()` 的 `context` 參數。用法如下：

```js
const someFunction = obj.someFunction;
someFunction.apply(obj, [1, 2, 3]);
```

此時 someFunction 的 `this` 就是 `obj`。

## JavaScript call()

JavaScript 中 `call()` 是 Function 物件的另一個方法，用法是：

```jsx
someFunction.apply(context, arg1, arg2, ...)
```

其中 `context` 是呼叫這個 function 所使用的 `this` 值，而 `arg1`, `arg2`, ... 則是呼叫這個 function 時的參數。

call 和 apply 十分類似，唯一的差別在於呼叫 apply 時的參數是一個陣列，而 call 的參數則是分開的。

舉個例子，一般來說我們要呼叫一個 function 時，我們會這麼寫：

```js
someFunction(1, 2, 3);
```

我們可以用 `call()` 達成同樣的效果，用法如下：

```jsx
someFunction.call(undefined, 1, 2, 3)
```

### JS call() 的 context 參數

那當我們需要指定 function 的 `this` 時怎麼辦呢？舉例來說，當我們呼叫一個物件的方法時，`this` 會等於物件本身：

```js
obj.someFunction(1, 2, 3)
```

這個時候我們就需要指定 `call()` 的 `context` 參數。用法如下：

```js
const someFunction = obj.someFunction;
someFunction.call(obj, 1, 2, 3);
```

## JS apply 和 call 的應用 #1: Call Forwarding

有時候，我們想要在一個函式原本的功能之上附加額外的功能，這個時候可以使用 **Call Forwarding** 的技巧。

**Call Forwarding** 簡單來說就是：回傳一個 wrapper function，這個 wrapper function 會把原本的 function 包起來，加上自己想要的邏輯後呼叫原本的 function。

基本的使用方法如下：

```jsx
function wrapper(func) {
  const wrappedFunction = function() {
    const result = func.apply(this, arguments)

    // Some custom logic...
    return result
  }

  return wrappedFunction
}

const wrappedFoo = wrapper(foo)
wrappedFoo(bar, baz)
```

`wrapper` 函式的參數是一個函式`func`，回傳值是另一個函式 `wrappedFunction`。

注意在 wrappedFunction 裡面，會呼叫 `func`，核心是用到 `apply()` 的這一行：`func.apply(this, arguments)`。注意：我們會用 `wrapper` 函式的 `this` 和 `arguments` 當作參數傳給 `func`。

這很重要，因為唯有當 `this` 和 `arguments` 都被考慮進去，呼叫 `func` 的結果才會和原本一模一樣。

結論：當 `wrappedFunction` 被呼叫的時候，會呼叫原本 `func` 並且加上你想要的邏輯，最後回傳 `func` 被執行的結果。

### JS function 中特別的 arguments 變數

`arguments` 是一個函式內部特別的變數，對應到函式被呼叫時使用的參數。

舉例來說，以下例子會印出參數 `[1, 2, 3]`。

```js
function printArgs() {
  console.log(arguments)
}

printArgs(1, 2, 3) // [1, 2, 3]
printArgs(1, 2, 3, 4) // [1, 2, 3, 4]
```

當我們呼叫一個 function 的時候，可能事先不知道呼叫者會傳幾個參數，這時候 `arguments` 就很好用了。

`arguments` 變數的另外一個替代方案是用 spread operator 取出參數 array:

```js
function printArgs(...args) {
  console.log(args)
}

printArgs(1, 2, 3) // [1, 2, 3]
printArgs(1, 2, 3, 4) // [1, 2, 3, 4]
```

## apply 和 call 的應用 #2: Cache

假設有個計算量非常費時的函式：

```jsx
function slow(x) {
  // Some CPU heavy task
  return x
}
```

我們希望加上cache的功能，如果用相同的參數去呼叫這個函式第二次的話，就直接回傳上一次計算過的結果：

```jsx
function cachingDecorator(func) {
  let cache = new Map() // The cache

  return function() {
    const key = hash(arguments) // Some hash function
    if (cache.has(key)) {
      return cache.get(key) // Retrieve value from the cache
    }

    const result = func.apply(this, arguments) // Compute result

    cache.set(key, result) // Save value to the cache
    return result
  }
}

slow = cachingDecorator(slow)
slow(1)
slow(1) // Cached!
slow(1) // Cached!
```

## apply 和 call 的應用 #3: Method Borrowing

上例中的 `hash()` 的實作需要注意。

以下寫法有問題，因為 `arguments` 不是一個array，沒有 `join` 方法：

```jsx
function hash() {
  return arguments.join(',') // Not working!
}
```

但是利用 `call()`，就可以借用 `Array.prototype.join` 方法：

```jsx
function hash() {
  return [].join.call(arguments, ',')
}
```

## Reference

* [Decorators and forwarding, call/apply - JavaScript Info](http://javascript.info/call-apply-decorators)
* [Arguments object - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments)
* [Function.prototype.apply - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)
* [Function.prototype.call - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call)
* [[JavaScript] 函數原型最實用的 3 個方法 — call、apply、bind](https://realdennis.medium.com/javascript-%E8%81%8A%E8%81%8Acall-apply-bind%E7%9A%84%E5%B7%AE%E7%95%B0%E8%88%87%E7%9B%B8%E4%BC%BC%E4%B9%8B%E8%99%95-2f82a4b4dd66)