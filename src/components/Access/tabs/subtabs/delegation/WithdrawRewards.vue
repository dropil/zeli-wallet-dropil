<template>
  <div class="sub-tab-content">
    <Loading v-if="withdrawRewards.loading || modifyWithdrawAddress.loading" />

    <div class="section" v-if="withdrawRewards.start && !modifyWithdrawAddress.signed && !modifyWithdrawAddress.broadcasted">
      <p class="desc">
        You may withdraw rewards earned from staking here. Rewards are automatically withdrawn to 
        the designated withdraw address when you delegate or undelegate to any validator. 
        Read more about delegators in the <a :href="meta.infoDocsUrl" target="_blank">{{meta.chainName}} Documentation</a>.
      </p>

      <div class="form">
        <div class="field">
          <div class="text">Available Rewards</div>
          <div class="value" v-html="toCoinAmount(balances.rewards) + ' ' + meta.ticker"></div>
        </div>

        <div class="field">
          <div class="text">Withdraw Address</div>
          <div class="input-wrap has-button">
            <input v-model="withdrawAddress" type="text" :placeholder="'Enter validator address (' + meta.bech32Prefix + '...)'" />
            <div class="btn" @click="signTransaction('modifyWithdrawAddress')">Update</div>
          </div>                      
          <div></div>
          <small style="margin-top: .5em">To edit the withdraw address, input the desired address and click update</small>
        </div>
        <br />
        <div class="text-button">
          <p>
            Prepare this
            <b>withdraw rewards</b> transaction by signing it with your provided mnemonic phrase. 
            This does not submit the transaction to the blockchain yet.
            You will be able to review this transaction before submitting.
          </p>

          <div>
            <div class="btn" @click="signTransaction('withdrawRewards')">Sign Transaction</div>
          </div>
        </div>
      </div>
    </div>  

    <SignedTx v-if="withdrawRewards.signed" :signedTx="withdrawRewards.signedTx" @broadcast="broadcastTransaction('withdrawRewards')" @reset="$emit('reset', 'withdrawRewards')" :title="'Withdraw Rewards'" />
    <BroadcastedTx v-if="withdrawRewards.broadcasted" :json="withdrawRewards.broadcastResponse" @reset="$emit('reset', 'withdrawRewards')" :title="'Withdraw Rewards'" />     

    <SignedTx v-if="modifyWithdrawAddress.signed" :signedTx="modifyWithdrawAddress.signedTx" @broadcast="broadcastTransaction('modifyWithdrawAddress')" @reset="$emit('reset', 'modifyWithdrawAddress')" :title="'Withdraw Rewards'" />
    <BroadcastedTx v-if="modifyWithdrawAddress.broadcasted" :json="modifyWithdrawAddress.broadcastResponse" @reset="$emit('reset', 'modifyWithdrawAddress')" :title="'Withdraw Rewards'" />     
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
  name: 'WithdrawRewards',
  components: { SignedTx, BroadcastedTx, Loading },
  computed: {
    ...mapGetters(['meta', 'withdrawRewards', 'modifyWithdrawAddress', 'balances'])
  },
  data() {
    return {
      withdrawAddress: ''
    }
  },
  watch: {
    modifyWithdrawAddress: {
      deep: true,
      handler() {
        this.withdrawAddress = this.modifyWithdrawAddress.withdrawAddress        
      }
    },
    withdrawAddress() {
      store.dispatch(SET_TAB_STATE, { type: 'modifyWithdrawAddress', key: 'withdrawAddress', value: e.target.value })
    } 
  },
  mounted() {
    this.withdrawAddress = this.modifyWithdrawAddress.withdrawAddress
  },
  methods: {    
    toCoinAmount(denom) {      
      return tools.toCoinAmount(denom)      
    },
    signTransaction(type) {
      tools.signTransaction(type)
    },
    broadcastTransaction(type) {
      tools.broadcastTransaction(type)
    },
    reset() {
      store.dispatch(RESET_TAB_STATE, 'modifyWithdrawAddress')
      store.dispatch(RESET_TAB_STATE, 'withdrawRewards')
    }
  }  
}
</script>