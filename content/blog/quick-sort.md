---
title: "Quick Sort 演算法原理與實作"
tags: ["javascript", "algorithm"]
last_modified_at: 2020/10/15
date: "2019-03-21"
---

Quick sort 快速排序演算法是一種 divide and conquer 的陣列排序方法，其過程如下：先從 array 中選出一個元素當基準 (pivot)，然後讓 pivot 左邊的元素都小於等於 pivot，pivot 右邊的元素都大於 pivot，這個過程稱為 partition。再分別對 pivot 左邊和右邊的 array 重複以上過程，就可以達到排序的效果，時間複雜度為 O(nlogn)。

## 目錄

```toc
```

## Quick Sort 介紹

[Quick Sort (快速排序)](https://en.wikipedia.org/wiki/Quicksort)，是一種 divide and conquer 的排序方法，其過程如下：

1. 先從 array 中選出一個元素當基準 (pivot)，然後讓 pivot 左邊的元素都小於 pivot，pivot 右邊的元素都大於等於 pivot。這個過程稱為 partition。
2. 分別對左邊的 array 和右邊的 array 重複這個過程。

舉個例子：

假設有個 array，初始狀態 = `[9, 4, 1, 6, 7, 3, 8, 2, 5]`。

首先，選定 5 作為 pivot。我們把小於 pivot 的通通擺在左邊，剩下的擺右邊，結果如下：

```
<--小於pivot--|--大於pivot->
[4, 1, 3, 2, 5, 9, 6, 7, 8]
             ^pivot
```

這樣我們就完成了一次 partition。

接下來分別對 pivot 左邊和右邊的 array `[4, 1, 3, 2]` 和 `[9, 6, 7, 8]` 重複一樣的過程，，就可以達到排序的效果。

Quick sort 的時間複雜度平均是 O(nlogn)。

## partition()

為了實作 quick sort，我們需要一個輔助函式 `partition()`。

`partition()` 的作用是從 array 中選出一個 pivot 當作標準，用這個 pivot 把 array 分成兩半，使得左半邊元素全部小於 pivot，右半邊元素全部大於等於 pivot。**注意它會直接修改原本的 array。**

以下會介紹兩種不同的 `partition()` 實作方式。

## Lomuto Partition Scheme

[Lomuto Partition Scheme](https://en.wikipedia.org/wiki/Quicksort#Lomuto_partition_scheme) 是一種常見的 quick sort 實作方法。它所使用的 partition 函式的概念如下：

1. 首先選出一個 pivot，這邊是用陣列內的最後一個元素 `arr[hi]`。
2. 用 `i` 紀錄下一個小於等於 `pivot` 的元素所要放置的位置，初始化為 `lo`。
3. 接著遍歷 `arr`，範圍從 `lo` 到 `hi - 1`。當發現小於等於 `pivot` 的元素時，就跟位於 `i` 的元素交換位置。每次交換完，就把 `i` 往前加一。
4. 遍歷結束以後，再把位於 `i` 的元素和位於 `hi` 的元素 (也就是 pivot) 作交換。
5. 最後回傳 `i`，它就是 pivot 的 index。

做完 partition， `i` 左邊的元素都會小於等於 pivot，右邊都會大於 pivot。實作如下：

```Javascript
function partition(arr, lo, hi) {
  // 選出 pivot
  const pivot = arr[hi];

  // 遍歷陣列，將小於等於 pivot 的元素和 i 位置的元素交換
  let i = lo;
  for (let j = lo; j < hi; ++j) {
    if (arr[j] <= pivot) {
      swap(arr, i, j);
      i++;
    }
  }

  // 將 pivot 和位於 i 的元素交換
  swap(arr, i, hi);
  return i;
}
```

基於這個 partition 的 quick sort 實作如下：

```js
function quickSort(arr, lo, hi) {
  const p = partition(arr, lo, hi)
  quickSort(arr, lo, p - 1)
  quickSort(arr, p + 1, hi)
}

quickSort(arr, 0, arr.length - 1)
```

## Hoare partition scheme

另外一種版本的 quick sort 實作是基於 [Hoare partition scheme](https://en.wikipedia.org/wiki/Quicksort#Hoare_partition_scheme)，與上一種實作的差別在於 partition 的實作方式。

這個版本的 partition 概念如下：

1. 選擇陣列中央的元素作為 pivot。
2. 從最前面開始掃描大於 pivot 的元素，從最後面開始掃描小於 pivot 的元素，找到之後交換。
3. 重複以上步驟，直到 lo 和 hi 相遇。

實作如下：

```Javascript
function partition(arr, lo, hi) {
  const pivot = arr[Math.floor((lo + hi) / 2)];
  let i = lo - 1;
  let j = hi + 1;
  while (true) {
    do {
        i++;
    } while (arr[i] < pivot);

    do {
        j--;
    } while (arr[j] > pivot);

    if (i >= j) {
      return j;
    }

    swap(arr, i, j);
  }
}
```

基於 Hoare partition scheme 的 quick sort 實作如下：

```Javascript
function quickSort(arr, lo, hi) {
  if (lo >=0 && hi >= 0 && lo < hi) {
    const p = partition(arr, lo, hi);
    quickSort(arr, lo, p); // 注意 p 有包含在內
    quickSort(arr, p + 1, hi);
  }
}

quickSort(arr, 0, arr.length - 1);
```

需注意遞迴的範圍和 Lomuto Partition Scheme 的實作不同，介於 `[lo, p]` 和 `[p + 1, hi]`。

## Quick Select 演算法

[Quick Select](https://en.wikipedia.org/wiki/Quickselect) 演算法可以用來快速找出 array 裡面第 k 小的元素。為了方便說明，先假設 k 是 zero-based。

對陣列做 partition，就可以得到分成兩半的陣列和 pivot index `p`。結果有三種情況：

1. `p == k`，因為 pivot 左邊所有元素都小於等於 pivot ，右邊元素都大於 pivot，所以 pivot 就是第 k 小的元素。
2. `p < k`，表示 pivot 的左半邊都比 pivot 小，我們只需要繼續對右半邊做 partition，直到 `p` 等於 k。
3. `p > k`，表示 pivot 的右半邊都比 pivot 大，我們只需要繼續對左半邊做 partition，直到 `p` 等於 k。

Quick select 平均時間複雜度為 O(n)。

實作如下 (partition 使用 Lomuto Partition Scheme 的版本)：

```Javascript
function quickSelect(arr, lo, hi, k) {
  if (lo === hi) {
    return arr[lo];
  }

  const p = partition(arr, lo, hi);
  if (p === k) {
    return arr[k];
  } else if (k < p) {
    return quickSelect(arr, lo, p - 1);
  } else {
    return quickSelect(arr, p + 1, hi, k)
  }
}
```

也可以改寫成迭代的版本:

```Javascript
function quickSelect(arr, lo, hi, k) {
  if (lo === hi) {
    return arr[lo];
  }

  while (true) {
    const p = partition(arr, lo, hi, k);
    if (p === k) {
      return arr[p];
    } else if (k < p) {
      hi = p - 1;
    } else {
      lo = p + 1;
    }
  }
}
```

LeetCode 相關題目:

[215. Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/)

[347. Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/)

## 參考資料

https://en.wikipedia.org/wiki/Quicksort

https://en.wikipedia.org/wiki/Quickselect

http://alrightchiu.github.io/SecondRound/comparison-sort-quick-sortkuai-su-pai-xu-fa.html

