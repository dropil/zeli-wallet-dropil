import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import JwtService from './jwt.service'
import { API_URL } from './config'
import { CHECK_AUTH } from '../store/actions.type'
import store from '../store'

export const Api = {
  retrying: false,
  init () {
    Vue.use(VueAxios, axios)
    Vue.axios.defaults.baseURL = API_URL
    Vue.axios.interceptors.response.use(null, async error => {      
      if (error.config && error.response && error.response.status === 401) {
        if (await store.dispatch(CHECK_AUTH)) {          
          if (error.config.data) error.config.data = JSON.parse(error.config.data)
          error.config.headers['Authorization'] = this.getBearerToken()

          if (!this.retrying) {
            this.retrying = true
            return Vue.axios.request(error.config)    
          }          
        }
      }
    
      this.retrying = false
      return Promise.reject(error)
    })
  },

  setHeader (auth = true) {
    if (auth) 
      Vue.axios.defaults.headers.common['Authorization'] = this.getBearerToken()
    else
      Vue.axios.defaults.headers.common['Authorization'] = ``
  },

  getBearerToken () {
    return `Bearer ${JwtService.getToken()}:${this.nonce()}:${Date.now()}:bearer`
  },

  get (resource, params = null, auth = false) {
    this.setHeader(auth)

    return Vue.axios.get(resource, params ? { params } : null)
      .catch(e => this.handleError(e.response))
  },

  post (resource, params, auth = false) {
    this.setHeader(auth)

    return Vue.axios.post(`${resource}`, params)
      .catch(e => this.handleError(e.response))
  },

  update (resource, endpoint, params, auth = false) {
    this.setHeader(auth)

    return Vue.axios.put(`${resource}/${endpoint}`, params)
      .catch(e => this.handleError(e.response))
  },

  put (resource, params, auth = false) {
    this.setHeader(auth)

    return Vue.axios.put(`${resource}`, params)
      .catch(e => this.handleError(e.response))
  },

  delete (resource, auth = false) {
    this.setHeader(auth)

    return Vue.axios.delete(resource)
      .catch(e => this.handleError(e.response))
  },

  nonce () {
    let text = ''; let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (var i = 0; i < 25; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
  },

  handleError (response) {
    return this.getFullErrorMessage(response.data);
  },

  getFullErrorMessage (data) {
    if (!data) return 'An unknown error occurred, please try again or contact support'

    let msg = data.errorMsg.trim()  
  
    if (data.notes) {
      if (msg.slice(-1) !== '.') msg += '.'
      msg += ' ' + data.notes.trim()
      if (msg.slice(-1) !== '.') msg += '.'
    }  
  
    return msg
  }
}

export default Api
