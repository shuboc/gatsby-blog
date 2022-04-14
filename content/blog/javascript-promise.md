---
title: "JavaScript Promise 的用法"
tags: [javascript]
last_modified_at: 2020/10/15
date: "2017-05-20"
---

JavaScript 中的 Promise 是專門用來執行非同步操作的資料結構，提供了 then、catch、all、race 等方法，使得複雜的非同步流程變得簡潔好管理。這篇文章將會介紹 promise 的 resolve 和 reject，如何使用 then 串接非同步流程以及 catch 處理錯誤，方便好用的 promise chain，以及如何利用 Promise.all 及 Promise.race 平行處理非同步流程。

## 目錄

```toc
```

## 為何要使用 Promise?

JavaScript在執行非同步（例如API request，等待使用者點擊）的流程時，因為不知道什麼時候會完成，通常會接受一個callback function作為參數，完成會呼叫此callback function以執行下一步。

我們很容易遇到一個狀況：有好幾件非同步的工作，並且每一件都依賴前一件工作的結果，必須按照順序完成，就會形成所謂的callback hell，讓程式碼變得難以維護：

```Javascript
asyncA(function(dataA) {
  asyncB(dataA, function(dataB) {
    asyncC(dataB, function() {
      ...
    })
  })
})
```

Promise能夠將非同步流程包裝成簡潔的結構，並提供統一的錯誤處理機制（某種程度上可以想成是把複雜的非同步流程用一個try/catch包起來）。

```Javascript
asyncA()
  .then(asyncB)
  .then(asyncC)
  .catch() // Error Handling
```

## 建立 Promise

Promise 是一種物件，它的建構函式接受一個執行函式 (executor)，用來定義非同步行為。執行函式會被馬上呼叫並傳入兩個參數：`(resolve, reject)`。

Promise 物件的初始狀態為 *pending*，當我們完成了非同步流程，在執行函式中呼叫 `resolve()`，會將 Promise 的狀態轉變成 *resolved*。當錯誤發生時，我們呼叫 `reject()` 會將 Promise 的狀態轉變為 *rejected*。

下面是一個建立 promise 的範例：

```Javascript
const p = new Promise(function(resolve, reject) {
  doSomethingAsync(function(err, value) {
    if (err) {
      reject(new Error(err))
    } else {
      resolve(value)
    }
  })
})
```

範例：檢查 document.readyState

```Javascript
function ready() {
  return new Promise(function(resolve) {
    function checkState() {
      if (document.readyState !== 'loading') {
        resolve()
      }
    }

    document.addEventListener('readystatechange', checkstate)
    checkstate()
  })
}
```

## 用 .then() 串接非同步流程

Promise具有 `.then()` 方法，用來定義非同步行為完成後的動作。`.then()` 方法接受一個 callback function 作為參數，當 promise 轉變成 *resolved* 狀態時，這個 callback function 會被執行。

範例：`setTimeout`

```Javascript
function delay(ms) {
  return new Promise(function(resolve) {
    setTimeout(resolve, ms)
  })
}

delay(3000).then(function() {
  console.log('hello!')
})
```

Promise 中 `resolve()` 的值，可以在 `.then()` 方法的 callback function 中使用：

```Javascript
const p = new Promise(resolve => {
  resolve(42)
})

p.then(function(value) {
  console.log(value) // 42
})
```

## 用 .catch() 錯誤處理

在執行函數中呼叫 reject，或非同步的過程中有 exception 被拋出（`throw new Error(...)`）時，可以用 `.catch()` 方法來處理錯誤：

```Javascript
new Promise(function(resolve, reject) {
  ...
  reject(new Error())
})
.then(function(value) {
  ...
  throw new Error()
})
.catch(function(error) {
  // Error Handling...
})
```

### .catch() 如何簡化非同步流程的錯誤處理

非同步的錯誤處理其實很麻煩！

以下是一個常見的錯誤：如果在 `callback` 裡面 `throw err` 的話，無法被 try/catch 區塊捕捉到，因為等到 `callback` 被執行時，已經離開 try/catch 的範圍了：

```Javascript
try {
  doSomethingAsync(function callback(err) {
    if (err) {
      throw err // Throw error in a callback
    }
  })
} catch(err) {
  console.error(err) // Can not catch error properly!
}
```

解法是 callback function 裡面也必須要有 try/catch。這凸顯了一個難處：寫非同步程式的人必須仔細在各處捕捉錯誤，否則程式一不小心就 crash 了。

有了 `.catch()` 之後，所有錯誤都可以在 `.catch()` 中統一處理，相當方便！

