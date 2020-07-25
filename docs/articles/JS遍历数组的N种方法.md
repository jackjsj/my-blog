---
title: 'JS遍历数组的N种方法'
date: 2020/04/09 09:58:34
tags:
  - JavaScript
  - 数组
  - 遍历
categories:
  - 前端
---

数组的遍历在实际的开发中是必不可少的基本功，本文总结一下，温故知新。
<!-- more -->
## 1. for 循环

```js
const array = [1, 2, 3, 4, 5];
for (let i = 0, length = array.length; i < length; i++) {
  console.log(array[i]);
}
```

最经典的 for 循环，优点是兼容性好，可以使用`break`或`continue`，缺点可能是要计算长度。

## 2. 数组的 forEach 方法

```js
array.forEach((item, i) => {
  console.log(item);
});
```

这个写法优点是简结，不需要计算长度，缺点就是不能使用`break`或`continue`

## 3. for...in (不推荐)

```js
for (let i in array) {
  console.log(array[i]);
}
```

这种实际是用来遍历对象的，数组也属于对象，i 是数组的索引值。

缺点是 for...in 也不能`break`，而且如果在`Array.prototype`添加了属性，这个属性也会被遍历出来，因此最好选择其它遍历方法。

## 4. for...of 语法

```js
for (let [item, i] of array.entries()) {
  if (i === 2) {
    break;
  }
  console.log(item, i);
}
```

这个是`ES6`的语法，使用了数组的 entries，先获取迭代器，然后使用`let...of`遍历迭代器，而且`let of`可以用`break`，个人认为是最优雅的写法。

## N. 其它循环方法(不常用)

```js
// while
let i = 0;
while (i < array.length) {
  console.log(array[i]);
  i++;
}

// do...while
let j = 0;
do {
  console.log(array[j]);
  j++;
} while (j < array.length);
```

待补充...
