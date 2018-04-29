module.exports = {
  title: 'Hello VuePress',
  description: 'Just playing around',
  base: '/',
  sidebar: 'auto',
  themeConfig: {
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
