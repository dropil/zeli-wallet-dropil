<template>
  <div class="sub-tab-content">
    <Loading v-if="delegate.loading" />

    <div class="section" v-if="delegate.start">      
      <p class="desc">
        Before delegating / staking your {{meta.tickerPlural}}, ensure you understand all of the associated
        <b class="danger">risks and rewards</b> with delegating.
        Read all about delegating in the
        <a :href="meta.infoDocsUrl" target="_blank" >{{meta.chainName}} Documentation</a>.
      </p>                  

      <p class="desc">
        To view available validators to delegate to, click the <b>View Validators</b> tab which 
        shows useful information for choosing a validator to delegate to.
      </p>

      <div class="form">
        <div class="field">
          <div class="text">Available Balance</div>
          <div class="value" v-html="toCoinAmount(balances.available) + ' ' + meta.ticker"></div>
        </div>

        <div class="field">
          <div class="text">Validator Address</div>
          <input v-model="destination" type="text" :placeholder="'Enter validator address (' + meta.bech32Prefix + 'valoper...)'" />
        </div>

        <div class="field">
          <div class="text">Amount</div>
          <input v-model="amount" type="number" placeholder="Enter amount to delegate" />
        </div>

        <div class="field">
          <div class="text">Memo (optional)</div>
          <textarea v-model="memo" rows="3" placeholder="Enter memo"></textarea>
        </div>

        <div class="text-button">
          <p>
            Prepare this
            <b>delegate</b> transaction by signing it with your provided mnemonic phrase. 
            This does not submit the transaction to the blockchain yet.
            You will be able to review this transaction before submitting.
          </p>

          <div>
            <div class="btn" @click="signTransaction()">Sign Transaction</div>
          </div>
        </div>
      </div>
    </div>

    <SignedTx v-if="delegate.signed" :signedTx="delegate.signedTx" @broadcast="broadcastTransaction()" @reset="$emit('reset', 'delegate')" :title="'Delegate'" />
    <BroadcastedTx v-if="delegate.broadcasted" :json="delegate.broadcastResponse" @reset="$emit('reset', 'delegate')" :title="'Delegate'" />     
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
  name: 'Delegate',
  components: { SignedTx, BroadcastedTx, Loading },
  computed: {
    ...mapGetters(['meta', 'delegate', 'balances'])    
  },
  data() {
    return {
      destination: '',
      amount: '',
      memo: ''
    }
  },
  watch: {
    delegate: {
      deep: true,
      handler() {
        this.destination = this.delegate.destination
        this.amount = this.delegate.amount
        this.memo = this.delegate.memo
      }
    },
    destination(val) {
      store.dispatch(SET_TAB_STATE, { type: 'delegate', key: 'destination', value: val })
    },
    amount(val) {
      store.dispatch(SET_TAB_STATE, { type: 'delegate', key: 'amount', value: val })
    },
    memo(val) {
      store.dispatch(SET_TAB_STATE, { type: 'delegate', key: 'memo', value: val })
    }
  },
  mounted() {
    this.destination = this.delegate.destination
    this.amount = this.delegate.amount
    this.memo = this.delegate.memo
  },
  methods: {
    toCoinAmount(denom) {      
      return tools.toCoinAmount(denom)      
    },
    signTransaction() {
      tools.signTransaction('delegate')
    },
    broadcastTransaction() {
      tools.broadcastTransaction('delegate')
    }
  }
}
</script>