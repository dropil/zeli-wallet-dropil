import {
  SET_CREATE_MNEMONIC, SET_CREATE_ADDRESS, SET_MNEMONIC, SET_ADDRESS, SET_HD_PATH, SET_VALIDATORS, SET_TOTAL_BONDED, SET_BALANCE, SET_ACCOUNT_DATA, RESET_BALANCES, SET_DELEGATIONS, SET_REWARDS, SET_UNBONDING, SET_TAB_STATE, RESET_TAB_STATE,
  SET_LOAD_INTERVAL_ID, SET_BALANCES_INTERVAL_ID, SET_BALANCES_UPDATED, RESET_ALL_ACCESS, SET_COIN_PRICE
} from './actions.type'

import {
  COMMIT_CREATE_MNEMONIC, COMMIT_CREATE_ADDRESS, COMMIT_MNEMONIC, COMMIT_ADDRESS, COMMIT_HD_PATH, COMMIT_VALIDATORS, COMMIT_TOTAL_BONDED, COMMIT_BALANCE, COMMIT_BALANCES_UPDATED_SECONDS, COMMIT_ACCOUNT_DATA, COMMIT_RESET_BALANCES, COMMIT_DELEGATIONS, COMMIT_REWARDS, COMMIT_UNBONDING, COMMIT_TAB_STATE, COMMIT_RESET_TAB_STATE,
  COMMIT_LOAD_INTERVAL_ID, COMMIT_BALANCES_INTERVAL_ID, COMMIT_BALANCES_UPDATED, COMMIT_COIN_PRICE
} from './mutations.type'

const BASE_TAB_FIELDS = {
  destination: "",
  amount: "",
  memo: "",
  loading: false,
  start: true,
  signed: false,
  signedTx: "",
  broadcasted: false
};

const state = {
  create: {
    mnemonic: '',
    address: ''    
  },
  saveOptions: {
    keystore: false,
    browser: false
  },
  mnemonic: '',
  address: '',
  hdPath: '44/495/0/0/0',
  accountData: {
    accountNumber: 0,
    sequence: 0
  },
  rewards: [],
  delegations: [],  
  unbonding: [],  
  validators: [],
  totalBonded: 0,
  balances: {
    available: "N/A",
    rewards: "N/A",
    delegated: "N/A",
    unbonding: "N/A"    
  },
  balancesUpdated: 0,  
  loadIntervalId: 0,
  balancesIntervalId: 0,
  send: { ...BASE_TAB_FIELDS },
  delegate: { ...BASE_TAB_FIELDS },      
  undelegate: { ...BASE_TAB_FIELDS },
  redelegate: { ...BASE_TAB_FIELDS, validatorSourceAddress: '', validatorDestAddress: '' },
  withdrawRewards: { ...BASE_TAB_FIELDS, withdrawRewards: '' },
  modifyWithdrawAddress: { ...BASE_TAB_FIELDS },
  coinPrice: 0
}

const getters = {
  createMnemonic (state) {
    return state.create.mnemonic
  },
  createAddress(state) {
    return state.create.address
  },
  createSave (state) {
    return state.create.save
  },
  mnemonic (state) {
    return state.mnemonic
  },
  address (state) {
    return state.address
  },
  hdPath (state) {
    return state.hdPath
  },  
  accountData (state) {
    return state.accountData
  },  
  rewards (state) {
    return state.rewards
  },
  delegations (state) {
    return state.delegations
  },
  unbonding (state) {
    return state.unbonding
  },
  validators (state) {
    return state.validators
  },
  totalBonded (state) {
    return state.totalBonded
  },
  balances (state) {
    return state.balances
  },
  balancesUpdated (state) {
    return state.balancesUpdated
  },  
  loadIntervalId (state) {
    return state.loadIntervalId
  },
  balancesIntervalId (state) {
    return state.balancesIntervalId
  },
  send (state) {
    return state.send
  },
  delegate (state) {
    return state.delegate
  },
  undelegate (state) {
    return state.undelegate
  },
  redelegate (state) {
    return state.redelegate
  },
  withdrawRewards (state) {
    return state.withdrawRewards
  },
  modifyWithdrawAddress (state) {
    return state.modifyWithdrawAddress
  },
  coinPrice (state) {
    return state.coinPrice
  }
}

