<template>
  <header class="navigation">
    <div class="container lg">
      <div class="type-logo">
        <router-link to="/" class="title"></router-link>
      </div>

      <HeaderNetworks />

      <ul class="mininav">
        <li>
          <router-link to="/">Home</router-link>
          <router-link to="/create">Create a Wallet</router-link>
          <router-link to="/access">Access Wallet</router-link>
          <router-link v-if="meta.coin==='Dropil' && meta.environment==='Testnet'" to="/faucet">Faucet</router-link>
          <a :href="meta.docsUrl">Docs <i class="far fa-external-link"></i></a>
          <a :href="meta.websiteUrl">Website <i class="far fa-external-link"></i></a>
        </li>
      </ul>

      <div class="submenu">
        <div class="extra">
          <router-link to="/">Home</router-link>
          <router-link to="/create">Create a Wallet</router-link>
          <router-link to="/access">Access Wallet</router-link>
          <router-link v-if="meta.coin==='Dropil' && meta.environment==='Testnet'" to="/faucet">Faucet</router-link>
          <a :href="meta.docsUrl">Docs</a>
          <a :href="meta.websiteUrl">Website</a>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { mapGetters } from 'vuex'
import HeaderNetworks from './HeaderNetworks'

export default {
  name: 'Header',
  components: { HeaderNetworks },
  computed: {
    ...mapGetters(['meta'])
  }  
}
</script>

<style scoped lang="scss">
  a i {
    font-size: .9em;
    margin-left: 3px;
  }
</style>