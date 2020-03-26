<template>
  <div class="accessing">
    <h3 class="title">Accessing {{meta.chainAndEnvironment}} Wallet</h3>
    <VerifyDomain />

    <div class="tabs">
      <div class="head">
        <a
          class="tab"
          :class="[{active:tab==='wallet'},{'mobile-show':showMobileMenu}]"
          @click="tab='wallet';showMobileMenu=!showMobileMenu"
        >
          Wallet
          <div @click.stop="showMobileMenu=!showMobileMenu" class="mobile-menu"></div>
        </a>

        <a
          class="tab"
          :class="[{active:tab==='send'},{'mobile-show':showMobileMenu}]"
          @click="tab='send';showMobileMenu=!showMobileMenu"
        >
          Send {{meta.tickerPlural}}
          <div @click.stop="showMobileMenu=!showMobileMenu" class="mobile-menu"></div>
        </a>

        <a
          class="tab has-sub-tabs"
          :class="[{active:tab==='delegation'},{'mobile-show':showMobileMenu}]"
          @click="tab='delegation';showMobileMenu=!showMobileMenu"
        >
          Delegation
          <div @click.stop="showMobileMenu=!showMobileMenu" class="mobile-menu"></div>
        </a>

        <a
          class="tab"
          :class="[{active:tab==='proposals'},{'mobile-show':showMobileMenu}]"
          @click="tab='proposals';showMobileMenu=!showMobileMenu"
        >
          Proposals
          <div @click.stop="showMobileMenu=!showMobileMenu" class="mobile-menu"></div>
        </a>

        <a
          class="tab"
          :class="[{'mobile-show':showMobileMenu}]"
          target="_blank"
          :href="meta.explorerUrl + `/account/${address}`"
        >
          Explorer
          <i class="far fa-external-link"></i>
        </a>
      </div>

      <transition name="animation-fade-fast" mode="out-in">
        <Wallet v-if="tab==='wallet'" key="wallet" @switchTab="switchTab" />        
        <Send v-if="tab==='send'" key="send" @switchTab="switchTab" @reset="reset" />        
        <Delegation v-if="tab==='delegation'" key="delegation" @switchTab="switchTab" @reset="reset" />
        <Proposals v-if="tab==='proposals'" key="proposals" @switchTab="switchTab" @reset="reset" />
      </transition>
    </div>

    <div class="buttons">
      <a class="btn" v-if="tab!=='wallet'" @click="tab='wallet'">View Wallet</a>
      <a class="btn" v-if="tab!=='send'" @click="tab='send'">Send {{meta.tickerPlural}}</a>
      <a class="btn" v-if="tab!=='delegation'" @click="tab='delegation'">Delegation</a>
      <a class="btn" v-if="tab!=='proposals'" @click="tab='proposals'">Proposals</a>
    </div>

    <div class="buttons disconnect">
      <div class="btn r" @click="disconnect()">Disconnect</div>
    </div>
  </div>
</template>

<script>
import Wallet from './tabs/Wallet'
import Send from './tabs/Send'
import Delegation from './tabs/Delegation'
import Proposals from './tabs/Proposals'
import VerifyDomain from '../VerifyDomain'
import tools from "../../mixins/tools";
import store from "../../store";
import { RESET_TAB_STATE, RESET_ALL_ACCESS, SET_HD_PATH } from "../../store/actions.type";
import { mapGetters } from "vuex";

export default {
  name: 'Accessing',
  components: { Wallet, Send, Delegation, Proposals, VerifyDomain },
  data() {
    return {
      tab: "wallet",
      showMobileMenu: false
    };
  },
  computed: {
    ...mapGetters(['meta', 'address', 'loadIntervalId'])
  },  
  methods: {     
    switchTab(tab, subtab) {
      this.tab = tab
      if (subtab) setTimeout(() => this.$root.$emit('switchSubTab', subtab), 200)
    },
    disconnect(destroyed = false) {
      clearInterval(this.loadIntervalId)      

      store.dispatch(RESET_ALL_ACCESS)

      this.$emit('unload')
      this.$root.$off('disconnect')

      if (!destroyed) tools.toastrSuccess("Successfully disconnected from wallet");
    },
    reset(type) {      
      store.dispatch(RESET_TAB_STATE, type)
    }
  },
  mounted() {            
    this.$root.$on('disconnect', () => this.disconnect(true))
  },
  destroyed() {     
    this.disconnect(true)
  }
}
</script>