const actions = {
  [SET_CREATE_MNEMONIC] ({ commit }, mnemonic) {
    commit(COMMIT_CREATE_MNEMONIC, mnemonic)
  },
  [SET_CREATE_ADDRESS] ({ commit }, address) {
    commit(COMMIT_CREATE_ADDRESS, address)
  },
  [SET_MNEMONIC] ({ commit }, mnemonic) {
    commit(COMMIT_MNEMONIC, mnemonic)
  },
  [SET_ADDRESS] ({ commit }, address) {
    commit(COMMIT_ADDRESS, address)
  },
  [SET_HD_PATH] ({ commit }, hdPath) {
    commit(COMMIT_HD_PATH, hdPath)
  },
  [SET_ACCOUNT_DATA] ({ commit }, { type, value }) {
    commit(COMMIT_ACCOUNT_DATA, type, value)
  },
  [SET_REWARDS] ({ commit }, rewards) {
    commit(COMMIT_REWARDS, rewards)
  },
  [SET_DELEGATIONS] ({ commit }, delegations) {
    commit(COMMIT_DELEGATIONS, delegations)
  },  
  [SET_UNBONDING] ({ commit }, unbonding) {
    commit(COMMIT_UNBONDING, unbonding)
  },
  [SET_VALIDATORS] ({ commit }, validators) {
    commit(COMMIT_VALIDATORS, validators)
  },
  [SET_TOTAL_BONDED] ({ commit }, totalBonded) {
    commit(COMMIT_TOTAL_BONDED, totalBonded)
  },
  [SET_BALANCE] ({ commit }, { type, value }) {
    commit(COMMIT_BALANCE, { type, value })
  },
  [SET_BALANCES_UPDATED] ({ commit }, balancesUpdated) {
    commit(COMMIT_BALANCES_UPDATED, balancesUpdated)
  },  
  [SET_LOAD_INTERVAL_ID] ({ commit }, loadIntervalId) {
    commit(COMMIT_LOAD_INTERVAL_ID, loadIntervalId)
  },
  [SET_BALANCES_INTERVAL_ID] ({ commit }, balancesIntervalId) {
    commit(COMMIT_BALANCES_INTERVAL_ID, balancesIntervalId)
  },
  [RESET_BALANCES] ({ commit }) {
    commit(COMMIT_RESET_BALANCES)
  },
  [SET_TAB_STATE] ({ commit }, { type, key, value }) {
    commit(COMMIT_TAB_STATE, { type, key, value })
  },
  [RESET_TAB_STATE] ({ commit }, type) {
    let newObj = { ...BASE_TAB_FIELDS }    
    
    if (type === 'modifyWithdrawAddress') newObj.withdrawAddress = state.modifyWithdrawAddress.withdrawAddress
    if (type === 'redelegate') newObj = { ...newObj, validatorSourceAddress: '', validatorDestAddress: '' }

    commit(COMMIT_RESET_TAB_STATE, { type, newObj })
  },
  [RESET_ALL_ACCESS] ({ dispatch }) {
    dispatch(SET_MNEMONIC, '')
    dispatch(SET_ADDRESS, '')
    dispatch(SET_ACCOUNT_DATA, { type: 'accountNumber', value: 0 })
    dispatch(SET_ACCOUNT_DATA, { type: 'sequence', value: 0 })
    dispatch(SET_REWARDS, [])
    dispatch(SET_DELEGATIONS, [])
    dispatch(SET_UNBONDING, [])
    dispatch(SET_VALIDATORS, [])
    dispatch(SET_TOTAL_BONDED, 0)
    dispatch(RESET_BALANCES)
    dispatch(SET_BALANCES_UPDATED, 0)
    dispatch(SET_LOAD_INTERVAL_ID, 0)
    dispatch(SET_BALANCES_INTERVAL_ID, 0)
    dispatch(RESET_TAB_STATE, 'send')
    dispatch(RESET_TAB_STATE, 'delegate')
    dispatch(RESET_TAB_STATE, 'undelegate')
    dispatch(RESET_TAB_STATE, 'redelegate')
    dispatch(RESET_TAB_STATE, 'withdrawRewards')
    dispatch(RESET_TAB_STATE, 'modifyWithdrawAddress')
  },
  [SET_COIN_PRICE] ({ commit }, coinPrice) {
    commit(COMMIT_COIN_PRICE, coinPrice)
  }
}

const mutations = {
  [COMMIT_CREATE_MNEMONIC] (state, mnemonic) {
    state.create.mnemonic = mnemonic
  },
  [COMMIT_CREATE_ADDRESS] (state, address) {
    state.create.address = address
  },  
  [COMMIT_MNEMONIC] (state, mnemonic) {
    state.mnemonic = mnemonic
  },
  [COMMIT_ADDRESS] (state, address) {
    state.address = address
  },
  [COMMIT_HD_PATH] (state, hdPath) {
    state.hdPath = hdPath
  },
  [COMMIT_ACCOUNT_DATA] (state, { type, value }) {
    state.accountData[type] = value
  },
  [COMMIT_REWARDS] (state, rewards) {
    state.rewards = rewards
  },
  [COMMIT_DELEGATIONS] (state, delegations) {
    state.delegations = delegations
  },  
  [COMMIT_UNBONDING] (state, unbonding) {
    state.unbonding = unbonding
  },
  [COMMIT_VALIDATORS] (state, validators) {
    state.validators = validators
  },
  [COMMIT_TOTAL_BONDED] (state, totalBonded) {
    state.totalBonded = totalBonded
  },
  [COMMIT_BALANCE] (state, { type, value }) {    
    state.balances[type] = value
  },
  [COMMIT_BALANCES_UPDATED] (state, balancesUpdated) {
    state.balancesUpdated = balancesUpdated
  },   
  [COMMIT_LOAD_INTERVAL_ID] (state, loadIntervalId) {
    state.loadIntervalId = loadIntervalId
  }, 
  [COMMIT_BALANCES_INTERVAL_ID] (state, balancesIntervalId) {
    state.balancesIntervalId = balancesIntervalId
  }, 
  [COMMIT_RESET_BALANCES] (state) {
    state.balancesUpdated = 0
    state.balances = {
      available: "N/A",
      delegated: "N/A",
      unbonding: "N/A",
      rewards: "N/A"
    }
  },
  [COMMIT_TAB_STATE] (state, { type, key, value }) {    
    state[type][key] = value
  },
  [COMMIT_RESET_TAB_STATE] (state, { type, newObj }) {        
    state[type] = newObj
  },
  [COMMIT_COIN_PRICE] (state, coinPrice) {        
    state.coinPrice = coinPrice
  }  
}

export default {
  state,
  getters,
  actions,
  mutations
}
