import 'isomorphic-unfetch'
import Vue from 'vue'
import VueApollo from 'vue-apollo'
import VueApolloSSR from 'vue-apollo/ssr'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import defaultConfig from '~/graphql/clients/default'

Vue.use(VueApollo)

export default (context) => {
  const { isDev, app, beforeNuxtRender } = context
  const clientConfig = defaultConfig(context)

  const cache = clientConfig.cache || new InMemoryCache()
  if (!process.server) {
    cache.restore(window.__NUXT__ ? window.__NUXT__.VA.defaultClient : null)
  }

  const defaultClient = new ApolloClient({
    ...(process.server
      ? {
          ssrMode: true
        }
      : {
          ssrForceFetchDelay: 100,
          connectToDevTools: isDev
        }),
    ...clientConfig,
    cache
  })
  app.apolloProvider = new VueApollo({
    clients: {},
    defaultClient
  })

  if (process.server) {
    beforeNuxtRender(({ nuxtState }) => {
      nuxtState.VA = VueApolloSSR.getStates(app.apolloProvider)
    })
  }
}
