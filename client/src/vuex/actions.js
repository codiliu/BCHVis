import * as types from './types';

export default {

  setAddData({ commit, state }, data) {
    //console.log(data)
    commit(types.ADD_DATA, data)
  },
  setNewAddress({ commit, state }, newAddress) {
    commit(types.NEW_ADDRESS, newAddress)
  },
  setDelData({ commit, state }, data) {
    //console.log(data)
    commit(types.DEL_DATA, data)
  },
  setSelectedTx({ commit, state}, data) {
    commit(types.SET_SELECTED_TX, data)
  },
  setTimeRange({ commit, state}, data) {
    commit(types.SET_TIMERANGE, data)
  },
  setTxId({ commit, state}, data) {
    commit(types.SET_TXID, data)
  },
  setHash({ commit, state}, data) {
    commit(types.SET_HASH, data)
  },
  setHashData({ commit, state}, data) {
    commit(types.SET_HASHDATA, data)
  }
}
	