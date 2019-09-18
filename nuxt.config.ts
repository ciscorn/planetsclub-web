import path from 'path'
import fs from 'fs'
import { Configuration } from '@nuxt/types'

const apiBaseUrl = (process.env.PLA_API_BASEURL ||
  'https://pctemp.joetsutj.com') as string

const nuxtConfig: Configuration = {
  mode: 'universal',
  modern: true,
  env: {
    apiBaseUrlForClient: apiBaseUrl,
    apiBaseUrlForServer: process.env.PLA_API_BASEURL || 'http://localhost:8005',
    wsBaseUrl: (process.env.PLA_WS_BASEURL ||
      apiBaseUrl.replace(/^http/, 'ws')) as string
  },
  server: {
    https: process.env.NUXT_DEV_HTTPS
      ? {
          key: fs.readFileSync(path.resolve(__dirname, 'localhost.key')),
          cert: fs.readFileSync(path.resolve(__dirname, 'localhost.crt'))
        }
      : undefined
  },
  head: {
    htmlAttrs: {
      lang: 'ja',
      class: 'has-navbar-fixed-top-touch'
    },
    titleTemplate(title) {
      if (!title || title === 'PLANETS アーカイブス β') {
        return 'PLANETS アーカイブス β'
      }
      return `${title}｜PLANETS アーカイブス β`
    },
    meta: [
      { hid: 'charset', charset: 'utf-8' },
      {
        hid: 'viewport',
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      { hid: 'referrer', name: 'referrer', content: 'always' },
      {
        hid: 'apple-mobile-web-app-title',
        name: 'apple-mobile-web-app-title',
        content: 'PLANETS CLUB'
      },
      {
        hid: 'description',
        name: 'description',
        content: 'PLANETS CLUB - 宇野常寛と「価値」をつくるコミュニティ'
      }
    ],
    link: [
      { rel: 'icon', type: 'image/png', href: '/favicon.png' },
      {
        rel: 'stylesheet',
        type: 'text/css',
        href:
          'https://fonts.googleapis.com/css?family=M+PLUS+Rounded+1c:800&display=swap'
      }
    ],
    script: [
      {
        type: 'text/javascript',
        defer: true,
        async: true,
        src: 'https://connect.facebook.net/ja_JP/sdk.js'
      },
      {
        type: 'text/javascript',
        defer: true,
        async: true,
        src: 'https://www.googletagmanager.com/gtag/js?id=UA-144952231-1'
      }
    ]
  },
  manifest: {
    name: 'PLANETS CLUB',
    lang: 'ja',
    theme_color: '#2AA22B',
    ogTitle: false,
    ogType: false,
    ogDescription: false,
    ogImage: false
  },
  loading: {
    color: '#2AA22B'
  },
  router: {
    linkActiveClass: 'is-active',
    linkExactActiveClass: 'is-exact-active'
  },
  plugins: [
    '@/plugins/date-fns',
    '@/plugins/facebook-sdk',
    '@/plugins/ga',
    '@/plugins/vue-apollo',
    '@/plugins/vue-composition-api'
  ],
  modules: [
    '@nuxtjs/proxy',
    // '@nuxtjs/component-cache',
    // '@nuxtjs/pwa',
    ['nuxt-buefy', { css: false, materialDesignIcons: true }]
  ],
  css: ['~/assets/scss/buefy.scss'],
  proxy: {
    '/api/': process.env.PLA_REMOTE_API_BASEURL || 'http://localhost:8005'
  },
  buildModules: ['@nuxt/typescript-build'],
  build: {
    publicPath: '/static/',
    extractCSS: true,
    optimizeCSS: true,
    // hardSource: true,
    // extend(config, { loaders: { scss } }) {
    extend(config) {
      // scss.implementation = require('sass')
      // scss.fiber = require('fibers')

      if (config.resolve && config.resolve.extensions) {
        config.resolve.extensions = config.resolve.extensions.concat(
          '.graphql',
          '.gql'
        )
      }
      if (config.module) {
        config.module.rules.push({
          test: /\.(graphql|gql)$/,
          use: 'graphql-tag/loader'
        })
      }
    }
  }
}

export default nuxtConfig
