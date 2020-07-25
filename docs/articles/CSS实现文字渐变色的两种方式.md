---
title: CSS实现文字渐变色的两种方式
tags:
  - CSS
  - Sass
categories:
  - 前端
date: 2020-05-18 20:03:34
---

在做大屏页面开发的时候，经常需要显示带渐变色的文字效果，这里简单总结了两种实现方式。

<!-- more -->

## 1. 使用-webkit-background-clip

### 思路

1. 将文字设置成透明；
2. 背景使用渐变色；
3. 设置 `-webkit-background-clip` 为 `text`， 即背景使用文字来裁剪。

### 关键代码

```css
/** 关键代码 **/
span {
  color: transparent; /** 文字颜色设为透明 **/
  background: linear-gradient(to right, red, blue); /** 背影颜色使用渐变色 **/
  -webkit-background-clip: text; /** 背景被裁剪成文字的前景色 **/
}
```

### 示例

<p class="codepen" data-height="265" data-theme-id="light" data-default-tab="result" data-user="jackjsj" data-slug-hash="vYNQyEZ" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="vYNQyEZ">
  <span>See the Pen <a href="https://codepen.io/jackjsj/pen/vYNQyEZ">
  vYNQyEZ</a> by Jesse (<a href="https://codepen.io/jackjsj">@jackjsj</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

## 2. 使用-webkit-mask

### 思路

1. 在要设置为渐变色的 html 标签中设置一个属性，如 text，其值为要渲染成渐变色的文字；
2. 将该标签样式的 `position` 设置为 `relative` ，并设置成其中一个渐变颜色；
3. 使用伪元素 `::after` ( `::before` 亦可)，设置内容为 `attr(text)` ，并设置其绝对定位，使伪元素与文字完全重叠；
4. 将伪元素的颜色设置成另一个渐变颜色；
5. 最后使用 `-webkit-mask` ，将值设置成渐变色，关键是将其中一个渐变色设置成透明，透明的地方将会显示层叠在下方的文字颜色。

### 关键代码

```css
span {
  position: relative;
  color: blue;
}
span::after {
  position: absolute;
  top: 0;
  left: 0;
  content: attr(text);
  color: green;
  -webkit-mask: linear-gradient(to left, #fff, transparent);
}
```

### 示例

<p class="codepen" data-height="265" data-theme-id="light" data-default-tab="result" data-user="jackjsj" data-slug-hash="pojQRLP" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="文字渐变色2">
  <span>See the Pen <a href="https://codepen.io/jackjsj/pen/pojQRLP">
  文字渐变色2</a> by Jesse (<a href="https://codepen.io/jackjsj">@jackjsj</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

## 总结

显然，第一种方式代码量少，使用方便，应是首选。但是第一种方式在某些版本的 Chrome 浏览器中存在[bug](https://codepen.io/jackjsj/pen/XWmyMmx)，无奈只能选用第二种方式。

第二种方式，虽然使用繁琐，但可以结合 `scss` 的混入特性，封装成 `mixin` 方法后使用 `@include` 混入也非常的方便，当然不能忘了在文本 HTML 标签上添加一个属性用于伪元素的 `content`。

```scss
@mixin gradientText($color1: #3cddff, $color2: #0084ff, $to: top) {
  position: relative;
  color: $color1;
  &:before {
    content: attr(text);
    position: absolute;
    z-index: 10;
    color: $color2;
    -webkit-mask: linear-gradient(to $to, $color1, transparent);
  }
}
```
