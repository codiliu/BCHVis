import * as types from './types';
export default {

  [types.ADD_DATA] (state, data) {
  	state.addrData[data[0]]=data[1]
  },
  [types.NEW_ADDRESS] (state, newAddress) {
    state.newAddress=newAddress
  },

  [types.DEL_DATA] (state, addr) {
    delete(state.addrData[addr])
  },
}
