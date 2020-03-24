import Vue from 'vue'
import App from './App.vue'
import router from './router'

import 'normalize.css'

// development of @dropilcoin/dropjs npm package
//window.dropjs = require('./drop')

// production version of drop.js
window.dropjs = require('@dropilcoin/dropjs')

import VueAnalytics from 'vue-analytics'
Vue.use(VueAnalytics, {
  id: process.env.VUE_APP_GA_ID,
  router
})

import Fragment from 'vue-fragment'
Vue.use(Fragment.Plugin)

import VTooltip from 'v-tooltip' 
Vue.use(VTooltip)

import VueIziToast from 'vue-izitoast'
import 'izitoast/dist/css/iziToast.min.css'
Vue.use(VueIziToast)

// store
import store from './store'
import { SHOW_POPUP, CLOSE_POPUP } from './store/actions.type'

// mixins
import titleMixin from './mixins/titleMixin'
Vue.mixin(titleMixin)

import pageClassMixin from './mixins/pageClassMixin'
Vue.mixin(pageClassMixin)

import tools from './mixins/tools'

function popup (id) {
  store.dispatch(SHOW_POPUP, id)  
}
window.popup = popup
Vue.prototype.$popup = window.popup

function closePopups() {
  store.dispatch(CLOSE_POPUP)
}
window.closePopups = closePopups
Vue.prototype.$closePopups = window.closePopups

// window mixins
window.copy = copy
Vue.prototype.$copy = window.copy

function copy (text) {
  var textToCopy = text

  var input = document.createElement('input')
  input.classList.add('copy-input')
  input.value = textToCopy
  document.body.appendChild(input)

  if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
    input.contentEditable = true
    input.readOnly = false
    var range = document.createRange()
    range.selectNodeContents(input)
    var sel = window.getSelection()
    sel.removeAllRanges()
    sel.addRange(range)
    input.setSelectionRange(0, 999999)
  } else {
    input.select()
  }

  document.execCommand('copy')
  input.remove()

  tools.toastr({type: 'success', message: 'Copied to clipboard', title: 'Copied!', timeout: 1500})
}

Vue.config.productionTip = false

window.vm = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