參考：[Error Handling in Node.js](https://www.joyent.com/node-js/production/design/errors)

### 使用 .catch() 的一些小細節

#### .then(onResolve, onReject) / .then(onResolve).catch(onReject) 的差異

Promise 的錯誤處理有兩種寫法，其中第二種比較好：

1. `then(onResolve, onReject)`：只會有其中一個被執行，如果執行`onResolve`錯誤無法被`onReject`處理。
2. `.then(onResolve).catch(onReject)`：如果執行 `onResolve` 錯誤，會被 `onReject` 處理。

#### resolve 也可能失敗

在promise裡面呼叫 `resolve(value)`，或是 `.then(function() { return value })` 都有可能發生錯誤，例如：

1. `value === undefined`
2. `value` 是一個 *rejected* 的 Promise

參考：[Promises: resolve is not the opposite of reject](https://jakearchibald.com/2014/resolve-not-opposite-of-reject/)

#### 使用 reject 而不是 throw

可以區分是我們主動回傳錯誤，還是非預期的異常，debug 的時候可能會滿有用的。

參考：[使用reject有什么优点](http://liubin.org/promises-book/#not-throw-use-reject)。

注意：`.then()` 中需要 `reject` 的時候，可用 `return Promise.reject(new Error())`)。

## Promise Chaining

前面有提到 Promise 的回傳值可以在 `.then()` 的 callback function 的參數中拿到：

```Javascript
doAsync()
  .then(function(value) {
    console.log(value) // 42
  })
```

除此之外，**`.then()` 方法也會回傳一個新 Promise**，其 resolve 的值等於 `.then()` 的callback function 的回傳值。所以我們可以不斷地用 `.then()` 方法串接非同步流程：

```Javascript
doAsync()
  .then(function() {
    return 42 // Return value of callback
  })
  .then(function(value) {
    console.log(value) // 42
  })
```

上面的程式碼等同於：

```Javascript
// .then() 回傳一個 promise
const p1 = doAsync()
  .then(function() {
    return 42 // p1的resolve值為42
  })

// promise 可以呼叫 then 方法
p1.then(function(value) {
  console.log(value) // 42
})
```

## Resolve a promise

`resolve` 或是 `.then()` 的callback function的回傳值可以是任何東西，包括promise。

resolve 一個 promise，會等這個 promise 完成之後才呼叫 `.then()`，這個特性可以讓我們達成一件非同步工作完成後，再做另一件非同步工作的效果：

```Javascript
fetch(urls[0]).then(processData)
  .then(function() {
    return fetch(urls[1]).then(processData) // return a promise
  })
  .then(function() {
    return fetch(urls[2]).then(processData) // return a promise
  })
```

## 用 forEach() 串接 promise

假設我想要一件事做完，再接著做下一件事，可以用 `forEach()` 串接：

```Javascript
const urls = [url1, url2, url3]
let sequence = Promise.resolve()
urls.forEach(function(url) {
  sequence = sequence.then(function() {
    return fetch(url).then(processData)
  })
})
```

每次呼叫 `sequence.then()` 會回傳一個新的 promise，我們把它存在 `sequence` 變數，下次再對這個新的 promise 去呼叫 `.then()`。

以下寫法看起來很類似，但是效果完全不同：

```Javascript
const urls = [url1, url2, url3]
let sequence = Promise.resolve()
urls.forEatch(function(url) {
  // Calling .then on the same promise
  sequence.then(function() {
    return fetch(url).then(processData)
  })
})
```

因為所有的 `.then()` 都對同一個 Promise 呼叫，Promise 一旦 resolve，所有的 `.then()` callback functions 都會同時執行。

## 用 .reduce() 串接 promise

這個例子和上面做的事情一樣，只是改成用 `reduce()`：

```Javascript
const urls = [url1, url2, url3]
urls.reduce(function(sequence, url) {
  return sequence.then(function(url) {
    return fetch(url).then(processData)
  })
}, Promise.resolve())
```

參考:[专栏: 每次调用then都会返回一个新创建的promise对象](http://liubin.org/promises-book/#then-return-new-promise)

## 利用 Promise.all() 平行化執行非同步工作

如果我們需要平行執行非同步工作，可以利用 `Promise.all()`，它接受一個 promise 的陣列作為參數，並回傳一個 promise。

所有的 promise 會同時進行。當所有 promise 都 resolve 時，`Promise.all()` 回傳的 promise 才會 resolve，resolve 的值是所有 promise resolve 的值的陣列，並且會按照 promise 在陣列裡的順序：

```Javascript
Promise.all(
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3),
).then(function(arrayOfValue) {
  console.log(arrayOfValue) // [1, 2, 3]
})
```

注意 promise 完成的時間先後順序沒有一定，但是結果的順序一定會按照 promise 在陣列中的順序。

## 範例：平行化＋串接

假設想要平行發送 `urls`，且必須等前面 url 的回應做完 `processData` 之後才能對後面 url 的回應做 `processData`，該怎麼做呢？

```Javascript
const arrayOfFetchPromises = urls.map(function(url) {
  return fetch(url)
})

const sequence = Promise.resolve()
arrayOfFetchPromises.forEach(function(fetchPromise) {
  sequence = sequence.then(function() {
    return fetchPromise.then(processData)
  })
})
```

1. 分別對所有 url 創 promise，開始平行送 request。
2. 不斷串接 `fetchPromise.then(processData)` 的非同步工作，這樣就可以保證 `processData`是按照順序的。

## 延伸閱讀

* Promise polyfill
* [用Promise.race和setTimeout實現超時取消fetch操作](http://liubin.org/promises-book/#promise-and-method-chain)
* [`Promise.then()`保證非同步呼叫](http://liubin.org/promises-book/#promise-is-always-async)
* [方法鏈如何實作](http://liubin.org/promises-book/#promise-and-method-chain)

## 參考資料

* [JavaScript Promise迷你书（中文版）](http://liubin.org/promises-book/)
* [JavaScript Promise - Udacity](https://classroom.udacity.com/courses/ud898)
* [JavaScript Promises: an introduction - web.dev](https://developers.google.com/web/fundamentals/getting-started/primers/promises)
