<template>
  <article class="series">
    <section class="section">
      <div class="container">
        <h1 class="title">シリーズ一覧</h1>
        <!--
        <p class="subtitle">仮です</p>
        -->
        <b-tabs v-model="tabIndex" position="is-centered" expanded>
          <b-tab-item label="メルマガ" icon="file-document-box">
            <b-table :data="seriesData" :mobile-cards="false">
              <template slot-scope="props">
                <b-table-column field="author" label="著者">
                  <nuxt-link :to="`/?q=${props.row.author}`">{{
                    props.row.author
                  }}</nuxt-link>
                </b-table-column>
                <b-table-column field="title" label="タイトル">
                  <nuxt-link :to="`/?q=${props.row.search}`">{{
                    props.row.title
                  }}</nuxt-link>
                </b-table-column>
              </template>
            </b-table>
          </b-tab-item>
          <b-tab-item label="動画" icon="youtube">
            <ul class="columns is-mobile is-multiline">
              <li
                v-for="item in videoSeries"
                :key="item.title"
                class="column is-half-mobile is-half-tablet is-one-third-desktop"
              >
                <nuxt-link :to="`/?q=${item.search}`" class="card">
                  <div
                    class="card-image"
                    :style="{ 'background-image': `url(${item.image})` }"
                  ></div>
                  <div class="card-content">
                    {{ item.title }}
                  </div>
                </nuxt-link>
              </li>
            </ul>
          </b-tab-item>
        </b-tabs>
      </div>
    </section>
  </article>
</template>

<script lang="ts">
import Vue from 'vue'

const VIDEO_SERIES = [
  {
    title: 'PLANETS the BLUEPRINT',
    search: '"PLANETS the BLUEPRINT" type:video',
    image:
      'https://scontent.xx.fbcdn.net/v/t15.5256-10/66483217_2659754830724151_7567815143866761216_n.jpg?_nc_cat=104&_nc_oc=AQmqAu15kX6JMJ4lPwmlTH9pPZply0VDP6uoprQEgqc1_at11NzHnS2QeeT3JJig6K1yexv44SkS4bR8enNsiPsn&_nc_ht=scontent.xx&oh=a669dc374f5c75f9a23efc179920ab97&oe=5DD3D309'
  },
  {
    title: 'オールフリー高田馬場',
    search: 'オールフリー高田馬場 type:video',
    image:
      'https://scontent.xx.fbcdn.net/v/t15.5256-10/66597814_528089278013998_745130727972012032_n.jpg?_nc_cat=111&_nc_oc=AQkJrsv_Shds7b8hDCOwledjpLKhTlkUDae3VWAYJC50A3ZMQCbbGE56kgivC4RLJag&_nc_ht=scontent.xx&oh=a4a543cb837258bd105e7eb30d7ad2d7&oe=5DA5D448'
  },
  {
    title: 'PLANETS CLUB 定例会',
    search: '定例会 type:video',
    image: '/images/pcmeetup_001.jpg'
  },
  {
    title: 'HANGOUT PLUS',
    search: '"HANGOUT+PLUS" type:video',
    image:
      'http://wakusei2nd.com/wp-content/uploads/2016/11/HANGOUTPLUS_everynight_16-9.jpg'
  },
  {
    title: 'ゲーム・オブ・ザ・ラウンド',
    search: 'ゲーム・オブ・ザ・ラウンド',
    image:
      'https://scontent.xx.fbcdn.net/v/t15.5256-10/s720x720/72732723_2553630921361171_9051254301959127040_n.jpg?_nc_cat=104&_nc_oc=AQm8dctu1aJFXH7Eu6JeVeTlqGC14M4GcVG_73GzMN90nfVwE9aHx8xSzpps5B9avKM&_nc_ht=scontent.xx&oh=0bae08df145aecec28d1e0653ffe8d49&oe=5E5E761B'
  },
  {
    title: '木曜解放区',
    search: '木曜解放区 type:video',
    image:
      'http://wakusei2nd.com/wp-content/uploads/2017/04/mokuyou8%E6%99%821920x1080-1024x576.png'
  },
  {
    title: 'NewsX',
    search: 'NewsX type:video',
    image: '/images/newsx_001.jpg'
  },
  {
    title: 'HIKARIE＋PLANETS',
    search: '(ヒカリエ OR 渋谷セカンドステージ) AND type:video',
    image:
      'http://wakusei2nd.com/wp-content/uploads/2019/06/ヒカリエ21PLANETS1280x720_2.jpg'
  },
  {
    title: '立教大学講義',
    search: '立教大学講義',
    image:
      'https://scontent.xx.fbcdn.net/v/t15.5256-10/49575856_10218968891437248_7315936700893495296_n.jpg?_nc_cat=107&_nc_oc=AQmg1ZgiKIyspz1_PAvw4rE99R8hQTVHZJMjnoLbk3zko5Vvh77ATDtxHLIEFGGLrnA&_nc_ht=scontent.xx&oh=5aab90d0ac01e0074ad28cd8b0cd7c18&oe=5DAF56E5'
  },
  {
    title: '石岡さん',
    search: '石岡良治 type:video',
    image:
      'http://wakusei2nd.com/wp-content/uploads/2019/05/photo-_05201530.jpg'
  }
]

