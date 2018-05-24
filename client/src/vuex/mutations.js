import * as types from './types';
export default {
  [types.GRAPH_DATA] (state, graphData) {
    state.graphData = graphData
  },
  [types.SELECT_ROUND] (state, selectRound) {
    state.selectRound = selectRound
  },

  [types.ADD_DATA] (state, data) {
  	var key = Object.keys(data)[0]
  	state.addrData[key]=data[key]
  },

  [types.DEL_DATA] (state, addr) {
    delete(state.addrData[addr])
  },
}
