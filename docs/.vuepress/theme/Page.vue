<template>
  <div class="page">
    <div class="title">
      <h1>{{ title }}</h1>
      <div class="meta">
        <span class="date">Posted at {{ dateString }}</span>
        <ul class="tags">
          <li class="tag" v-for="t in $page.frontmatter.tags">
            <a :href="'/posts/?tag=' + t">#{{ t }}</a>
          </li>
        </ul>
        <div class="social-buttons">
          <TweetButton/><PocketButton/>
        </div>
      </div>
    </div>
    <Content :custom="false"/>
    <div class="page-edit">
      <div class="edit-link" v-if="editLink">
        <a :href="editLink" target="_blank" rel="noopener noreferrer">{{ editLinkText }}</a>
        <OutboundLink/>
      </div>
      <div class="last-updated" v-if="lastUpdated">
        <span class="prefix">{{ lastUpdatedText }}: </span>
        <span class="time">{{ lastUpdated }}</span>
      </div>
    </div>
    <div class="content page-nav" v-if="prev || next">
      <p class="inner">
        <span v-if="prev" class="prev">
          ← <router-link v-if="prev" class="prev" :to="prev.path">
            {{ prev.title || prev.path }}
          </router-link>
        </span>
        <span v-if="next" class="next">
          <router-link v-if="next" :to="next.path">
            {{ next.title || next.path }}
          </router-link> →
        </span>
      </p>
    </div>
    <slot name="bottom"/>
    <div class="footer" v-if="$site.themeConfig.footer">
      {{ $site.themeConfig.footer }}
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { resolvePage, normalize, outboundRE, endingSlashRE } from './util'

export default {
  created () {
    Vue.component('TweetButton', {
      render: function (createElement) {
        return createElement(
          'div', {
            attrs: {
              class: 'tweet-button'
            }
          }, [
            createElement('a', {
              attrs: {
                href: 'https://twitter.com/share',
                class: 'twitter-share-button',
                "data-lang": 'en'
              }
            }),
            createElement('script', {
              attrs: {
                async: '',
                src: './js/twitter.js'
              }
            })
          ]
        )
      }
    })
    Vue.component('PocketButton', {
      render: function (createElement) {
        return createElement(
          'div', {
            attrs: {
              class: 'pocket-button'
            }
          }, [
            createElement('a', {
              attrs: {
                class: 'pocket-btn',
                "data-pocket-label": 'pocket',
                "data-pocket-count": 'none',
                "data-lang": 'en'
              }
            }),
            createElement('script', {
              attrs: {
                async: '',
                src: './js/pocket.js'
              }
            })
          ]
        )
      }
    })
  },
  props: ['sidebarItems'],
  computed: {
    title () {
      return this.$page.frontmatter.title || ''
    },
    lastUpdated () {
      if (this.$page.lastUpdated) {
        return new Date(this.$page.lastUpdated).toLocaleString(this.$lang)
      }
    },
    lastUpdatedText () {
      if (typeof this.$themeLocaleConfig.lastUpdated === 'string') {
        return this.$themeLocaleConfig.lastUpdated
      }
      if (typeof this.$site.themeConfig.lastUpdated === 'string') {
        return this.$site.themeConfig.lastUpdated
      }
      return 'Last Updated'
    },
    date () {
      const d = new Date()
      d.setTime(0)
      const dateType = typeof d
      const pageDate = this.$page.frontmatter.date
      if (!pageDate) return d
      if (typeof pageDate === dateType) return pageDate
      return new Date(pageDate)
    },
    dateString() {
      if (!this.date.getTime()) return '----/--/--'
      return this.date.toLocaleDateString({ ca:'iso8601' },
        { timeZone:"Asia/Tokyo", year:"numeric", month:"2-digit", day:"2-digit" })
    },
    prev () {
      const prev = this.$page.frontmatter.prev
      if (prev === false) {
        return
      } else if (prev) {
        return resolvePage(this.$site.pages, prev, this.$route.path)
      } else {
        return resolvePrev(this.$page, this.sidebarItems)
      }
    },
    next () {
      const next = this.$page.frontmatter.next
      if (next === false) {
        return
      } else if (next) {
        return resolvePage(this.$site.pages, next, this.$route.path)
      } else {
        return resolveNext(this.$page, this.sidebarItems)
      }
    },
    editLink () {
      if (this.$page.frontmatter.editLink === false) {
        return
      }
      const {
        repo,
        editLinks,
        docsDir = '',
        docsBranch = 'master',
        docsRepo = repo
      } = this.$site.themeConfig

      let path = normalize(this.$page.path)
      if (endingSlashRE.test(path)) {
        path += 'README.md'
      } else {
        path += '.md'
      }
      if (docsRepo && editLinks) {
        return this.createEditLink(repo, docsRepo, docsDir, docsBranch, path)
      }
    },
    editLinkText () {
      return (
        this.$themeLocaleConfig.editLinkText ||
        this.$site.themeConfig.editLinkText ||
        `Edit this page`
      )
    }
  },
  methods: {
    createEditLink (repo, docsRepo, docsDir, docsBranch, path) {
      const bitbucket = /bitbucket.org/
      if (bitbucket.test(repo)) {
        const base = outboundRE.test(docsRepo)
          ? docsRepo
          : repo
        return (
          base.replace(endingSlashRE, '') +
           `/${docsBranch}` +
           (docsDir ? '/' + docsDir.replace(endingSlashRE, '') : '') +
           path +
           `?mode=edit&spa=0&at=${docsBranch}&fileviewer=file-view-default`
        )
      }

      const base = outboundRE.test(docsRepo)
        ? docsRepo
        : `https://github.com/${docsRepo}`

      return (
        base.replace(endingSlashRE, '') +
        `/edit/${docsBranch}` +
        (docsDir ? '/' + docsDir.replace(endingSlashRE, '') : '') +
        path
      )
    }
  }
}

