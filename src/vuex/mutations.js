import * as types from './types';
export default {
  [types.GRAPH_DATA] (state, graphData) {
    state.graphData = graphData
  },
  [types.DAY_STA] (state, daysta) {
    state.daysta = daysta
  },
  [types.MINUTE_STA] (state, minutesta) {
    state.minutesta = minutesta
  },
  [types.AIRPORTSELECTED] (state, airportSelected) {
    state.airportSelected = airportSelected
  },
  [types.TRAJDATA] (state, trajData) {
    state.trajData = trajData
  },
  [types.TIMELINETOPRANGE] (state, timelineTopRange) {
    state.timelineTopRange = timelineTopRange
  },
  [types.CURTIME] (state, curtime) {
    state.curtime = curtime
  },
  [types.SLIDINGWINDOWSIZE] (state, slidingwindowsize) {
    state.slidingwindowsize = slidingwindowsize
  }
}
