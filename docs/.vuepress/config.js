module.exports = {
  title: 'Null的博客',
  description: '分享一些前端相关的技术文章',
  head: [
    [
      'link',
      {
        rel: 'icon',
        href: '/logo.png',
      },
    ], // 设置favicon
    // 移动端优化
    [
      'meta',
      {
        name: 'viewport',
        content: 'width=device-width,initial-scale=1,user-scalable=no',
      },
    ],
  ],
  markdown: {
    lineNumbers: true, // 在每个代码块左侧显示行号
  },
  locales: {
    // vuepress 的默认语言代码为 en-US
    '/': {
      lang: 'zh-CN',
    },
  },
  theme: 'reco',
  themeConfig: {
    type: 'blog', //让首页更具有博客风格
    mode: 'light', // 明亮
    authorAvatar:'/avatar.jpeg', // 头像
    author: 'Null',
    nav: [
      { text: 'GitHub', link: 'https://github.com/jackjsj',icon: 'reco-github' },
    ],
    // 博客配置
    // blogConfig: {
    //   category: {
    //     location: 2, // 在导航栏菜单中所占的位置，默认2
    //     text: '分类', // 默认文案 “分类”
    //   },
    //   tag: {
    //     location: 3, // 在导航栏菜单中所占的位置，默认3
    //     text: '标签', // 默认文案 “标签”
    //   },
    // },
    noFoundPageByTencent: false, // 取消404腾讯公益
  },
};
