<template>
  <div class="search-container">
    <div class="container is-fluid is-fullhd sidebar-split">
      <!--
      <div class="sidebar is-hidden-touch">
        <b-menu class="">
          <b-menu-list label="シリーズ">
            <b-menu-item icon="note" label="メルマガ">
              <b-menu-item
                icon="account"
                label="消極性デザインが社会を変える、まずは"
              ></b-menu-item>
            </b-menu-item>
          </b-menu-list>
        </b-menu>
      </div>
      -->
      <div class="main">
        <b-field>
          <b-input
            v-model="searchPhrase"
            placeholder="キーワードを入力..."
            type="search"
            icon="magnify"
            size="is-large"
            rounded
            @keypress.enter.native="$event.target.blur()"
            @focus="$event.target.select()"
          />
        </b-field>
        <div v-if="archiveItems" class="level is-mobile">
          <div class="level-left">
            <!--
            <span
              ><span class="has-text-weight-bold">グリッド表示</span> |
              リスト表示</span
            >
            -->
          </div>
          <div class="level-right">
            <template v-if="archiveItems.totalCount === 0">
              見つかりませんでした
            </template>
            <template v-else>
              {{ archiveItems.totalCount }}件見つかりました
            </template>
          </div>
        </div>
        <div class="results-container">
          <ul v-if="archiveItems" class="columns is-multiline">
            <li
              v-for="item in archiveItems.items"
              :key="item.id"
              class="result column is-half-tablet is-one-third-desktop is-one-quarter-fullhd"
            >
              <div class="result card">
                <a
                  target="_blank"
                  :href="`https://www.facebook.com/${item.sourceId}`"
                  class="card-image thumb"
                  :style="{ backgroundImage: `url(${item.thumbnailUrl})` }"
                  @click="onCardClick(item)"
                >
                  <div v-if="item.type === 'video'" class="video-sign" />
                  <div
                    v-if="item.type === 'video' && item.length"
                    class="video-length"
                  >
                    ▶ {{ parseInt(item.length / 3660) }}:{{
                      (parseInt(item.length / 60) % 60)
                        .toString()
                        .padStart(2, '0')
                    }}
                  </div>
                </a>
                <div class="card-content">
                  <h4
                    v-if="item.series"
                    class="subtitle is-size-7 has-text-weight-bold"
                  >
                    <nuxt-link :to="`/?q=series:&quot;${item.series}&quot;`">{{
                      item.series
                    }}</nuxt-link>
                  </h4>
                  <h3 class="title is-6">
                    <a
                      target="_blank"
                      :href="`https://www.facebook.com/${item.sourceId}`"
                      @click="onCardClick(item)"
                    >
                      {{ item.title }}
                    </a>
                  </h3>
                  <!-- eslint-disable-next-line -->
                    <div v-if=" item.bodyHighlights && item.bodyHighlights.length > 0 " class="shighlight is-size-7" v-html="highlightText(item.bodyHighlights)" />
                  <div v-else class="description is-size-7">
                    {{ item.description }}
                  </div>
                  <p
                    v-if="item.publishedAt"
                    class="is-size-7 has-text-right pubdate"
                  >
                    {{ item.publishedAt | date('Y年M月d日 HH:mm') }} -
                    <span class="has-text-weight-bold">{{
                      item.publishedAt | dateDistance
                    }}</span>
                  </p>
                </div>
              </div>
              <nuxt-link class="edit-item" :to="`/archives/${item.id}/edit`">
                <span class="icon is-small"><i class="mdi mdi-pencil"/></span>
                <span>編集</span>
              </nuxt-link>
            </li>
          </ul>
          <div ref="bottom">
            <button
              v-if="archiveItems"
              :class="{
                button: true,
                'is-info': archiveItems.hasNextPage,
                'is-dark': !archiveItems.hasNextPage,
                'is-large': true,
                'is-loading': $apollo.queries.archiveItems.loading,
                'is-fullwidth': true
              }"
              :disabled="!archiveItems.hasNextPage"
              @click="fetchMore"
            >
              <template v-if="archiveItems.hasNextPage">
                さらに読み込む
              </template>
              <template v-else-if="archiveItems.totalCount === 0">
                見つかりませんでした
              </template>
              <template v-else>
                検索結果は以上です
              </template>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import gql from 'graphql-tag'
import { makeAuthViewerQuery } from '~/graphql/utils'

