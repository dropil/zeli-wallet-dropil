<template>
  <div class="section">
    <h3>Transaction Successfully Broadcasted!</h3>
    <p>Below is the broadcast response from the node.</p>
    <div class="broadcasted-tx">{{JSON.stringify(json, null, 4)}}</div>

    <div class="complete">
      <a @click="$emit('reset')">
        <i class="far fa-arrow-left"></i> Back to {{title}}
      </a>
      <a
        class="btn"
        :href="meta.explorerUrl + meta.explorerTransactionEndpoint + json.txhash"
        target="_blank"
      >View Transaction on Explorer</a>
    </div>
  </div>
</template>

<script>
import tools from '../../../mixins/tools'
import { mapGetters } from 'vuex'

export default {
  name: 'SignedTx',
  props: {
    json: Object,
    title: {
      type: String,
      default: 'Previous Page'
    }    
  },
  computed: {
    ...mapGetters(['meta'])    
  }
}
</script>