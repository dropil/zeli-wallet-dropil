<template>
  <div class="tab-content wallet">
    <div class="section wallet-information">
      <h3>
        Wallet Information
        <span>
          -
          <a :href="meta.explorerUrl + meta.explorerAccountEndpoint + address" target="_blank">View on Explorer</a>
        </span>

        <div class="updated">
          <span style="margin-right: .75em;">Last updated {{balancesUpdatedSeconds ? balancesUpdatedSeconds + ' second' + (balancesUpdatedSeconds === 1 ? '' : 's') + ' ago' : 'loading...'}}</span>
          <i class="far fa-sync-alt" @click="load(true, true)"></i>
        </div>
      </h3>

      <div class="image">
        <vue-qrcode :value="address" :width="80" />
      </div>

      <div class="text full">
        <b>Wallet Address</b>
        <small>
          HD derivation path: {{hdPathPretty}}
          <i
            class="far fa-info-circle"
            v-tooltip="'Click for more information on HD paths'"
            @click="$popup('hd-path')"
          ></i>
          <a class="change" @click="$popup('hd-path')">Change</a>
        </small>

        <div>
          {{address}}
          <i class="far fa-copy" @click="copy(address)"></i>
        </div>
      </div>
    </div>

    <div class="section balance">
      <h3>
        Balances
        <div class="updated" v-if="balances.available && balances.available !== 'N/A'">
          <span class="cursor" @click="$emit('switchTab', 'send')">Send {{meta.tickerPlural}}</span>
        </div>
      </h3>

      <div class="image">
        <div class="color-logo" :class="meta.ticker.toLowerCase()"></div>
      </div>

      <div class="text">
        <b>Total {{meta.ticker}} Balance</b>
        <br />
        <span v-html="toCoinAmount(totalBalance)"></span> {{meta.ticker}}
        <br />
        <small style="margin-left: 0;">≈ <span v-html="totalUSD"></span> USD (${{coinPrice}} / {{meta.ticker}})</small>
      </div>

      <div class="balances">
        <div class="amount">
          <div class="left">
            Available
            <span>:</span>
          </div>
          <div class="right" v-html="toCoinAmount(balances.available)"></div>
        </div>

        <div class="amount">
          <div class="left">
            Rewards
            <span>:</span>
          </div>
          <div class="right" v-html="toCoinAmount(balances.rewards)"></div>
        </div>

        <div class="amount">
          <div class="left">
            Delegated
            <span>:</span>
          </div>
          <div class="right" v-html="toCoinAmount(balances.delegated)"></div>
        </div>

        <div class="amount">
          <div class="left">
            Unbonding
            <span>:</span>
          </div>
          <div class="right" v-html="toCoinAmount(balances.unbonding)"></div>
        </div>
      </div>
    </div>

    <div class="section delegations">
      <h3>
        Delegations
        <div class="updated">
          <span v-if="delegations.length" class='cursor' @click="$emit('switchTab', 'delegation', 'withdrawRewards')">Claim rewards</span>
          <span v-if="delegations.length"><b style="margin: 0 5px;">|</b></span>
          <span class='cursor' @click="$emit('switchTab', 'delegation', 'validators')">View validators</span>
        </div>
      </h3>

      <div class="image">
        <i class="fad fa-treasure-chest"></i>
      </div>

      <div class="text">
        <b>Total Delegated</b>
        <br />
        <span v-html="toCoinAmount(balances.delegated)"></span> {{meta.ticker}}
        <br />
        <small style="margin-left: 0;"><span v-html="toCoinAmount(balances.rewards)"></span> {{meta.ticker}} - Unclaimed Rewards</small>
      </div>

      <table>
        <thead>
          <tr>
            <th>Validator</th>
            <th>Delegated</th>
            <th>Rewards <i class="far fa-info-circle" v-tooltip="'This reflects unclaimed rewards, not all time rewards'"></i></th>
            <th></th>
          </tr>                  
        </thead>                

        <fragment v-if="delegations.length">
          <tbody>                  
            <tr v-for="d in delegations" :key="d.validator_address">
              <td><a :href="meta.explorerUrl + meta.explorerValidatorEndpoint + d.validator_address" target="_blank">{{getMoniker(d.validator_address)}}</a></td>
              <td><span v-html="toCoinAmount(d.balance)"></span> {{meta.ticker}}</td>
              <td><span v-if="rewards.filter(r => r.validator_address === d.validator_address).length && rewards.filter(r => r.validator_address === d.validator_address)[0].reward" v-html="toCoinAmount(rewards.filter(r => r.validator_address === d.validator_address)[0].reward.filter(r => r.denom === meta.denom)[0].amount)"></span> {{meta.ticker}}</td>
              <td><a class="btn r" @click="goToUndelegate(d.validator_address, d.balance)"><span class='mobile'>X</span><span class='desktop'>Undelegate</span></a></td>
            </tr>                    
          </tbody>
        </fragment>

        <fragment v-else>
          <tbody>
            <tr>
              <td colspan="4" class='center'>No delegation records</td>
            </tr>
          </tbody>
        </fragment>                
      </table>              
    </div>

    <div class="section delegations">
      <h3>Unbonding</h3>

      <div class="image">
        <i class="fad fa-lock-open-alt"></i>
      </div>

      <div class="text">
        <b>Total Unbonding</b>
        <br />
        <span v-html="toCoinAmount(balances.unbonding)"></span> {{meta.ticker}}
      </div>

      <table class="unbonding">
        <thead>
          <tr>
            <th>Validator</th>
            <th>Unbonding</th>
            <th>Remaining</th>
          </tr>                  
        </thead>
        
        <fragment v-if="unbonding.length">
          <tbody v-for="u in unbonding" :key="u.validator_address">
            <tr v-for="(e, i) in u.entries" :key="e.creation_time">
              <td v-html="i === 0 ? `<a href='${meta.explorerUrl}${meta.explorerValidatorEndpoint}${u.validator_address}' target='_blank'>${getMoniker(u.validator_address)}</a>` : ''"></td>
              <td><span v-html="toCoinAmount(e.balance)"></span> {{meta.ticker}}</td>
              <td><Countdown :endDate="e.completion_time" :type="'long'" /></td>
            </tr>                  
          </tbody>
        </fragment>

        <fragment v-else>
          <tbody>
            <tr>
              <td colspan="3" class='center'>No unbonding records</td>
            </tr>                  
          </tbody>
        </fragment>                                
      </table>              
    </div>
  </div>
