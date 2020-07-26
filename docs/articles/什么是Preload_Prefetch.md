---
title: 什么是Preload/Prefetch？
date: 2020-07-26 23:00:00
categories:
 - 前端
tags:
 - preload
 - prefetch
 - vue-cli
 - 性能优化
---

在使用 `Vue cli` 打包后的 `index.html` 中发现了在 `link` 标签中有`preload` 和 `prefetch` 作为其 `rel` 属性值，不明何用。于是通过搜索相关资料了解到二者主要是用来优化页面加载速度的，有各自的使用场景，那么这里就对它们进行一番疏理。
<!-- more -->
## preload

`preload` 提供了一种声明式命令，让浏览器提前加载指定资源，但不会执行，等需要执行时再执行。使用方式如：

```html
<link rel="preload" href="index.js" as="script">
<link rel="preload" href="index.css" as="style">
...
<!-- 后面再添加相应的资源引用 -->
<link rel="stylesheet" href="index.css">
...
<script src="index.js"></script>
```

`preload` 的优先级很高，不管资源是否使用浏览器都会加载。如果预加载的资源最终没有被使用，在 Chrome 的 console 里会在 onload 事件 3s 后发生警告。因此，不要滥用 preload，以免给页面带来更沉重的负担。

它将加载和执行分离，让资源尽早的得到加载并可用（有效解决加载字体时出现的闪动）。而且，它不会阻塞页面的渲染和 document 的 load 事件。

请不要忽略 `as` 属性，或者使用错误的 `as` ，这样会使 `preload` 等同于 `XHR` 请求，浏览器不知道加载的是什么类型，会赋予非常低的加载优先级，达不到预加载的效果。`as` 的值可以是 style、script、image、font、fetch、document、audio、video等。

在 `link` 标签中可以指定 `onload` 和 `onerror` 方法，表示加载成功和失败触发的方法。如：

```html
<link rel="preload" href="style.css" onload="this.rel=stylesheet">
<!-- 这样可以让样式加载成功后，立即生效 -->
```

另外，`preload` 可以加载跨域资源，如果加载的是跨域资源或者字体资源需加上 `crossorigin` 属性，否则会导致资源的二次加载。

**属性支持度检测方法**：

```js
const preloadSupported = () => {
	const link = document.createElement('link');
	const relList = link.relList;
	if (!relList || relList.supports)
		return false;
	return relList.supports('preload');
}
```

## prefetch

`prefetch` 的作用是告诉浏览器加载未来页面（非当前页）可能会用到的资源，也是提前加载而不执行。使用方式如：

```html
<link rel="prefetch" href="other.js">
```

`prefetch` 加载优先级非常低，低到可能浏览器不一定会加载这些资源。注意不要混用 `preload` 和 `prefetch` ，同时使用并不会复用资源，而是会重复加载。

`prefetch` 加载的资源会放入缓存中至少5分钟（无论资源是否可缓存），而且当页面跳转时，未完成的 `prefetch` 请求不会中断。

由于自身的特性，使用 `prefetch` 可能会导致流量的浪费，因为很可能用户不会使用到加载的资源，尤其在移动端中应注意不要滥用 `prefetch` 。

## 相关扩展

### vue-cli项目中怎么取消 `prefetch`

 vue-cli 3.x 是默认开启 `prefetch` 的，通常使用动态按需加载 `import()` 而产生的 `js` 文件会使用 `prefetch` 。但上文说到在移动端不要滥用 `prefetch` ，但是因此对其关闭也是在移动端优化中非常有必要的。

实际上官方也给了明确的提示

:::tip 提示

Prefetch 链接将会消耗带宽。如果你的应用很大且有很多 async chunk，而用户主要使用的是对带宽较敏感的移动端，那么你可能需要关掉 prefetch 链接并手动选择要提前获取的代码区块。

:::

并给出了官方示例：

```js
// vue.config.js
module.exports = {
  chainWebpack: config => {
    // 方式一：移除 prefetch 插件
    config.plugins.delete('prefetch')

    // 方式二：修改它的选项：
    config.plugin('prefetch').tap(options => {
      options[0].fileBlacklist = options[0].fileBlacklist || []
      options[0].fileBlacklist.push(/myasyncRoute(.)+?\.js$/)
      return options
    })
  }
}
```

当 prefetch 插件被禁用时，你可以通过 webpack 的内联注释手动选定要提前获取的代码区块：

```js
import(/* webpackPrefetch: true */ './someAsyncComponent.vue')
```

webpack 的运行时会在父级区块被加载之后注入 prefetch 链接。

### dns-prefetch

`dns-prefetch` ，即 DNS 预获取，提前获取 CDN 的 DNS 可以减少用户等待时间。使用方式如：

```html
<link rel="dns-prefetch" href="//g.alicnd.com">
```

一般来说，浏览器会对页面中和当前域名不在同一域的域名进行预获取，并缓存结果，即隐式的 DNS Prefetch。但如果想对页面中没有出现的域进行预获取，那就要使用显式的 DNS Prefetch。

Chrome 和 Firefox 3.5+ 内置了该技术并对 DNS 预解析做了相应优化设置，所以即使不设置此属性，也能达到同样的效果。

`dns-prefetch` 应尽量放在网页前面，推荐放在 `<meta charset="UTF-8">` 下面。

通过以下方式，也可以禁止隐式的`dns-prefetch` ：

```html
<meta http-equiv="x-dns-prefetch-control" content="off">
```

##
