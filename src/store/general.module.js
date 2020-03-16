import { 
  SET_PAGE_CLASS,
  SET_META
} from './actions.type'

import { 
  COMMIT_PAGE_CLASS,
  COMMIT_META
} from './mutations.type'

import networks from '../config/networks'

const state = {
  pageClass: '',
  meta: { ...networks['development']['dropilchain-testnet'] }
}

const getters = {
  pageClass (state) {
    return state.pageClass
  },
  meta (state) {
    return state.meta
  }
}

const actions = {
  [SET_PAGE_CLASS] ({ commit }, cls) {
    commit(COMMIT_PAGE_CLASS, cls)
  },
  [SET_META] ({ commit }, meta) {
    commit(COMMIT_META, meta)
  }
}

const mutations = {
  [COMMIT_PAGE_CLASS] (state, cls) {
    state.pageClass = cls
  },
  [COMMIT_META] (state, meta) {
    state.meta = meta
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
