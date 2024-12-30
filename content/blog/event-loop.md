---
title: "什麼是 Event Loop？"
tags: ["javascript", "frontend interview"]
date: "2024-12-30"
---

Event loop 是一個持續運行的機制，負責監控 Call Stack 是否為空，並依序從 Microtask Queue 和 Task Queue 中選取任務放入 Call Stack 執行。此外，它也協調瀏覽器的渲染操作，確保在必要時刷新畫面。

## JavaScript 是單執行緒語言

要解釋 event loop，首先要知道 JavaScript 是一個單執行緒 (single-threaded) 的語言。

換句話說，JavaScript engine 在單一執行緒 (single-thread) 上一次只能執行一個任務。當 JavaScript engine 要執行程式碼的時候，會把程式碼和函式放到 call stack 上面執行。

問題來了，在 single thread 的條件下，如果一個任務要花很長的時間，它會 block 住 main thread，讓瀏覽器動不了。

那 JavaScript 要如何處理非同步的動作，例如網路請求，或是延遲執行 (例如五秒後才執行一段程式碼) 而不 block main thread 呢？

## Web APIs

當我們需要執行上述非同步操作時，在瀏覽器環境下，會使用 Web APIs，例如 `setTimeout` 或 `fetch`。而在 Node.js 中，類似的非同步操作是由 libuv 提供的事件驅動架構來實現的。

Web APIs 可以幫助我們在背景執行非同步的任務。這樣一來，main thread 就不會處於阻塞 (blocked) 的狀態。

常見的 Web APIs 包括：

* `setTimeout` 和 `setInterval`：計時相關的 API。
* `fetch`：處理網路請求。
* DOM 事件監聽：如 `addEventListener`。

當非同步的任務完成後，結果會以 callback 的形式通知我們，讓我們可以處理結果。

這些非同步 callback 並不會立即執行，而是會根據 event loop 的機制被放入適當的佇列中 (Task Queue 或 microtask queue)。

## Task Queue

當使用 `setTimeout` 這類的非同步 API，其 callback function 會被放入 Task Queue 中。

Task Queue 是一個先進先出的 (FIFO) 佇列，裡面儲存著尚未被執行的 callbacks。

那 Task Queue 中的任務會如何被處理呢？這時候就輪到 event loop 發揮作用了。

Event loop 會負責持續檢查 call stack 是否為空。當 call stack 為空，且 Task Queue 裡有尚未處理的任務時，event loop 會將 Task Queue 中的第一個任務拿出來，放到 call stack 上執行。

這就是 JavaScript 如何處理非同步任務的機制：當 main thread 有空的時候，event loop 會取出 Task Queue 中的任務來執行。

## Microtask Queue

還有一些 Web APIs 是 promise-based，例如 `fetch`。

為了要處理這些 promise 相關的非同步操作，除了 Task Queue 之外，還有另外一個 microtask queue。

Microtask queue 是用來處理和 promise 相關的非同步操作 (microtasks)。以下是一些 microtask 的範例：

* `.then()` 的 callback
* `await` 之後的程式碼
* `MutationObserver` callback
* `queueMicrotask()` 的 callback

當一個 promise 被 resolve 的時候，`.then()` 的 callback 會被放進 microtask queue 裡面。

那 microtask queue 裡的任務會如何被處理呢？

和 Task Queue 裡的任務很類似，當 call stack 為空的時候，event loop 會檢查 microtask queue，如果有任務，便會將其取出放到 call stack 上執行。

重點來了：**microtask queue 比 Task Queue 有更高的優先度**。

也就是說，當 event loop 處理 microtask queue 時，會確保該佇列中的所有任務都完成後，才會切換到 Task Queue。

值得注意的是，當執行一個 microtask 時，若此過程中又產生新的 microtask，這些新增的 microtask 會被立即加入到 Microtask Queue 並且優先處理。

總而言之，event loop 在處理 Task Queue 的任務前，會確保 microtask queue 中的任務完全清空。

## Event Loop 範例

以下程式碼會印出什麼呢？

```js
console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
console.log("4");
```

分析：

