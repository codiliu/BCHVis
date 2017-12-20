import * as types from './types';
export default {
  [types.NEXTSONG](state) {},
  [types.PREVSONG](state, obj) {
    state.playing = obj
  },
  [types.ADDINDEX](state) {
    state.currentIndex += 1;
  }
}
