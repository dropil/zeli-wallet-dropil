<template>
  <div class="sub-tab-content">
    <div class="section validators">
      <div class="table-wrap">
        <table class='validators'>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Validator</th>
              <th>Voting Power</th>
              <th>Commission</th>
              <th class='btns'></th>
            </tr>                    
          </thead>
          <fragment v-if="validators.length">
            <tbody>
              <tr v-for="(v, i) in validators" :key="v.operator_address">
                <td><div class="rank">{{i + 1}}</div></td>
                <td>
                  <div class="img" :class="meta.ticker.toLowerCase()"></div>
                  <div class='img-text'>
                    <a :href="meta.explorerUrl + meta.explorerValidatorEndpoint + v.operator_address" target="_blank" class='bold'>{{shorten(v.description.moniker, 25)}}<br /><span>{{v.operator_address.substr(0, 18)}}..</span></a>
                  </div>                            
                </td>
                <td>{{toCoinAmount(v.tokens)}}<br /><span>{{totalBonded === 0 ? '...' : formatPercent(v.tokens / totalBonded)}}</span></td>
                <td>{{formatPercent(v.commission.commission_rates.rate)}}<br /><span>Max {{formatPercent(v.commission.commission_rates.max_rate)}}</span></td>
                <td class='btns'><a :href="meta.explorerUrl + meta.explorerValidatorEndpoint + v.operator_address" target="_blank" class="btn db">More Info</a><a @click="goToDelegate(v.operator_address)" class="btn g">Delegate</a></td>
              </tr>                          
            </tbody>
          </fragment>
          <fragment v-else>
            <tbody>
              <tr>
                <td colspan='5' class='center'>Loading validators...</td>
              </tr>
            </tbody>
          </fragment>                      
        </table>
      </div>                  
    </div>                
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import tools from '../../../../../mixins/tools'
import store from '../../../../../store'
import { RESET_TAB_STATE, SET_TAB_STATE } from '../../../../../store/actions.type'

export default {
  name: 'Validators',
  computed: {
    ...mapGetters(['meta', 'validators', 'totalBonded'])    
  },
  methods: {
    toCoinAmount(denom) {
      return tools.toCoinAmount(denom)
    },
    formatPercent(percent) {
      return tools.formatPercent(percent)
    },
    goToDelegate(validatorAddress) {
      store.dispatch(RESET_TAB_STATE, 'delegate')
      store.dispatch(SET_TAB_STATE, { type: 'delegate', key: 'destination', value: validatorAddress })      
      this.$root.$emit('switchSubTab', 'delegate')
      tools.toastrSuccess('Validator address pre-filled with selected validator. Enter amount to delegate to continue')
    },
    shorten(text, length) {
      if (text.length < length) return text
      return text.toString().substr(0, length) + '...'
    }
  }
}
</script>