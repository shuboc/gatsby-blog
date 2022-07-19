---
title: "[教學] Binary Search 二元搜尋法"
tags: ["algorithm"]
date: "2022-04-26"
---

在一個已排序的陣列中，可用 binary search 演算法快速找到你要的數字。Binary search 概念雖然簡單，但是實作上卻有許多細節需要注意，要加一減一？小於還是小於等於？都需要非常小心。

```toc
```

## Binary Search 二元搜尋演算法介紹

Binary search 用兩個變數 `hi` 和 `lo` 分別代表搜尋範圍的上限和下限的 index (有包含 lo 和 hi 在內)。`lo` 初始為 0，`hi` 初始為陣列的最後一個 index。當 `lo <= hi` 時，用一個 while loop 重複以下的搜尋動作，直到找到目標值，或是當 `lo == hi + 1` 時 while loop 結束，表示搜尋範圍為空集合，找不到 `target`，這時回傳 -1。

在 while loop 內，比較搜尋範圍正中間的值 pivot 和目標值 target：

1. 如果 pivot 等於 target 就找到我們要的目標值，回傳結果。
2. 如果 pivot 大於 target，表示目標值在 pivot 的左邊，令 `hi = mid - 1` 縮小搜尋範圍。
3. 如果 pivot 小於 target，表示目標值在右邊，令 `lo = mid + 1` 縮小搜尋範圍。

```js
function binarySearch(nums, target) {
    let lo = 0, hi = nums.length - 1
    while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2)
        const pivot = nums[mid]
        if (pivot === target) {
            return mid
        } else if (pivot > target) {
            hi = mid - 1
        } else if (pivot < target) {
            lo = mid + 1
        }
    }
    return -1
}
```

Binary Search 的重點是：`hi` 和 `lo` 分別代表搜尋範圍的上限和下限的 index (有包含 lo 和 hi 在內)，用數學術語表示就是閉區間 `[hi, lo]`。有了搜尋區間的觀念，要注意的部分是：

1. `lo <= hi`，`lo` 可以等於 `hi`，表示搜尋範圍內還有一個數。
2. `hi = mid - 1`，搜尋範圍要排除掉 `mid`。
3. `lo = mid + 1`，搜尋範圍要排除掉 `mid`。

我們也可以把搜尋的範圍改成開區間 `[lo, hi)`，但演算法也需要相對應的修改，為了避免混淆在此就不多做說明。

相關 LeetCode：

[33. Search in Rotated Sorted Array](https://leetcode.com/problems/search-in-rotated-sorted-array/)：小細節很多，花了很久才寫對。

## 搜尋左邊界

如果我們想要搜尋的目標數字在陣列中有重複，而我們想要找到左邊界，例如: `nums = [1, 2, 2, 2, 3]`，target = 2，左邊界 index = 1，該怎麼做呢？

我們可以修改 `pivot == target` 的處理方式，檢查目前的值是否已是左邊界，條件是 `lo == mid` (搜尋範圍已縮到最小) 或是 `nums[mid - 1] !== target` (左邊一格的值是其他值，表示現在這個值就是邊界)。

```js
function binarySearchLeft(nums, target) {
    let lo = 0, hi = nums.length - 1
    while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2)
        const num = nums[mid]
        if (num > target) {
            hi = mid - 1
        } else if (num < target) {
            lo = mid + 1
        } else if (num === target) {
            // 確認是否為左邊界
            if (lo === mid || nums[mid - 1] !== target) return mid
            // 尚未遇到左邊界，繼續往左縮小搜尋範圍
            hi = mid - 1
        }
    }
    return -1
}
```

另外一種修改 `pivot == target` 的處理方式是一律改成繼續向左搜尋 (`hi = mid - 1`)，最後的 `lo` 就會是左邊界，但是需要做額外的檢查。

注意當 target 比陣列的最大值還大時，左邊界可能會超出陣列的範圍 (因為 while loop 結束時 `lo == hi + 1`)，所以還要檢查 `lo >= nums.length`。

另外也有可能 target 不存在陣列中，所以最後要檢查 `lo` 的數字是否為 target。

```js
function binarySearchLeft(nums, target) {
    let lo = 0, hi = nums.length - 1
    while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2)
        const num = nums[mid]
        if (num > target) {
            hi = mid - 1
        } else if (num < target) {
            lo = mid + 1
        } else if (num === target) {
            hi = mid - 1
        }
    }
    if (lo >= nums.length || nums[lo] !== target) return -1
    return lo
}
```

相關 LeetCode:

[34. Find First and Last Position of Element in Sorted Array](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/)

## 搜尋右邊界

如果我們想要搜尋的目標數字在陣列中有重複，而我們想要找到右邊界，例如: `nums = [1, 2, 2, 2, 3]`，target = 2，右邊界 index = 3，該怎麼做呢？

我們可以修改 `pivot == target` 的處理方式，檢查目前的值是否已是右邊界，條件是 `mid == hi` (搜尋範圍已縮到最小) 或是 `nums[mid + 1] !== target` (右邊一格的值是其他值，表示現在這個值就是邊界)。否則就繼續向右搜尋。

```js
function binarySearchRight(nums, target) {
    let lo = 0, hi = nums.length - 1
    while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2)
        const num = nums[mid]
        if (num > target) {
            hi = mid - 1
        } else if (num < target) {
            lo = mid + 1
        } else if (nums === target) {
            // 確認是否為右邊界
            if (mid === hi || nums[mid + 1] !== target) return mid
            // 尚未遇到右邊界，繼續向右縮小搜尋範圍
            lo = mid + 1
        }
    }
    return -1
}
```

另外一種修改 `pivot == target` 的處理方式是一律改成繼續向右搜尋 (`lo = mid + 1`)，最後的 `hi` 就會是右邊界，但是需要做額外的檢查：

1. 當 target 小於陣列中所有值時，`hi` 可能會超出陣列的範圍 (因為 while loop 結束時 `lo + 1 == hi`, or `hi == lo - 1`)，所以要檢查 `hi >= 0`。
2. 另外也有可能 target 不存在陣列中，所以最後要檢查 `hi` 的數字是否為 target。

```js
function bsRight(nums, target) {
    let lo = 0, hi = nums.length - 1
    while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2)
        const num = nums[mid]
        if (num > target) {
            hi = mid - 1
        } else if (num < target) {
            lo = mid + 1
        } else if (num === target) {
            lo = mid + 1
        }
    }
    if (hi < 0 || nums[hi] !== target) return -1
    return hi
}
```

相關 LeetCode:

[34. Find First and Last Position of Element in Sorted Array](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/)

## 參考資料

[刷題實戰筆記：演算法工程師求職加分的祕笈](https://www.books.com.tw/products/0010900855?loc=P_0003_005)