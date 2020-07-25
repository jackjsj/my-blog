---
title: 'JS实现数字千分位分隔的三种方法'
date: 2020/04/09 15:49:34
tags:
  - JavaScript
  - 面试题
categories:
  - 前端
---
这是一道常见的前端面试题，本文将介绍三种实现方法。
<!-- more -->
## 原生 JS

使用 Number.prototype.toLocaleString()方法

```js
function fn1(num) {
  const result = Number(num).toLocaleString();
  console.log(result);
  return result;
}
```

## 拆分，遍历，能整除 3 的位置加逗号

获取整数部分，然后拆分成一个个字符串数组，将数组反转，设置一个新数组，遍历字符串数组，在遍历的索引为 3 的整数倍时（即索引能整除 3 且索引不为 0），添加一个逗号到新数组中，然后添加当前字符到新数组，然后将新数组反转，并用 join 连接，连接小数部分，得到最终的结果

```js
function fn2(num) {
  let [integer, decimal] = String.prototype.split.call(num, '.');
  const charArr = integer.split('');
  let nums = [];
  charArr.reverse().forEach((item, index) => {
    if (index % 3 === 0 && index != 0) {
      nums.push(',');
    }
    nums.push(item);
  });
  integer = nums.reverse().join('');
  const result = decimal ? integer + '.' + decimal : integer;
  console.log(result);
  return result;
}
```

## 优雅正则

要先用'.'分隔整数和小数部分，然后对整数部分进行正则匹配，通过 replace 替换，然后再将小数部分拼接。

找到后面是 3 或 3n 的非边界位置，然后替换成逗号。

```js
function fn3(num){
    let [interger, decimal] = String.prototype.split.call(num, '.');
    interger = interger.replace(/(\B)(?=(\d{3})+)$/g),',');
    const result = decimal ? interger + '.' +decimal : interger;
    console.log(result);
    return result;
}
```
