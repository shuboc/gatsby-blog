---
title: "最大子數列問題 (Maximum Subarray Problem) 及 Kadane's Algorithm"
tags: [algorithm, dynamic programming]
date: "2017-04-01"
---

給定 A = [a0, a1, ..., an-1]，如何使得 slice 的和 sum(A[p], A[p+1], ..., A[q]) 有最大值 (slice長度可以為0) ？有個知名的 Kadane's Algorithm 可以解決這個問題。

## 目錄

```toc
```

## Kadane's Algorithm

如果已知 `A[:i]` 的 max sum，那麼 `A[:i+1]` 的 max sum 必定包含或不包含 `A[:i]` 的 prefix。

對每個 `A` 內的元素，求目前位置 `i` 所能達到的 sum 最大值，令其為 `max_ending_here`。

包含 prefix 的情況下，`max_ending_here` 等於 prefix 加上當前元素 `a`。

不包含 prefix 的情況下，`max_ending_here` 為 0，因為不包含的情況，表示 `max_ending_here + a` 小於 0，所以我們可以直接捨棄掉 prefix 和當前元素 `a`，令 `max_ending_here` 歸零，從下一個元素開始累積 sum。

~~~Python
def max_slice(A):
    max_ending_here = result = 0
    for a in A:
        max_ending_here = max(0, max_ending_here + a)
        result = max(result, max_ending_here)

    return result
~~~

## 參考

[Maximum Subarray Problem - Wikipedia](https://en.wikipedia.org/wiki/Maximum_subarray_problem)
