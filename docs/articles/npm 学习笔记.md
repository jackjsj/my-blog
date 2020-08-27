---
title: npm 学习笔记

date: 2020-08-27 11:45:00

categories:
  - 前端

tags:
  - npm

  - Node.js

  - nvm
---

前端的工程化离不开 npm，今天系统地学习一下 npm，通过笔记的方式来探索平时常用的 npm 包管理器，在拾遗的过程中尽可能全方位地揭开 npm 的层层面纱。

<!-- more -->

## 认识 npm

npm 是世界最大的软件注册中心。世界各地的开源开发者使用 npm 来分享和使用里面管理的包，而且也有很多组织使用 npm 来管理私有的开发产品。

npm 包含了三个独特的组件：

- **网站**
- **命令行接口**
- **注册系统**

用户可以使用网站去探索和发现各种包，建立档案，以及管理你的 npm 体验的方方面面。比如，你可以设置 Orgs 来管理对公共和私有的包的访问。

命令行接口 `CLI` 在一个终端中执行，也是开发者与 npm 交互最频繁的一部分。

注册系统则是指一个大型的 JavaScript 软件公共数据库，以及那些围绕它的元信息。

我们可以使用 npm 来：

- 在你的应用中使用并包含 npm 中的包
- 下载开箱即用的独立工具集
- 使用 `npx` 命令来运行包，而无需下载
- 任何用户，在任何地点都能分享代码
- 建立 Orgs 来协调包的维护，编码以及开发者
- 使用 Orgs 来形成虚拟团队
- 对代码多版本和代码依赖的管理
- 当依赖的代码更新时，能尽早地更新应用
- 能探索出多种方式来解决相同的问题
- 找到志同道合的开发者。

## 起步

开始之前，可以先在 [npm 官网](https://www.npmjs.com/signup) 创建个人帐户。

然后，需要安装 Node.js 和 npm 的 CLI， 有两种方式，一是使用一个 **Node 版本管理器**（如 nodist, nvm-windows），二是使用 Node 安装器（即 node.js installer）。

官网强烈建议使用第一种方式，而不鼓励第二种方式，因为第二种方式的安装过程会将 npm 安装在一个具有本地权限的目录下，这样可能在以后全局安装 npm 包时导致权限错误。

### 使用 nvm-windows 安装 nodejs

[nvm-windows 下载地址](https://github.com/coreybutler/nvm-windows/releases)，下载并完成 nvm-windows 的安装。

> 安装路径不要出现中文和空格！

nvm-windows 需要以管理员的身份，因此需要以管理员的身份运行命令行。

输入 `nvm` 可以查看相关的信息，以及支持的命令。

![nvm命令](file://C:\Users\Jesse\Documents.FocusNote\assets\16d5a194-cb40-4591-9b75-e8d721269965.png?t=1598498475197)

通过 `nvm install <version> [arch]` 命令，可以安装指定版本的 node.js，设置 latest 使用最新版本，arch 指定 32 位或 64 位的版本。

`nvm list` 可以查看已安装的 nodejs 版本，\* 表示当前使用的版本。

`nvm on` 开启 node.js 环境。

`nvm off` 关闭 node.js 环境。

`nvm uninstall <version>` 用于卸载指定版本 node。

`nvm use <version> [arch]` 用于切换 node 版本。

`nvm version` 查看当前 nvm 的版本。

`nvm node_mirror <node_mirror_url>` 指定 node 的镜像，中国可以使用淘宝镜像 _https://npm.taobao.org/mirrors/node/_

`nvm npm_mirror <npm_mirror_url>` 指定 npm 的镜像，中国可使用淘宝镜像 _https://npm.taobao.org/mirrors/npm/_

先设置 node 和 npm 镜像，这样下载安装 node 的速度会很快。

### 设置 npm 的淘宝镜像源

以下汇总了淘宝镜像源，解决了下载很慢的问题。

```bash
npm config set puppeteer_download_host https://npm.taobao.org/mirrors/
npm config set phantomjs_cdnurl https://npm.taobao.org/mirrors/phantomjs/
npm config set sentrycli_cdnurl https://npm.taobao.org/mirrors/sentry-cli/
npm config set sqlite3_binary_site https://npm.taobao.org/mirrors/sqlite3/
npm config set python_mirror https://npm.taobao.org/mirrors/python/
npm config set registry https://registry.npm.taobao.org/
npm config set disturl https://npm.taobao.org/mirrors/node/
npm config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/
npm config set sharp_dist_base_url https://npm.taobao.org/mirrors/sharp-libvips/
npm config set electron_mirror https://npm.taobao.org/mirrors/electron/
```

### 查看版本，初试 CLI 命令

通过以下命令，可以查看 node 和 npm 的版本

```bash
node -v && npm -v
```

安装好以后，可以使用 `npm login` 命令来测试个人帐户的登录，依次输入用户名，密码和邮箱地址，如果你启用了双重认证，还需要再次输入一个动态密码。

```bash
npm login
```

需要注意的是，如果之前配置了 npm 淘宝镜像源，登录会失败，需要使用 --registry 临时修改为官方源。

```bash
npm login --registry='https://registry.npmjs.org'
```

登录成功后，使用 'who am I' 命令可以显示出当前的 npm 用户名。

```bash
npm whoami
```

## 发布 npm 包

如果未登录，需要先使用 `npm login` 登录。

然后通过 `npm publish` 命令发布。注意，发布时也要将源改成官方源。

通过下列方式撤销发布的包：

```bash
npm unpublish <pkg>[@<version>] // 删除某个版本
npm unpublish <pkg> --force // 删除整个包
```

撤包的推荐用法：

```bash
npm deprecate <pkg>[@<version>] <message>
```

使用些命令，并不会在社区里撤销你发布的包，但会在任何人尝试安装这个包时得到警告。

### 常见问题

```
npm ERR! You cannot publish over the previously published versions:x.x.x.
```

该错误表示需要提高版本号。

```
npm ERR! xxx cannot be republished until 24 hours have passed.
```

删除整个包后，同名的包需要 24 小时后才能发布。