1. 第一行 `console.log("1")` 是同步任務，會立刻執行，印出 1。
2. 第二行 `setTimeout()` 排程了 0 秒後執行一個 callback function。此 callback function 是一個 macro task，會被放進 Task Queue 裡。
3. 第三行的 promise 立即 resolve，`.then()` 的 callback 是一個 microtask，因此會被放進 microtask queue 裡。
4. 第四行的 `console.log("4")` 是同步任務，會立刻執行，印出 4。
5. Event loop 檢查 call stack 發現為空，先確認 microtask 裡是否有尚未執行的任務。此時 microtask 裡的 `console.log("3")` 被放進 call stack 執行，印出 3。
6. Event loop 檢查 call stack 發現為空，也確認 microtask 為空，才確認 Task Queue 裡是否有尚未執行的任務。此時 Task Queue 的 `console.log("2")` 被放進 call stack 裡執行，印出 2。

因此印出的結果是 1 4 3 2。

### Bonus Challenge

以下程式碼會印出什麼呢？

```js
Promise.resolve()
  .then(() => console.log(1));

setTimeout(() => console.log(2), 10);

queueMicrotask(() => {
    console.log(3)
    queueMicrotask(() => console.log(4));
});

console.log(5)
```

分析：

1. `Promise.resolve().then` 的 callback（microtask）先放入 microtask queue。
2. `setTimeout` 的 callback（macro task）放入 Task Queue。
3. `queueMicrotask` 創建 microtask，放入 microtask queue。
4. `console.log(5)` 是同步任務，立即執行。
5. 開始處理 microtask queue：
    * 執行 `console.log(1)`。
    * 執行 `console.log(3)`，在執行過程中再新增一個 `console.log(4)` 到 microtask queue。
    * 執行新增的 `console.log(4)`。
6. 處理完 microtask queue，開始執行 Task Queue：
    * 執行 `console.log(2)`。

結果：5 1 3 4 2。

值得注意的是，在處理 queueMicrotask 的時候，每當一個 microtask 執行時產生新的 microtask，這些新任務會立即加入 Microtask Queue，並按照順序被處理。因此範例中，`console.log(4)` 之所以能在所有 microtask 完成之前被執行，是因為它被新增到 microtask queue 時仍屬於當前執行階段。

## 結論

Event Loop 是 JavaScript 非同步模型的核心，確保主執行緒的流暢運行。透過區分同步與非同步任務、管理不同的隊列（microtask queue 和 Task Queue），它讓 JavaScript 能夠有效處理事件，提供一種高效的非同步執行方式。

重點如下：

* Event loop 可以允許 JavaScript 將需要長時間執行的任務交給瀏覽器的 Web APIs，避免 main thread 被 block 住。
* Event loop 藉由不斷地確認 call stack 和 queues，確保 main thread 可以有效率的執行任務。
* 當非同步任務完成時，他們的 callback function 會被放進 Task Queue 或是 microtask queue 裡。
* 當 call stack 為空的時候，event loop 會從 microtask queue 和 Task Queue 中取出任務，放到 call stack 上執行。

理解 Event Loop 是 JavaScript 非同步架構的核心，對於前端開發者來說是不可或缺的基礎知識，理解 microtask 和 macro task 的差異有助於我們在實際開發中避免 race condition 或執行順序的混淆，進一步最佳化應用的性能。

讀者也可以試試看視覺化 Event Loop 工具：[Loupe: JS Event Loop Visualizer](http://latentflip.com/loupe)來加深你的理解。

## Reference

* [JavaScript Visualized - Event Loop, Web APIs, (Micro)task Queue](https://youtu.be/eiC58R16hb8?si=SyglHon9J5tbZKIK)：YouTube 影片，用視覺化的方式帶你快速了解 event loop 的運作方式。
* MDN Documentation：[Concurrency model and Event Loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop)
* [Jake Archibald on the web browser event loop, setTimeout, micro tasks, requestAnimationFrame, ...](https://youtu.be/cCOL7MC4Pl0?si=jZQYvA7fgJgvr30V)：YouTube 影片，讓你了解 event loop 在處理非同步程式碼的同時，如何協調瀏覽器的渲染操作，以及深入瞭解 `requestAnimationFrame` 和 micro tasks。

