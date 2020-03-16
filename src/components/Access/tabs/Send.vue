<template>
  <div class="tab-content send">
    <Loading v-if="send.loading" />    

    <div class="section" v-if="send.start">
      <h3>Send {{meta.tickerPlural}}</h3>

      <div class="form">
        <div class="field">
          <div class="text">Available Balance</div>
          <div class="value" v-html="toCoinAmount(balances.available) + ' ' + meta.ticker"></div>
        </div>

        <div class="field">
          <div class="text">Destination Address</div>
          <input v-model="destination" type="text" :placeholder="'Enter destination address (' + meta.bech32Prefix + '...)'" />
        </div>

        <div class="field">
          <div class="text">Amount</div>
          <input v-model="amount" type="number" placeholder="Enter amount to send" />
        </div>

        <div class="field">
          <div class="text">Memo (optional)</div>
          <textarea v-model="memo" rows="3" placeholder="Enter memo"></textarea>
        </div>

        <div class="text-button">
          <p>
            Prepare this
            <b>send</b> transaction by signing it with your provided mnemonic phrase. 
            This does not submit the transaction to the blockchain yet.
            You will be able to review this transaction before submitting.
          </p>

          <div>
            <div class="btn" @click="signTransaction()">Sign Transaction</div>
          </div>
        </div>
      </div>
    </div>

    <SignedTx v-if="send.signed" :signedTx="send.signedTx" @broadcast="broadcastTransaction()" @reset="$emit('reset', 'send')" :title="'Send'" />
    <BroadcastedTx v-if="send.broadcasted" :json="send.broadcastResponse" @reset="$emit('reset', 'send')" :title="'Send'" />     
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { SET_TAB_STATE } from '../../../store/actions.type'
import SignedTx from '../components/SignedTx'
import BroadcastedTx from '../components/BroadcastedTx'
import Loading from '../../MiniComponents/Loading'
import tools from '../../../mixins/tools'
import store from '../../../store'

export default {
  name: 'Send',
  components: { SignedTx, BroadcastedTx, Loading },
  computed: {
    ...mapGetters(['meta', 'send', 'balances'])
  },
  data() {
    return {
      destination: '',
      amount: '',
      memo: ''
    }
  },
  watch: {
    send: {
      deep: true,
      handler() {
        this.destination = this.send.destination
        this.amount = this.send.amount
        this.memo = this.send.memo
      }
    },
    destination(val) {
      store.dispatch(SET_TAB_STATE, { type: 'send', key: 'destination', value: val })
    },
    amount(val) {
      store.dispatch(SET_TAB_STATE, { type: 'send', key: 'amount', value: val })
    },
    memo(val) {      
      store.dispatch(SET_TAB_STATE, { type: 'send', key: 'memo', value: val })
    }
  },
  mounted() {
    this.destination = this.send.destination
    this.amount = this.send.amount
    this.memo = this.send.memo
  },
  methods: {
    toCoinAmount(denom) {
      return tools.toCoinAmount(denom)
    },
    signTransaction() {
      tools.signTransaction('send')
    },
    broadcastTransaction() {
      tools.broadcastTransaction('send')
    }
  }
}
</script>