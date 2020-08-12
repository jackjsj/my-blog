---
title: 数组去重的N种方法
date: 2020-08-12 09:30:00
categories:
  - 前端
tags:
  - 数组
  - 方法
  - ES6
  - 总结
---

本文总结了 6 种数组去重的方法。

<!-- more -->

## 双层循环法

思路：遍历目标数组，每次遍历，都判断当前元素是否存在于结果数组中（结果数组一开始是空的），如果不存在，就把这个元素放入结果数组中。

```js
function unique(array) {
  const res = []; // 结果数组
  // 遍历目标数组array，在每一次遍历中，遍历结果数组res
  // 通过双重遍历，判断结果数组res当前项是否能在目标数组中找到
  array.forEach((item) => {
    let i;
    for (i = 0, length = res.length; i < length; i++) {
      if (res[i] === item) {
        // 如果在目标数组中找到，直接跳出循环
        break;
      }
    }
    if (i === res.length) {
      // 如果循环次数与结果数组的长度一致
      // 说明遍历完了都没有找到和当前遍历项相同，则push入结果数组中
      res.push(item);
    }
  });
  return res;
}
const array = [1, 1, 2, 3, 3];
console.log(unique(array)); // [1,2,3]
```

此方法最为原始，兼容性最好。

## indexOf 方法

思路：此方法思路与双层循环法相同，只是将第二次遍历省去，而是用 indexOf 方法来判断当前元素是否存在于结果数组中。

```js
function unique(array) {
  const res = []; // 结果数组
  array.forEach((item) => {
    // 在ES6中可以使用includes方法
    // 如果用includes，结果为[1, 2, 3, NaN]
    // !res.includes(item) && res.push(item);
    if (res.indexOf(item) === -1) {
      //在结果数组中没找到，就塞入结果数组中
      res.push(item);
    }
  });
  return res;
}
const array = [1, 1, 2, 3, 3, NaN, NaN];
console.log(unique(array)); // [1, 2, 3, NaN, NaN]
```

ES6 可以使用 includes 方法，但二者是有区别的。includes 方法可以对 NaN 去重，indexOf 不能对 NaN 去重。

## filter+indexOf 方法

思路：filter 方法的第二个参数是个判断函数，满足条件的可被筛选出来，我们可以通过 indexOf 方法查出当前项在目标数组第一次查到的索引值，判断该索引是不是当前项的索引值，如果是就筛选出来，如果不是（说明当前项不是第一次出现了）就剔除。

```js
function unique(array) {
  return array.filter((item, index) => array.indexOf(item) === index);
}
const array = [1, 1, 2, 3, 3, NaN, NaN];
console.log(unique(array)); // [1, 2, 3]
// 这种方法NaN会被忽略掉，因为array.indexOf(NaN)的值为-1
```

## filter+hasOwnProperty

思路：创建一个空对象，filter 目标数组，通过对象的 hasOwnProperty 方法判断是否拥有当前项作为 key 值，如果有就返回 false，如果没有，就让这个 key 的值为 true，并返回 true

```js
// 第一版
function unique(array) {
  const obj = {};
  array.filter((item) =>
    obj.hasOwnProperty(item) ? false : (obj[item] = true)
  );
}
const array = [1, '1', 2, 3, 3, NaN, NaN];
console.log(unique(array)); //  [1, 2, 3, NaN]
```

我们可以发现，上面是有问题的，因为 1 和 '1' 是不同的，但是这种方法会判断为同一个值，这是因为对象的 key 值只能是字符串（es5 中），所以我们可以使用 typeof item + item 拼成字符串作为 key 值来避免这个问题：

```js
function unique(array) {
  const obj = {};
  array.filter((item) =>
    obj.hasOwnProperty(typeof item + item)
      ? false
      : (obj[typeof item + item] = true)
  );
}
const array = [1, '1', 2, 3, 3, NaN, NaN, { value: 1 }, { value: 2 }];
console.log(unique(array)); //  [1, "1", 2, 3, NaN, {value:1}]
```

