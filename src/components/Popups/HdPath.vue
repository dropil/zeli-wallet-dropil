<template>
  <div class="popup hd-path">
    <a @click="$emit('close-popup')" class="close"></a>
    <h2>HD Path</h2>    

    <div class="justify">
      <p>
        An HD derivation path is a string that allows a single seed phrase (mnemonic) to handle
        multiple wallets. Changing the HD path will change which wallet you are accessing within that seed.
      </p>

      <p>
        <b class="danger">This is an advanced feature, most users can safely ignore this feature.</b>
      </p>

      <p>
        A great article has been written by the MyEtherWallet team on Medium explaining HD paths in depth.
        <a href="https://medium.com/myetherwallet/hd-wallets-and-derivation-paths-explained-865a643c7bf2" target="_blank">Click here</a> 
        to read the article if interested.
      </p>

      <p>
        A typical HD path follows this pattern:
      </p>

      <input type="text" readonly="readonly" class="address" value="m / purpose' / coin_type' / account' / change / address_index">

      <p>
        The default HD path for {{meta.chainName}} wallets is:
      </p>

      <input type="text" readonly="readonly" class="address" :value="defaultPath">
    </div>

    <div class="edit">
      <p class="justify">
        You may adjust the HD path for the current wallet you are viewing by editing the underlined fields below.
      </p>

      <div class="inputs">
        <div>m</div>
        <div>/</div>
        <div>44'</div>
        <div>/</div>
        <div><AutoGrowInput v-model="coinType" />'</div>
        <div>/</div>
        <div><AutoGrowInput v-model="account" />'</div>
        <div>/</div>
        <div><AutoGrowInput v-model="change" /></div>
        <div>/</div>
        <div><AutoGrowInput v-model="addressIndex" /></div>
      </div>      
    </div>

    <div class="complete">
      <a class="btn" @click="save()">Save</a>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import networks from '../../config/networks'
import AutoGrowInput from '../MiniComponents/AutoGrowInput'
import tools from '../../mixins/tools';
import store from '../../store';
import { SET_HD_PATH } from '../../store/actions.type';

export default {
  name: 'HdPath',
  components: {
    AutoGrowInput
  },
  computed: {
    ...mapGetters(['meta', 'hdPath', 'mnemonic']),
    defaultPath() {
      return networks[this.meta.environmentLower].filter(n => n.chainId === this.meta.chainId)[0].hdPath
    }
  },
  data () {
    return {
      coinType: '',
      account: '',
      change: '',
      addressIndex: ''
    }
  },
  mounted() {
    this.coinType = this.hdPath.split('/')[2].replace("'", "")
    this.account = this.hdPath.split('/')[3].replace("'", "")
    this.change = this.hdPath.split('/')[4].replace("'", "")
    this.addressIndex = this.hdPath.split('/')[5].replace("'", "")
  },
  methods: {
    async save() {
      if (this.coinType === '') return tools.toastrError('Please fill out the coin type input (field 1)')
      else if (this.account === '') return tools.toastrError('Please fill out the account input (field 2)')
      else if (this.change === '') return tools.toastrError('Please fill out the change input (field 3)')
      else if (this.addressIndex === '') return tools.toastrError('Please fill out the address index input (field 4)')

      let hdPath = `m/44'/${this.coinType}'/${this.account}'/${this.change}/${this.addressIndex}`            

      store.dispatch(SET_HD_PATH, hdPath)

      let drop = tools.startDropJs();
      let address = String(await drop.getAddress(this.mnemonic).catch(ex => ex.message));

      // reset all state, update to new address, then reload wallet
      tools.wallet.access(this.mnemonic, address)
      store.dispatch(SET_HD_PATH, hdPath)
      tools.wallet.load(true, true)

      window.closePopups()
      tools.toastrSuccess('The HD path has been successfully updated')
    }
  }
}
</script>
