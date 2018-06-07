module.exports = {
  title: 'talk2wall',
  description: 'Incurable chūni',
  base: '/',
  ga: 'UA-119554407-1',
  head: [
    ['link', { rel: 'shortcut icon', type: 'image/x-icon', href: '/favicon/favicon.ico' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon/apple-touch-icon.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon/favicon-32x32.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon/favicon-16x16.png' }],
    ['link', { rel: 'manifest', type: 'image/png', href: '/favicon/site.webmanifest' }],
    ['link', { rel: 'mask-icon', type: 'image/png', href: '/favicon/safari-pinned-tab.svg', color: '#5bbad5' }],
    ['meta', { name: 'msapplication-TileColor', content: '#da532c' }],
    ['meta', { name: 'theme-color', content: '#ffffff' }],
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
