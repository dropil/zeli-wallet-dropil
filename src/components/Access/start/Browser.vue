<template>
  <div class="form browser">
    <h3>Access Browser Saved Wallet</h3>
    <p>
      You may access a previously saved wallet in your browser by selecting the wallet from the dropdown
      and entering the password used to encrypt your wallet.          
    </p>        

    <p>
      Delete a stored wallet by selecting it from the dropdown, entering the password, and 
      clicking the delete button.
    </p>

    <div class="select-wrap" :class="{marg:name==='Select a wallet'}">
      <select v-model='name'>
        <option>Select a wallet</option>
        <option v-for="o in options" :key="o">{{o}}</option>
      </select>
    </div>        

    <div class="delete" v-if="name!=='Select a wallet'">
      <a class="first" @click="confirmDelete=true" v-if="!confirmDelete">Delete Saved Wallet</a>
      <p v-if="confirmDelete">
        Are you sure? 
        <a class="btn g" @click="deleteWallet()">Yes</a>
        <a class="btn r" @click="confirmDelete=false">No</a>
      </p>
    </div>

    <InputWrap ref="password" v-model="password" :type="'password'" :placeholder="'Enter password'" @keydown.enter="access()" />

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
import InputWrap from '../../MiniComponents/InputWrap'
import tools from '../../../mixins/tools'
import { mapGetters } from 'vuex';

export default {
  name: 'Browser',
  components: { Checkbox, InputWrap },
  computed: {
    ...mapGetters(['meta'])    
  },
  data() {
    return {
      name: '',
      password: '',
      options: [],
      confirmDelete: false
    }
  },
  mounted() {
    this.loadSavedWallets()
  },
  methods: {
    loadSavedWallets() {
      let savedWalletNames = tools.localStorage.get('savedWalletNames') || ''
      if (!savedWalletNames) {
        this.$emit('reset')
        tools.toastrWarning('You do not have any saved wallets yet. You can save a wallet by selecting the Mnemonic Phrase method.')
      }

      this.options = savedWalletNames.split('|')      
      this.name = 'Select a wallet'
    },
    deleteWallet() {            
      let existingWallets = (tools.localStorage.get('savedWalletNames') || '').split('|')
      existingWallets = existingWallets.filter(a => a !== this.name)

      tools.localStorage.set('savedWalletNames', existingWallets.join('|'))
      tools.localStorage.delete('savedWallet_' + name)
            
      this.confirmDelete = false
      this.loadSavedWallets()
    },
    async access() {
      let name = this.name

      // form validation
      if (name === 'Select a wallet')
        return tools.toastrError('Please select a wallet from the dropdown')
      else if (this.password === '') {
        this.$refs.password.focus()
        return tools.toastrError('Please enter the password to unlock the wallet')
      } else if (!this.$refs.agree.checked)
        return tools.toastrError("Please check the box accepting the terms before continuing");          
      
      // attempt to grab wallet from local storage
      let saveDataString = tools.localStorage.get('savedWallet_' + name) || ''
      if (saveDataString === '') {
        // failed to grab wallet from local storage 
        let existingWallets = (tools.localStorage.get('savedWalletNames') || '').split('|')
        tools.localStorage.set('savedWalletNames', existingWallets.filter(x => x !== name).join('|'))

        this.loadSavedWallets()
        this.password = ''

        return tools.toastrError('Could not find a wallet saved under the name "' + name + '". If this is unexpected, your cookies may have been erased.')
      }

      // decrypt mnemonic
      let mnemonic = tools.decryptSaveData(saveDataString, this.password)

      // mnemonic validation
      let errorString = 'Could not decrypt wallet using provided password. Verify you have entered the correct password and try again.'
      if (!(/^[a-z ]+$/.test(mnemonic))) return tools.toastrError(errorString)

      let correctLength = false
      this.meta.mnemonicLengths.split('/').forEach(l => {
        if (parseInt(l) === mnemonic.split(" ").length) correctLength = true
      })
      if (!correctLength) return tools.toastrError(errorString)

      let drop = tools.startDropJs();
      let address = String(await drop.getAddress(mnemonic).catch(ex => ex.message));

      if (!address.startsWith(this.meta.bech32Prefix))
        return tools.toastrError("Mnemonic retrieved with provided password did not unlock a valid " + this.meta.bech32Prefix + ' wallet');

      tools.wallet.access(mnemonic, address)

      this.$emit('load')      
    }
  }
}
</script>