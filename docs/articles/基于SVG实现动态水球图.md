---
title: 基于SVG实现动态水球图
tags:
  - CSS
  - SVG
  - 动画
  - 效果
  - 图表
  - 水球图
categories:
  - 前端
date: 2020-05-21 09:03:34
---

在大屏项目中，经常需要通过水球图来表达**占比**指标，之前一直使用 `echarts-liquidfill` 库来实现，但是样式太固定，不够灵活，于是尝试自己来实现一个样式美观的水球图。
<!-- more -->
实际上，实现一个水球图的关键，是如何绘制一个波浪。我们可以通过 `SVG` 绘制一个**三次贝塞尔曲线**来实现。对`SVG` 不太熟悉的，可以在 [MDN 的 SVG 教程](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial) 先学习一下。

## 三次贝塞尔曲线

根据教程中的介绍，三次贝塞尔曲线需要**定义一个点和两个控制点**，用**C 命令**创建三次贝塞尔曲线，需要设置三组坐标参数：

> `C x1 y1, x2 y2, x y`

这里的最后一个坐标 `(x, y)` 表示的是曲线的**终点**，另外两个坐标是**控制点**，其中 `(x1, y1)` 是起点的控制点，`(x2, y2)` 是终点的控制点。控制点描述的是曲线起始点的斜率，曲线上各点的斜率，是从起点斜率到终点斜率的渐变过程。可以通过一张图来感受一下控制点在不同位置时的三次贝塞尔曲线的样子。

![](https://media.prod.mdn.mozit.cloud/attachments/2012/07/09/326/76fac9890a405b70098ec9cf309e1cd3/Cubic_Bezier_Curves.png)

我们可以使用 C 命令来绘制一个波浪曲线，如下图：

![ShortCut_Cubic_Bezier.png](https://i.loli.net/2020/05/21/ftaTVzWGnC7KgvF.png)

```html
<svg
  width="200px"
  height="200px"
  version="1.1"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="M0 100 C 40 50, 60 50, 100 100 C 140 150, 160 150, 200 100"
    stroke="black"
    fill="transparent"
  />
</svg>
```

注意，`SVG` 的坐标原点默认是左上角，即左上角的坐标是 (0, 0)。

这样一个波浪曲线就绘制好了，但是我们实际需要的是一个闭合的面，使用 L 命令和 Z 命令补足剩余的路径形成一个闭合图形。

```html
<svg
  width="200px"
  height="200px"
  version="1.1"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="M0 100 C 40 50, 60 50, 100 100 C 140 150, 160 150, 200 100 L200 200, 0 200 Z"
    stroke="black"
    fill="rgba(10, 177, 255, 0.3)"
  />
</svg>
```

![image-20200521100151261.png](https://i.loli.net/2020/05/21/cKfRgxY7CuXFovV.png)

## 给波浪添加动效

给波浪图添加一个从左往右的动画。

```css
@keyframes move {
  from {
    left: 0;
  }
  to {
    left: 200px;
  }
}
.svg-item {
  position: absolute;
  top: 0;
  left: 0;
  animation: move 5s linear infinite;
}
```

为了能够看起来是连续不断的，还需要在原来的波浪图上添加一段相同长度的波浪，高度也变为原来的两倍，然后让动画从`left:-200px` 变化至 `left:200px`。

## 适应容器

在 `SVG` 标签中设置一个相对的容器视口 `viewBox` ，这里设置成 `400*400` 的画布大小，这样 `SVG` 内中的坐标位置都会相对于视口，并且将 `SVG` 的宽高设置成 200%，即为容器的两倍大（为了实现连续不断的动效），`CSS` 中的 `left` 属性也需要设置成百分比，这样就能实现容器的自适应。

以下是容器为 `100px*100px` 的水球图完整例子。

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="result" data-user="jackjsj" data-slug-hash="zYveOvQ" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="水球图">
  <span>See the Pen <a href="https://codepen.io/jackjsj/pen/zYveOvQ">
  水球图</a> by Jesse (<a href="https://codepen.io/jackjsj">@jackjsj</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

我们可以通过改变 `svg` 的`top` 值来展示不同的水位，需注意的是，当 `svg` 的 `top` 为 0 时，水位是`50%`，因为我们设置的曲线初始点和终点都是在中间位置（当初是为了调试`SVG`更直观），那么如果水位为 `0%` 时，`top` 值应设置为 `50%`，而水位为 `100%` 时， `top` 值应设置为 `-50%`。

当然也可以将起始点，控制点和终点的纵坐标都加上 200，这样 `top` 值的意思将更好理解，只需把 `top` 设置成实际指标百分比的相反数即可。

## 结尾

实际上，项目中还添加了一些斜率不同的波浪，实现了多波浪交错翻滚的效果，并且还将其抽取成了通用组件，可配置颜色外观，水位等属性。
