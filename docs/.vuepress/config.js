module.exports = {
  title: '知识图谱',
  description: '柴劲松的知识图谱',
  themeConfig: {// 主题设置
    nav: [// 导航栏
      {
        text: '浏览器',
        link: '/browser/'
      },
      {
        text: '算法',
        link: '/algo/'
      },
      {
        text: 'JS',
        link: '/js/',
        // items: [
        //   { text: '原生函数实现', link: '/call' }, // 可不写后缀 .md
        // ]
      },
      // {
      //   text: 'Vue',
      //   link: '/guide/vue/'
      //   // items: [
      //   //   { text: '笔记', link: '/guide/foo/one' }, // 可不写后缀 .md
      //   //   { text: '其它链接', link: 'https://www.baidu.com/' }// 外部链接
      //   // ]
      // },
      // {
      //   text: 'Typescript 学习笔记',
      //   items: [
      //     { text: '笔记', link: '/guide/bar/' },// 以 ‘/’结束，默认读取 README.md
      //     { text: '其它链接', link: 'https://www.baidu.com/' } // 外部链接
      //   ]
      // }
    ],
    sidebar: {//左侧列表
      '/browser/': ['browser_request_limit'],
      '/js/': [
        {
          title: '原生函数实现',
          collapsable: true,
          children: ['call']
        }
      ],
      // '/': [''] //不能放在数组第一个，否则会导致右侧栏无法使用 
    }
  }
}