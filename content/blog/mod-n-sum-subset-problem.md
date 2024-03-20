---
title: "Sum of subarray 的實用解題技巧"
tags: [algorithm]
date: "2017-03-27"
---

當遇到 sum of subarray 相關的問題時，有個很實用的解題技巧：所有的 sum of subarray 都可以用 Si - Sj 組出來，其中 Si = a0 + a1 + ... + ai。

## 目錄

```toc
```

## 問題: 0 mod n Sum Subset Problem

Given a set of numbers {a1-an}, what is the best way to come up with a nonempty subset such that the sum of its elements is 0 mod n, where n is the size of the original set?

### 解題思路

令 `Si = a0 + a1 + ... + ai`，考慮數列 `[S0 % n, S1 % n, ..., Sn % n]`，根據鴿籠原理，必定其中有一個 `Si` 等於 0 mod n，或是任兩個 `Si, Sj` 同屬 k mod n。

所以 mod n 的情況下，必定存在 subarray 使得 sum(subarray) = 0 mod n：

* `Si` = 0 mod n的情況，`Si`就是要找的subset。
* `Si` 和 `Sj` 同屬 k mod n 的情況，`Sj - Si` 就是要找的subset。

<!-- TODO: Zero sum Subarray -->

## 問題: Zero sum array

You're given a list of integers `nums`. Write a function that returns a boolean representing whether there exists a zero-sum subarray of `nums`.

### 解題思路

計算 subarray 的 sum 時，可以運用 subarray sum = Si - Sj 的性質。要找到 subarray sum === 0，只要滿足以下條件：

* Si === 0
* 或是 Si === Sj (i !== j) 的時候，存在 subarray 的 sum === 0。

另外搭配 Set 資料結構，就可以快速找到是否已經存在某個 subarray sum 的值。

### 參考解法

```js
function zeroSumSubarray(nums) {
  const sums = new Set()
  let sum = 0
  for (const num of nums) {
    sum += num

    // check if sum is zero or has been seen
    if (sum === 0 || sums.has(sum)) {
      return true
    }

    sums.add(sum)
  }

  return false
}
```

## 結論

心得：滿有趣的性質，所有的 sum of subarray 都可以用 Si - Sj 組出來。

## 參考

* [Given a set of numbers {a1-an}, what is the best way to come up with a nonempty subset such that the sum of its elements is 0 mod n, where n is the size of the original set? Is there a polynomial-time solution?](https://www.quora.com/Given-a-set-of-numbers-a1-an-what-is-the-best-way-to-come-up-with-a-nonempty-subset-such-that-the-sum-of-its-elements-is-0-mod-n-where-n-is-the-size-of-the-original-set-Is-there-a-polynomial-time-solution)
* [Zero Sum Subarray](https://www.algoexpert.io/questions/zero-sum-subarray)