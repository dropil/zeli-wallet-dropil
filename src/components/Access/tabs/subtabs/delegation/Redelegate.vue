<template>
  <div class="sub-tab-content">
    <Loading v-if="redelegate.loading" />

    <div class="section" v-if="redelegate.start">      
      <p class="desc">
        Before delegating / staking your {{meta.tickerPlural}}, ensure you understand all of the associated
        <b class="danger">risks and rewards</b> with delegating.
        Read all about delegating in the
        <a :href="meta.infoDocsUrl" target="_blank" >{{meta.chainName}} Documentation</a>.
      </p>

      <p class="desc">
        You can transfer your delegation of {{meta.tickerPlural}} from one validator to another without waiting 
        the 21 day undelegation period. This is available to prevent bad actors from harming 
        innocent delegators. To view available validators to delegate to, click the <b>View Validators</b> 
        tab which shows useful information for choosing a validator to delegate to.
      </p>

      <div class="form">                    
        <div class="field">
          <div class="text">Old Validator Address</div>
          <input v-model="validatorSourceAddress" type="text" :placeholder="'Enter validator address (' + meta.bech32Prefix + 'valoper...)'" />
        </div>

        <div class="field">
          <div class="text">New Validator Address</div>
          <input v-model="validatorDestAddress" type="text" :placeholder="'Enter validator address (' + meta.bech32Prefix + 'valoper...)'" />
        </div>

        <div class="field">
          <div class="text">Amount</div>
          <input v-model="amount" type="number" placeholder="Enter amount to transfer" />
        </div>

        <div class="field">
          <div class="text">Memo (optional)</div>
          <textarea v-model="memo" rows="3" placeholder="Enter memo"></textarea>
        </div>

        <div class="text-button">
          <p>
            Prepare this
            <b>redelegate</b> transaction by signing it with your provided mnemonic phrase. 
            This does not submit the transaction to the blockchain yet.
            You will be able to review this transaction before submitting.
          </p>

          <div>
            <div class="btn" @click="signTransaction()">Sign Transaction</div>
          </div>
        </div>
      </div>
    </div>

    <SignedTx v-if="redelegate.signed" :signedTx="redelegate.signedTx" @broadcast="broadcastTransaction()" @reset="$emit('reset', 'redelegate')" :title="'Transfer Delegation'" :feeText="`The redelegate transaction charges ${meta.baseFeeCoin*2} ${meta.ticker} instead of ${meta.baseFeeCoin} ${meta.ticker} due to high gas consumption.`" />
    <BroadcastedTx v-if="redelegate.broadcasted" :json="redelegate.broadcastResponse" @reset="$emit('reset', 'redelegate')" :title="'Transfer Delegation'" />     
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
  name: 'Redelegate',
  components: { SignedTx, BroadcastedTx, Loading },
  computed: {
    ...mapGetters(['meta', 'redelegate', 'balances'])
  },
  data() {
    return {
      validatorSourceAddress: '',
      validatorDestAddress: '',
      amount: '',
      memo: ''
    }
  },
  watch: {
    redelegate: {
      deep: true,
      handler() {
        this.validatorSourceAddress = this.redelegate.validatorSourceAddress
        this.validatorDestAddress = this.redelegate.validatorDestAddress
        this.amount = this.redelegate.amount
        this.memo = this.redelegate.memo
      }
    },
    validatorSourceAddress(val) {
      store.dispatch(SET_TAB_STATE, { type: 'redelegate', key: 'validatorSourceAddress', value: val })
    },
    validatorDestAddress(val) {
      store.dispatch(SET_TAB_STATE, { type: 'redelegate', key: 'validatorDestAddress', value: val })
    },
    amount(val) {
      store.dispatch(SET_TAB_STATE, { type: 'redelegate', key: 'amount', value: val })
    },
    memo(val) {
      store.dispatch(SET_TAB_STATE, { type: 'redelegate', key: 'memo', value: val })
    }
  },
  mounted() {
    this.validatorSourceAddress = this.redelegate.validatorSourceAddress
    this.validatorDestAddress = this.redelegate.validatorDestAddress
    this.amount = this.redelegate.amount
    this.memo = this.redelegate.memo
  },
  methods: {
    signTransaction() {
      tools.signTransaction('redelegate')
    },
    broadcastTransaction() {
      tools.broadcastTransaction('redelegate')
    }
  }
}
</script>