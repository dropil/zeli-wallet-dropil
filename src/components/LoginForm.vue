<template>
  <div class="form login">
    <h2>{{ twoFactor ? "Two Factor Authentication" : "Sign in to Dropil" }}</h2>

    <p class="desc" v-if="description">
      {{description}}
    </p>

    <div v-if="!twoFactor" class="form-field">
      <label for="username">Username</label>
      <input
        id="username"
        type="text"
        class="under"
        ref="username"
        v-model="username"
        @keyup.enter.prevent="submit"
      />
    </div>

    <div v-if="!twoFactor" class="form-field sm-marg">
      <label for="password">Password</label>
      <input
        id="password"
        ref="password"
        type="password"
        class="under"
        v-model="password"
        @keyup.enter.prevent="submit"
      />
    </div>

    <Checkbox ref="rememberMe" v-show="!twoFactor" :text="'Remember my login details'" :localStorageKey="rememberMeLocalStorageKey" @toggle="toggleRememberMe" />

    <div v-if="twoFactor" class="form-field">
      <input
        id="two-factor"
        ref="two-factor"
        type="text"
        class="under"
        v-model="code"            
        @keyup="keyup"
        placeholder="Enter two factor code..."
      />
    </div>      

    <div class="center">
      <Loading text="Logging in..." v-if="loading" :hasHeader="false" />

      <a class="btn wide dark" @click.prevent="submit">{{ twoFactor ? 'Submit' : 'Login' }}</a>
      <div v-if="!loading" class="under">
        <a @click="twoFactor=back()" v-if="twoFactor">Back</a>
        <a href="https://dropil.com/signup" v-if="!twoFactor">Or, sign up</a>
      </div>
    </div>
  </div>
</template>

<script>
import Api from '../api/api.service'
import Loading from './MiniComponents/Loading'
import Checkbox from './MiniComponents/Checkbox'
import tools from '../mixins/tools'
import { mapGetters } from 'vuex'
import store from '../store'
import { LOGIN } from '../store/actions.type'

const REMEMBER_ME_SALT = '|lksrn23j5no2jn4lj2nlsdjfnasfjk223kjlasdfj'

export default {
  name: 'LoginForm',
  components: {    
    Loading,
    Checkbox
  },
  props: {
    description: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      username: '',
      password: '',
      code: '',
      twoFactor: false,
      loading: false
    }
  },
  computed: {
    ...mapGetters(['entryUrl', 'isAuth']),
    rememberMeLocalStorageKey () {
      return this.encode('remember-me-enabled')      
    }
  },
  mounted () {
    if (this.$refs.rememberMe.checked) {
      this.username = this.decode(tools.localStorage.get(this.encode('remember-me-username')))
      this.password = this.decode(tools.localStorage.get(this.encode('remember-me-password')))      
    }

    this.$refs.username.focus()
  },
  methods: {
    keyup (e) {
      if (e.keyCode === 13 || this.code.length === 6)
        this.submit()      
    },
    submit () {
      if (this.loading) return
      this.loading = true

      Api.post('account/login', { u: this.username, p: this.password, tf: this.code })
        .then(r => {          
          if (r.data) {            
            if (this.$refs.rememberMe.checked) this.setRememberMe()

            store.dispatch(LOGIN, r.data.result)
            tools.toastrSuccess('You have successfully logged in')
          } 
          else if (r === 'Two factor authentication required') {
            this.loading = false
            this.twoFactor = true            
            setTimeout(() => this.$refs['two-factor'].focus(), 250)
          } 
          else {
            if (!this.twoFactor) {
              this.password = ''
              setTimeout(() => this.$refs['password'].focus(), 250)
            }

            this.code = ''
            this.loading = false

            tools.toastrError(r)
          }
        })
    },
    back () {
      this.password = ''
      this.code = ''
      this.twoFactor = false
      this.loading = false
      setTimeout(() => this.$refs['password'].focus(), 250)
    },
    encode (text) {
      return window.btoa(text+REMEMBER_ME_SALT)
    },
    decode (text) {
      if (!text) return ''
      return window.atob(text).replace(REMEMBER_ME_SALT, '')
    },    
    toggleRememberMe () {
      if (!this.$refs.rememberMe.checked) {        
        tools.localStorage.delete(window.btoa('remember-me-username'+REMEMBER_ME_SALT))
        tools.localStorage.delete(window.btoa('remember-me-password'+REMEMBER_ME_SALT))
      }      
    },
    setRememberMe () {
      tools.localStorage.set(this.encode('remember-me-username'), this.encode(this.username))
      tools.localStorage.set(this.encode('remember-me-password'), this.encode(this.password))      
    }
  }
}
</script>