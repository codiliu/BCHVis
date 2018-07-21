import * as types from './types';
export default {

  [types.ADD_DATA] (state, data) {
  	console.log(data)
  	var temp={}
  	temp[data[0]]=data[1]
  	state.addrData = Object.assign({}, state.addrData, temp)
  	console.log(state.addrData)
  },
  [types.NEW_ADDRESS] (state, newAddress) {
    state.newAddress=newAddress
  },

  [types.SET_TXID] (state, txId) {
    state.txId=txId
  },

  [types.DEL_DATA] (state, addr) {
    delete(state.addrData[addr])
  },
  [types.SET_SELECTED_TX] (state, tx) {
    state.selectedTx = tx
  },
  [types.SET_TIMERANGE] (state, timerange) {
    state.timeRange = timerange
  },
  [types.SET_HASH] (state, hash) {
    state.hash = hash
  },
  [types.SET_HASHDATA] (state, hashData) {
    state.hashData = hashData
  },
}


