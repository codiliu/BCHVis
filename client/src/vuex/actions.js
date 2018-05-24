import * as types from './types';

export default {
  setGraphData({ commit, state }, graphData) {
    commit(types.GRAPH_DATA, graphData)
  },

  setSelectRound({ commit, state }, selectRound) {
    console.log(selectRound)
    commit(types.SELECT_ROUND, selectRound)
  },

  setAddData({ commit, state }, data) {
    console.log(data)
    commit(types.ADD_DATA, data)
  },

  setDelData({ commit, state }, data) {
    console.log(data)
    commit(types.DEL_DATA, data)
  },

}
	