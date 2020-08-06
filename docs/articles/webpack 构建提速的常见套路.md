\---

title: webpack 构建提速的常见套路

date: 2020-08-06 12:00:00

categories:

 \- 前端

tags:

 \- webpack

 \- cdn

 \- 插件

 \- 性能优化

\---



对于前端项目而言，【快】似乎对我们来说一直都是追求的目标，不管是 npm 下载安装依赖的速度，还是 webpack 的打包速度，亦或是实际的资源加载运行速度，都要求精益求精，没有最快，只有更快，这也正是性能优化的意义所在。本文将对提高 webpack 打包构建速度的常用套路进行展开讨论，总结疏理实际的配置方式和优缺点。

<!-- more -->

## CDN + externals

通过 CDN 引入一些几乎不会发生变更的库，而不是通过 npm 来安装到本地，可以省去 webpack 对这些库打包的过程。

### 配置细节

首先我们可以在网上找一些免费的 CDN 加速服务提供者（这里推荐使用 [https://www.bootcdn.cn/](https://www.bootcdn.cn/)），在上面找到你引入的库，比如 `echarts`。将 CDN 地址添加到 `index.html` 中通过 script 标签引入。

```html
<link rel="preload" as="script" href="//cdn.bootcdn.net/ajax/libs/echarts/4.6.0/echarts.min.js"/>
...
<script src="//cdn.bootcdn.net/ajax/libs/echarts/4.6.0/echarts.min.js"></script>
```

通过添加 `preload` 可以进行预加载提高优先级。不加协议名，会自动根据当前项目的协议来添加。

如果 webpack 不作配置，此时已经可以在项目中的全局变量中找到 `echarts` 并直接使用。

但更优的方式是通过 `import echarts from 'echarts'` 来引入，这样我们就需要用到 webpack 的 externals 来配置外部扩展。

```js
module.exports = {
    //...
    externals:{
        echarts:'echarts', // 使用字符串，意味着它将被视为全局的
        jquery:'jQuery', // 注意冒号前的为包名，冒号后的为引入的变量名
        vue:'Vue',
    }
}
```

`externals` 的作用，官方的解释是 【从输出的 bundle 中排除依赖】，并且所输出的 bundle 依赖于那些存在于用户环境中的依赖。结合我们的例子，那就是如果我们在 externals 中配置了`echarts` ，那么 `echarts` 将不会去 node_modules 中找到并输出，而是依赖于用户使用的环境，我们之前在 `index.html` 中添加了对 `echarts` 的引用，那么就依赖于我们提供的全局环境。 

### 优缺点

- 优点：CDN 加速，提高加载速度；省去打包过程，提高构建速度
- 缺点：资源来自于 CDN 意味着需要有网络环境；CDN 提供的一般是完整的包，无法进行按需加载，如果只是其它页面需要，会增加首屏的加载负担。

## DllPlugin 和 DllReferencePlugin

`DllPlugin` 和 `DllReferencePlugin` 用某种方法实现了拆分 bundles，同时还大幅度提升了构建的速度。"DLL" 一词代表微软最初引入的动态链接库。

可以利用这组插件预先对不常变的库进行预先打包，以后项目只需要打包我们自己写的代码，从而提高打包的速度。

### 配置细节

创建一个打包 `dll` 的 webpack 配置文件 `webpack.dll.config.js` ：

```js
const path = require('path');
const webpack = require('webpack');
module.exports = {
  entry: {
    vendor: [
      'vue/dist/vue.esm.js',
      'vue-router',
      'vuex',
      'element-ui',
      'axios'
    ] 
    // 要进行 dll 打包的库，vendor 是打包后的名字，可以自定义
    // 如果打包的结果太大，可以分成多个入口，这样会打成多个 dll 文件
    // 结合Http2的多路复用可以提高加载速度
  },
  output: {
    path: path.resolve(__dirname, './static/js/'), // 输出的 dll 路径
    filename: '[name]_[hash:6].dll.js', // 输出的 dll 文件名,加 hash 便于缓存
    library: '[name]_[hash:6]' // 指定library名称
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.resolve(__dirname, '/[name]-manifest.json'), 
      // 生成 manifest.json 供 DllReferencePlugin使用
      name: '[name]_[hash:6]' // 指定library名称
    }),
  ]
};
```

以上配置主要做了几件事：

1. 设置入口，并指定要打包成 dll 的库。如果打包的结果太大，可以分成多个入口，这样会打成多个 dll 文件。结合Http2的多路复用可以提高加载速度。
2. 指定打包后的输出路径和文件名以及 library 名； 
3. 使用 `DllPlugin` 生成 `manifest.json` 供 `DllReferencePlugin` 使用。

然后在 `package.json` 添加一个执行脚本： 

```json
{
    ...
    script:{
        ...
        "build:dll":"webpack --config webpack.dll.config.js"
    }
}
```

通过指定 webpack 的配置文件来进行 dll 打包，当我们执行 `npm run build:dll` 就能在指定路径生成相应的文件。

有了 `manifest.json` 文件后，就可以在 `webpack.config.js` 中添加 `DllReferencePlugin` 来省去对已打成 dll 的那些库进行再次构建的过程。

```js
module.exports = {
  // ...
  plugins: [
    new webpack.DllReferencePlugin({
      manifest: require('./vendor-manifest.json')
    }),
  ]
};
```

最后，还需要在 index.html 添加将打好的`xxx.dll.js` 引入。这里可以使用 `webpack-html-plugin` 配合 `copy-webpack-plugin` 来完成。我们是将 `xxx.dll.js` 输出到 `./static/js` 路径下的，在正式打包的时候，需要将 `./static/js` 中的资源复制到 dist 中，然后在 `webpack-html-plugin` 设置 `template` 将 `xxx.dll.js` 引入。 

```js
module.exports = {
  // ...
  plugins: [
    new webpack.DllReferencePlugin({
      manifest: require('./vendor-manifest.json')
    }),
    new CopyWebpackPlugin({
        patterns:[
            {from:'./static/js',to:'./'}
        ]
    }),
     new HtmlWebpackPlugin({
         template:'index.html',
     }),
  ]
};
```

### 优缺点

- 优点：预先编译，避免不常变的库重复打包，可以提高构建速度；打包出来的资源放在本地，不需要网络环境也能访问（相比 CDN 而言）。
- 缺点：打包出来的也是完整的包，一般而言 dll 文件会很大，虽然可以设置多个入口，但是要在 index.html 中引入，同样无法解决按需加载的问题；相比 CDN 配置也比较繁琐。

## thread-loader 多进程打包

webpack 需要处理的文件很多时，构建过程需要涉及很多文件的 IO 操作，而且运行在 nodeJS 上的 webpack 是单线程模型的，一个时刻只能处理一个任务，构建速度就会变得很慢。

webpack 4 官方提供了一个 thread-loader 可以解决这个问题。只需要把这个 loader 放置在其它 loader 之前，而在其后的 loader 就会在一个单独的 worker 里运行，一个 worker 就是一个 nodeJS 进程【node.js process】。

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve("src"),
        use: [
            "thread-loader",
            // loaders with equal options will share worker pools
            options: {
              // the number of spawned workers, defaults to (number of cpus - 1) or
              // fallback to 1 when require('os').cpus() is undefined
              workers: 2,

              // number of jobs a worker processes in parallel
              // defaults to 20
              workerParallelJobs: 50,

              // additional node.js arguments
              workerNodeArgs: ['--max-old-space-size=1024'],

              // Allow to respawn a dead worker pool
              // respawning slows down the entire compilation
              // and should be set to false for development
              poolRespawn: false,

              // timeout for killing the worker processes when idle
              // defaults to 500 (ms)
              // can be set to Infinity for watching builds to keep workers alive
              poolTimeout: 2000,

              // number of jobs the poll distributes to the workers
              // defaults to 200
              // decrease of less efficient but more fair distribution
              poolParallelJobs: 50,

              // name of the pool
              // can be used to create different pools with elsewise identical options
              name: "my-pool"
            }
          },
          // your expensive loader (e.g babel-loader)
        ]
      }
    ]
  }
}
```

在 vue-cli 3.0 中，有相关的配置 `parallel` ，是一个 boolean 类型，默认会根据当前系统是 CPU 内核数决定是否开启 `thread-loader` ，仅作用于生产环境。

### 优缺点

- 优点：发挥多核CPU的能力，加快打包速度； 配置
- 缺点：如果项目不大，文件不多，开启 thread-loader 反而会变慢，因为进程启动大概为 600ms ，进程通信也有开销。

## cache-loader 缓存

使用 `cache-loader` 可以启用持久化缓存。将此 loader 放置在其它开销昂贵的 loaders 前面，就可以将其结果缓存到磁盘中，如：

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.ext$/,
        use: ['cache-loader', ...loaders],
        include: path.resolve('src'),
      },
    ],
  },
};
```

