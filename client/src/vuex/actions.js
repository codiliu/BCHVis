import * as types from './types';
export default {
  sendAudio({ commit, state }, obj) {
    commit(types.NEXTSONG, obj)
  },
  addIndex({ commit, state }) { //
    commit(types.ADDINDEX);
  },

}
