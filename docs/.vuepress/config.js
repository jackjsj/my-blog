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
    smoothScroll: true,
    authorAvatar:'/avatar.jpeg', // 头像
    author: 'Null',
    nav: [
      { text: '时间轴', link: '/timeline/', icon: 'reco-date' },
      { text: 'GitHub', link: 'https://github.com/jackjsj',icon: 'reco-github' },
    ],
    lastUpdated:'上次更新时间',
    // valine 评论配置
    valineConfig: {
      appId: 'TrtACavvq6bQYvroLvGwwvsg-gzGzoHsz',
      appKey: 'dkiPtOLqMC7OfxOj6povepGd',
    },
    noFoundPageByTencent: false, // 取消404腾讯公益
  },
};