使用 `package.json` 中的 `postinstall` 可以清除缓存目录。

在 vue-cli 3.0 中会默认为 Vue/Babel/TypeScript 编译开启 `cache-loader` 。文件会缓存在 `node_modules/.cache` 中。——如果你遇到了编译方面的问题，记得先删掉缓存目录之后再试试看。

### 优缺点

- 优点：如果是二次构建，在本地能节省很多时间； 
- 缺点：如果项目生产版本每次都必须初始构建的话，缓存反而会增加构建时间，因为对缓存文件进行保存和读取会有一些时间开销，所以请只对性能开销较大的 loader 使用此 loader。

## 其它

在webpack 4 以前可能还会使用到 `uglify-webpack-plugin` 来压缩代码，一般会配合 `webpack-uglify-parallel` 来支持并行压缩，提高打包速度。但 webpack 4 提供了官方的 `uglifyjs-webpack-plugin` 并在生产环境中默认开启的，并且支持并行处理。

此外，还有一些可以提高打包速度的常规操作，比如配置 `resolve.modules`指向 `node_modules`  的所在位置，在 js 里出现 `import 'vue'` 这样不是相对、也不是绝对路径的写法时，会去 `node_modules` 目录下找。但是默认的配置，会采用向上递归搜索的方式去寻找，但通常项目目录里只有一个 `node_modules` ，且是在项目根目录，为了减少搜索范围，可以直接写明 `node_modules` 的全路径；同样，对于别名(`alias`)的配置，亦当如此：

