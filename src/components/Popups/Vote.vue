<template>
  <div class="popup vote" :class="{wide: vote.signedTx || vote.broadcasted}">
    <a @click="$emit('close-popup')" class="close"></a>
    <h2>Vote on Proposal</h2>

    <div class="wrapper">      
      <Loading v-if="vote.loading" />      

      <div class="section" v-if="vote.start">
        <div class="notice danger" v-if="existingVote">
          Warning! You have already voted '{{existingVote}}' on this proposal.
        </div>

        <div class="title">{{this.voteProposal.title}}</div>
        <p>
          Vote on this proposal by selecting one of the options below. Delegators that do not vote on a proposal 
          inherit the vote of the validator they are delegating to.
        </p>

        <p>
          Selecting an option below will prepare a 
          <b>vote</b> transaction by signing it with your provided mnemonic phrase. 
          This does not submit the transaction to the blockchain yet.
          You will be able to review this transaction before submitting.
        </p>

        <div class="options">
          <div class="option yes" @click="castVote('Yes')">Yes</div>
          <div class="option no" @click="castVote('No')">No</div>
          <div class="option veto" @click="castVote('NoWithVeto')">Veto / Reject</div>
          <div class="option abstain" @click="castVote('Abstain')">Abstain / Opt Out</div>
        </div>
      </div>

      <SignedTx v-if="vote.signed" :signedTx="vote.signedTx" @broadcast="broadcastTransaction()" @reset="close(false)" :title="'Vote'" />
      <BroadcastedTx v-if="vote.broadcasted" :json="vote.broadcastResponse" @reset="close()" :title="'Proposals'" />         
    </div>
  </div>
</template>

<script>
import Loading from '../MiniComponents/Loading'
import SignedTx from '../Access/components/SignedTx'
import BroadcastedTx from '../Access/components/BroadcastedTx'
import { mapGetters } from 'vuex'
import tools from '../../mixins/tools'
import store from '../../store'
import { RESET_TAB_STATE, SET_TAB_STATE } from '../../store/actions.type'

export default {
  name: 'Vote',  
  components: { Loading, SignedTx, BroadcastedTx },
  computed: {
    ...mapGetters(['meta', 'vote', 'voteProposal', 'address']),
    proposal_id() {
      return this.voteProposal.id
    }
  },
  data() {
    return {
      existingVote: ''
    }
  },
  beforeMount() {
    tools.fetch(`${this.meta.apiUrl}/gov/proposals/${this.proposal_id}/votes/${this.address}`)
    .then(data => this.existingVote = data.result.option)
    .catch(() => this.existingVote = '')
  },
  methods: {
    castVote(option) {
      store.dispatch(SET_TAB_STATE, { type: 'vote', key: 'proposal_id', value: this.voteProposal.id })
      store.dispatch(SET_TAB_STATE, { type: 'vote', key: 'option', value: option })
      tools.signTransaction('vote')
    },    
    broadcastTransaction() {
      tools.broadcastTransaction('vote')
      setTimeout(() => this.$root.$emit('getProposals'), 10000)
    },
    close(exit = true) {
      store.dispatch(RESET_TAB_STATE, 'vote')      
      if (exit) window.closePopups()      
    }
  },
  destroyed() {
    this.close(false)
  }  
}
</script>