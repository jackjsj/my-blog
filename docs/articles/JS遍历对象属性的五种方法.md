---
title: 'JS遍历对象属性的五种方法'
date: 2020/02/17 15:49:34
tags:
  - 对象
  - 遍历
categories:
  - 前端
---

在开发中，我们常常需要遍历一个 JS 对象的 key 值，这里总结一下 ES6 中主要的五种方法：

1. `for...in`
2. `Object.keys(obj)`
3. `Object.getOwnPropertyNames(obj)`
4. `Object.getOwnPropertySymbols(obj)`
5. `Reflect.ownKeys(obj)`

<!-- more -->

为了测试，我们先定义一个 Person 构造函数，它有 5 个实例属性，分别是`name`, `age`, `sex`, `Symbol.for('foo')`和`Symbol.for('hello')`， 其中`name`和`age`是可枚举的，`sex`是不可枚举的, Symbol.for('foo')是可枚举的 Symbol 属性，Symbol.for('hello')是不可枚举的 Symbol 属性。另外原型上还有两个方法，`sayHello`可枚举和`toString`不可枚举。代码如下：

```js
function Person(name, age, sex) {
  this.name = name;
  this.age = age;
  Object.defineProperty(this, 'sex', {
    value: sex,
    enumberable: false, // 性别属性设为不可枚举
  });
  // 添加一个Symbol类型的属性
  this[Symbol.for('foo')] = 'bar';
  // 添加一个不可枚举的Symbol属性
  Object.defineProperty(this, Symbol.for('hello'), {
    value: 'world',
    enumberable: false,
  });
}
Person.prototype.sayHello = function () {
  console.log('hello');
};
// 定义一个不可枚举的原型方法
Person.prototype.toString = Object.defineProperty(
  Person.prototype,
  'toString',
  {
    value: function () {
      console.log('name=' + this.name + '&age=' + this.age);
    },
    enumerable: false, // 不可枚举
  }
);
const person = new Person('Jesse', 18, '男');
console.log(person);
// Person {name: "Jesse", age: 18, sex: "男"}
```

## for ... in

`for...in`可以遍历出所有**自身可枚举**属性，同时也会遍历出**原型链上的可枚举属性**，不能遍历 Symbol 属性。

```js
...
person.toString(); // name=Jesse&age=18
for(const key in person){
    console.log(key);
}
// name
// age
// sayHello

// 如果只想要自己的属性可以加一个hasOwnProperty方法进行判断
for(const key in person){
    if(person.hasOwnProperty(key)){
        console.log(key);
    }
}
// name
// age
```

代码中使用了`for...in`对`person`实例进行遍历，结果除了实例自己的`name`和`age`属性，还有原型链上的`sayHello`属性，而`sex`属性和原型链上的`toString`属性都是**不可枚举的**， 所以不能被遍历。

如果只想要自己的属性，可以调用目标对象的`hasOwnProperty`方法，该方法可判断属性是否是自身的。

## Object.keys()

该方法传入目标遍历对象作为参数，返回的是目标对象**自身可枚举**的属性名数组，不包含 Symbol 属性。

```js
...
const propKeys = Object.keys(person); // 只包含自身可枚举的且非Symbol类型的属性名。
propKeys.forEach(key=>console.log(key));
// name
// age
```

## Object.getOwnPropertyNames()

该方法也是传入目标遍历对象作为参数，但返回的是目标对象**自身非`Symbol`类型且可枚举**的属性名数组。

```js
...
const propNames = Object.getOwnPropertyNames(person);
propNames.forEach(key=>console.log(key));
// name
// age
// sex 包含了不可枚举的自身对象
```

## Object.getOwnPropertySymbols()

该方法也是传入目标对象作为参数，但返回的是目标对象**自身所有`Symbol`类型**的属性名数组，包括不可枚举的 Symbol 属性。

```js
const symbolKeys = Object.getOwnPropertySymbols(person);
symbolKeys.forEach((key) => console.log(key));
// Symbol(foo)
// Symbol(hello)
```

## Reflect.ownKeys()

该方法也是传入目标对象作为参数，返回的是目标对象**自身所有**属性名数组，包括不可枚举的属性。相当于`Object.getOwnPropertyNames`与`Object.getOwnPropertySymbols`之和。

```js
const allKeys = Reflect.ownKeys(person);
console.log(allKeys);
//Array(5) ["name", "age", "sex", Symbol(foo), Symbol(hello)]
```

## 总结

| 方法                           | 自身属性 | 继承属性 | 含不可枚举属性 | 含 Symbol | ES 标准 |
| ------------------------------ | -------- | -------- | -------------- | --------- | ------- |
| for...in                       | √        | √        | ×              | ×         | ES5     |
| Object.keys()                  | √        | ×        | ×              | ×         | ES5     |
| Object.getOwnPropertyNames()   | √        | ×        | √              | ×         | ES5     |
| Object.getOwnPropertySymbols() | √        | ×        | √              | √         | ES6     |
| Reflect.ownKeys()              | √        | ×        | √              | √         | ES6     |
