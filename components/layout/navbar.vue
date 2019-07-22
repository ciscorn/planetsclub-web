<template>
  <nav
    :class="{ 'is-spaced': spaced }"
    class="navbar has-shadow is-fixed-top-touch"
  >
    <div class="container">
      <div class="navbar-brand">
        <h1 class="navbar-item site-title">
          <nuxt-link to="/" @click.native="top">
            <!--<img src="~/assets/images/logo.svg" alt="PLANETS CLUB" />-->
            <h1 class="title">
              <span>PLANETS</span> <span>アーカイブスβ</span>
            </h1>
          </nuxt-link>
        </h1>

        <!--
        <a
          target="_blank"
          href="https://twitter.com/PLANETS_CLUB"
          class="navbar-item"
        >
          <span class="icon"> <i class="mdi mdi-twitter mdi-24px" /> </span>
        </a>
        <a
          target="_blank"
          href="https://www.facebook.com/wakusei2nd"
          class="navbar-item"
        >
          <span class="icon">
            <i class="mdi mdi-facebook-box mdi-24px" />
          </span>
        </a>
        -->

        <nuxt-link class="navbar-item" to="/archives/series?type=article">
          <b-icon icon="file-document-box" /><span>メルマガ</span>
        </nuxt-link>
        <nuxt-link class="navbar-item" to="/archives/series?type=video">
          <b-icon icon="youtube" /><span>動画</span>
        </nuxt-link>

        <a
          :class="{ 'is-active': menuOpen }"
          class="navbar-burger"
          @click="toggleMenu"
        >
          <span aria-hidden="true" /> <span aria-hidden="true" />
          <span aria-hidden="true" />
        </a>
      </div>
      <div :class="{ 'is-active': menuOpen }" class="navbar-menu">
        <div class="navbar-start">
          <div
            class="navbar-item has-dropdown is-hoverable"
            style="user-select: none"
          >
            <a class="navbar-link"><span>公式サイト</span></a>
            <div class="navbar-dropdown">
              <a
                v-if="me.isAuthenticated"
                class="navbar-item"
                target="_blank"
                href="https://www.facebook.com/groups/727594310962689/"
                ><span>PLANETS CLUB (Facebook)</span>
                <b-icon icon="open-in-new" size="is-small" />
              </a>
              <a
                v-else
                class="navbar-item"
                target="_blank"
                href="https://camp-fire.jp/projects/view/65828"
                ><span>PLANETS CLUB</span>
                <b-icon icon="open-in-new" size="is-small" />
              </a>
              <a
                class="navbar-item"
                target="_blank"
                href="https://note.mu/planetsclub"
                ><span>PLANETS CLUB (note)</span>
                <b-icon icon="open-in-new" size="is-small" />
              </a>
              <a
                class="navbar-item"
                target="_blank"
                href="https://ch.nicovideo.jp/wakusei2nd"
                ><span>PLANETSチャンネル (ニコニコ)</span>
                <b-icon icon="open-in-new" size="is-small" />
              </a>
              <a
                class="navbar-item"
                target="_blank"
                href="http://wakusei2nd.thebase.in/"
                ><span>PLANETS公式ストア (BASE)</span>
                <b-icon icon="open-in-new" size="is-small" />
              </a>
              <a
                class="navbar-item"
                target="_blank"
                href="https://www.facebook.com/groups/727594310962689/permalink/1085157908539659/"
                ><span>PLANETS CLUB用ストア (BASE)</span>
                <b-icon icon="open-in-new" size="is-small" />
              </a>
              <a
                class="navbar-item"
                target="_blank"
                href="http://wakusei2nd.com/"
                ><span>PLANETS公式サイト</span>
                <b-icon icon="open-in-new" size="is-small" />
              </a>
            </div>
          </div>
        </div>
        <div class="navbar-end"></div>

        <div
          v-if="me.isAuthenticated"
          class="navbar-item has-dropdown is-hoverable"
        >
          <a class="navbar-link is-arrowless"><img :src="me.pictureUri"/></a>
          <div class="navbar-dropdown is-right">
            <div class="navbar-item">{{ me.realName }}</div>
            <hr class="navbar-divider" />
            <a class="navbar-item" @click="signOut()"> 再認証</a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import Vue from 'vue'
import gql from 'graphql-tag'
import { ApolloProvider } from 'vue-apollo'
import userQueries from '~/graphql/user.gql'

export default Vue.extend({
  props: {
    spaced: { type: Boolean, default: false }
  },
  data() {
    return {
      menuOpen: false,
      me: {}
    }
  },
  apollo: {
    me: {
      query: userQueries.me,
      update(data) {
        return data.me
      },
      fetchPolicy: 'cache-first',
      prefetch: true
    }
  },
  watch: {
    '$route.fullPath': {
      handler() {
        this.menuOpen = false
      }
    }
  },
  methods: {
    top() {
      window.scrollTo(0, 0)
    },
    toggleMenu() {
      this.menuOpen = !this.menuOpen
    },
    signOut() {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation {
              signOut
            }
          `
        })
        .then(() => {
          return (this
            .$apolloProvider as ApolloProvider).defaultClient.resetStore()
        })
        .then(() => {
          this.$router.replace({ path: '/' })
          this.$buefy.toast.open({
            message: 'ログアウトしました',
            type: 'is-info'
          })
        })
        .catch((err) => {
          console.error('failed to sign out', err)
        })
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'bulma/sass/utilities/_all.sass';

@media (max-width: 400px) {
  .navbar-item {
    padding-right: 0.2rem;
  }
}

.navbar-brand {
  .title {
    font-family: 'M PLUS Rounded 1c', sans-serif;
  }
  .navbar-item {
    .icon {
      margin-right: 0.2rem;
      @include mobile {
        display: none;
      }
    }
  }
}

.site-title {
  margin-right: 0.5em;
  .title {
    font-size: 1.3rem;
    span {
      display: inline;
    }
    @include mobile {
      font-size: 0.9rem;
      span {
        display: block;
      }
    }
  }
}

.navbar-dropdown {
  a.is-active {
    color: inherit;
  }
}
</style>
