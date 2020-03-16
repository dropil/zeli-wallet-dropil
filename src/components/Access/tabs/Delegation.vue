<template>
  <div class="tab-content has-sub-tabs delegate">
    <div class="sub-tabs">
      <a class="tab" @click="tab='delegate'" :class="{active:tab==='delegate'}">Delegate {{meta.tickerPlural}}</a>
      <a class="tab" @click="tab='undelegate'" :class="{active:tab==='undelegate'}">Undelegate {{meta.tickerPlural}}</a>
      <a class="tab" @click="tab='redelegate'" :class="{active:tab==='redelegate'}">Transfer Delegation</a>
      <a class="tab" @click="tab='withdrawRewards'" :class="{active:tab==='withdrawRewards'}">Withdraw Rewards</a>
      <a class="tab" @click="tab='validators'" :class="{active:tab==='validators'}">View Validators</a>
    </div>

    <transition name="animation-fade-fast" mode="out-in">            
      <Delegate v-if="tab==='delegate'" key="delegate" @reset="val => $emit('reset', val)" />
      <Undelegate v-if="tab==='undelegate'" key="undelegate" @reset="val => $emit('reset', val)" />
      <Redelegate v-if="tab==='redelegate'" key="redelegate" @reset="val => $emit('reset', val)" />
      <WithdrawRewards v-if="tab==='withdrawRewards'" key="withdrawRewards" @reset="val => $emit('reset', val)" />
      <Validators v-if="tab==='validators'" key="validators" @reset="val => $emit('reset', val)" />                
    </transition>
  </div>
</template>

<script>
import tools from '../../../mixins/tools'
import Delegate from './subtabs/delegation/Delegate'
import Undelegate from './subtabs/delegation/Undelegate'
import Redelegate from './subtabs/delegation/Redelegate'
import WithdrawRewards from './subtabs/delegation/WithdrawRewards'
import Validators from './subtabs/delegation/Validators'
import { mapGetters } from 'vuex'

export default {
  name: 'Delegation',
  components: { Delegate, Undelegate, Redelegate, WithdrawRewards, Validators },
  computed: {
    ...mapGetters(['meta'])    
  },
  data() {
    return {
      tab: 'delegate'
    }
  },
  mounted() {
    this.$root.$on('switchSubTab', subtab => this.tab = subtab)
  },
  destroyed() {
    this.$root.$off('switchSubTab')
  }
}
</script>