通过添加了类型标识，解决了 1 和'1'的问题，但{value:1}和{value:2}只保留了 1 个，因为二者通过`typeof item + item` 计算后都是 object[object Object]，因此需要将对象序列化：

```js
function unique(array) {
  const obj = {};
  array.filter((item) =>
    obj.hasOwnProperty(typeof item + JSON.stringify(item))
      ? false
      : (obj[typeof item + JSON.stringify(item)] = true)
  );
}
const array = [1, '1', 2, 3, 3, NaN, NaN, { value: 1 }, { value: 2 }];
console.log(unique(array)); //  [1, "1", 2, 3, NaN, {value:1},{value:2}]
```

## ES6 方法

除了之前的 includes 方法外，还有其它的一些方法更加简洁，真香！

```js
function unique(array) {
  return Array.from(new Set(array));
}
const array = [1, '1', 2, 3, 3, NaN, NaN, { value: 1 }, { value: 1 }];
console.log(unique(array)); // [1, "1", 2, 3, NaN, { value: 1 }, { value: 1 }]
```

更香的写法：

```js
function unique(array) {
  return [...new Set(array)];
}
```

香爆了的写法：

```js
const unique = (array) => [...new Set(array)];
```

用 filter+Map 对象去重（filter+hasProperty 变种）：

```js
function unique(array) {
  const map = new Map();
  return array.filter((item) => (map.has(item) ? false : map.set(item, true)));
}
```

需要注意的是，以上的方法不能对对象去重，在实际的应用中也很少对对象去重。

## 对排序后的数组去重

思路：其实排序后，就可以通过遍历数组，对比后者和前者是否相同来决定是否去除了。

```js
// 假设array是排好序的数组
function unique(array) {
  return array.filter(
    (item, index) => index === 0 || array[index - 1] !== item
  );
}
```

## 代码汇总

```js
var array = [
  1,
  1,
  '1',
  '1',
  null,
  null,
  undefined,
  undefined,
  NaN,
  NaN,
  { a: 1 },
  { a: 1 },
  /a/,
  /a/,
];
// 1. 双层遍历
function unique1(array) {
  var result = [];
  for (var i = 0, length = array.length; i < length; i++) {
    var item = array[i];
    for (var j = 0; j < result.length; j++) {
      if (item === result[j]) {
        break;
      }
    }
    if (j === result.length) {
      result.push(item);
    }
  }
  return result;
}
console.log('双重遍历法：', unique1(array));
// 2. indexOf
function unique2(array) {
  var result = [];
  for (var i = 0, length = array.length; i < length; i++) {
    var item = array[i];
    // if(!result.includes(item)){
    //   result.push(item);
    // }
    if (result.indexOf(item) === -1) {
      result.push(item);
    }
  }
  return result;
}
console.log('indexOf法：', unique2(array));
// 3. 排序后去重
function uniqueAfterSort(array) {
  var result = [];
  array = array.slice().sort();
  result.push(array[0]);
  for (var i = 1, length = array.length; i < length; i++) {
    var item = array[i];
    if (item !== array[i - 1]) {
      result.push(item);
    }
  }
  return result;
}
console.log('排序后去重：', uniqueAfterSort(array));
// 4. filter+indexOf
function unique4(array) {
  return array.filter((item, index) => array.indexOf(item) === index);
}
console.log('filter+indexOf:', unique4(array)); // NaN会丢失
// 5. Object.hasOwnProperty
function unique5(array) {
  var obj = {};
  return array.filter((item) =>
    obj.hasOwnProperty(typeof item + JSON.stringify(item))
      ? false
      : (obj[typeof item + JSON.stringify(item)] = true)
  );
}
console.log('Object.hasOwnProperty:', unique5(array));
// 6.es6 Set
function unique6(array) {
  return [...new Set(array)];
}
console.log('es6 Set:', unique6(array));
// 6.es6 Map
function unique7(array) {
  let map = new Map();
  return array.filter((item) => (map.has(item) ? false : map.set(item, 1)));
}
console.log('es6 Map:', unique7(array));
```
