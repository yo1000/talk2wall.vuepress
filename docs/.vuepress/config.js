module.exports = {
  title: 'talk2wall',
  description: 'Incurable chūni',
  base: '/',
  ga: 'UA-119554407-1',
  head: [
    ['link', { rel: 'alternate', type: 'application/rss+xml', href: '/rss.xml', title: 'talk2wall | latest posts feed' }]
  ],
  sidebar: 'auto',
  themeConfig: {
    repo: 'yo1000/talk2wall.vuepress',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Posts', link: '/posts/' },
      { text: 'About me', link: '/about/' },
    ],
    sidebar: 'auto',
    footer: 'Text: CC BY-NC-ND 4.0 | Code: MIT Licensed | Copyright © 2018-present yo1000',
  },
  markdown: {
    config: (md) => {
      md.options.linkify = true
    },
  },
  locales: {
    '/': {
      lang: 'ja-JP'
    }
  }
}
