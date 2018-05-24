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

  [types.DEL_DATA] (state, addr) {
    delete(state.addrData[addr])
  },
}
