import * as types from './types';

export default {
  setAddData({ commit, state }, data) {
    //console.log(data)
    commit(types.ADD_DATA, data)
  },
  setDelData({ commit, state }, data) {
    //console.log(data)
    commit(types.DEL_DATA, data)
  },

}
	