<template>
  <div class="form mnemonic">
    <div class="paragraphs" :class="{active:showText}">
      <h3>Important Notes</h3>      

      <p>
        Dropil, the creator of this app, does not gain access to your mnemonic phrase when you use this 
        service. All actions taken using your wallet are completed on the 
        client side and then broadcasted to the {{meta.chainName}} 
        {{meta.environment}}  network without exposing any sensitive information 
        to any party involved.
      </p>

      <p>
        In order to access your wallet using this method, you must provide the 
        mnemonic phrase that was provided to you when you generated your wallet. 
        Enter your mnemonic phrase and check the box agreeing to the terms 
        to get started.
      </p>

      <p>
        <b
          class="red-font"
        >Mnemonic phrase must be {{meta.mnemonicLengths}} words and be entered in the exact order originally provided.</b>
      </p>
    </div>

    <div class="extra">
      <Checkbox ref="save" :text="'Save mnemonic phrase for future use'" @toggle="toggleSave()" />
      <div class="right"><a @click="toggleText()">{{showText ? 'Hide' : 'Show'}} Description <i class="far" :class="showText ? 'fa-chevron-up' : 'fa-chevron-down'"></i></a></div>
    </div>        

    <transition name="animation-slide" mode="out-in">
      <SaveForm ref="saveForm" v-if="save" @submit="access()" />    
    </transition>

    <textarea ref="mnemonic" v-model="mnemonic" rows="5" placeholder="Enter mnemonic phrase..." @keydown.enter.prevent="access()"></textarea>

    <Checkbox
      ref="agree"
      :text="'I understand that accessing my wallet through this service does not mean Dropil gains access to my wallet in any way'"
    />

    <div class="complete">
      <a @click="$emit('reset')">
        <i class="far fa-arrow-left"></i> Back to methods
      </a>
      <a class="btn" @click="access()">Access Wallet</a>
    </div>    
  </div>
</template>

<script>
import Checkbox from '../../MiniComponents/Checkbox'
import SaveForm from '../../SaveForm'
import tools from '../../../mixins/tools'
import store from '../../../store'
import { SET_MNEMONIC, SET_ADDRESS } from '../../../store/actions.type'
import { mapGetters } from 'vuex';

export default {
  name: 'Mnemonic',
  components: { Checkbox, SaveForm },
  computed: {
    ...mapGetters(['meta'])
  },
  data() {
    return {
      mnemonic: '',
      showText: true,
      save: false      
    }
  },
  methods: {
    async access() {
      let mnemonic = this.mnemonic.trim()

      // form validation
      let correctLength = false
      this.meta.mnemonicLengths.split('/').forEach(l => {
        if (parseInt(l) === mnemonic.split(" ").length) correctLength = true
      })
      
      if (mnemonic === "") {
        this.$refs.mnemonic.focus()
        return tools.toastrError("Please enter your mnemonic phrase before continuing");
      } else if (!correctLength) 
        return tools.toastrError("Mnemonic was not in correct format, must be " + this.meta.mnemonicLengths + " words");
      else if (!this.$refs.agree.checked)
        return tools.toastrError("Please check the box accepting the terms before continuing");          

      let drop = tools.startDropJs();
      let address = String(await drop.getAddress(mnemonic).catch(ex => ex.message));

      if (!address.startsWith(this.meta.bech32Prefix))
        return tools.toastrError("Mnemonic entered did not unlock a valid " + this.meta.bech32Prefix + ' wallet');

      // save wallet if checkbox is checked
      if (this.save) {
        if (!this.$refs.saveForm.validateSave()) return
        
        this.$refs.saveForm.saveBrowser(mnemonic, address)
        this.$refs.saveForm.saveKeystore(mnemonic, address)                
      }      

      store.dispatch(SET_MNEMONIC, mnemonic);
      store.dispatch(SET_ADDRESS, address);

      if (!this.save) tools.toastrSuccess('Successfully connected to wallet')
      this.$emit('load')
    },
    toggleText() {
      this.showText = !this.showText
    },
    toggleSave() {
      this.save = this.$refs.save.checked

      if (this.save) this.showText = false
      else this.showText = true
    }    
  } 
}
</script>