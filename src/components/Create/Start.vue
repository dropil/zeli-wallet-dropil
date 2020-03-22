<template>
  <div class="form">
    <div class="paragraphs active">
      <h3>Generate New Wallet</h3>

      <p>
        New {{meta.coin}} wallets are generated using 24 word mnemonic phrases. 
        <b>You must save your mnemonic phrase</b> in order to access your 
        wallet later. If you lose your mnemonic, your wallet will be 
        unrecoverable. Save options will be shown in the next step.
      </p>           

      <p>
        This form will walk you through generating and securely saving your
        wallet. The generated address and mnemonic phrase will be provided
        in the last step.
      </p>       
    </div>    

    <div class="complete">
      <router-link to="/"><i class="far fa-arrow-left"></i> Back to Home</router-link>
      <a class="btn" @click="$emit('step', 'save')">Get Started</a>
    </div>              
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import store from '../../store'
import { SET_CREATE_MNEMONIC, SET_CREATE_ADDRESS } from '../../store/actions.type'
import Checkbox from '../MiniComponents/Checkbox'
import tools from '../../mixins/tools'

export default {
  name: 'Start',
  components: { Checkbox },
  computed: {
    ...mapGetters(['meta'])    
  }  
}
</script>