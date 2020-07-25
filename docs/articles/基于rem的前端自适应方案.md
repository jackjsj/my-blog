---
title: '基于rem的前端自适应方案'
date: 2019/11/01 14:24:34
tags:
- CSS
- 自适应
- rem
categories:
- 前端
---

在进行前端页面开发时，我们一般根据设计稿用 `px` 设置大小。设计稿是在某一固定尺寸下设计的，当页面适口尺寸发生变化时，需要对页面中的元素进行自适应，也就是元素大小要根据页面尺寸的变化按比例地进行相应的调整（适配）。

<!-- more -->

比如，设计稿是按 750px 的宽度设计的（iphone6/7/8），页面上有一个`750px`宽的 div，其 CSS 样式

```css
div {
  width: 750px;
}
```

如果我们的页面在`640px`宽度的（iphone5）设备上显示，这个 div 的宽度需要按比例变成 640px。

要在运行阶段，根据窗口尺寸的变化，去修改页面上所有元素的`px`大小，显然不现实。那我们要如何去解决这个问题呢？

## 用`rem`单位来解决

`rem`可以和`px`单位进行换算的，而这个换算依赖于 html 根元素的`font-size`大小，比如谷歌浏览器 html 默认的 font-size 大小是`16px`，那意味着 1rem=16px。

单独地使用`rem`来设置元素大小，也并不能解决上面的问题，因为 html 的`font-size`不变，`rem`自然也不会变。所以我们可以在改变窗口尺寸的时候，重新设置 html 的`font-size`。

还是用上面的例子，设备宽度`750px`的页面中有一个 750px 的 div，那么我们设置 html 的 font-size 为 100px（为了换算方便）

```css
html {
  font-size: 100px;
}
div {
  width: 7.5rem;
}
```

当设备变成`640px`时，我们把 html 的`font-size`按比例缩小，通过计算

> 750:100 = 640:?
> 640\*100/750 = 85.333333
> 即 当前设备宽度 × 基数 ÷ 设计稿宽度

```css
html {
  font-size: 85.333333px;
}
```

那么此时页面中的元素`7.5rem`实际对应的实际像素宽度变为`640px`了。

以上的思路用代码实现，并在页面加载完后开始监听

```js
/** flexlib.js*/
(function () {
  function flex() {
    // 绑定到窗口的这个事件中
    const designSize = 750; // 设计图的宽度
    const html = document.documentElement;
    const wW = html.clientWidth; // 当前设备宽度
    const rem = (wW * 100) / designSize; // 100为基数
    document.documentElement.style.fontSize = `${rem}px`; // 修改html的font-size值
  }
  flex(); // 页面加载完后先调整一次
  window.onload = flex; // 每当页面重新加载的时候调整一次
  window.onresize = flex; // 每当页面窗口变化，调整一次
})();
```

## 利用`vw`单位省去对窗口变化的监听

利用 flexlib.js 来动态改变 html 的 font-size 方法非常好用，但还有另一个方法

用`vw`单位表示的大小也是一个相对的大小，这个大小依赖于当前窗口的宽度，换算方式为 1vw=1% × 当前窗口的宽度，如果我们用`vw`单位设置 html 的 font-size，那不就可以在窗口宽度发生变化时，改变 font-size 的值了吗？

```css
html {
  font-size: 10vw;
}
div {
  width: 10rem;
}
```

`750px`的设备页面中有一个`750px`的 div 元素，由于`font-size`当前是`10vw`，也就是`75px`，即 1rem 为 75px, 那么 750px 的元素宽度应设置为 10rem。

当窗口的宽度从`750px`变成`640px`时，此时 html 的`font-size`实际是`64px`， 也就是`1rem`变成`64px`了，那么 div 的`10rem`在`640px`的设备中的宽度变成了 640px，符合我们要的自适应需求。

这个方法很香，但 vw 单位有的浏览器并不兼容，考虑到浏览器的兼容性，还是使用 flexlib.js 比较安全。

## px to rem

以上的两个方法，在开发时，都要在 css 中使用 rem 单位，那就意味着我们要把设计稿中的`px`根据基数转换成相应的`rem`单位的值，虽然可以使用开发工具的一些插件来实现，但通过转换后的 rem 单位的值看起来不太直观，体验并不好。有没有方法可以在开发的时候源码中使用`px`单位，然后通过编译才转为`rem`呢？

答案当前是有，而且相关的插件还挺多，比如`postcss-pxtorem` 。 它的功能就是将我们的`px`根据我们设置的一些参数在代码打包编译阶段帮我们转成`rem`单位，具体的使用去查相关的文档，这里就不再赘述了。
