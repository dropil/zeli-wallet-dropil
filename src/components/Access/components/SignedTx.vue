<template>
  <div class="section">
    <h3>Transaction Successfully Signed!</h3>
    <p>Below is the raw signed transaction JSON. You may use this to broadcast this transaction via any method of your choosing.</p>
    <div class="signed-tx">{{JSON.stringify(signedTx)}}</div>

    <h3>Broadcast Transaction</h3>
    <div class="text-button">
      <p>
        You may broadcast your transaction to the {{meta.chainAndEnvironment}} network using the public API that {{meta.chainName}} offers by clicking the broadcast button.
        The public {{meta.chainAndEnvironment}} API endpoint is
        <a :href="meta.apiUrl" target="_blank">{{meta.apiUrlShort}}</a>
        and the API docs can be found at
        <a
          :href="meta.apiDocsUrl"
          target="_blank"
        >{{meta.apiDocsUrlShort}}</a>.
        <br /><br />
        <b class="red">
          Warning! By default, most transactions signed through this app use the base fee of {{meta.baseFeeCoin}} {{meta.ticker}}. 
          {{feeText ? feeText : 'By broadcasting your transaction, you agree to pay the ' + meta.baseFeeCoin + ' ' + meta.ticker + ' fee.'}}
        </b>
      </p>
      
      <div>
        <div class="btn" @click="$emit('broadcast')">Broadcast Transaction</div>
      </div>
    </div>

    <a class="reset" @click="$emit('reset')">
      <i class="far fa-arrow-left"></i> Back to {{title}}
    </a>
  </div>
</template>

<script>
import tools from '../../../mixins/tools'
import { mapGetters } from 'vuex'

export default {
  name: 'SignedTx',
  props: {    
    signedTx: Object,
    title: {
      type: String,
      default: 'Previous Page'
    },
    feeText: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapGetters(['meta'])    
  }
}
</script>