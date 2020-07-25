---
title: 'JS正则表达式相关方法'
date: 2020/04/09 11:49:34
tags:
  - 正则表达式
  - JavaScript
categories:
  - 前端
---

正则表达式用于匹配字符串中字符组合的模式。这种模式被用在正则表达式对象（RegExp）的`exec`和`test`方法，以及字符串（String）的`match`、`matchAll`、`replace`、`search`和`split`方法中。以下将一一介绍这些方法是如何配合正则表达式使用的。

<!-- more -->

## 正则表达式对象的实例方法

### `RegExp.prototype.test()`

该方法接受一个字符串，返回一个 boolean 值，表示当前正则是否匹配目标字符串。

```js
const regExp = /dog/g;
regExp.test('dog'); // true;
regExp.test('cat'); // false;
```

### `RegExp.prototype.exec()`

该方法接受一个字符串，返回一个**数组**或**null**，数组中除了匹配的结果外，还包含额外的属性**index**，**input**以及**groups**，同时还会更新当前正则的**`lastIndex`**属性。

完全匹配成功的文本将作为数组的第一项，从第二项起，后续每项都对应正则表达式内**捕获括号里**匹配成功的文本。

如果匹配失败，则返回`null`，并将`lastIndex`重置为 0。

返回的数组包含的属性如下：

- [0]：匹配的全部字符串
- [1]...[n]：捕获括号里的匹配的字符串，n 对应第 n 个捕获括号
- index: 匹配到的字符在目标字符串的索引值
- input: 目标（原始）字符串，其实就是 exec 接受到的字符串
- groups: 根据**命名的捕获组**生成的对象，key 为捕获组名，value 为捕获组所捕获的文本

```js
// 捕获括号中使用?<...>可以为捕获组【命名】
/\[object (?<type>.+)\]/g.exec(Object.prototype.toString.call({}) + '123');

// [0:'[object Object]', 1:'Object', index:0, input: '[object Object]123', group:{type:'Object'} length:2]
```

需要注意的是，如果正则表达式设置了`global`或`sticky`（如`/foo/g` 或 `/foo/y`）,正则表达式对象是**有状态**的。也就是会记录上一次匹配后的位置记录`lastIndex`，exec()可以对单个字符串中的多次匹配结果进行逐条遍历。

```js
const regex1 = /foo*/g;
const str1 = 'table football, foosball';
let array1;

// 如果不为null，就一直循环
while ((array1 = regex1.exec(str1)) !== null) {
  console.log(`Found ${array1[0]}. Next starts at ${regex1.lastIndex}.`);
  // expected output: "Found foo. Next starts at 9." 第一次匹配到football中的foo
  // expected output: "Found foo. Next starts at 19."第二次匹配到foosball中的foo
}
```

## 字符串中与正则相关的方法

### String.prototype.replace()

字符串的替换方法，接受两个参数，返回替换后的字符串：

1. 第一个参数可以是字符串或者是一个正则表达式，表示要替换的字符串，或是通过正则式表达式匹配的字符串来指定要替换的字符串。
2. 第二个参数也可以是字符串，也可以是一个回调函数，表示要替换的目标字符串，或者要替换成通过回调函数计算得到的字符串。

```js
const str = '<div>123</div>';
// 正则中使用[\数字]表示第数字n个捕获取捕获的文本
str.replace(/\<(\w+)\>(.+\)<\/\1\>/, function($0, $1, $2) {
  return '<p>' + $2 + '</p>';
});
```

### String.prototype.split()

字符串的分割方法，接受一个字符串，或通过正则表达式匹配的字符串来指定，返回一个分割后的字符串数组。

### String.prototype.match()

字符串的匹配方法，接受一个正则表达式，如果不是正则表达式，会使用`new RegExp()`进行隐式转换，返回一个数组，表示该正则表达式匹配到所有文本。

需要注意的是，如果没有设置 g 标志，返回结果同正则表达式的**exec()方法**。如果有 g 标志，则返回所有匹配文本的数组，不包含单项的具体信息。

### String.prototype.matchAll()

也是字符串的匹配方法，接受一个正则表达式，返回一个迭代器，遍历迭代器返回每一个匹配对象，同**exec()**方法

### String.prototype.search()

接受一个正则表达式，如果不是正则对象，会使用`new RegRex()`进行隐式转换。

如果匹配成功，则返回该正则在字符串中首次匹配项的索引，否则，返回-1;
