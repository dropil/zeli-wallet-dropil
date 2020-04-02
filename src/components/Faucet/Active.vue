<template>
  <div class="form faucet">
    <div class="paragraphs active">
      <h3>Welcome to the Testnet Faucet!</h3>

      <p style="margin-top: 5px;">
        Currently logged in as: <span class="username">{{currentUser.username}}</span>
      </p>

      <p>
        You may request <b>10,000</b> testnet {{meta.tickerPlural}} from the faucet up to {{maxRequests}} times.
        You have currently used {{used}} request{{used === 1 ? '' : 's'}} and have {{remaining}} remaining.
      </p>                 
    </div>
    
    <div class="new-request" v-if="remaining > 0">
      <h3>New Request</h3>
      <p>
        Provide a {{meta.chainAndEnvironment}} address and press submit to make a new faucet request.
      </p>

      <InputWrap ref="address" v-model="input" :placeholder="meta.chainAndEnvironment + ' Address'" />

      <div class="complete">
        <a class="btn" @click="newRequest()">Submit</a>
      </div>
    </div>

    <div class="requests" v-if="!firstLoad && requests.length">
      <h3>Past Faucet Requests</h3>

      <p>
        Below is a list of past faucet requests you have made and their details. 
      </p>

      <div class="input-wrap faucet-request" v-for="(request, i) in requests" :key="i">
        <div class="above">
          <div class="left">
            <label>{{formatAmount(request.amount)}} {{meta.tickerPlural}} To:</label>
          </div>

          <div class="right">
            <div class="tag sm" :class="request.status.toLowerCase()">{{request.status}}</div>
          </div>
        </div>

        <input type="text" readonly="readonly" :value="request.address">

        <div class="under">
          <div class="left">
            <label>{{formatDate(request.dateSent !== '0001-01-01T00:00:00' ? request.dateSent : request.date)}}</label>
          </div>          

          <div class="right">
            <label v-if="request.txid !== 'N/A'"><a :href="meta.explorerUrl + meta.explorerTransactionEndpoint + request.txid" target="_blank">View TX <i class="fa fa-arrow-right"></i></a></label>            
          </div>
        </div>
      </div> 
    </div>
  </div>
</template>

<script>
import InputWrap from '../MiniComponents/InputWrap'
import { mapGetters } from 'vuex'
import Api from '../../api/api.service'
import tools from '../../mixins/tools'

export default {
  name: 'Active',
  components: { InputWrap },
  computed: {
    ...mapGetters(['meta', 'currentUser']),
    used() {
      return this.requests.length
    },
    remaining() {
      return this.maxRequests - this.used
    }
  },
  data() {
    return {
      maxRequests: 5,
      requests: [],
      input: '',
      firstLoad: false,
      loading: false,
      timeoutId: 0
    }
  },
  mounted() {    
    this.firstLoad = true
    this.getFaucetRequests().then(() => {
      this.firstLoad = false
      this.loading = false      
    })
  },
  methods: {
    getFaucetRequests() {      
      this.loading = true
      
      return Api.get('faucet', null, true).then(r => {
        this.requests = r.data.result
        
        // if there are pending requests, then start the timeout to recheck
        if (this.requests.filter(r => r.status.toLowerCase() === 'pending').length)
          this.startTimeout()
        else {           
          clearTimeout(this.timeoutId)
          this.timeoutId = 0
        }
        
        this.loading = false
        return true
      }).catch(() => {
        this.loading = false
        return false
      })
    },
    formatAmount(amount) {
      return tools.toCoinAmount(parseFloat(amount) * this.meta.powerReduction)
    },
    formatDate(date) {
      return tools.formatDate(new Date(date).toString() + ' UTC')
    },
    newRequest() {
      if (this.loading) return
      this.loading = true

      if (this.input === '')
        return tools.toastrError('Please enter an address for the faucet request')
      else if (!this.input.startsWith(this.meta.bech32Prefix + '1'))
        return tools.toastrError('Address entered was not in proper format "' + this.meta.bech32Prefix + '1..."')
            
      Api.post('faucet', { value: this.input }, true).then(data => {
        if (typeof data === "string") return tools.toastrError(data)

        this.$refs.address.input = ''
        this.getFaucetRequests()
        tools.toastrSuccess('Faucet request has been submitted, requests are usually completed within 1 minute. This page will automatically update when processed.')
        tools.logEvent('Faucet Used')
      })
    },
    startTimeout() {      
      this.timeoutId = setTimeout(() => {
        this.getFaucetRequests()
      }, 10000)
    }
  },
  destroyed() {
    clearTimeout(this.timeoutId)
  }
}
</script>