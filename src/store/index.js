import Vue from 'vue'
import Vuex from 'vuex'

import auth from './auth.module'
import general from './general.module'
import wallet from './wallet.module'
import popups from './popups.module'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    general,
    wallet,
    popups
  }
})
