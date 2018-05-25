<template>
  <div class="about-me">
    <div class="profile">
      <img class="profile-image" :src="$withBase(data.profileImage)" alt="profile">
      <h1>
        <ruby class="profile-name">yo1000<rt class="profile-ruby">Please call me "yō"</rt></ruby>
      </h1>
    </div>
    <div class="personalities" v-if="data.personalities && data.personalities.length">
      <div class="personality items" v-for="personality in data.personalities">
        <h2>{{ personality.title }}</h2>
        <ul v-if="personality.details && personality.details.length">
          <li v-for="detail in personality.details">{{ detail }}</li>
        </ul>
      </div>
    </div>
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
    actionLink () {
      return {
        link: this.data.actionLink,
        text: this.data.actionText
      }
    }
  }
}
</script>

<style lang="stylus">
@import './styles/config.styl'

.about-me
  padding 0 2rem 0
  max-width 960px
  margin 0px auto
  .profile
    text-align center
    img
      max-height 280px
      display block
      margin 3rem auto 1.5rem
      width 8rem
      height 8rem
      padding 0.25rem
      border-radius 50%
      border 0.25rem solid #171f29
    h1
      font-size 3rem
    h1, .description, .action
      margin 1.8rem auto
    ruby
      font-weight 800
      font-size 1.5rem
    rt
      font-weight 400
  .personalities
    border-top 1px solid $borderColor
    padding 1.2rem 0
    margin-top 2.5rem
    display flex
    flex-wrap wrap
    align-items flex-start
    align-content strech
    justify-content space-between
    .personality
      flex-grow 1
      flex-basis 30%
      max-width 30%
  .items
    h2
      font-size 1.4rem
      font-weight 500
      border-bottom none
      padding-bottom 0
      color lighten($textColor, 10%)
    ul
      color lighten($textColor, 25%)
      margin 1rem 0
      padding 0
    li
      list-style none
      display inline-block
      margin 0 .5rem 0 0
    li:after
      content "/"
      margin 0 0 0 .5rem
    ul li:last-child
      margin 0
    ul li:last-child:after
      content ""
      margin 0
@media (max-width: $MQMobile)
  .about-me
    padding-left 1.5rem
    padding-right 1.5rem
    .personalities
      flex-direction column
      padding-bottom: 0
      .personality
        max-width 100%
        padding 0 2.5rem
      .personality:last-child
        padding-bottom 1rem
        margin-bottom 1.2rem
        border-bottom 1px solid $borderColor
    .content.custom
      padding 0 2.5rem
      h2
        font-size 1.4rem
        font-weight 500
        border-bottom none
        padding-bottom 0
        color lighten($textColor, 10%)
      h3
        font-size 1.1rem
        font-weight 500
        border-bottom none
        padding-bottom 0
        color lighten($textColor, 10%)
@media (max-width: $MQMobileNarrow)
  .about-me
    padding-left 1.5rem
    padding-right 1.5rem
    .personality
      h2
        font-size 1.25rem
</style>
