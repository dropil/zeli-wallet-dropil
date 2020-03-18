<template>
  <div class="content" :class="{wide:method==='new'}">
      <h3>Access {{meta.chainAndEnvironment}} Wallet</h3>
      <VerifyDomain />

      <transition mode="out-in" name="animation-fade-fast">
        <div class="form" v-if="method===''" key="select">
          <h3>Select access method</h3>
          <p>Select the method to access your wallet.</p>

          <div class="methods">
            <div class="method" @click="method='saved'">
              <div class="img"><i class="fad fa-save"></i></div>
              <div class="name">Saved Wallets</div>
              <p class="desc">Access a wallet previously stored on this app</p>
            </div>

            <div class="method" @click="method='new'">
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

        <Saved v-if="method==='saved'" @reset="method=''" @load="$emit('load')" key="saved" />
        <New v-if="method==='new'" @reset="method=''" @load="$emit('load')" key="new" />
      </transition>      
    </div>
</template>

<script>
import VerifyDomain from "../../VerifyDomain";
import Saved from './Saved'
import New from './New'
import tools from '../../../mixins/tools'
import store from "../../../store";
import { SET_MNEMONIC, SET_ADDRESS } from "../../../store/actions.type";
import { mapGetters } from 'vuex';

export default {
  name: 'Start',
  components: { VerifyDomain, Saved, New },
  data() {
    return {
      method: ''      
    }
  },
  computed: {
    ...mapGetters(['meta'])    
  }
}
</script>