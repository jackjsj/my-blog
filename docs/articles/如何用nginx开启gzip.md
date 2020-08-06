---
title: 如何用nginx开启gzip?
date: 2020-07-26 13:30:00
categories:
  - 前端
tags:
  - nginx
  - gzip
  - 部署
  - 性能优化
---

服务端对响应资源进行压缩后发送一般能够大大减少传输数据的大小，减少流量，达到性能优化的目的。本文将介绍如何使用 nginx 来开启 gzip 对响应进行压缩，包括动态压缩和静态压缩的实现方式。

<!-- more -->

## 使用 nginx 开启 gzip

### 在 nginx 中的配置位置

与大多数其他指令一样，gzip 相关配置可以包含在 `http` 、`server` 或 `location` 中。

### 启用压缩

要启用压缩，需在 nginx 配置中添加 `gzip` 参数，并设置为 `on` 。

```javascript
gzip on;
```

### 指定压缩类型

**注**：默认情况下， nginx 仅压缩 MIME 类型为 `text/html` 的响应。如果要压缩其它 MIME 类型的响应，需设置 `gzip_types` 参数，如：

```javascript
gzip_types application/javascript text/css text/xml;
```

以上设置将对 `js` 、`css` 以及 `html` 类型的响应资源进行压缩。

### 指定压缩策略

默认情况下，nginx 会对 20 字节(byte) 以上的响应资源进行压缩，通过指定 `gzip_min_length` 可以进行调整，如：

```javascript
gzip_min_length 10240;
```

以上设置表示对大小为 10kb 以上的响应资源进行压缩，低于 10kb 的响应不进行压缩处理。

### 对代理请求进行压缩

默认情况下，nginx 不会对来自代理服务的请求进行响应压缩。一个请求是否来代理服务器取决于请求头中是否在 `via` 请求头的存在，即如果请求头中有 `via` 字段，说明请求来自代理服务器。

如需对代理请求进行响应压缩，则使用 `gzip_proxied` 指令。该指令有一系列参数，用于指定哪些代理请求需要响应压缩。比如，只对那些不缓存在代理服务器的请求进行响应压缩，则可以设置参数值 `no-cache` , `no-store` 或 `private` 来指示 nginx 去检查`Cache-Control` 响应头。

另外，必须包含 `expired` 参数来检查 `Expired` 值，包含 `auth` 参数来检查是否存在 `Authorization` 字段，授权响应通常不会缓存。

## 静态压缩

### 什么是静态压缩

之前我们使用的都是动态压缩的方式，即 nginx 自带 gzip 模块，开启后会对每个请求响应先压缩再返回，这样会造成虚拟机浪费很多 CPU， 因此为了解决这个问题可以利用 nginx 的 `gzip precompression` 模块。

这个模块的作用是对于需要压缩的文件，直接读取已经压缩好的文件（如.gz 文件），对于不支持 gzip 的请求则读取原文件，而不是请求时才进行动态压缩。

所谓静态压缩就是，返回响应时使用的是提前压缩好的文件，这个文件一般是在打包时生成的。

### nginx 如何开启静态压缩

要向客户端发送文件的压缩版本，需要在适当的上下文中将 `gzip_static` 指令设置为 `on` ，如：

```javascript
location / {
  gzip_static on;
}
```

以上配置生效后，nginx 将尝试寻找并返回 `/path/to/file.gz` 资源，如果该资源不存在或客户端不支持 `gzip` , nginx 就会发送非压缩的版本。

**注**：gzip_types 设置对 gzip_static 无效，也就是如开启静态压缩，则不管 gzip_types 配置了什么 MIME 类型，只要有相应的 gz 文件，就会返回压缩后的版本。

### 如何提前生成 gz 文件？

nginx 已经配置好了，但是 gz 文件如何提前生成呢？这里以 webpack 前端项目为例，我们可以使用 webpack 的一个压缩插件 `compression-webpack-plugin` 。

该插件能够在打包时，对指定文件进行 `gz` 压缩并生成压缩后的文件，使用方式如下：

```javascript
// webpack.config.js
const CompressionPlugin = require('compression-webpack-plugin');

modules.exports = {
  ...
  plugins:[new CompressionPlugin({
      test: /\.(js|css|html|svg)$/i, // 对js\css\html\svg类型文件进行压缩
      threshold: 10240, // 压缩策略为仅对大于10kb的文件进行压缩
  })]
}
```

其它配置可参考插件的配置说明文档，[https://www.npmjs.com/package/compression-webpack-plugin](https://www.npmjs.com/package/compression-webpack-plugin)
