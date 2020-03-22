<template>
  <div class="form">
    <SaveForm ref="saveForm" type="create" :allowSkip="true" @submit="next()" @skip="skip()" />

    <Checkbox ref="agree" :text="'I understand that Dropil cannot help me if I lose access to my wallet. I will safely backup a copy of my wallet via my chosen method(s) and keep it secure.'" />

    <div class="complete">
      <a @click="$emit('back')">
        <i class="far fa-arrow-left"></i> Back
      </a>
      <a class="btn" @click="next()">Save & Continue</a>
    </div>
  </div>
</template>

<script>
import SaveForm from '../SaveForm'
import Checkbox from '../MiniComponents/Checkbox'
import { mapGetters } from 'vuex'
import tools from '../../mixins/tools'
import store from '../../store'
import { SET_CREATE_MNEMONIC, SET_CREATE_ADDRESS } from '../../store/actions.type'

export default {
  name: 'Save',
  components: { SaveForm, Checkbox },
  computed: {
    ...mapGetters(['meta'])    
  },
  data() {
    return {
      
    }
  },
  methods: {
    async skip() {            
      if (!this.$refs.agree.checked) return tools.toastrError('Please check the box at the bottom of this form to at least acknowledge the risks before skipping this step')
      await this.generateWallet()
      this.$emit('step', 'details')
    },
    async next() {
      if (!this.$refs.agree.checked) return tools.toastrError('Please check the box accepting the terms before continuing')
      else if (!this.$refs.saveForm.validateSave()) return

      let { mnemonic, address } = await this.generateWallet()
      
      this.$refs.saveForm.saveBrowser(mnemonic, address)
      this.$refs.saveForm.saveKeystore(mnemonic, address)

      this.$emit('step', 'details')
    },
    async generateWallet() {
      let drop = tools.startDropJs()
      let { address, mnemonic } = await drop.generateWallet()

      store.dispatch(SET_CREATE_MNEMONIC, mnemonic)
      store.dispatch(SET_CREATE_ADDRESS, address)

      return { address, mnemonic }
    }
  }
}
</script>