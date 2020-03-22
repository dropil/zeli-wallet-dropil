<template>
  <div class="main-content" key="create">
    <div class="content">
      <h3>Create a {{meta.chainAndEnvironment}} Wallet</h3>
      <VerifyDomain />

      <transition name="animation-fade-fast" mode="out-in">
        <Start ref="start" v-if="step==='start'" key="start" @step="goToStep" />
        <Save v-if="step==='save'" key="save" @back="back()" @step="goToStep" />
        <Details v-if="step==='details'" key="details" @back="back()" @step="goToStep" />
      </transition>      
    </div>
  </div>
</template>

<script>
import VerifyDomain from '../components/VerifyDomain'
import Start from '../components/Create/Start'
import Save from '../components/Create/Save'
import Details from '../components/Create/Details'
import { mapGetters } from 'vuex'
import store from '../store'
import { SET_CREATE_MNEMONIC, SET_CREATE_ADDRESS } from '../store/actions.type'

export default {
  name: 'Create',
  title: 'Create a Wallet',
  pageClass: 'create',
  components: { VerifyDomain, Start, Save, Details },
  computed: {
    ...mapGetters(['meta'])     
  },
  data() {
    return {
      step: 'start'            
    }
  },  
  methods: {
    goToStep(step) {
      this.step = step
    },
    back() {
      store.dispatch(SET_CREATE_MNEMONIC, '')
      store.dispatch(SET_CREATE_ADDRESS, '')

      if (this.step === 'details')
        this.step = 'save'
      else 
        this.step = 'start'            
    }
  }
}
</script>