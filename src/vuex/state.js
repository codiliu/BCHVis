import { playMode } from '../commons/config'
const state = {
  graphData: {},
  month: 4,
  timelineTopRange: [Date.parse(new Date(2016, 11, 18)), Date.parse(new Date(2016, 11, 19))],
  daysta: [],
  minutesta: [],
  trajData: [],
  curtime: new Date(2016, 11, 18).getTime(),
  slidingwindowsize: 30 * 60 * 1000,
  focusLocation: null,
  filterCircle: false,
  airportSelected: 'PEK',
  currentCenterAirport: 'ZBAA',
  filterPolygon: false,
  filterShow: 'filterRemove',
  filterTrajShow: false,
  brushFinish: true, // judge whether brush finished ß
  brushFinish1: true, // judge whether brush finished ß
  brushEmpty: false,
  curScale: 8,
  emPixel: null,
  focusLocationArray: {
    World: {
      scale: 3
    },
    China: {
      scale: 4
    },
    Beijing: {
      scale: 8
    },
    PEK: {
      scale: 13
    }
  },
  centerAirportArray: {
    ZBAA: [40.076805, 116.588355],
    ZBNY: [39.4652, 116.2312], // 北京南苑机场
    ZBSJ: [38.1651, 114.4150], // 石家庄正定国际机场
    ZBTJ: [39.0728, 117.2045] // 天津滨海国际机场
  },
  loading: true
}
export default state
