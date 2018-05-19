module.exports = {
  title: 'talk2wall',
  description: 'Incurable chūni',
  base: '/',
  ga: 'UA-119554407-1',
  sidebar: 'auto',
  themeConfig: {
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
      lang: 'ja-JP',
    }
  }
}
