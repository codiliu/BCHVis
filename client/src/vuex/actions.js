import * as types from './types';

export default {

  setAddData({ commit, state }, data) {
    console.log(data)
    commit(types.ADD_DATA, data)
  },
  setNewAddress({ commit, state }, newAddress) {
    console.log(newAddress)
    commit(types.NEW_ADDRESS, newAddress)
  },
  setDelData({ commit, state }, data) {
    console.log(data)
    commit(types.DEL_DATA, data)
  },

}
	