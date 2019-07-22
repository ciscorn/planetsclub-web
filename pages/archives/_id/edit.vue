<template>
  <section v-if="item" class="section">
    <div class="container">
      <h1 class="title">「{{ item.title }}」の編集</h1>
      <section>
        <b-field label="タイトル" horizontal>
          <b-input
            v-model="newItem.title"
            maxlength="200"
            :has-counter="false"
          />
        </b-field>
        <b-field label="シリーズ" horizontal>
          <b-input
            v-model="newItem.series"
            maxlength="200"
            :has-counter="false"
          />
        </b-field>
        <b-field label="種別" horizontal>
          <div>
            <b-radio v-model="newItem.type" native-value="article"
              >記事（メルマガ）</b-radio
            >
            <b-radio v-model="newItem.type" native-value="video">動画</b-radio>
          </div>
        </b-field>
        <b-field label="本文（全文検索用）" horizontal>
          <b-input v-model="newItem.body" type="textarea" />
        </b-field>
        <b-field label="ソース" horizontal>
          <div>
            <b-radio v-model="newItem.source" native-value="facebook"
              >Facebook</b-radio
            >
          </div>
        </b-field>
        <b-field label="ソースID" horizontal>
          <b-input v-model="newItem.sourceId" />
        </b-field>
        <b-field label="サムネイルURL" horizontal>
          <b-input v-model="newItem.thumbnailUrl" type="url" />
        </b-field>
        <b-field label="更新日" horizontal>
          <div class="level">
            <div class="level-left">
              <div class="level-item">
                {{ item.updatedAt | date('Pp') }} ({{
                  item.updatedAt | dateDistance
                }})
              </div>
              <div v-if="item.updatedBy" class="level-item">
                <figure class="image is-32x32">
                  <img :src="item.updatedBy.pictureUri" />
                </figure>
                &nbsp;{{ item.updatedBy.realName }}
              </div>
            </div>
          </div>
        </b-field>
        <b-field label="作成日" horizontal>
          <div class="level">
            <div class="level-left">
              <div class="level-item">
                {{ item.createdAt | date('Pp') }} ({{
                  item.createdAt | dateDistance
                }})
              </div>
              <div v-if="item.createdBy" class="level-item">
                <figure class="image is-32x32">
                  <img :src="item.createdBy.pictureUri" />
                </figure>
                &nbsp;{{ item.createdBy.realName }}
              </div>
            </div>
          </div>
        </b-field>
        <hr />
        <div class="level">
          <div class="level-left">
            <div class="level-item">
              <button
                :disabled="!edited || !valid"
                :class="{
                  button: true,
                  'is-primary': true,
                  'is-loading': saving
                }"
                @click="updateItem"
              >
                変更を保存
              </button>
              <!--
              <button class="button is-danger is-outlined" @click="deleteItem">
                削除する
              </button>
              -->
            </div>
            <div class="level-item">
              <div class="saved has-text-success has-text-weight-bold">
                <transition name="saved">
                  <span v-show="saved"
                    ><i class="mdi mdi-checkbox-marked-circle-outline" />
                    保存しました</span
                  >
                </transition>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </section>
</template>

<script>
import Vue from 'vue'
import gql from 'graphql-tag'
import { makeAuthViewerQuery } from '~/graphql/utils'

export default Vue.extend({
  components: {},
  data() {
    return {
      newItem: {},
      valid: true,
      saved: false,
      saving: false,
      edited: false
    }
  },
  watch: {
    newItem: {
      handler(val, oldval) {
        if (val === oldval) {
          this.saved = false
        }
        this.edited = true
      },
      deep: true
    }
  },
  beforeRouteLeave(to, from, next) {
    if (!this.edited) {
      return next()
    }
    this.$buefy.dialog.confirm({
      message: `変更内容が保存されていません。変更を破棄しますか？`,
      confirmText: '破棄',
      cancelText: 'キャンセル',
      onConfirm: () => next(),
      onCancel: () => next(false)
    })
  },
  methods: {
    initNewItem(item) {
      this.newItem = {
        ...item,
        id: undefined,
        __typename: undefined,
        htmlContent: item.htmlContent || '',
        createdAt: undefined,
        createdBy: undefined,
        updatedAt: undefined,
        updatedBy: undefined
        // endAt: item.endAt ? new Date(item.endAt) : null,
        // beginAt: item.beginAt ? new Date(item.beginAt) : null
      }
      Vue.nextTick(() => {
        this.edited = false
      })
    },
    updateItem() {
      this.saving = true
      this.$apollo
        .mutate({
          mutation: gql`
            mutation($id: ID, $input: ArchiveItemInput) {
              updateItem: updateArchiveItem(id: $id, input: $input) {
                id
                series
                title
                length
                tags
                body
                source
                sourceId
                thumbnailUrl
                type
                series
                htmlContent
                publishedAt
                createdAt
                createdBy {
                  id
                  realName
                  pictureUri
                }
                updatedAt
                updatedBy {
                  id
                  realName
                  pictureUri
                }
              }
            }
          `,
          variables: {
            id: this.item.id,
            input: this.newItem
          }
        })
        .then((result) => {
          console.log(result)
          const item = result.data.updateItem
          if (item) {
            this.initNewItem(item)
            this.saved = true
            this.saving = false
          }
        })
        .catch(() => {
          this.saving = false
          return this.$buefy.toast.open({
            type: 'is-danger',
            message: '保存に失敗しました'
          })
        })
    }
    // deleteItem() {
    //  this.$buefy.dialog.confirm({
    //    message: `アイテム「${this.item.title}」を本当に削除しますか？`,
    //    type: 'is-danger',
    //    confirmText: '削除',
    //    cancelText: 'キャンセル',
    //    onConfirm: () => {
    //      this.$apollo
    //        .mutate({
    //          mutation: itemQueries.deleteItem,
    //          variables: { id: this.item.id }
    //        })
    //        .then(() => {
    //          this.$buefy.toast.open({
    //            type: 'is-info',
    //            message: `アイテム「${this.item.title}」を削除しました`
    //          })
    //          return this.$router.replace({ path: '/admin/items' })
    //        })
    //        .catch(() => {
    //          return this.$buefy.toast.open({
    //            type: 'is-danger',
    //            message: '削除に失敗しました'
    //          })
    //        })
    //    }
    //  })
    // }
  },
  apollo: {
    me: makeAuthViewerQuery(),
    item: {
      query: gql`
        query($id: ID!) {
          item: archiveItem(id: $id) {
            id
            series
            title
            length
            tags
            body
            source
            sourceId
            thumbnailUrl
            type
            series
            htmlContent
            publishedAt
            createdAt
            createdBy {
              id
              realName
              pictureUri
            }
            updatedAt
            updatedBy {
              id
              realName
              pictureUri
            }
          }
        }
      `,
      errorPolicy: 'all',
      update(data) {
        if (data.item) {
          this.initNewItem(data.item)
        }
        return data.item
      },
      result({ loading, data }) {
        if (!loading && !data.item) {
          console.log('error')
        }
      },
      variables() {
        return { id: (this.$route || this.route).params.id }
      },
      fetchPolicy: 'cache-and-network'
    }
  }
})
</script>

<style lang="scss" scoped>
.saved-enter-active,
.saved-leave-active {
  transition: opacity 0.5s ease;
}

.saved-enter,
.saved-leave-to {
  opacity: 0;
}
</style>
