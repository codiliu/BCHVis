// import * as types from './types';

// export const month = state => state.month;
// export const daysta = state => state.daysta;
// export const minutesta = state => state.minutesta;
// export const loading = state => state.loading;
// export const curtime = state => state.curtime;
// export const slidingwindowsize = state => state.slidingwindowsize;
// export const timelineTopRange = state => state.timelineTopRange;
// export const airportSelected = state => state.airportSelected;
// export const trajData = state => state.trajData;

// export const getDaySta = state => {
//     return state.daysta;
// }

export default {
	getDaySta(state){
		console.log("getter getDaySta: ",state.currentIndex)
		return state.daysta;
	},
	getTrajData(state){
		return state.trajData;
	},
  // const getDaySta = state =>state.daysta
  // getDaySta = state => state.daysta,
  // index(state) {
  //   return state.currentIndex;
  // },
}
