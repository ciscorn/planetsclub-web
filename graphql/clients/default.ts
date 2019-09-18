import { ApolloLink, split } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { Context } from '@nuxt/types'

interface Definition {
  kind: string
  operation?: string
}

export default ({ isDev, req }: Context) => {
  // http link
  const httpLink = new HttpLink({
    uri:
      (process.server
        ? process.env.apiBaseUrlForServer
        : process.env.apiBaseUrlForClient) + '/api/graphql/',
    credentials: 'include'
  })

  // ws link
  const link = (() => {
    if (process.client) {
      const wsLink = new WebSocketLink({
        uri: process.env.wsBaseUrl + '/api/graphql/',
        options: {
          reconnect: true
        }
      })
      return split(
        ({ query }) => {
          const { kind, operation }: Definition = getMainDefinition(query)
          return kind === 'OperationDefinition' && operation === 'subscription'
        },
        wsLink,
        httpLink
      )
    } else {
      return httpLink
    }
  })()

  // proxy cookie
  const cookieMiddlewareLink = new ApolloLink((operation, forward) => {
    if (req && req.headers.cookie) {
      operation.setContext({
        headers: {
          cookie: req.headers.cookie
        }
      })
    }
    if (forward) {
      return forward(operation)
    } else {
      return null
    }
  })

  return {
    link: cookieMiddlewareLink.concat(link),
    cache: new InMemoryCache(),
    connectToDevTools: isDev
  }
}