const SERIES = [
  {
    title: '人類を前に進めたい',
    search: '人類を前に進めたい',
    author: '猪子寿之',
    type: 'article'
  },
  {
    title: 'PLANETSアーカイブス',
    search: 'PLANETSアーカイブス',
    author: '編集部',
    type: 'article'
  },
  {
    title: '平成史 ― ぼくらの昨日の世界',
    search: '平成史 type:article',
    type: 'article',
    author: '與那覇潤'
  },
  {
    title: 'ユートピアの終焉 ― あだち充と戦後日本の青春',
    search: 'ユートピアの終焉',
    type: 'article',
    author: '碇本学'
  },
  {
    author: '小山虎',
    title: '知られざるコンピューターの思想史',
    search: 'title:知られざるコンピューターの思想史',
    type: 'article'
  },
  {
    title: 'ネオアニマ',
    search: 'ネオアニマ',
    author: '近藤那央',
    type: 'article'
  },
  {
    title: 'エッセイ『男と×××』',
    search: '井上敏樹エッセイ',
    author: '井上敏樹',
    type: 'article'
  },
  {
    title: '波紋を編む本屋',
    search: '波紋を編む本屋',
    author: '山下優',
    type: 'article'
  },
  {
    title: 'スポーツタイムマシン',
    search: 'スポーツタイムマシン',
    author: '犬飼博士・安藤僚子',
    type: 'article'
  },
  {
    title: '作ること、生きること',
    search: '作ること、生きること',
    author: '上妻世界',
    type: 'article'
  },
  {
    title: '消極性デザインが社会を変える。まずは、あなたの生活を変える。',
    search: '消極性デザインが社会を変える',
    author: '消極性研究会',
    type: 'article'
  },
  {
    title: 'オートマトン・フィロソフィア',
    search: 'オートマトン・フィロソフィア',
    author: '三宅陽一郎',
    type: 'article'
  },
  {
    title: '“kakkoii”の誕生 ― 世紀末ボーイズトイ列伝',
    search: 'kakkoii の誕生',
    author: '池田明季哉',
    type: 'article'
  },
  {
    title: 'GQ ― Government Curation',
    search: 'Government Curation',
    author: '橘宏樹',
    type: 'article'
  },
  {
    title: 'テレビドラマクロニクル (1995→2010)',
    author: '成馬零一',
    search: 'テレビドラマクロニクル',
    type: 'article'
  },
  {
    title: '中心をもたない、現象としてのゲームについて',
    search: '中心をもたない、現象としてのゲームについて',
    author: '井上明人',
    type: 'article'
  },
  {
    title: '御宅女生的政治日常',
    search: '御宅女生的政治日常',
    author: '周庭',
    type: 'article'
  },
  {
    title: 'ボーダレス＆タイムレス',
    search: 'ボーダレス＆タイムレス',
    author: '丸若裕俊',
    type: 'article'
  },
  {
    title: '中東で一番有名な日本人',
    search: '中東で一番有名な日本人',
    author: '鷹鳥屋明',
    type: 'article'
  },
  {
    title: '考えるを考える',
    search: '考えるを考える',
    author: '長谷川リョー',
    type: 'article'
  },
  {
    title: 'ニューレトロフューチャー',
    search: 'ニューレトロフューチャー',
    author: '草野絵美',
    type: 'article'
  },
  {
    title: '汎イメージ論',
    search: '汎イメージ論',
    author: '宇野常寛',
    type: 'article'
  },
  {
    title: 'NewsX 書き起こし',
    search: 'NewsX type:article',
    author: 'PLANETS',
    type: 'article'
  },
  {
    title: '対談',
    search: 'title:対談',
    author: '編集部',
    type: 'article'
  },
  {
    title: 'インタビュー',
    search: 'title:インタビュー',
    author: '編集部',
    type: 'article'
  }
]

export default Vue.extend({
  data() {
    return {
      searchBounce: null,
      seriesData: SERIES,
      videoSeries: VIDEO_SERIES
    }
  },
  computed: {
    tabIndex: {
      get() {
        const type = (this.$route || (this as any).route).query.type
        if (type === 'article') {
          return 0
        } else if (type === 'video') {
          return 1
        } else {
          return 0
        }
      },
      set(v) {
        const type = v === 1 ? 'video' : 'article'
        this.$router.replace({
          query: {
            ...this.$route.query,
            type
          }
        })
      }
    }
    //
  }
})
</script>

<style scoped>
.series /deep/ .tab-content {
  padding-left: 0;
  padding-right: 0;
}

.card {
  display: block;
}

.card-content {
  padding: 0.75em;
}
.card-image {
  background-size: cover;
  background-position: center;
  padding-bottom: 56.25%;
}
</style>