function resolvePrev (page, items) {
  return find(page, items, -1)
}

function resolveNext (page, items) {
  return find(page, items, 1)
}

function find (page, items, offset) {
  const res = []
  items.forEach(item => {
    if (item.type === 'group') {
      res.push(...item.children || [])
    } else {
      res.push(item)
    }
  })
  for (let i = 0; i < res.length; i++) {
    const cur = res[i]
    if (cur.type === 'page' && cur.path === page.path) {
      return res[i + offset]
    }
  }
}
</script>

<style lang="stylus">
@import './styles/config.styl'
@require './styles/wrapper.styl'

.page
  padding-bottom 2rem
  .content:not(.custom)
    h2:first-child
      margin-top -6rem
    > p:first-child
      margin-top -2rem
  .title
    padding 2rem 2.5rem 0 2.5rem
    margin 0 auto
    max-width 740px
    h1
      padding-top 4.6rem
      margin-top -1.5rem
      margin-bottom 0
      padding-bottom 0.3rem
  .meta
    margin 1rem 0 0 0
    padding 0 0 2rem 0
    code
      font-size .95rem
    .tags
      margin 0
      padding 0
      flex-wrap wrap
      align-items flex-start
      align-content strech
      justify-content space-between
      li
        list-style none
        a, span
          display inline-block
          margin-right .5rem
      .tag
        display inline-block
    .social-buttons
      margin-top .125rem
      .tweet-button,
      .pocket-button
        display:inline-block
      .pocket-button
        position relative
        top 2px
  img
    width: 90%
    padding 1rem
    border .5rem $borderColor solid

.page-edit
  @extend $wrapper
  padding-top 1rem
  padding-bottom 1rem
  overflow auto
  .edit-link
    display inline-block
    a
      color lighten($textColor, 25%)
      margin-right 0.25rem
  .last-updated
    float right
    font-size 0.9em
    .prefix
      font-weight 500
      color lighten($textColor, 25%)
    .time
      font-weight 400
      color #aaa

.page-nav
  @extend $wrapper
  padding-top 1rem
  padding-bottom 0
  .inner
    min-height 2rem
    margin-top 0
    border-top 1px solid $borderColor
    padding-top 1rem
    overflow auto // clear float
  .next
    float right
@media (max-width: $MQNarrow)
  .page
    .title
      padding: 2rem 2rem 0 2rem
    .content:not(.custom)
      padding 2rem
@media (max-width: $MQMobile)
  .page-edit
    .edit-link
      margin-bottom .5rem
    .last-updated
      font-size .8em
      float none
      text-align left

</style>
