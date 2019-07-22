<template>
  <div class="section">
    <div class="container">
      <h2 class="title">ログイン</h2>
      <b-message v-if="failedToCheckMembership" type="is-danger">
        あなたがPLANETS CLUBのメンバーであることを確認できませんでした。
      </b-message>
      <b-message v-else-if="this.$route.query.next" type="is-danger">
        <a target="_blank" href="https://camp-fire.jp/projects/view/65828"
          >PLANETS CLUB</a
        >のメンバーであることを確認するため、Facebookログインが必要です。
      </b-message>
      <div class="block">
        <button
          :class="{
            button: true,
            'is-loading': $store.state.fbLoginStatus === null,
            'is-info': true
          }"
          :disabled="loggedIn"
          @click="signIn"
        >
          <template v-if="loggedIn">
            既にログインしています
          </template>
          <template v-else>
            Facebookアカウントでログイン
          </template>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import gql from 'graphql-tag'
import { ApolloProvider } from 'vue-apollo'
import userQueries from '~/graphql/admin/user.gql'

export default Vue.extend({
  head() {
    return {
      title: 'ログイン'
    }
  },
  data() {
    return {
      failedToCheckMembership: false,
      me: {
        isAuthenticated: false
      }
    }
  },
  computed: {
    loggedIn(): boolean {
      return (
        this.me.isAuthenticated &&
        this.$store.state.fbLoginStatus &&
        this.$store.state.fbLoginStatus.status === 'connected' &&
        !this.failedToCheckMembership
      )
    }
  },
  watch: {
    '$store.state.fbLoginStatus': {
      immediate: true,
      deep: true,
      handler(status) {
        if (status && status.status === 'connected') {
          const accessToken = status.authResponse.accessToken
          this.signInWithFacebook(accessToken)
        }
      }
    },
    me: {
      deep: true,
      handler() {
        if (this.me.isAuthenticated && this.$route.query.next) {
          this.$router.replace({
            path: this.$route.query.next[0] as string
          })
        }
      }
    }
  },
  apollo: {
    me: {
      query: userQueries.me,
      update(data) {
        return data.me
      },
      prefetch: true
    }
  },
  methods: {
    signIn(): void {
      window.FB.login(
        (resp) => {
          if (resp.authResponse) {
            this.$store.commit('changeFbLoginStatus', resp)
          } else {
            this.$buefy.toast.open('ログインがキャンセルされました')
          }
        },
        {
          scope: ''
        }
      )
    },
    signInWithFacebook(accessToken: string) {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation($token: String!) {
              signInWithFacebook(accessToken: $token) {
                user {
                  id
                }
                error
              }
            }
          `,
          variables: {
            token: accessToken
          }
        })
        .then(({ data }) => {
          const result = data.signInWithFacebook
          if (result.error === null || result.error === undefined) {
            this.failedToCheckMembership = false
            this.$buefy.toast.open({
              message: 'ログインしました。',
              type: 'is-success'
            })
            return (this
              .$apolloProvider as ApolloProvider).defaultClient.resetStore()
          } else {
            if (result.error === 'NOT_PC_MEMBER') {
              this.failedToCheckMembership = true
            }
            this.$buefy.toast.open({
              message:
                'Facebookログインに成功しましたが、あなたがPLANETS CLUBのメンバーであることを確認できませんでした。',
              type: 'is-info'
            })
          }
          return null
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: 'ログインに失敗しました。',
            type: 'is-danger'
          })
        })
    }
  }
})
</script>

<style lang="scss" scoped></style>
