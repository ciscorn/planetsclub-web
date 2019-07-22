export default ({ app }, inject) => {
  function gtag() {
    window.dataLayer.push(arguments) // eslint-disable-line prefer-rest-params
  }
  inject('gtag', gtag)

  if (process.client) {
    window.dataLayer = window.dataLayer || []
    gtag('js', new Date())

    app.router.afterEach((to) => {
      gtag('config', 'UA-144952231-1', { page_path: to.fullPath })
    })
  }
}