```js
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    modules: [
      resolve('src'),
      resolve('node_modules') // 直接写明模块库路径
    ],
    alias: {
      'vue$': 'vue/dist/vue.common.js', // alias 中也直接写明全路径，减小文件搜索范围
      'src': resolve('src'),
      'assets': resolve('src/assets'),
      'components': resolve('src/components'),
      // ...
      'store': resolve('src/store')
    }
  },
  // ...
}
```

又比如合理设置配置中的 `test` , `include` 或 `exclude` 属性来限定处理的范围。

```js
module: {
  preLoaders: [
    {
      test: /\.js$/,
      loader: 'eslint',
      include: [resolve('src')],
      exclude: /node_modules/
    },
    {
      test: /\.svg$/,
      loader: 'svgo?' + JSON.stringify(svgoConfig)，
      include: [resolve('src/assets/icons')],
      exclude: /node_modules/
    }
  ],
  loaders: [
    {
      test: /\.vue$/,
      loader: 'vue-loader',
      include: [resolve('src')],
      exclude: /node_modules\/(?!(autotrack|dom-utils))|vendor\.dll\.js/
    },
    {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      loader: 'url',
      exclude: /assets\/icons/,
      query: {
        limit: 10000,
        name: utils.assetsPath('img/[name].[hash:7].[ext]')
      }
    }
  ]
}
```

## 结语

提高构建速度的方式有很多，而且很多情况它们其实是一把双刃剑，比如 thread-loader 以及 cache-loader ，用得好可以让你享受构建如丝般顺滑，用得不好或滥用反而会让你体会到构建的地狱深渊，所以要具体情况具体分析，在适当的场景选择适当的方式。

更需注意的是，构建速度的优化固然会带来很好的体验，但是相比实际的性能优化而言，后者显然更为重要。尤其在构建速度和性能存在冲突的情况下，比如使用 `dll` 预先编译可以提高构建速度，但是如果生成的文件过大，实际加载速度反而可能会变慢，这种情况肯定要牺牲掉构建速度而去优先考虑实际加载性能。因此在实际生产过程中应做好权衡和取舍，避免本末倒置。