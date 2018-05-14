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
    <h1>Posts<span v-if="tagFirstQuery">#{{ tagFirstQuery }}</span></h1>
    <ul class="items">
      <li class="item" v-for="page in pagesSortedByTagFirstQuery">
        <code>{{ page.frontmatter.dateString }}</code><a :href="page.path">{{ page.title }}</a>
      </li>
    </ul>
    <Content custom/>
    <div class="footer" v-if="$site.themeConfig.footer">
      {{ $site.themeConfig.footer }}
    </div>
  </div>
</template>

<script>
import NavLink from './NavLink.vue'
export default {
  components: { NavLink },
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
    },
    pagesSortedByTagFirstQuery () {
      const tagQuery = this.tagFirstQuery
      if (!tagQuery) return this.pagesSorted

      return this.pagesSorted.filter(page => {
        if (!page.frontmatter.tags) return false
        if (typeof page.frontmatter.tags !== typeof []) return page.frontmatter.tags === tagQuery
        
        const tags = page.frontmatter.tags.filter(tag => {
          return tag === tagQuery
        })
        if (typeof tags !== typeof []) return tags
        return tags.length >= 1
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
    padding 1.2rem 0
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
    .item
      display list-item
      code
        display inline-block
        margin 0 .5rem 0 0
        font-size .95rem
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
        code
          display inline-block
          margin 0 .5rem 0 0
          font-size .95rem
    .feature
      max-width 100%
      padding 0 2.5rem

@media (max-width: $MQMobileNarrow)
  .posts
    padding-left 1.5rem
    padding-right 1.5rem
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
</style>
