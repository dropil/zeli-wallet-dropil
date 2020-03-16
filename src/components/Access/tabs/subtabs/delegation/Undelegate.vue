<template>
  <div class="sub-tab-content">
    <Loading v-if="undelegate.loading" />

    <div class="section" v-if="undelegate.start">
      <p class="desc">
        Before delegating / staking your {{meta.tickerPlural}}, ensure you understand all of the associated
        <b class="danger">risks and rewards</b> with delegating.
        Read all about delegating in the
        <a :href="meta.infoDocsUrl" target="_blank" >{{meta.chainName}} Documentation</a>.
      </p> 

      <p class="desc">
        <b class="danger">After undelegating, {{meta.tickerPlural}} cannot be withdrawn for 21 days.</b> 
        Transferring delegation between two validators does not impose the same restriction.
      </p>

      <div class="form">
        <div class="field">
          <div class="text">Validator Address</div>
          <input v-model="destination" type="text" :placeholder="'Enter validator address (' + meta.bech32Prefix + 'valoper...)'" />
        </div>

        <div class="field">
          <div class="text">Amount</div>
          <input v-model="amount" type="number" placeholder="Enter amount to undelegate" />
        </div>

        <div class="field">
          <div class="text">Memo (optional)</div>
          <textarea v-model="memo" rows="3" placeholder="Enter memo"></textarea>
        </div>

        <div class="text-button">
          <p>
            Prepare this
            <b>undelegate</b> transaction by signing it with your provided mnemonic phrase. 
            This does not submit the transaction to the blockchain yet.
            You will be able to review this transaction before submitting.
          </p>

          <div>
            <div class="btn" @click="signTransaction()">Sign Transaction</div>
          </div>
        </div>
      </div>
    </div>

    <SignedTx v-if="undelegate.signed" :signedTx="undelegate.signedTx" @broadcast="broadcastTransaction()" @reset="$emit('reset', 'undelegate')" :title="'Undelegate'" />
    <BroadcastedTx v-if="undelegate.broadcasted" :json="undelegate.broadcastResponse" @reset="$emit('reset', 'undelegate')" :title="'Undelegate'" />     
  </div>
</template>

<script>
import SignedTx from '../../../components/SignedTx'
import BroadcastedTx from '../../../components/BroadcastedTx'
import Loading from '../../../../MiniComponents/Loading'
import tools from '../../../../../mixins/tools'
import { mapGetters } from 'vuex'
import store from '../../../../../store'
import { SET_TAB_STATE, RESET_TAB_STATE } from '../../../../../store/actions.type'

export default {
  name: 'Undelegate',
  components: { SignedTx, BroadcastedTx, Loading },
  computed: {
    ...mapGetters(['meta', 'undelegate', 'balances'])
  },
  data() {
    return {
      destination: '',
      amount: '',
      memo: ''
    }
  },
  watch: {
    undelegate: {
      deep: true,
      handler() {
        this.destination = this.undelegate.destination
        this.amount = this.undelegate.amount
        this.memo = this.undelegate.memo
      }
    },
    destination(val) {
      store.dispatch(SET_TAB_STATE, { type: 'undelegate', key: 'destination', value: val })
    },
    amount(val) {
      store.dispatch(SET_TAB_STATE, { type: 'undelegate', key: 'amount', value: val })
    },
    memo(val) {
      store.dispatch(SET_TAB_STATE, { type: 'undelegate', key: 'memo', value: val })
    }
  },
  mounted() {
    this.destination = this.undelegate.destination
    this.amount = this.undelegate.amount
    this.memo = this.undelegate.memo
  },
  methods: {
    signTransaction() {
      tools.signTransaction('undelegate')
    },
    broadcastTransaction() {
      tools.broadcastTransaction('undelegate')
    }
  }
}
</script>