</template>

<script>
import tools from '../../../mixins/tools'
import { mapGetters } from 'vuex'
import store from '../../../store'
import { SET_BALANCE, RESET_BALANCES, SET_ACCOUNT_DATA, SET_VALIDATORS, 
  SET_TOTAL_BONDED, SET_DELEGATIONS, SET_UNBONDING, 
  SET_REWARDS, SET_LOAD_INTERVAL_ID, SET_BALANCES_UPDATED, 
  RESET_TAB_STATE, SET_TAB_STATE, SET_COIN_PRICE 
  } from '../../../store/actions.type'
import VueQrcode from "vue-qrcode";
import Countdown from "../../MiniComponents/Countdown";

export default {
  name: 'Wallet',
  components: { VueQrcode, Countdown },    
  computed: {
    ...mapGetters(["meta", "address", "hdPathPretty", "balances", "balancesUpdated", 
      "loadIntervalId", "delegations", "rewards", "unbonding", 
      "validators", "totalBonded", "coinPrice"]),
    totalBalance() {
      return String(
        (parseInt(this.balances.available) || 0) +
        (parseInt(this.balances.rewards) || 0) +
        (parseInt(this.balances.delegated) || 0) +
        (parseInt(this.balances.unbonding) || 0)
      );
    },
    totalUSD() {
      if (isNaN(this.totalBalance))
        return '<i class="fas fa-spinner fa-spin"></i>';
        
      return "$" + ((parseFloat(this.totalBalance) / 1000000) * this.coinPrice).toLocaleString("en-US", { maximumFractionDigits: 2 });
    }    
  },
  data() {
    return {
      balancesIntervalId: 0,
      balancesUpdatedSeconds: 0
    }
  },
  mounted() {
    if (this.balancesUpdated) 
      this.balancesUpdatedSeconds = new Date(Date.now() - this.balancesUpdated).getSeconds()      
    
    let firstLoad = !this.balancesUpdatedSeconds || this.balancesUpdatedSeconds > 60    
    
    if (firstLoad) this.load(true)
    else this.startBalancesUpdatedInterval()    
  },
  destroyed() {
    clearInterval(this.balancesIntervalId)    
  },
  methods: {    
    load(firstLoad = false, userRequest = false) {    
      if (userRequest && this.balancesUpdatedSeconds < 10)
        return tools.toastrWarning('You may only manually refresh every 10 seconds')      

      this.balancesUpdatedSeconds = 0
      tools.wallet.load(firstLoad, userRequest)

      this.startBalancesUpdatedInterval()
    },
    startBalancesUpdatedInterval() {      
      clearInterval(this.balancesIntervalId)  
      this.balancesIntervalId = setInterval(() => {
        this.balancesUpdatedSeconds = new Date(Date.now() - this.balancesUpdated).getSeconds()
      }, 1000)
    },
    getMoniker(validatorAddress) {
      return tools.getMoniker(validatorAddress)
    },
    copy(text) {
      copy(text);
    },
    toCoinAmount(denom) {
      return tools.toCoinAmount(denom)
    },
    formatPercent(percent) {
      return tools.formatPercent(percent)
    },
    goToUndelegate(validatorAddress, amount) {            
      store.dispatch(RESET_TAB_STATE, 'undelegate')
      store.dispatch(SET_TAB_STATE, { type: 'undelegate', key: 'destination', value: validatorAddress })
      store.dispatch(SET_TAB_STATE, { type: 'undelegate', key: 'amount', value: String(parseFloat(amount) / 1000000) })

      this.$emit('switchTab', 'delegation', 'undelegate')

      tools.toastrSuccess('Fields pre-filled with validator address and amount to undelegate')
    },
  }
}
</script>