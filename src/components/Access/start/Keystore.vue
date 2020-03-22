<template>
  <div class="form keystore">
    <div class="paragraphs active">
      <h3>Upload Keystore</h3>

      <p>Upload your keystore file by clicking or dragging into the box below.</p>

      <p class="danger">
        <b>
          Processing of keystore files takes place on the client-side.
          Your keystore file is never uploaded to a server.
        </b>
      </p>      
    </div>

    <transition name="animation-fade">
      <div class="upload" v-if="!isSuccess">
        <div class="file-upload">
          <input type="file" id="file" ref="file" :disabled="isSaving" @change="handleFileUpload()">

          <p v-if="isInitial || isFailed">
            <i class="fad fa-file"></i>
            <br>
            Drag your keystore here 
            <br> 
            or click to browse
          </p>

          <p v-if="isSaving">
            <i class="fad fa-upload"></i>
            <br>
            Uploading file...
          </p>
        </div>    

        <div class="notice alert danger" v-if="isFailed">
          Failed to process file, are you sure you uploaded a valid keystore?
        </div> 

        <div class="complete">
          <a @click="$emit('reset')">
            <i class="far fa-arrow-left"></i> Back to methods
          </a>
        </div>
      </div>        

      <div class="unlock" v-if="isSuccess">
        <InputWrap inputCls="address" placeholder="Wallet Name" :value="saveData.name" :readonly="true" />
        <InputWrap inputCls="address" placeholder="Wallet Address" :value="saveData.address" :readonly="true" />
        <InputWrap ref="password" v-model="password" type="password" placeholder="Enter password to unlock" @keydown.enter="access()" />

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
    </transition>      
  </div>
</template>

<script>
import Checkbox from '../../MiniComponents/Checkbox'
import InputWrap from '../../MiniComponents/InputWrap'
import tools from '../../../mixins/tools';
import { mapGetters } from 'vuex';
import store from '../../../store';
import { SET_MNEMONIC, SET_ADDRESS } from '../../../store/actions.type';
const STATUS_INITIAL = 0, STATUS_SAVING = 1, STATUS_SUCCESS = 2, STATUS_FAILED = 3;

export default {
  name: 'Keystore',
  components: { Checkbox, InputWrap },  
  data() {
    return {     
      currentStatus: null,
      saveData: {},
      password: ''
    }
  },
  computed: {
    ...mapGetters(['meta']),
    isInitial() {
      return this.currentStatus === STATUS_INITIAL;
    },
    isSaving() {
      return this.currentStatus === STATUS_SAVING;
    },
    isSuccess() {
      return this.currentStatus === STATUS_SUCCESS;
    },
    isFailed() {
      return this.currentStatus === STATUS_FAILED;
    }
  },
  methods: {
    reset() {      
      this.currentStatus = STATUS_INITIAL      
    },    
    handleFileUpload() {
      this.currentStatus = STATUS_SAVING
      this.file = this.$refs.file.files[0];

      var reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = (theFile => {
        return e => {
          let result = JSON.parse(e.target.result)
          this.handleResult(result)
        };
      })(this.file);   
      
      reader.readAsText(this.file)
    },
    handleResult(result) {
      if (!result.mnemonic || !result.salt)
        return this.currentStatus = STATUS_FAILED

      this.currentStatus = STATUS_SUCCESS 
      this.saveData = result
    },
    async access() {
      if (this.password === '') {
        this.$refs.password.focus()
        return tools.toastrError('Please enter the password to unlock the wallet')
      } 
      else if (!this.$refs.agree.checked)
        return tools.toastrError("Please check the box accepting the terms before continuing");          

      let mnemonic = tools.decryptSaveData(JSON.stringify(this.saveData), this.password)
      
      let drop = tools.startDropJs();
      let address = String(await drop.getAddress(mnemonic).catch(ex => ex.message));

      if (!address.startsWith(this.meta.bech32Prefix))
        return tools.toastrError("Mnemonic entered did not unlock a valid " + this.meta.bech32Prefix + ' wallet');

      store.dispatch(SET_MNEMONIC, mnemonic);
      store.dispatch(SET_ADDRESS, address);

      if (!this.save) tools.toastrSuccess('Successfully connected to wallet')
      this.$emit('load')
    }
  },
  mounted() {
    this.reset();
  },
}
</script>