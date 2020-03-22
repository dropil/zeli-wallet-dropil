<template>
  <div class="form generated">
    <h3>Wallet Successfully Generated!</h3>

    <p>
      Below you will find your wallet address and the associated mnemonic phrase. 
      <b>It is crucial that you save your mnemonic phrase in a secure location.</b>
      If you lose this phrase or you lose access to your backup methods from the
      previous step, you will lose access to your wallet forever. 
      Dropil (the creator of this app), or anyone else, will not be able to recover 
      your wallet.
    </p>

    <br />

    <div class="input-wrap">
      <label>Your wallet address</label>
      <input type="text" readonly="readonly" :value="createAddress" class="address">
      <a @click="copyAddress()" class="copy-address"></a>
    </div>
    
    <div class="input-wrap">          
      <label>Your mnemonic phrase</label>
      <a @click="copyMnemonic()" class="btn">Copy to clipboard</a>
      <div class="mnemonic" v-html="mnemonicHTML"></div>          
    </div>        

    <div class="complete">
      <a @click="$emit('back')"><i class="far fa-arrow-left"></i> Back</a>
      <a @click="$router.push('/access')" class="btn">Access Wallet <i class="far fa-arrow-right"></i></a>
    </div>          
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Details',
  components: {},
  computed: {
    ...mapGetters(['meta', 'createMnemonic', 'createAddress']),
    mnemonicHTML() {
      let html = ''
      let i = 1
      this.createMnemonic.split(' ').forEach(str => {
        html += `<div><span>#${i}</span>${str}</div>`
        i++
      })
      return html
    }   
  },  
  methods: {
    copyAddress() {      
      copy(this.createAddress)
    },
    copyMnemonic() {
      copy(this.createMnemonic)
    }    
  }
}
</script>