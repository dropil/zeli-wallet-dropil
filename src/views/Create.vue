<template>
  <div class="main-content" key="create">
    <div class="content">
      <h3>Create a {{meta.chainAndEnvironment}} Wallet</h3>
      <VerifyDomain />

      <div class="form" v-if="!generated">
        <h3>Generate Mnemonic Phrase</h3>

        <p>
          {{meta.coin}} wallets are generated using 24 word mnemonic phrases. 
          <b>You must save your mnemonic phrase</b> in order to access your 
          wallet later. If you lose your mnemonic, your wallet will be 
          unrecoverable.
        </p>

        <br />

        <p>
          Once you are ready to generate your wallet and save your mnemonic 
          phrase, accept the terms by checking the box below and then click 
          the Generate Mnemonic button below.
        </p>

        <br />

        <div class="complete">
          <router-link to="/"><i class="far fa-arrow-left"></i> Back to Home</router-link>
          <a class="btn" @click="generate()">Generate Mnemonic</a>
        </div>
        
        <Checkbox ref="agree" :text="'I understand that Dropil cannot help me if I lose access to my keystore file or my password. I will safely backup a copy of my keystore file and password and keep them secret.'" />
      </div>

      <div class="form generated" v-if="generated">
        <h3>Wallet successfully generated!</h3>

        <p>
          Below you will find your wallet address and the associated mnemonic phrase. <b>It is crucial that you save your mnemonic phrase in a secure location.</b>
          If you lose this phrase, you will lose access to your wallet forever. Dropil (the creator of this app), or anyone else, will not be able to recover your wallet.
        </p>

        <br />

        <div class="input-wrap">
          <label>Your wallet address</label>
          <input type="text" readonly="readonly" :value="address" class="address">
          <a @click="copyAddress()" class="copy-address"></a>
        </div>
        
        <div class="input-wrap">          
          <label>Your mnemonic phrase</label>
          <a @click="copyMnemonic()" class="btn">Copy to clipboard</a>
          <div class="mnemonic" v-html="mnemonicHTML"></div>          
        </div>        

        <div class="complete">
          <a @click="back()"><i class="far fa-arrow-left"></i> Back</a>
          <a @click="access()" class="btn">Access Wallet <i class="far fa-arrow-right"></i></a>
        </div>

        <Checkbox ref="saved" :text="'I have saved my mnemonic phrase in a secure location'" />
      </div>
    </div>
  </div>
</template>

<script>
import VerifyDomain from '../components/VerifyDomain'
import Checkbox from '../components/MiniComponents/Checkbox'
import tools from '../mixins/tools'
import store from '../store'
import { SET_MNEMONIC, SET_ADDRESS } from '../store/actions.type'
import { mapGetters } from 'vuex'

export default {
  name: 'Create',
  title: 'Create a Wallet',
  pageClass: 'create',
  components: { VerifyDomain, Checkbox },
  data() {
    return {
      generated: false,
      address: '',
      mnemonic: '',
    }
  },
  computed: {
    ...mapGetters(['meta']),
    mnemonicHTML() {
      let html = ''
      let i = 1
      this.mnemonic.split(' ').forEach(str => {
        html += `<div><span>#${i}</span>${str}</div>`
        i++
      })
      return html
    }    
  },
  methods: {
    async generate() {
      if (!this.$refs.agree.checked) return tools.toastrError('Please check the box accepting the terms before continuing')

      let drop = tools.startDropJs()
      let { address, mnemonic } = await drop.generateWallet()
      this.address = address
      this.mnemonic = mnemonic
      this.generated = true
      
      this.$nextTick(() => {
        this.$refs.saved.checked = false
      })
    },
    back() {
      this.generated = false,
      this.address = false,
      this.mnemonic = false
    },
    copyAddress() {
      copy(this.address)
    },
    copyMnemonic() {
      copy(this.mnemonic)
    },
    access() {
      if (!this.$refs.saved.checked) return tools.toastrError('Please check the box confirming that you have saved your mnemonic phrase')      
      this.$router.push('/access')
    }
  }
}
</script>