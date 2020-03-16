<template>
  <div class="content">
      <h3>Access {{meta.chainAndEnvironment}} Wallet</h3>
      <VerifyDomain />

      <div class="form">
        <h3>Read before getting started</h3>

        <div class="paragraphs">
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

        <textarea v-model="input" rows="5" placeholder="Enter mnemonic phrase..."></textarea>

        <div class="complete">
          <router-link to="/">
            <i class="far fa-arrow-left"></i> Back to Home
          </router-link>
          <a class="btn" @click="access()">Access Wallet</a>
        </div>

        <Checkbox
          ref="agree"
          :text="'I understand that accessing my wallet through this service does not mean Dropil gains access to my wallet in any way'"
        />
      </div>
    </div>
</template>

<script>
import VerifyDomain from "../VerifyDomain";
import Checkbox from "../MiniComponents/Checkbox";
import tools from '../../mixins/tools'
import store from "../../store";
import { SET_MNEMONIC, SET_ADDRESS } from "../../store/actions.type";
import { mapGetters } from 'vuex';

export default {
  name: 'Start',
  components: { VerifyDomain, Checkbox },
  data() {
    return {
      input: ''
    }
  },
  computed: {
    ...mapGetters(['meta'])    
  },
  methods: {
    async access() {
      this.input = this.input.trim()

      if (this.input === "")
        return tools.toastrError("Please enter your mnemonic phrase before continuing");
      else if (!this.$refs.agree.checked)
        return tools.toastrError("Please check the box accepting the terms before continuing");

      let drop = tools.startDropJs();
      let address = String(await drop.getAddress(this.input).catch(ex => ex.message));

      if (!address.startsWith(this.meta.bech32Prefix))
        return tools.toastrError("Mnemonic was not in correct format, must be " + this.meta.mnemonicLengths + " words");

      store.dispatch(SET_MNEMONIC, this.input);
      store.dispatch(SET_ADDRESS, address);

      this.$emit('load')
    }
  }
}
</script>