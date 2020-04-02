<template>
  <header class="navigation">
    <div class="container lg">
      <div class="type-logo">
        <router-link to="/" class="title"></router-link>
      </div>

      <HeaderNetworks />

      <ul class="mininav">
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/create">Create a Wallet</router-link></li>
        <li><router-link to="/access">Access Wallet</router-link></li>
        <li v-if="meta.coin==='Dropil' && meta.environment==='Testnet'"><router-link to="/faucet">Faucet</router-link></li>
        <li v-if="meta.coin==='Dropil'"><a href="https://calc.dropilchain.com">Staking Calc</a></li>
        <li><a :href="meta.docsUrl">Docs <i class="far fa-external-link"></i></a></li>
        <li><a :href="meta.websiteUrl">Website <i class="far fa-external-link"></i></a></li>
        <li v-if="isAuth"><a @click="$store.dispatch('logout')">Logout</a></li>
        <li><a class="theme" @click="switchTheme()"><i v-tooltip="'Toggle light/dark theme'" class="fas" :class="themeClass"></i></a></li>        
      </ul>

      <div class="submenu">
        <div class="extra">
          <router-link to="/">Home</router-link>
          <router-link to="/create">Create a Wallet</router-link>
          <router-link to="/access">Access Wallet</router-link>
          <router-link v-if="meta.coin==='Dropil' && meta.environment==='Testnet'" to="/faucet">Faucet</router-link>
          <a v-if="meta.coin==='Dropil'" href="https://calc.dropilchain.com">Staking Calc</a>
          <a :href="meta.docsUrl">Docs</a>
          <a :href="meta.websiteUrl">Website</a>
          <a class="theme" @click="switchTheme()"><i v-tooltip="'Toggle light/dark theme'" class="fas" :class="themeClass"></i> Toggle Theme</a>
          <a v-if="isAuth" @click="$store.dispatch('logout')">Logout</a>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { mapGetters } from 'vuex'
import HeaderNetworks from './HeaderNetworks'
import tools from '../mixins/tools'

export default {
  name: 'Header',
  components: { HeaderNetworks },
  computed: {
    ...mapGetters(['meta', 'isAuth'])    
  },
  data() {
    return {
      themeClass: ''
    }
  },
  mounted() {
    this.getThemeClass()
  },
  methods: {
    switchTheme() {
      tools.toggleTheme(this)
      this.getThemeClass()
      tools.logEvent('Switched Theme', 'New Theme: ' + tools.getTheme())
    },
    getThemeClass() {
      this.themeClass = tools.getTheme() === 'light' ? 'fa-sun': 'fa-moon'
    }
  }
}
</script>