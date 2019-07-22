function initFb(store) {
  window.FB.init({
    appId: '2306502569610759',
    autoLogAppEvents: true,
    xfbml: true,
    version: 'v3.3'
  })
  window.FB.getLoginStatus((resp) => {
    store.commit('changeFbLoginStatus', resp)
  })
}

export default (context) => {
  if (process.client) {
    const { store } = context

    if (window.FB) {
      initFb(store)
    } else {
      window.fbAsyncInit = () => initFb(store)
    }
  }
}
