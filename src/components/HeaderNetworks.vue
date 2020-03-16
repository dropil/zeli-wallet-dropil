<template>
  <div class="networks" @click="toggle" :id="uniqueId">
    <p>network</p>
    <div class="current">{{meta.chainId}}</div>
    
    <div class="dropdown" :class="{active:open}" :id="uniqueId+'-child'">
      <div class="wrapper">
        <div class="environment">        
          <p>Mainnet Networks</p>          
                  
          <div class="network first" @click="switchNetwork('mainnet', 'cosmoshub-3')">
            <div class="img atom"></div>
            <div class="text">
              <div class="name">Cosmos Hub</div>
              <div class="chain-id">cosmoshub-3</div>
            </div>              
          </div>            
        </div>
        
        <div class="environment">
          <p>Testnet Networks</p>
          No networks yet          
        </div>          

        <div class="environment">
          <p>Development Networks</p>
          <div class="network first" @click="switchNetwork('development', 'dropilchain-testnet')">
            <div class="img drop"></div>
            <div class="text">
              <div class="name">Dropil Chain</div>
              <div class="chain-id">dropilchain-testnet</div>
            </div>              
          </div>
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
    ...mapGetters(['meta'])
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

      store.dispatch(SET_META, networks[environment][chainId])      
      tools.toastrSuccess('You have switched to the ' + chainId + ' network')
      this.$root.$emit('disconnect')
    }
  }
}
</script>