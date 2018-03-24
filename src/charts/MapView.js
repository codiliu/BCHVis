/**
 * data: 2017-11-14 
 * author: yuechenglei
 * describe: map
 */

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Trajlayer from './layers/trajLayer.js'
import config from '../commons/config.js'
let { curTime } = config


export default class {
  constructor(el) {
    this.el = el
    // console.log(L)
    this.init()
  }


  init() {
    var latlng = L.latLng(40.07317, 116.5847) //location of Beijing

    // var dom = document.getElementById(this.el)

    this.map = L.map(this.el, {
      center: latlng,
      zoom: 15,
      attributionControl: false, //不显示右下角的标记
      zoomControl: true, //不显示放大缩小的按钮
    });

    var accessToken = 'pk.eyJ1IjoieWV0YW5nemhpIiwiYSI6ImNpajFrdmJ1aDAwYnF0b2x6cDA2bndybjgifQ.g9phAioL8kT5ik4jGg6kNQ';
    var style = "dark"; // emerald,light,dark
    var tileLayer = L.tileLayer('https://api.mapbox.com/v4/mapbox.' + style + '/{z}/{x}/{y}.png?access_token=' + accessToken);

    this.map.scrollWheelZoom.disable();

    tileLayer.addTo(this.map);
    return this
  }

  initLayers(trajData) {
    var self = this;

    // var fixPotOptions = {
    //   "zoomDraw": true, // redraw after zoom
    //   "fixPots": Datacenter.get("fixPots"),
    //   "map": self.map,
    //   "model": self.model,
    // };
    // // var fixPots = Datacenter.get("fixPots");
    // // self.fixpotlayer = new Fixpotlayer(self.map, fixPots, "fixpotlayer");
    // // self.fixpotlayer = new Fixpotlayer(self.map, fixPotOptions, "fixpotlayer");
    // self.fixpotlayer = new Fixpotlayer(self.map, fixPotOptions, "fixpotlayer", Datacenter.timelineModel);
    // self.fixpotlayer.init(fixPotOptions);
    // self.model.get("layers")['fixpotlayer'] = self.fixpotlayer;
    // d3.selectAll(".fixpot").classed("hidden", !fixPotShow);

    // var trajData = Datacenter.get('trajData');

    // self.historyTrajlayer = new HistoryTrajlayer(self.map, "historyTrajlayer");
    // self.trajlayerTotal = new TrajlayerTotal(self.map, "trajlayerTotal");
    self.trajlayer = new Trajlayer(self.map, "trajlayer");

    var timeStart = new Date(2016, 11, 15, 0).getTime();
    var timeEnd = new Date(2016, 11, 15, 1).getTime();

    var arrTrajsNew = self.filterDataCurtime(curTime, trajData['arrTrajs'])
    var depTrajsNew = self.filterDataCurtime(curTime, trajData['depTrajs'])
    var trajDataNew = { "arrTrajs": arrTrajsNew, "depTrajs": depTrajsNew };

    // self.historyTrajlayer.init(trajDataNew);
    // self.trajlayerTotal.init(trajDataNew);
    self.trajlayer.init(trajDataNew);

  }

  filterDataCurtime(curtime, dataOld) {
    var self = this;
    var data = [];

    dataOld.forEach(function(d) {
      if (curtime >= d['sTime'] && curtime < d['eTime']) {
        // data.push({'trajID':d.trajID,'data':d.data})
        data.push(d);
      }
    });
    return data;
  }

  drawTraj(data) {

    var self = this
    data.arrTrajs.forEach(function(d, i) {
      let pointList = [];

      // console.log(d)
      d.data.forEach(function(d, i) {
        var point = new L.LatLng(+d.latlon[0], +d.latlon[1]);
        pointList.push(point)
      })

      var firstpolyline = new L.Polyline(pointList, {
        color: '#d14745',
        weight: 2,
        opacity: 0.5,
        smoothFactor: 1
      });
      // console.log
      firstpolyline.addTo(self.map)

    })

  }




}
