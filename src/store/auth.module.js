import Api from '../api/api.service'
import JwtService from '../api/jwt.service'
import {
  LOGIN,
  LOGOUT,
  REGISTER,
  CHECK_AUTH,
  REMOVE_AUTH,
  SET_ENTRY_URL,
  REMOVE_ENTRY_URL
} from './actions.type'

import {
  COMMIT_AUTH,
  COMMIT_REMOVE_AUTH,
  COMMIT_ERROR,
  COMMIT_ENTRY_URL,
  COMMIT_REMOVE_ENTRY_URL
} from './mutations.type'
import tools from '../mixins/tools'

const state = {
  entryUrl: '',
  user: {},
  isAuth: !!JwtService.getToken()
}

const getters = {
  entryUrl (state) {
    return state.entryUrl
  },
  currentUser (state) {
    return state.user
  },
  isAuth (state) {
    return state.isAuth
  }
}

const actions = {
  [LOGIN] ({ commit }, data) {
    commit(COMMIT_AUTH, data)
    setRefreshAuth(commit)
  },
  [LOGOUT] (context) {    
    context.commit(COMMIT_REMOVE_AUTH, true)    
    tools.toastrSuccess('Successfully signed out of Dropil account')
  },
  async [CHECK_AUTH] ({ commit }) {
    let nextAuth = parseInt(JwtService.getNextAuth())
    let timeout = nextAuth - Date.now()

    let bearer = JwtService.getToken()

    if (bearer && timeout > 0) {
      // bearer token exists, validate still active via API
      try {
        let result = await Api.get('account/checkAuth', null, true)
        if (result.data && result.data.success)
          // bearer token still active with API
          commit(COMMIT_AUTH, result.data.result)  
        else
          // bearer token no longer active with API
          commit(COMMIT_REMOVE_AUTH)        
      } catch (err) {
        // bearer token no longer active with API
        commit(COMMIT_REMOVE_AUTH)
      }
    }
    
    bearer = JwtService.getToken()
    let reauth = JwtService.getReauthToken()

    if (reauth && (!state.isAuth || !bearer || timeout <= 0)) {
      // either user is not authorized or bearer token does not exist in local storage
      // however, reauth token exists in local storage, try to reauth
      let result = await Api.post('account/reauth', { value: reauth }, false)
      if (result.data && result.data.success)
        // successfuly reauthed
        commit(COMMIT_AUTH, result.data.result)
      else
        // failed to reauth
        commit(COMMIT_REMOVE_AUTH, true)
    } 

    bearer = JwtService.getToken()
    nextAuth = parseInt(JwtService.getNextAuth())
    timeout = nextAuth - Date.now()

    if (state.isAuth && bearer && timeout > 0) {
      // set timeout to refresh auth after 29 minutes
      setRefreshAuth(commit)
      return true
    }
    
    return false
  },
  [SET_ENTRY_URL] ({ commit }, entryUrl) {
    commit(COMMIT_ENTRY_URL, entryUrl)
  },
  [REMOVE_ENTRY_URL] ({ commit }) {
    commit(COMMIT_REMOVE_ENTRY_URL)
  },
  [REMOVE_AUTH] ({ commit }) {
    commit(COMMIT_REMOVE_AUTH)
  }
}

const mutations = {
  [COMMIT_ERROR] (state, error) {
    state.errors = error
  },
  [COMMIT_AUTH] (state, data) {
    state.isAuth = true
    
    state.user = {
      username: data.username,
      email: data.email
    }

    if (data.token) {
      JwtService.saveToken(data.token)
      JwtService.saveNextAuth(data.expire)
    }

    if (data.reauth) 
      JwtService.saveReauthToken(data.reauth)    
  },
  [COMMIT_REMOVE_AUTH] (state, reauth = false) {
    state.isAuth = false
    state.user = {}
    JwtService.destroyToken()
    JwtService.destroyNextAuth()
    if (reauth) JwtService.destroyReauthToken()
  },
  [COMMIT_ENTRY_URL] (state, entryUrl) {
    state.entryUrl = entryUrl
  },
  [COMMIT_REMOVE_ENTRY_URL] (state) {
    state.entryUrl = ''
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}

let refreshTimeout
async function setRefreshAuth (commit) {
  let nextAuth = parseInt(JwtService.getNextAuth())
  let timeout = nextAuth - Date.now()
  
  if (refreshTimeout) clearInterval(refreshTimeout)
  refreshTimeout = setTimeout(async function () {
    if (!state.isAuth) return

    let result = await Api.get('account/refreshAuth', null, true)
    if (result.data.success) {
      commit(COMMIT_AUTH, result.data.result)
      setRefreshAuth(commit)
    }
  }, timeout)
}
