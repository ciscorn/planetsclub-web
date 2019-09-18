import userQueries from '~/graphql/user.gql'

export function makeAuthViewerQuery({
  memberOnly = true,
  adminOnly = false
} = {}) {
  function check(ctx: any, { loading, data }) {
    if (loading) {
      return
    }

    if (data.me.isAuthenticated) {
      const errorParams = {
        statusCode: 403,
        message: '閲覧する権限がありません'
      }
      if (
        (adminOnly && !data.me.isAdmin) ||
        (memberOnly && !data.me.isMember)
      ) {
        process.server
          ? ctx.$nuxt.$options.context.error(errorParams)
          : ctx.$root.error(errorParams)
      }
    } else {
      const redirectParams = {
        path: '/login',
        query: {
          next: (ctx.route || ctx.$route).fullPath
        }
      }
      process.server
        ? ctx.$nuxt.$options.context.redirect(redirectParams)
        : ctx.$router.replace(redirectParams)
    }
  }

  // return a query definition
  return {
    query: userQueries.me,
    update(data) {
      return data.me
    },
    result(result) {
      check(this, result)
    },
    fetchPolicy: 'cache-first'
  }
}
