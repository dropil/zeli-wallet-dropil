<template>
  <div class="popup new-proposal" :class="{wide: submitProposal.signedTx || submitProposal.broadcasted}">
    <a @click="$emit('close-popup')" class="close"></a>    
    <h2>Create New Proposal</h2>

    <div class="wrapper">
      <Loading v-if="submitProposal.loading" />

      <div class="section" v-if="submitProposal.start">
        <p>
          Create a new governance proposal by setting a title, description, and initial deposit amount.
          The minimum deposit on proposals for {{meta.chainAndEnvironment}} is <b>{{formatAmount(minDeposit)}} {{meta.ticker}}</b>.
        </p>
        
        <div class="form">
          <InputWrap v-model="title" placeholder="Proposal Title" />

          <TextareaWrap v-model="description" placeholder="Proposal Description" />

          <InputWrap v-model="amount" ref="deposit" placeholder="Initial Deposit" />
        </div>

        <p>
          Prepare this
          <b>submit proposal</b> transaction by signing it with your provided mnemonic phrase. 
          This does not submit the transaction to the blockchain yet.
          You will be able to review this transaction before submitting.
        </p>

        <div class="buttons">
          <div class="btn grey left" @click="$closePopups()">Cancel</div>
          <div class="btn right" @click="signTransaction()">Sign Transaction</div>
        </div>
      </div>

      <SignedTx v-if="submitProposal.signed" :signedTx="submitProposal.signedTx" @broadcast="broadcastTransaction()" @reset="close(false)" :title="'New Proposal'" />
      <BroadcastedTx v-if="submitProposal.broadcasted" :json="submitProposal.broadcastResponse" @reset="close()" :title="'Proposals'" />         
    </div>    
  </div>
</template>

<script>
import InputWrap from '../MiniComponents/InputWrap'
import TextareaWrap from '../MiniComponents/TextareaWrap'
import Loading from '../MiniComponents/Loading'
import SignedTx from '../Access/components/SignedTx'
import BroadcastedTx from '../Access/components/BroadcastedTx'
import { mapGetters } from 'vuex'
import tools from '../../mixins/tools'
import store from '../../store'
import { RESET_TAB_STATE, SET_TAB_STATE } from '../../store/actions.type'

export default {
  name: 'NewProposal',
  components: { InputWrap, TextareaWrap, Loading, SignedTx, BroadcastedTx },
  computed: {
    ...mapGetters(['meta', 'submitProposal'])
  },
  data() {
    return {
      minDeposit: 0,
      title: '',
      description: '',
      amount: ''
    }
  },
  watch: {
    submitProposal: {
      deep: true,
      handler() {
        this.title = this.submitProposal.title
        this.description = this.submitProposal.description
        this.amount = this.submitProposal.amount        
      }
    },
    title(val) {      
      store.dispatch(SET_TAB_STATE, { type: 'submitProposal', key: 'title', value: val })
    },
    description(val) {      
      store.dispatch(SET_TAB_STATE, { type: 'submitProposal', key: 'description', value: val })
    },
    amount(val) {
      store.dispatch(SET_TAB_STATE, { type: 'submitProposal', key: 'amount', value: val })
    }    
  },
  mounted() {
    this.title = this.submitProposal.title
    this.description = this.submitProposal.description
    this.amount = this.submitProposal.amount
    this.getMinDeposit()  
  },
  methods: {
    async getMinDeposit() {
      this.minDeposit = await tools.fetch(this.meta.apiUrl + '/gov/parameters/deposit').then(data => {
        return data.result.min_deposit.filter(x => x.denom === this.meta.denom)[0].amount
      })

      this.$refs.deposit.input = this.formatAmount(this.minDeposit).replace(/,/g, '')
    },
    formatAmount(amount) {
      return tools.toCoinAmount(amount)
    },
    signTransaction() {
      tools.signTransaction('submitProposal')
    },
    broadcastTransaction() {
      tools.broadcastTransaction('submitProposal')
      setTimeout(() => this.$root.$emit('getProposals'), 10000)
    },
    close(exit = true) {
      store.dispatch(RESET_TAB_STATE, 'submitProposal')
      
      if (exit) window.closePopups()
      else this.getMinDeposit()
    }
  },
  destroyed() {
    this.close(false)
  }
}
</script>