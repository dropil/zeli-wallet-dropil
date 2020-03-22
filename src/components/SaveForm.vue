<template>  
  <div class="save-form">
    <div class="wrapper">      
      <div class="paragraphs active">
        <h3>Save Your Wallet<span class='skip' @click="$emit('skip')" v-if="allowSkip"> Skip Step <i class="far fa-arrow-right"></i></span></h3>

        <p>
          This app allows you to access your wallet using 3 methods: keystore, saved in browser, 
          or by manually entering the mnemonic phrase. 
        </p>

        <p v-if="type==='create'">
          You may optionally skip this step and write down the mnemonic phrase 
          in the next step for storing it however you wish.
        </p>      

        <p>
          Select your save method(s) then set a wallet name and password to encrypt your wallet with.
        </p>
      </div>        

      <div class="save-options">
        <div class="options">
          <div class="option" @click="keystore=!keystore" :class="{active:keystore}">
            <i class="far"></i>
            Save Keystore
          </div>
          <div class="option" @click="browser=!browser" :class="{active:browser}">
            <i class="far"></i>
            Save in Browser
          </div>      
        </div>      
      </div>

      <small v-if="browser">
        <b class="danger">
          Storing this wallet in your browser will only save the wallet in your <u>current</u> 
          browser's storage. If the cookie/storage is erased or you lose the password you 
          set and you do not have your mnemonic backed up elsewhere, you will lose your 
          wallet permanently.
        </b>
      </small>

      <InputWrap ref="name" v-model="name" placeholder="Enter desired wallet name" @keydown.enter="$emit('submit')" />

      <div class="input-label neutral">
        Password must meet the following requirements:
        <div class="grid-row requirements">
          <div class="col">
            <ul>
              <li><i class="far" :class="req.min ? 'fa-check success' : 'fa-times danger'"></i> 8+ characters</li>
              <li><i class="far" :class="req.special ? 'fa-check success' : 'fa-times danger'"></i> One special character</li>
            </ul>
          </div>

          <div class="col">
            <ul>
              <li><i class="far" :class="req.upper ? 'fa-check success' : 'fa-times danger'"></i> One uppercase letter</li>
              <li><i class="far" :class="req.lower ? 'fa-check success' : 'fa-times danger'"></i> One lowercase letter</li>
            </ul>
          </div>
        </div>
      </div>

      <InputWrap ref="password" v-model="password" type="password" placeholder="Enter password" @keydown.enter="$emit('submit')" />
      
      <InputWrap ref="repeat" v-model="repeat" type="password" placeholder="Repeat password" @keydown.enter="$emit('submit')" />
      <div class="input-label danger" v-if="!req.match">Passwords do not match</div>              
    </div>          
  </div>  
</template>

<script>
import InputWrap from './MiniComponents/InputWrap'
import { mapGetters } from 'vuex'
import tools from '../mixins/tools'

export default {
  name: 'SaveForm',
  props: {
    allowSkip: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ''
    }
  },
  components: { InputWrap },
  computed: {
    ...mapGetters(['meta', 'mnemonic', 'address'])    
  },
  data() {
    return {
      name: '',
      password: '',
      repeat: '',
      req: {
        min: false,
        upper: false,
        lower: false,
        special: false,
        match: true
      },
      keystore: false,
      browser: false
    }
  },
  watch: {
    password() {
      this.reqHandler()
    },
    repeat() {
      this.reqHandler()
    }
  },
  methods: {    
    reqHandler() {
      this.req.min = this.password.length >= 8
      this.req.lower = (/[a-z]/.test(this.password))
      this.req.upper = (/[A-Z]/.test(this.password))
      this.req.special = this.password !== '' && !(/^[A-Za-z0-9 ]+$/.test(this.password))
      this.req.match = this.repeat === '' || (this.repeat !== '' && this.password === this.repeat)
    },
    saveKeystore(mnemonic, address) {
      if (!this.keystore) return

      let saveData = this.getSaveData(mnemonic, address)

      let file = new Blob([JSON.stringify(saveData, null, 4)], {type: 'application/json'});
      let fileName = this.GUID() + '.keystore'

      if (window.navigator.msSaveOrOpenBlob) // IE10+
          window.navigator.msSaveOrOpenBlob(file, fileName);
      else { // Others
          var a = document.createElement("a"),
                  url = URL.createObjectURL(file);
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          setTimeout(function() {
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);  
          }, 0); 
      }
    },
    GUID() {
      return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      )
    },
    saveBrowser(mnemonic, address) {    
      if (!this.browser) return            

      // update local storage with existing wallet names plus new name separated by "|" character
      let existingWallets = (tools.localStorage.get('savedWalletNames') || '')
      existingWallets += (existingWallets !== '' ? '|' : '') + this.name
      tools.localStorage.set('savedWalletNames', existingWallets)

      // add savedWallet_name to local storage with saveData
      let saveData = this.getSaveData(mnemonic, address)
      tools.localStorage.set('savedWallet_' + this.name, JSON.stringify(saveData))     

      tools.toastrSuccess(`Wallet successfully stored in browser's local storage under name "${this.name}"`)
    },
    getSaveData(mnemonic, address) {      
      return {
        chainName: this.meta.chainName,
        environment: this.meta.environment,
        encryptVersion: '1',
        address,
        ...tools.encryptSaveData(mnemonic, this.name, this.password)
      }      
    },
    validateSave() {
      let existingWallets = (tools.localStorage.get('savedWalletNames') || '').split('|')
      
      if (!this.keystore && !this.browser) {
        let response = 'Select at least one save method by clicking either "Save Keystore" or "Save in Browser"'
        if (this.type === 'create') response += '. Alternatively, skip this step by clicking the "Skip Step" button towards the top of this form.'

        tools.toastrError(response)
        return false

      } else if (this.name === '') {
        this.$refs.name.focus()
        tools.toastrError('Please enter a name to save this wallet with')
        return false

      } else if (existingWallets.includes(this.name)) {
        tools.toastrError('You already have a wallet stored with that name. Please select a different name.')
        return false

      } else if (this.password === '' || this.repeat === '') {
        if (this.password === '') this.$refs.password.focus()
        if (this.repeat === '') this.$refs.repeat.focus()

        tools.toastrError('Please fill out both password fields and fulfill the password requirements')
        return false

      } else if (!this.req.min) {
        this.$refs.password.focus()

        tools.toastrError('Passwords must be at least 8 characters')
        return false

      } else if (!this.req.upper) {
        this.$refs.password.focus()

        tools.toastrError('Passwords must contain at least 1 uppercase letter')
        return false

      } else if (!this.req.lower) {
        this.$refs.password.focus()

        tools.toastrError('Passwords must contain at least 1 lowercase letter')
        return false

      } else if (!this.req.special) {
        this.$refs.password.focus()

        tools.toastrError('Passwords must contain at least 1 special character')
        return false

      } else if (this.req.password !== this.req.repeat) {
        this.$refs.repeat.focus()

        tools.toastrError('Please make sure the two passwords entered match')
        return false        
      }

      return true
    }       
  }
}
</script>