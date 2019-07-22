export const state = () => ({
  fbLoginStatus: null
})

export const mutations = {
  changeFbLoginStatus(state, payload) {
    state.fbLoginStatus = payload
  }
}
