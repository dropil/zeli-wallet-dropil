<template>
  <div class="content" :class="{start:method===''}">
      <h3>Access {{meta.chainAndEnvironment}} Wallet</h3>
      <VerifyDomain />

      <transition mode="out-in" name="animation-fade-fast">
        <div class="form" v-if="method===''" key="select">
          <h3>Select Access Method</h3>
          <p>Select the method to access your wallet.</p>

          <div class="methods">
            <div class="method keystore" @click="method='keystore'">
              <div class="corner-ribbon">Recommended</div>
              <div class="img"><i class="fad fa-file-download"></i></div>
              <div class="name">Keystore</div>
              <p class="desc">Access a wallet using a keystore you have saved</p>
            </div>

            <div class="method browser" @click="checkBrowser()">
              <div class="img"><i class="fad fa-browser"></i></div>
              <div class="name">Saved Wallets</div>
              <p class="desc">Access a wallet previously saved in your browser</p>
            </div>

            <div class="method mnemonic" @click="method='mnemonic'">
              <div class="img"><i class="fad fa-file-alt"></i></div>
              <div class="name">Mnemonic Phrase</div>
              <p class="desc">Access a wallet by providing a mnemonic phrase</p>
            </div>
          </div>  

          <div class="complete">
            <router-link to="/">
              <i class="far fa-arrow-left"></i> Back to Home
            </router-link>

            <router-link to="/create" class="btn">Create New Wallet</router-link>
          </div>      
        </div>

        <Keystore v-if="method==='keystore'" @load="$emit('load')" @reset="method=''" key="keystore" />
        <Browser v-if="method==='browser'" @load="$emit('load')" @reset="method=''" key="browser" />
        <Mnemonic v-if="method==='mnemonic'" @load="$emit('load')" @reset="method=''" key="mnemonic" />
      </transition>      
    </div>
</template>

<script>
import VerifyDomain from "../../VerifyDomain";
import Keystore from './Keystore'
import Browser from './Browser'
import Mnemonic from './Mnemonic'
import tools from '../../../mixins/tools'
import store from "../../../store";
import { SET_MNEMONIC, SET_ADDRESS } from "../../../store/actions.type";
import { mapGetters } from 'vuex';

export default {
  name: 'Start',
  components: { VerifyDomain, Keystore, Browser, Mnemonic },
  data() {
    return {
      method: ''      
    }
  },
  computed: {
    ...mapGetters(['meta'])    
  },
  methods: {
    checkBrowser() {
      let savedWalletNames = tools.localStorage.get('savedWalletNames') || ''      
      if (!savedWalletNames)
        return tools.toastrWarning('You do not have any saved wallets yet. You can save a wallet by selecting the Mnemonic Phrase method.')
      
      this.method = 'browser'
    }
  }
}
</script>