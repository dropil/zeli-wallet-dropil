<template>
  <div class="networks" @click="toggle" :id="uniqueId">
    <p>network</p>
    <div class="current"><div class="img" :class="meta.tickerLower"></div> {{meta.chainId}}</div>
    
    <div class="dropdown" :class="{active:open}" :id="uniqueId+'-child'">
      <div class="wrapper">
        <div class="environment">        
          <p>Mainnet Networks</p>          
                  
          <div class="network" :class="{first:i===0}" v-for="(network, i) in networks.mainnet" :key="i" @click="switchNetwork('mainnet', network.chainId)">
            <div class="img" :class="network.tickerLower"></div>
            <div class="text">
              <div class="name">{{network.chainName}}</div>
              <div class="chain-id">{{network.chainId}}</div>
            </div>              
          </div>           
        </div>
        
        <div class="environment">
          <p>Testnet Networks</p>
          
          <div class="network" :class="{first:i===0}" v-for="(network, i) in networks.testnet" :key="i" @click="switchNetwork('testnet', network.chainId)">
            <div class="img" :class="network.tickerLower"></div>
            <div class="text">
              <div class="name">{{network.chainName}}</div>
              <div class="chain-id">{{network.chainId}}</div>
            </div>              
          </div>     
        </div>          

        <div class="environment">
          <p>Development Networks</p>
          No networks yet               
        </div>          
      </div>      
    </div>
  </div>
</template>

<script>
import tools from '../mixins/tools'
import store from '../store'
import { SET_META } from '../store/actions.type'
import networks from '../config/networks'
import { mapGetters } from 'vuex'

export default {
  name: 'HeaderNetworks',
  data() {
    return {
      uniqueId: '',
      open: false
    }
  },
  computed: {
    ...mapGetters(['meta']),
    networks() {
      return networks
    }
  },
  mounted () {    
    this.uniqueId = tools.randomString()
    this.f = event => this.closeEvent(event, this)
  },
  watch: {
    open () {
      this.bindCloseEvent()
    }
  },
  methods: {
    toggle () {
      this.open = !this.open
    },
    closeEvent: (event, t) => {
      let offsets = document.getElementById(t.uniqueId).getBoundingClientRect();
      let childOffsets = document.getElementById(t.uniqueId+'-child').getBoundingClientRect();

      let top = offsets.top;
      let left = offsets.left;
      let right = offsets.right;
      let childBottom = childOffsets.bottom;

      let pageX = event.pageX
      let pageY = event.pageY

      if ((pageX >= left && pageX <= right) && (pageY >= top && pageY <= childBottom))
        return

      t.open = false
    },
    bindCloseEvent() {
      if (this.open) {
        document.addEventListener('mousedown', this.f)
      } else {
        document.removeEventListener('mousedown', this.f)
      }    
    },
    switchNetwork(environment, chainId) {
      if (chainId === this.meta.chainId) return tools.toastrWarning('You are already connected to that network')

      let meta = { ...networks[environment].filter(n => n.chainId === chainId)[0] }

      store.dispatch(SET_META, meta)
      tools.toastrSuccess('You have switched to the ' + chainId + ' ' + environment + ' network')
      tools.logEvent('Switched Network', 'New Network: ' + chainId)
      this.$router.push('/')
    }
  }
}
</script>