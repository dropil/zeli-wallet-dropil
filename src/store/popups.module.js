import { SHOW_POPUP, CLOSE_POPUP, SET_PREVENT_SHOW_POPUP } from './actions.type'
import { COMMIT_SHOW_POPUP, COMMIT_CLOSE_POPUP, COMMIT_PREVENT_SHOW_POPUP } from './mutations.type'

const state = {
  showPopup: '',
  preventShowPopup: true
}

const getters = {
  showPopup (state) {
    return state.showPopup
  },
  preventShowPopup (state) {
    return state.preventShowPopup
  }
}

const actions = {
  [SHOW_POPUP] ({ commit }, id) {
    commit(COMMIT_SHOW_POPUP, id)    
  },
  [SET_PREVENT_SHOW_POPUP] ({ commit }, prevent) {
    commit(COMMIT_PREVENT_SHOW_POPUP, prevent)
  },
  [CLOSE_POPUP] ({ commit }) {
    commit(COMMIT_CLOSE_POPUP)
    if (state.preventShowPopup) commit(COMMIT_PREVENT_SHOW_POPUP, true)
  }
}

const mutations = {
  [COMMIT_SHOW_POPUP] (state, id) {
    state.showPopup = id
  },
  [COMMIT_PREVENT_SHOW_POPUP] (state, prevent) {
    state.preventShowPopup = prevent
  },
  [COMMIT_CLOSE_POPUP] (state) {
    state.showPopup = ''
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
