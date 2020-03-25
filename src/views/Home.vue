<template>
  <div class="main-content md" key="home">
    <h3>{{meta.chainAndEnvironment}}</h3>
    <p class="desc">Resources available to help you utilize {{meta.chainName}}.</p>

    <div class="blocks">
      <router-link to="/create" class="block">
        <i class="far fa-wallet"></i>
        <i class="fa fa-plus"></i>
        <h3>Create a Wallet</h3>
        <p>Create a wallet for use on the {{meta.chainAndEnvironment}}.</p>
      </router-link>

      <router-link to="/access" class="block">
        <i class="far fa-wallet"></i>
        <h3>Access Wallet</h3>
        <p>Access your wallet to view balances and easily transfer or delegate {{meta.tickerPlural}}.</p>
      </router-link>

      <router-link to="/faucet" class="block" v-if="meta.coin==='Dropil' && meta.environment==='Testnet'">
        <i class="far fa-shower"></i>
        <h3>Testnet Faucet</h3>
        <p>Obtain Testnet {{meta.tickerPlural}} for use while accessing your wallet.</p>
      </router-link>

      <a :href="meta.docsUrl" class="block">
        <i class="far fa-info-circle"></i>
        <h3>Documentation</h3>
        <p>Learn about {{meta.chainName}} and how to setup a node or become a validator.</p>
      </a>

      <a :href="meta.explorerUrl" class="block">
        <i class="far fa-compass"></i>
        <h3>{{meta.environment}} Explorer</h3>
        <p>Explore blocks, transactions, validators, and more on the {{meta.chainAndEnvironment}}.</p>
      </a>

      <a :href="meta.websiteUrl" class="block">
        <i class="far fa-browser"></i>
        <h3>{{meta.chainName}} Website</h3>
        <p>View the website for information on {{meta.chainName}}.</p>
      </a>
    </div>
  </div>
</template>

<script>
import tools from '../mixins/tools'
import { mapGetters } from 'vuex';
import networks from '../config/networks'
import store from '../store';
import { SET_META } from '../store/actions.type';

export default {
  name: "Home",
  title: "Home",
  pageClass: "home",
  computed: {
    ...mapGetters(['meta'])
  },
  beforeRouteEnter (to, from, next) {    
    let chainId = to.params.chainId ? to.params.chainId.toLowerCase() : ''

    // no chain id specified
    if (!chainId) 
      return next()

    // environment defaults to mainnet
    let environment = to.params.environment ? to.params.environment.toLowerCase() : 'mainnet'
    environment = ['mainnet', 'testnet', 'development'].includes(environment) ? environment : 'mainnet'
    
    // if mainnet does not contain chainId, check testnet
    if (environment === 'mainnet' && !networks[environment].filter(n => n.chainId.toLowerCase() === chainId).length) environment = 'testnet'

    // if testnet does not contain chainId, check development
    if (environment === 'testnet' && !networks[environment].filter(n => n.chainId.toLowerCase() === chainId).length) environment = 'development'

    // if development does not contain chainId, then do not set meta
    if (!networks[environment].filter(n => n.chainId.toLowerCase() === chainId).length) 
      return next('/')

    // set meta based on route
    let meta = { ...networks[environment].filter(n => n.chainId.toLowerCase() === chainId)[0] }
    store.dispatch(SET_META, meta)
    
    // remove chainId and environment params from URL
    next('/')
  }
};
</script>
