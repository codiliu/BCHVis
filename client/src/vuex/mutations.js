import * as types from './types';
export default {
  [types.GRAPH_DATA] (state, graphData) {
    state.graphData = graphData
  },
  [types.SELECT_ROUND] (state, selectRound) {
    state.selectRound = selectRound
  },
}