export default Vue.extend({
  data() {
    return {
      searchBounce: null
    }
  },
  computed: {
    searchPhrase: {
      get() {
        return (this.$route || this.route).query.q
      },
      set(q) {
        if (process.client) {
          if (this.searchBounce) {
            clearTimeout(this.searchBounce)
          }
          this.searchBounce = setTimeout(() => {
            this.$router.replace({
              query: {
                ...this.$route.query,
                q: q && q.length > 0 ? q : undefined
              }
            })
          }, 300)
        }
      }
    }
  },
  watch: {
    '$route.query.q'() {
      if (window) {
        window.scrollTo(0, 0)
      }
    }
  },
  mounted() {
    this.io = new IntersectionObserver((entries) => {
      if (entries[0].intersectionRatio > 0) {
        this.fetchMore()
      }
    })
    this.io.observe(this.$refs.bottom)
  },
  destroyed() {
    this.io.disconnect()
  },
  methods: {
    onCardClick(item) {
      this.$gtag('event', 'ItemClick', {
        event_category: 'Archive',
        event_label: `${item.source}::${item.sourceId}::${item.title}`,
        value: 1
      })
      console.log('click')
    },
    highlightText(h) {
      return h.join(' ... ')
    },
    fetchMore() {
      if (!this.archiveItems.hasNextPage) {
        return
      }
      this.$apollo.queries.archiveItems.fetchMore({
        variables: {
          after: this.archiveItems.endCursor,
          phrase: this.searchPhrase
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          const prev = prevResult.archiveItems
          const more = fetchMoreResult.archiveItems
          return {
            ...prevResult,
            archiveItems: {
              ...prev,
              items: [...prev.items, ...more.items],
              endCursor: more.endCursor,
              hasNextPage: more.hasNextPage
            }
          }
        }
      })
    }
  },
  apollo: {
    me: makeAuthViewerQuery(),
    archiveItems: {
      query: gql`
        query($phrase: String, $after: String) {
          archiveItems(q: $phrase, first: 24, after: $after) {
            items {
              id
              title
              type
              series
              source
              sourceId
              thumbnailUrl
              description
              length
              bodyHighlights
              publishedAt
            }
            totalCount
            endCursor
            hasNextPage
          }
        }
      `,
      fetchPolicy: 'cache-and-network',
      update(data) {
        return data.archiveItems
      },
      variables() {
        return {
          after: null,
          phrase: this.searchPhrase
        }
      }
    }
  }
})
</script>

<style lang="scss">
@import 'bulma/sass/utilities/_all.sass';

.search-container {
  padding: 0 1rem;
  @include desktop {
    padding: 0 1.5rem;
  }
}

.sidebar-split {
  display: flex;
}

.sidebar {
  flex-basis: 230px;
  flex-shrink: 0;
  padding: 2rem 0;
  padding-right: 1.5em;
  @include mobile {
    display: none;
  }
}
.main {
  flex-grow: 1;
  padding: 1rem 0;
  @include desktop {
    padding: 2rem 0;
  }
}
.results-container {
  position: relative;
}
.tag {
  &.is-document {
    font-weight: bold;
    background-color: #b10;
    color: white;
  }
}
.result {
  a {
    color: inherit;
  }
  position: relative;
  .card-image {
    background-position: center;
    background-size: cover;
    padding-bottom: 56.25%;
    position: relative;
    background-color: #f2f2f2;
    display: flex;
  }
  .card-content {
    padding: 1rem 1rem 0.65rem;
    word-break: break-all;
  }
  .subtitle {
    font-weight: bold;
    margin-bottom: 1.3rem;
    overflow: hidden;
    &:hover {
      color: #04e;
    }
  }
  .title {
    margin-bottom: 0.3rem;
    overflow: hidden;
    &:hover {
      color: #04e;
    }
  }
  .description {
    overflow: hidden;
    line-height: 1.15rem;
    max-height: 3.45rem;
  }
  .shighlight {
    line-height: 1.15rem;
    em {
      font-style: normal;
      background-color: #ef0;
    }
  }
  .pubdate {
    margin-top: 0.25rem;
  }
  &:hover {
    .edit-item {
      display: block;
    }
  }
  .edit-item {
    user-select: none;
    display: none;
    position: absolute;
    right: 1.5rem;
    top: 1.5rem;
    line-height: 1;
    border: 1px solid white;
    border-radius: 0.2rem;
    background-color: rgba(0, 0, 0, 0.4);
    padding: 0.3rem;
    color: white;
    opacity: 0.7;
    &:hover {
      opacity: 1;
    }
  }
  .video-length {
    background-color: rgba(0, 0, 0, 0.8);
    font-size: 0.75rem;
    font-weight: bold;
    padding: 0.4rem;
    line-height: 1;
    position: absolute;
    bottom: 0;
    right: 0;
    color: white;
  }
  .video-sign {
    opacity: 0.9;
    color: white;
    position: absolute;
    width: 100%;
    height: 100%;
    background-size: 20%;
    background-repeat: no-repeat;
    background-position: center;
    background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDQ4IDQ4IiBmaWxsPSIjZmZmIj48cGF0aCBkPSJNMjQgNEMxMi45NSA0IDQgMTIuOTUgNCAyNHM4Ljk1IDIwIDIwIDIwIDIwLTguOTUgMjAtMjBTMzUuMDUgNCAyNCA0em0tNCAyOVYxNWwxMiA5LTEyIDl6Ii8+PC9zdmc+);
  }
}
</style>
