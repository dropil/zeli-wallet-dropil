<template>
  <div class="field">
    <div class="text">Amount</div>
    <div class="input-wrap">
      <div class="input-button">
        <input v-model="amount" type="number" placeholder="Enter amount" />
        <div class="btn max" @click="max()">Max</div>
      </div>      

      <div class="message" v-show="greaterThanMax">
        Warning: The amount entered is greater than your available balance
      </div>

      <div class="message" v-show="!greaterThanMax && !roomForFees">
        Warning: The amount entered will not leave enough to pay for the transaction fee ({{this.meta.baseFeeCoin}} {{this.meta.ticker}}) and the transaction will fail. 
        We also recommend leaving a little extra for future transactions.
      </div>

      <div class="message" v-show="!greaterThanMax && roomForFees && willEmptyBalance && ['delegate', 'redelegate'].includes(type)">
        Warning: Using this amount will deplete your entire available balance and will not leave room for fees to undelegate. Optionally lower the amount by a small amount to leave room for future transaction fees.
      </div>

      <div class="message" v-show="negativeAmount">
        Error: The amount entered is less than 0
      </div>
    </div>
  </div>
</template>

<script>
import tools from '../../mixins/tools'
import { mapGetters } from 'vuex'
import store from '../../store'
import { SET_TAB_STATE } from '../../store/actions.type'
export default {
  name: 'AmountField',
  props: {
    type: String,
    available: String
  },
  computed: {
    ...mapGetters(['meta', 'send', 'delegate', 'undelegate', 'redelegate']),
    fee() {
      return this.type === 'redelegate' ? parseInt(this.meta.baseFee) * 2 : parseInt(this.meta.baseFee)
    },
    availableInt() {
      return parseInt(this.available)
    },
    amountDenom() {
      return parseInt(parseFloat(this.amount) * parseFloat(this.meta.powerReduction))
    },
    greaterThanMax() {
      if (isNaN(this.amountDenom)) return false
      return this.amountDenom > this.availableInt
    },
    roomForFees() {      
      if (isNaN(this.amountDenom)) return true
      return this.amountDenom <= this.availableInt - this.fee
    },
    willEmptyBalance() {      
      if (isNaN(this.amountDenom)) return false
      return this.amountDenom >= this.availableInt - this.fee
    },
    negativeAmount() {
      if (isNaN(this.amountDenom)) return false
      return this.amountDenom < 0
    }
  },
  data() {
    return {
      amount: ''
    }
  },
  watch: {
    amount(val) {      
      store.dispatch(SET_TAB_STATE, { type: this.type, key: 'amount', value: val })
    }
  },
  mounted() {    
    this.amount = this[this.type].amount
  },
  methods: {
    max() {
      let fee = this.type === 'redelegate' ? parseInt(this.meta.baseFee) * 2 : parseInt(this.meta.baseFee)
      this.amount = tools.toCoinAmount(parseInt(this.available) - fee).replace(/,/g, '')
    }
  }
}
</script>