import store from '../store'
import { SET_BALANCE, RESET_BALANCES, SET_ACCOUNT_DATA, SET_VALIDATORS, 
  SET_TOTAL_BONDED, SET_DELEGATIONS, SET_UNBONDING, SET_BALANCES_UPDATED,
  SET_REWARDS, SET_LOAD_INTERVAL_ID, SET_TAB_STATE, SET_COIN_PRICE, RESET_ALL_ACCESS, SET_MNEMONIC, SET_ADDRESS 
} from '../store/actions.type'

import aes from 'aes-js'
import pbkdf2 from 'pbkdf2'
import crypto from 'crypto'

export const tools = {
  lang: {
    url: process.env.VUE_APP_ENV_URL,
    urlShort: process.env.VUE_APP_ENV_URL.replace('https://', '')    
  },
  localStorage: {
    set (key, value) {
      window.localStorage.setItem(key, value)
    },
    get (key) {
      return window.localStorage.getItem(key)
    },
    remove (key) {
      window.localStorage.removeItem(key)
    },
    delete (key) {
      window.localStorage.removeItem(key)
    }
  },
  toCoinAmount (denom) {
    if (denom === "N/A" || isNaN(denom))
        return '<i class="fas fa-spinner fa-spin"></i>';

    let meta = store.state.general.meta
    return (parseInt(denom) / meta.powerReduction).toLocaleString("en-US", { maximumFractionDigits: meta.decimals });
  },
  toastrSuccess (message = 'Operation successfully completed', moreOptions = {}) {
    tools.toastr({ type: 'success', message, moreOptions })
  },
  toastrError (message = 'Something went wrong, please try again or contact support', moreOptions = {}) {    
    tools.toastr({ type: 'error', message, moreOptions })
  },
  toastrWarning (message, moreOptions = {}) {
    tools.toastr({ type: 'warning', message, moreOptions })
  },
  toastr ({ type = 'error', title = '', message = '', position = 'topRight', timeout = 5000, moreOptions = {} }) {
    if (!title) {
      switch (type) {
        case 'error':
          title = 'Error!'
          break;
        case 'success':
          title = 'Success!'
          break;
        case 'warning':
          title = 'Warning!'
          break;
      }    
    }      

    let defaultOptions = {
      closeOnClick: true,
      closeOnEscape: true,
      displayMode: 2,
      layout: 1,
      pauseOnHover: true,
      maxWidth: 600,
      transitionIn: 'bounceInLeft',
      transitionOut: 'fadeOutRight',
      transitionInMobile: 'fadeInDown',
      transitionOutMobile: 'fadeOutUp'
    }

    window.vm.$toast[type](message, title, { ...defaultOptions, position, timeout, ...moreOptions })
  },  
  callAfter(fn, timeout = 1000) {
    setTimeout(fn, timeout)
  },
  fadeOut(fnBefore, fnAfter, timeout = 500) {
    fnBefore()
    tools.callAfter(fnAfter, timeout)
  },
  successCheckmark(fnBefore, fnAfter) {
    fnBefore()
    tools.callAfter(fnAfter, 750)
  },
  randomString (length = 12) {
    let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let charsAndNums = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    
    let result = '';
    for (let i = length; i > 0; --i) {
      if (i === length) result += chars[Math.floor(Math.random() * chars.length)]
      else result += charsAndNums[Math.floor(Math.random() * chars.length)]
    }      

    return result;
  },
  unixFromDate (date) {
    return date.getTime()
  },
  unixNowLocal () {
    return Date.now()
  },
  unixNowUTC () {
    let date = new Date()
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds()).getTime()
  },
  updateUrl (url, _this) {
    window.history.pushState(null, null, url)
    _this.$root.$emit('update-url', url)
  },
  getMoniker(validatorAddress) {
    let validators = store.state.wallet.validators

    if (!validators.length || !validators.filter(v => v.operator_address === validatorAddress).length) 
      return validatorAddress.substr(0,18) + '...'
      
    return validators.filter(v => v.operator_address === validatorAddress)[0].description.moniker
  },
  formatPercent(percent) {
    return (parseFloat(percent) * 100).toLocaleString('en-US', { maximumFractionDigits: 2 }) + '%'
  },
  startDropJs() {
    return dropjs.start(tools.dropJsStartParams())
  },
  dropJsStartParams() {
    let meta = store.state.general.meta

    return {
      chainId: meta.chainId,
      lcdUrl: meta.apiUrl,
      hdPath: meta.hdPath,
      bech32Prefix: meta.bech32Prefix,
      denom: meta.denom,
      powerReduction: meta.powerReduction,
      baseFee: meta.baseFee,
      baseGas: meta.baseGas
    }
  },
  async signTransaction(type) {      
    let meta = store.state.general.meta

    let params = {
      mnemonic: store.state.wallet.mnemonic,
      memo: store.state.wallet[type].memo,
      broadcast: false,
      accountNumber: store.state.wallet.accountData.accountNumber,
      sequence: store.state.wallet.accountData.sequence
    }

    switch (type) {
      case 'send':
        if (!store.state.wallet[type].destination.toString().startsWith(meta.bech32Prefix))          
          return tools.toastrError("Entered destination address is not in proper format")

        params.destination = store.state.wallet[type].destination

        break
      case 'modifyWithdrawAddress':
        if (!store.state.wallet[type].withdrawAddress.toString().startsWith(meta.bech32Prefix))          
          return tools.toastrError("Entered withdraw address is not in proper format")

        params.withdrawAddress = store.state.wallet[type].withdrawAddress

        break
      case 'delegate':
      case 'undelegate':
        if (!store.state.wallet[type].destination.toString().startsWith(meta.bech32Prefix + 'valoper'))          
          return tools.toastrError("Entered validator address is not in proper format")

        params.validatorAddress = store.state.wallet[type].destination

        break
      case 'redelegate':
        if (!store.state.wallet.redelegate.validatorSourceAddress.toString().startsWith(meta.bech32Prefix + "valoper"))
          return tools.toastrError("Entered old validator address is not in proper format")
        else if (!store.state.wallet.redelegate.validatorDestAddress.toString().startsWith(meta.bech32Prefix + "valoper"))
          return tools.toastrError("Entered new validator address is not in proper format")

        params.validatorSourceAddress = store.state.wallet.redelegate.validatorSourceAddress
        params.validatorDestAddress = store.state.wallet.redelegate.validatorDestAddress
        params.fee = meta.baseFee * 2
        params.gas = meta.baseGas * 1.5

        break
    }
    
    // amount validation
    if (['send', 'delegate', 'undelegate', 'redelegate'].includes(type)) {
      if (store.state.wallet[type].amount === '' || parseFloat(store.state.wallet[type].amount) === 0)
        return tools.toastrError("Please enter an amount");
      else if (parseFloat(store.state.wallet[type].amount) % 1 !== 0 && store.state.wallet[type].amount.toString().split(".")[1].length > 6)
        return tools.toastrError("Maximum allowed decimals on amount is 6")
      else // add amount to params
        params.amount = parseFloat(store.state.wallet[type].amount) * 1000000      
    }

    if (store.state.wallet[type].loading) return;
    store.dispatch(SET_TAB_STATE, { type, key: 'loading', value: true })

    let drop = tools.startDropJs();

    if (!params.accountNumber || !params.sequence) {
      let data = await drop.getAccountData(params.mnemonic)
      params.accountNumber = data.accountNumber
      params.sequence = data.sequence
    }

    // sign transaction
    drop[type](params).then(signedTx => {
      store.dispatch(SET_TAB_STATE, { type, key: 'loading', value: false })
      store.dispatch(SET_TAB_STATE, { type, key: 'start', value: false })
      store.dispatch(SET_TAB_STATE, { type, key: 'signed', value: true })
      store.dispatch(SET_TAB_STATE, { type, key: 'broadcasted', value: false })
      store.dispatch(SET_TAB_STATE, { type, key: 'signedTx', value: signedTx })
    })
    .catch(e => {
      tools.toastrError(e.message)
      store.dispatch(SET_TAB_STATE, { type, key: 'loading', value: false })
    });
  },
  async broadcastTransaction(type) {
    if (store.state.wallet[type].loading) return;
    store.dispatch(SET_TAB_STATE, { type, key: 'loading', value: true })

    let drop = tools.startDropJs();
    let response = await drop.broadcast(store.state.wallet[type].signedTx);

    store.dispatch(SET_TAB_STATE, { type, key: 'loading', value: false })
    store.dispatch(SET_TAB_STATE, { type, key: 'start', value: false })
    store.dispatch(SET_TAB_STATE, { type, key: 'signed', value: false })
    store.dispatch(SET_TAB_STATE, { type, key: 'broadcasted', value: true })
    store.dispatch(SET_TAB_STATE, { type, key: 'broadcastResponse', value: response })
    store.dispatch(SET_ACCOUNT_DATA, { type: 'sequence', value: String(parseInt(store.state.wallet.accountData.sequence) + 1) })

    setTimeout(() => {
      tools.wallet.load()
    }, 10000)
  },
  encryptSaveData(mnemonic, name, password) {        
    let salt = crypto.randomBytes(16).toString('hex')
    let key = pbkdf2.pbkdf2Sync(password, salt, 1, 32, 'sha512')        
    let mnemonicBytes = aes.utils.utf8.toBytes(mnemonic)

    // encrypt mnemonic
    let aesCtr = new aes.ModeOfOperation.ctr(key)
    let encryptedBytes = aesCtr.encrypt(mnemonicBytes)
    let encrypted = aes.utils.hex.fromBytes(encryptedBytes)        

    return { name, salt, mnemonic: encrypted }
  },
  decryptSaveData(saveDataString, password) {
    let saveData = JSON.parse(saveDataString)            
    let salt = saveData.salt
    let key = pbkdf2.pbkdf2Sync(password, salt, 1, 32, 'sha512')        
    let mnemonicBytes = aes.utils.hex.toBytes(saveData.mnemonic)

    // decrypt mnemonic
    let aesCtr = new aes.ModeOfOperation.ctr(key)
    let decryptedBytes = aesCtr.decrypt(mnemonicBytes)
    let mnemonic = aes.utils.utf8.fromBytes(decryptedBytes)

    return mnemonic
  },
  wallet: {
    access(mnemonic, address) {      
      store.dispatch(RESET_ALL_ACCESS)
      store.dispatch(SET_MNEMONIC, mnemonic)
      store.dispatch(SET_ADDRESS, address)
    },
    load(firstLoad = false, userRequest = false) {
      if (!store.state.wallet.address) return          

      tools.wallet.loadBalances(firstLoad || userRequest)
      tools.wallet.loadWithdrawAddress()
      if (!userRequest) tools.wallet.loadValidators()
      if (firstLoad && !userRequest) tools.wallet.loadCoinPrice()

      tools.wallet.startLoadInterval()
    },
    startLoadInterval() {
      clearInterval(store.state.wallet.loadIntervalId)
      store.dispatch(SET_LOAD_INTERVAL_ID, setInterval(() => tools.wallet.load(), 60000))      
    },
    loadBalances(firstLoad = false) {
      if (firstLoad) store.dispatch(RESET_BALANCES)      

      tools.wallet.fetch(store.state.general.meta.apiUrl + `/auth/accounts/${store.state.wallet.address}`).then(data => {        
        if (!data.result || !data.result.value.coins.length || !data.result.value.coins.filter(c => c.denom.toLowerCase() === store.state.general.meta.denom))
          return store.dispatch(SET_BALANCE, { type: 'available', value: 0 });

        let available = data.result.value.coins.filter(c => c.denom.toLowerCase() === store.state.general.meta.denom)[0].amount
        store.dispatch(SET_BALANCE, { type: 'available', value: available })

        store.dispatch(SET_ACCOUNT_DATA, { type: 'accountNumber', value: data.result.value.account_number })
        store.dispatch(SET_ACCOUNT_DATA, { type: 'sequence', value: data.result.value.sequence })
      })

      tools.wallet.fetch(store.state.general.meta.apiUrl + `/distribution/delegators/${store.state.wallet.address}/rewards`).then(
        data => {
          if (!data.result || !data.result.total.length || !data.result.total.filter(c => c.denom.toLowerCase() === store.state.general.meta.denom))
            return store.dispatch(SET_BALANCE, { type: 'rewards', value: 0 });

          let rewards = data.result.total.filter(c => c.denom.toLowerCase() === store.state.general.meta.denom)[0].amount
          store.dispatch(SET_BALANCE, { type: 'rewards', value: rewards })
          
          store.dispatch(SET_REWARDS, data.result.rewards)
        }
      )

      tools.wallet.fetch(store.state.general.meta.apiUrl + `/staking/delegators/${store.state.wallet.address}/delegations`).then(
        data => {
          if (!data.result || !data.result.length)
            return store.dispatch(SET_BALANCE, { type: 'delegated', value: 0 });
          
          let delegated = String(data.result.reduce((a, c) => a + parseInt(c.balance), 0))
          store.dispatch(SET_BALANCE, { type: 'delegated', value: delegated })
          
          store.dispatch(SET_DELEGATIONS, data.result)
        }
      )

      tools.wallet.fetch(store.state.general.meta.apiUrl + `/staking/delegators/${store.state.wallet.address}/unbonding_delegations`).then(data => {
        if (!data.result || !data.result.length) 
          return store.dispatch(SET_BALANCE, { type: 'unbonding', value: 0 });
        
        let unbondingAmount = String(data.result.reduce((a, c) => {
          return a + c.entries.reduce((x, y) => x + parseInt(y.balance), 0)
        }, 0));
        store.dispatch(SET_BALANCE, { type: 'unbonding', value: unbondingAmount })
        
        store.dispatch(SET_UNBONDING, data.result)
      })

      store.dispatch(SET_BALANCES_UPDATED, Date.now())
    },
    async fetch(url) {
      let response = await fetch(url);
      let data = await response.json();
      return data;
    },
    loadWithdrawAddress() {
      tools.wallet.fetch(store.state.general.meta.apiUrl + `/distribution/delegators/${store.state.wallet.address}/withdraw_address`).then(data => {
        store.dispatch(SET_TAB_STATE, { type: 'modifyWithdrawAddress', key: 'withdrawAddress', value: data.result })
      })
    },
    loadValidators() {
      tools.wallet.fetch(store.state.general.meta.apiUrl + `/staking/validators`).then(data => {
        store.dispatch(SET_VALIDATORS, data.result.sort((a, b) => parseFloat(b.tokens) - parseFloat(a.tokens)))
      })

      tools.wallet.fetch(store.state.general.meta.apiUrl + `/staking/pool`).then(data => {
        store.dispatch(SET_TOTAL_BONDED, data.result.bonded_tokens)
      })
    },
    loadCoinPrice() {
      tools.wallet.fetch('https://api.coingecko.com/api/v3/coins/' + store.state.general.meta.coinGeckoId).then(data => {
        store.dispatch(SET_COIN_PRICE, data.market_data.current_price.usd)
      })
    }
  }
}

export default tools
