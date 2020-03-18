<template>
  <div class="form">
    <div class="paragraphs" :class="{active:showText}">
      <h3>Read before getting started</h3>

      <p>
        Accessing your {{meta.chainAndEnvironment}} wallet through 
        this app will allow you to view your wallet information, sign 
        transactions, and broadcast transactions to a supporting public API ({{meta.apiUrlShort}}).
      </p>

      <p>
        Dropil (the creator of this app) does not gain access to your mnemonic phrase when you use this 
        service. All actions taken using your wallet are completed on the 
        client side and then broadcasted to the {{meta.chainName}} 
        {{meta.environment}}  network without exposing any sensitive information 
        to any party involved.
      </p>

      <p>
        In order to access your wallet, you must provide the mnemonic phrase 
        that was provided to you when you generated your wallet. Please
        enter your mnemonic phrase and check the box agreeing to the terms 
        to get started!
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

    <div class="save-inputs" :class="{active:save.active}">
      <div class="wrapper">
        <p>
          You may save your mnemonic key in your cookies by setting a password to encrypt the key with.
          Saving your encrypted mnemonic will allow you to access it later easily by entering the
          password used to encrypt it.
        </p>

        <p>
          <b class="danger">
            This wallet will only be stored in your cookies. If the cookie is erased or you lose the password you set 
            and you do not have your mnemonic backed up anywhere else, you will lose your wallet permanently.
          </b>
        </p>

        <InputWrap ref="saveName" v-model="save.name" placeholder="Enter desired wallet name" @keydown.enter="access()" />

        <div class="input-label neutral">
          Password must meet the following requirements:
          <div class="grid-row requirements">
            <div class="col">
              <ul>
                <li><i class="far" :class="password.minMax ? 'fa-check success' : 'fa-times danger'"></i> 8-24 characters</li>
                <li><i class="far" :class="password.special ? 'fa-check success' : 'fa-times danger'"></i> One special character</li>
              </ul>
            </div>

            <div class="col">
              <ul>
                <li><i class="far" :class="password.upper ? 'fa-check success' : 'fa-times danger'"></i> One uppercase letter</li>
                <li><i class="far" :class="password.lower ? 'fa-check success' : 'fa-times danger'"></i> One lowercase letter</li>
              </ul>
            </div>
          </div>
        </div>

        <InputWrap ref="savePassword" v-model="save.password" type="password" placeholder="Enter password" @keydown.enter="access()" />
        
        <InputWrap ref="saveRepeat" v-model="save.repeat" type="password" placeholder="Repeat password" @keydown.enter="access()" />
        <div class="input-label danger" v-if="!password.match">Passwords do not match</div>
      </div>          
    </div>

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
import InputWrap from '../../MiniComponents/InputWrap'
import tools from '../../../mixins/tools'
import store from '../../../store'
import { SET_MNEMONIC, SET_ADDRESS } from '../../../store/actions.type'
import { mapGetters } from 'vuex';

export default {
  name: 'New',
  components: { Checkbox, InputWrap },
  computed: {
    ...mapGetters(['meta'])    
  },
  data() {
    return {
      mnemonic: '',
      showText: true,
      save: {
        active: false,
        name: '',
        password: '',
        repeat: ''
      },
      password: {
        min: false,
        upper: false,
        lower: false,
        special: false,
        match: true
      }      
    }
  },
  watch: {
    save: {
      deep: true,
      handler(val) {
        this.password.minMax = val.password.length >= 8 && val.password.length <= 24
        this.password.lower = (/[a-z]/.test(val.password))
        this.password.upper = (/[A-Z]/.test(val.password))
        this.password.special = val.password !== '' && !(/^[A-Za-z0-9 ]+$/.test(val.password))
        this.password.match = val.repeat === '' || (val.repeat !== '' && val.password === val.repeat)
      }
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
      if (this.save.active) {
        if (!this.validateSave()) return        

        // validate new wallet name
        let existingWallets = (tools.localStorage.get('savedWalletNames') || '').split('|')
        if (existingWallets.includes(this.save.name)) tools.toastrWarning('You already have a wallet stored with that name. Please select a different name.')
        existingWallets = existingWallets.join('|')

        // returns an object with name, salt, and encrypted mnemonic
        let saveData = tools.encryptSaveData(mnemonic, this.save.name, this.save.password)
        let saveDataString = JSON.stringify(saveData)                

        // update local storage with existing wallet names plus new name separated by "|" character
        existingWallets += (existingWallets !== '' ? '|' : '') + this.save.name
        tools.localStorage.set('savedWalletNames', existingWallets)

        // add savedWallet_name to local storage with saveData
        tools.localStorage.set('savedWallet_' + this.save.name, saveDataString)      
        
        tools.toastrSuccess('Wallet successfully saved under name "' + this.save.name + '"')
      }      

      store.dispatch(SET_MNEMONIC, mnemonic);
      store.dispatch(SET_ADDRESS, address);

      if (!this.save.active) tools.toastrSuccess('Successfully connected to wallet')
      this.$emit('load')
    },
    validateSave() {
      if (this.save.name === '') {
        this.$refs.saveName.focus()
        tools.toastrError('Please enter a name to save this wallet with')
        return false

      } else if (this.save.password === '' || this.save.repeat === '') {
        if (this.save.password === '') this.$refs.savePassword.focus()
        if (this.save.repeat === '') this.$refs.saveRepeat.focus()

        tools.toastrError('Please fill out both password fields and fulfill the password requirements')
        return false

      } else if (!this.password.minMax) {
        this.$refs.savePassword.focus()

        tools.toastrError('Passwords must contain between 8 and 24 characters')
        return false

      } else if (!this.password.upper) {
        this.$refs.savePassword.focus()

        tools.toastrError('Passwords must contain at least 1 uppercase letter')
        return false

      } else if (!this.password.lower) {
        this.$refs.savePassword.focus()

        tools.toastrError('Passwords must contain at least 1 lowercase letter')
        return false

      } else if (!this.password.special) {
        this.$refs.savePassword.focus()

        tools.toastrError('Passwords must contain at least 1 special character')
        return false

      } else if (this.save.password !== this.save.repeat) {
        this.$refs.saveRepeat.focus()

        tools.toastrError('Please make sure the two passwords entered match')
        return false        
      }

      return true
    },
    toggleText() {
      this.showText = !this.showText
    },
    toggleSave() {
      this.save.active = this.$refs.save.checked

      if (this.save.active) this.showText = false
      else this.showText = true
    }    
  } 
}
</script>