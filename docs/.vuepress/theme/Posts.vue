<template>
  <div class="posts">
    <div class="hero">
      <img v-if="data.heroImage" :src="$withBase(data.heroImage)" alt="hero">
    </div>
    <h1>Tags</h1>
    <ul class="tags">
      <li class="tag">
        <a href="/posts/">all(*)</a>
      </li>
      <li class="tag" v-for="tag in tagsSorted">
        <a :href="'/posts/?tag=' + tag.name">#{{ tag.name }}({{ tag.value }})</a>
      </li>
    </ul>
    <h1>Posts<span id="activeTag"></span></h1>
    <ul id="items" class="items">
      <li :class="'item ' + page.tagsString" v-for="page in pagesSorted">
        <span class="date">{{ page.frontmatter.dateString }}</span><a :href="page.path">{{ page.title }}</a>
      </li>
    </ul>
    <Content custom/>
    <div class="footer" v-if="$site.themeConfig.footer">
      {{ $site.themeConfig.footer }}
    </div>
    <LoadScript :src="'/posts/js/filter.js'"/>
  </div>
</template>

<script>
import Vue from 'vue'
import NavLink from './NavLink.vue'
export default {
  components: { NavLink },
  created () {
    Vue.component('LoadScript', {
      render: function (createElement) {
        return createElement('script', {
          attrs: {
            src: this.src
          }
        })
      },
      props: {
        src: {
          type: String,
          required: true
        }
      }
    })
  },
  computed: {
    data () {
      return this.$page.frontmatter
    },
    tagQueries () {
      return this.$route.query.tag
    },
    tagFirstQuery () {
      if (!this.tagQueries) return false
      if (typeof this.tagQueries === typeof []) {
        return this.tagQueries[0]
      } else {
        return this.tagQueries
      }
    },
    tags () {
      const tagsAll = this.$site.pages.filter(page => {
        return page.frontmatter.tags
      }).map(page => {
        return page.frontmatter.tags
      }).reduce((acc, tags) => {
        if (!acc) {
          return tags
        } else {
          return acc.concat(tags)
        }
      }, [])
      
      const tagsSummary = {}
      for (let i = 0; i < tagsAll.length; i++) {
        const t = tagsAll[i]
        if (!tagsSummary[t]) tagsSummary[t] = 0
        tagsSummary[t]++
      }

      const tags = []
      for (let key in tagsSummary) {
        tags.push({
          name: key,
          value: tagsSummary[key]
        })
      }

      return tags
    },
    tagsSorted () {
      return this.tags.sort((a, b) => {
        if (a.value < b.value) return 1
        if (a.value > b.value) return -1
        if (a.name < b.name) return -1
        if (a.name > b.name) return 1
        return 0
      })
    },
    pages () {
      const d = new Date()
      d.setTime(0)
      const dateType = typeof d
      return this.$site.pages.filter(page => {
        return /^\/posts\/.+/.test(page.path)
      }).map(page => {
        page['tagsString'] = page.frontmatter.tags.reduce((acc, t) => {
          if (acc && acc.length > 0) acc += ' '
          return acc + 'TAG_' + t.replace(/ /g, '-')
        }, '')

        if (!page.frontmatter.date) {
          page.frontmatter['date'] = d
          page.frontmatter['dateString'] = '----/--/--'
          return page
        }
        else if (typeof page.frontmatter.date !== dateType) {
          page.frontmatter.date = new Date(page.frontmatter.date)
        }

        page.frontmatter['dateString'] = page.frontmatter.date.toLocaleDateString(
          { ca:'iso8601' }, { timeZone:"Asia/Tokyo", year:"numeric", month:"2-digit", day:"2-digit" })
        return page
      })
    },
    pagesSorted () {
      return this.pages.sort((a, b) => {
        const aTime = a.frontmatter.date.getTime()
        const bTime = b.frontmatter.date.getTime()
        if (aTime < bTime) return 1
        if (aTime > bTime) return -1

        const aTitle = a.frontmatter.title
        const bTitle = b.frontmatter.title
        if (aTitle && !bTitle) return -1
        if (!aTitle && bTitle) return 1
        if (aTitle < bTitle) return -1
        if (aTitle > bTitle) return 1

        const aPath = a.path
        const bPath = b.path
        if (aPath < bPath) return -1
        if (aPath > bPath) return 1
        return 0
      })
    }
  }
}
</script>

<style lang="stylus">
@import './styles/config.styl'

.posts
  padding $navbarHeight 2rem 0
  max-width 960px
  margin 0px auto
  .hero
    text-align center
    img
      max-height 280px
      display block
    h1
      font-size 3rem
    h1, .description, .action
      margin 1.8rem auto
    .description
      max-width 35rem
      font-size 1.6rem
      line-height 1.3
      color lighten($textColor, 40%)
    .action-button
      display inline-block
      font-size 1.2rem
      color #fff
      background-color $accentColor
      padding 0.8rem 1.6rem
      border-radius 4px
      transition background-color .1s ease
      box-sizing border-box
      border-bottom 1px solid darken($accentColor, 10%)
      &:hover
        background-color lighten($accentColor, 10%)
  .features,
  .items,
  .tags
    padding 0 0 1.2rem 0
    flex-wrap wrap
    align-items flex-start
    align-content strech
    justify-content space-between
    li
      list-style none
      a, span
        display inline-block
        margin-right .5rem
        vertical-align middle
    .tag
      display inline-block
    .item
      display none
      .date
        width: 6rem
        margin 0 .25rem 0 0
      a
        max-width: 83%
        overflow hidden
        text-overflow ellipsis
        white-space nowrap
  .feature
    flex-grow 1
    flex-basis 30%
    max-width 30%
    h2
      font-size 1.4rem
      font-weight 500
      border-bottom none
      padding-bottom 0
      color lighten($textColor, 10%)
    p
      color lighten($textColor, 25%)
  .footer
    padding 2.5rem
    border-top 1px solid $borderColor
    text-align center
    color lighten($textColor, 25%)

@media (max-width: $MQMobile)
  .posts
    .features,
    .items,
    .tags
      flex-direction column
      .item
        display none
        code
          display inline-block
          margin 0 .5rem 0 0
          font-size .95rem
    .feature
      max-width 100%
      padding 0 2.5rem
    .items .item a
      max-width: 69%

@media (max-width: $MQMobileNarrow)
  .posts
    padding 2rem 2rem 0 2rem
    .hero
      img
        max-height 210px
      h1
        font-size 2rem
      h1, .description, .action
        margin 1.2rem auto
      .description
        font-size 1.2rem
      .action-button
        font-size 1rem
        padding 0.6rem 1.2rem
    .feature
      h2
        font-size 1.25rem
    .items .item
      .date
        display none
      a
        max-width 100%
</style>
