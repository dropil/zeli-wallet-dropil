import { 
  SET_PAGE_CLASS,
  SET_META,  
  SET_META_VALUE,
  SET_HD_PATH
} from './actions.type'

import { 
  COMMIT_PAGE_CLASS,
  COMMIT_META,
  COMMIT_META_VALUE
} from './mutations.type'

import networks from '../config/networks'

const state = {
  pageClass: '',
  meta: { ...(networks['testnet'].filter(n => n.chainId === 'Dropil-Chain-Poseidon')[0]) }
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
  [SET_META] ({ commit, dispatch }, meta) {
    commit(COMMIT_META, meta)
    dispatch(SET_HD_PATH, state.meta.hdPath)    
  },
  [SET_META_VALUE]({ commit }, { key, value }) {
    commit(COMMIT_META_VALUE, { key, value })
  }
}

const mutations = {
  [COMMIT_PAGE_CLASS] (state, cls) {
    state.pageClass = cls
  },
  [COMMIT_META] (state, meta) {
    state.meta = meta
  },
  [COMMIT_META_VALUE] (state, { key, value }) {
    state.meta[key] = value
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
