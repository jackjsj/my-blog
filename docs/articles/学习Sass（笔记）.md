---
title: 学习Sass（笔记）
tags:
  - CSS
  - Sass
categories:
  - 前端
date: 2020-05-10 18:14:34
---

学 `Vue` 的时候，接触了 `Sass`，得益于它的嵌套和变量的特点，在编写 CSS 时感到非常舒适，但想想自己现在似乎也仅记得如何使用它这两个最常用也最简单的用法，因此决定重新再看一遍入门手册。

学习的过程中，还发现了一个好网站：[https://www.sassmeister.com/](https://www.sassmeister.com/)，可以将 `Sass` 在线编译成 `CSS`，用来练习相当不错。
<!-- more -->
## 使用变量

### 声明变量

将反复使用的 `css` **属性值**定义成变量。`sass` 使用 `$` 符标识变量。如：

```scss
$highlight-color: #f90;
```

与 `CSS` 不同，变量可以在 `CSS` 规则块外面存在，而且还存在作用域，规则块外不能使用块内声明的变量。

### 引用变量

凡是 `CSS` 属性标准值（如 1px 或 bold）可存在的地方，变量就可使用。如：

```scss
$highlight-color: #f90;
.selected {
  border: 1px solid $highlight-color;
}

// 编译后变成
.selected {
  border: 1px solid #f90;
}
```

此外，在声明变量时，变量的值也可以引用其它变量，如：

```scss
$highlight-color: #f90;
$highlight-border: 1px solid $highlight-color;
.selected {
  border: $highlight-border;
}

//编译后变成
.selected {
  border: 1px solid #f90;
}
```

## 嵌套写法

就是在 `CSS` 规则块中，再嵌套其它 `CSS` 规则块。如：

```scss
#content {
  article {
    h1 {
      color: #333;
    }
    p {
      margin-bottom: 1.4em;
    }
  }
}

// 编译后变成
#content article h1 {
  color: #333;
}
#content article p {
  margin-bottom: 1.4em;
}
```

### 父选择器标识符&

在规则块内，使用 `&` 符可以表示当前规则块所属的选择器，后面的选择器将直接拼接在当前规则块所属选择器后面，如：

```scss
article a {
  &.active {
    color: red;
  }
  &:hover {
    background: white;
  }
  & .title {
    // 这里只是为了说明效果，实际上这里加不加 & 结果都一样
    color: blue;
  }
}

// 编译后变成
article a.active {
  color: red;
}
article a:hover {
  background: white;
}
acticle a .title {
  color: blue;
}
```

当然，也可以在 `&` 前面加选择器，也会将前面的选择器拼在当前规则块所属选择器的前面，如：

```scss
.world {
  .hello > & {
    color: blue;
  }
}

// 编译后
.hello > .world {
  color: blue;
}
```

### 群组选择器的嵌套

这个也很好理解，如果在一个群组选择器如 `.left, .right` 的规则块中嵌套其它规则块，最终也会应用在群组中每个元素身上，如：

```scss
.left,
.right {
  .box {
    color: blue;
  }
}

// 编译后
.left .box {
  color: blue;
}
.right .box {
  color: blue;
}
```

关于这种用法，手册中说了这样一句话：

> 有利必有弊，你需要特别注意群组选择器的规则嵌套生成的`CSS`。虽然`Sass`让你的样式表看上去很小，但实际生成的`CSS`却可能非常大，这会降低网站的速度。

### 属性也可以嵌套！

如果一个属性是复合属性，比如 `border`, 可以使用嵌套的写法。

```scss
nav {
  border: {
    style: solid;
    width: 1px;
    color: #ccc;
  }
}

// 编译后
nav {
  border-style: solid;
  border-width: 1px;
  border-color: #ccc;
}
```

对于属性的缩写形式，甚至可以下面的方式来嵌套，指明例外规则：

```scss
nav {
  border: 1px solid #ccc {
    left: 0;
    right: 0;
  }
}

// 编译后
nav {
  border: 1px solid #ccc;
  border-left: 0;
  border-right: 0;
}
```

这个规则平时真的不常用，有点鸡肋，个人更倾向于使用缩写，当然，如果要改例外的规则，而且规则还不止一条，这种写法还是值得一用的。

## 导入 SASS 文件

`css` 有一个特别不常用的特性，即 `@import` 规则，它允许在一个 `CSS` 文件中导入其它 `CSS` 文件。之所以不常用，甚至遭摒弃，是因为这个 `@import` 不如直接在 `html` 中直接再加一个 `link` 标签，`link` 会在页面加载时加载，而 `@import` 引用的 `CSS` 会等到页面加载完才加载，直接影响了页面加载速度。

而 `Sass` 也有一个 `@import` 规则，但不同的是，在其编译后就把其它 `CSS` 导入进来了，也就是样式被合并到同一个 `CSS` 文件中，无需发起额外的下载请求。

另外，所有在被导入文件中定义的变量和混合器均可在导入文件中使用。

在使用 `@import` 时不需要指明被导入文件的全名，可以省略 `.sass` 或 `.scss` 后缀。

### 使用 Sass 部分文件

其实就是不需要为一些专门为 `@import` 命令编写的 `Sass` 文件生成对应的 `CSS` 文件，可以使用 `_` 开头来对这些文件命名，这样在编译的时候就会忽略这些部分文件。

而且，你在使用 `@import` 导入时，也可以不用加 `_`。

### 默认变量值

一般，如果反复声明一个变量，后声明的会覆盖先声明的值。但是如果在变量后添加 `!default` 标识，则不会覆盖之前先明的值。

这常常用于设计一个希望被 `@import` 的 `scss` 库文件，在库文件中使用 `!default` 给变量赋予默认变量值，如果用户导入该库时，没有声明该变量，则会使用该值，如果已声明，则会使用用户自己设置的值。如：

```scss a.scss
$color: red !default; // 在a库中声明color变量,并设为默认变量值
```

```scss b.scss
$color: blue;
@import './a';
.c {
  color: $color; // 这里的值仍然是blue
}
```

### 嵌套导入

与原生的 `css` 不同， `Sass` 允许 `@import` 写在 `css` 规则里。这样局部文件会被直接插入到 `css` 规则内导入它的地方。如：

```scss a.scss
.box {
  width: 400px;
  height: 400px;
  border: 1px solid;
}
```

```scss b.scss
.box-wrapper {
  @import './a';
}

// 编译后
.box-wrapper {
  .box {
    width: 400px;
    height: 400px;
    border: 1px solid;
  }
}
```

被导入的局部文件中定义的所有变量和混合器，也会**只在**这个规则范围内有效。

### 原生的 CSS 导入

`sass` 也支持原生的 `CSS@import`， 通常在 `sass` 会尝试找到对应的 `sass` 文件导入进来，但在下列三种情况会生成原生的 `CSS@import`

- 被导入文件的名字以 `.css` 结尾；
- 被导入的文件名是一个 URL 地址，由此可用谷歌字体 API 提供的相应服务；
- 被导入的文件名是 `CSS` 的 url() 值。

也就是说，你不能用 `sass` 的 `@import` 直接导入一个原始的 `css` 文件，因为 `sass` 会认为你想用 `CSS` 原生的 `@import`。但可以将 `CSS` 文件后缀改成 `.scss` 然后再导入。

## 静默注释

在 `CSS` 中加注释可以增加可读性，有团队开发中有助于其它人更容易理解这样写的原因。但是，你并不希望每个浏览网站源码的人都看到这些注释。

在`CSS` 中我们只能使用 `/* ... */` 这种方式添加注释，但`scss` 提供了另一种格式（双斜杠） `//`，即静默注释，双斜杠后的内容不会出现在生成的 `CSS` 文件中。如：

```scss
body {
  color: #333; // 这条注释内容不会出现在生成的CSS文件中
  padding: 0; /* 这条注释内容则会出现 */
}
```

## 混合器

### 混合器的声明和使用

混合器能让你完成大段样式的重用，使用 `@mixin` 标识符来定义，然后在其后给需要重用的一大段样式赋予一个名字，如：

```scss
@mixin rounded-border {
  border: 1px solid;
  border-radius: 5px;
}
```

### 混合器的使用

然后就可以在你的样式表中使用 `@include` 来使用该混合器了，如：

```scss
.round-box {
  height: 100px;
  width: 100px;
  @include rounded-border;
}

// 编译为
.round-box {
  height: 100px;
  width: 100px;
  border: 1px solid;
  border-radius: 5px;
}
```

混合器不仅可以包含属性，也可以包含 `CSS` 规则，包含选择器和选择器中的属性，如：

```scss
@mixin no-bullets {
  list-style: none;
  li {
    list-style-image: none;
    list-style-type: none;
    margin-left: 0px;
  }
}
```

在我们在一个规则内使用该混合器，如：

```scss
ul.plain {
  color: #444;
  @include no-bullets;
}

// 编译为
ul.plain {
  list-style: none;
}
ul.plain li {
  list-style-image: none;
  list-style-type: none;
  margin-left: 0;
}
```

在混合器中的规则甚至可以使用 `&`， 这样在解开嵌套规则时，能使用父规则中的选择器来代替 `&`。

### 给混合器传参

这样就相当于编程中函数的概念了，我们可以通过传递参数不灵活地生成不一样的样式规则，如：

```scss
@mixin link-colors($normal, $hover, $visited) {
  color: $normal;
  &:hover {
    color: $hover;
  }
  &:visited {
    color: $visited;
  }
}
```

这样在使用 `@include` 时使用混合器，可以将混合器当作一个函数来用，如：

```scss
a {
  @include link-colors(blue, red, green);
}

// 编译后
a {
  color: blue;
  &:hover {
    color: red;
  }
  &:visited {
    color: green;
  }
}
```

另外，在使用 `@include` 使用混合器时，有可能会很难区分每个参数的意思，不清楚参数的顺序。为了解决这个问题， `sass` 允许通过语法 `$name: value` 的形式指定每个参数的值。这样就可以不在乎参数的顺序了，只需要保证没有漏掉参数即可：

```scss
a {
  // 三个参数的顺序任意，只要参数名与声明的匹配
  @include link-colors($normal: blue, $visited: green, $hover: red);
}
```

既然是函数，是否可以不传某个参数，然后让混合器使用默认值呢？答案当然是可以的，`sass` 支持给混合器参数设置默认值，使用 `$name: default-value` 这种声明形式，默认值可以是任何有效的 `CSS` 属性值，**甚至可以是其它参数的引用**，如：

```scss
$color: red;
@mixin link-colors($normal, $hover: $normal, $visited: $color) {
  color: $normal;
  &:hover {
    color: $hover;
  }
  &:visited {
    color: $visited;
  }
}

// 使用mixin
a {
  @include link-colors($normal: blue);
}

// 编译后
a {
  color: blue;
}
a:hover {
  color: red;
}
a:visited {
  color: yellow;
}
```

## 继承

我们之前学了如何使用变量，混合器来实现了 `CSS` 的重用，在 `sass` 中还有一种方式可以实现代码重用，那就是使用**继承**，通过 `@extend` 语法来实现，如：

```scss
// 通过选择器继承来继承样式
.error {
  border: 1px solid red;
  background-color: #fdd;
}

.seriousError {
  @extend .error;
  border-width: 3px;
}

// 编译后
.error,
.seriousError {
  border: 1px solid red;
  background-color: #fdd;
}

.seriousError {
  border-width: 3px;
}
```

需要注意的是，上面的 `.seriousError` 不仅会继承 `.error` 自身的所有样式，任何跟 `.error` 有关的组合选择器都会被 `.seriousError` 以组合选择器的形式继承，如：

```scss
// 在上面的代码添加一些 error类相关的组合选择器
.error a {
  color: red;
  font-weight: bold;
}

h1.error {
  hont-size: 1.2rem;
}

// 编译后
.error,
.seriousError {
  border: 1px solid red;
  background-color: #fdd;
}

// .seriousError 不仅继承了 .error, 还继承了其它组合选择器
.error a,
.seriousError a {
  color: red;
  font-weight: 100;
}

h1.error,
h1.seriousError {
  font-size: 1.2rem;
}

.seriousError {
  border-width: 3px;
}
```

### 继承的原理

`@extend` 背后最基本的想法是，如果 `.seriousError @extend .error`， 那么样式中的任何一处 `.error` 都用 `.error,.seriousError` 这一选择器组来替换。

关于 `@extend` 有两个要点应该知道：

- 跟混合器比，继承生成的代码相对更少。因为继承仅仅是重复选择器，而不会重复属性。
- 继承遵从 `CSS` 层叠的规则。当两个不同的 `CSS` 规则应用到同一个元素上时，且这两个不同的规则对同一属性设置了不同的值，通常权重更高的选择器胜出，如果权重相同，定义在后面的规则胜出。

混合器本身不会引起 `CSS` 层叠问题，因为混合器把样式直接放到了 `CSS` 规则中，而继承存在样式层叠问题。

### 使用继承需要注意的地方

避免用一个后代选择器去继承，因为这可能会导致生成的 `CSS` 的选择器数量很快失控，如：

```scss
// 不要在后代选择器中使用继承！！
.foo .bar {
  @extend .baz;
}

.bip .baz {
  color: red;
}

// 编译后
.bip .baz,
.bip .foo .bar,
.foo .bip .bar {
  color: red;
}
```
