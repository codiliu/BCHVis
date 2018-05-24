import * as types from './types';

export default {
  setNewAddress({ commit, state }, newAddress) {
    commit(types.NEW_ADDRESS, newAddress)
  },
  setAddressArr({ commit, state }, addressArr) {
    commit(types.ADDRESS_ARR, addressArr)
  },

}
	