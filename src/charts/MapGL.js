/**
 * data: 2018-1-6
 * author: yuechenglei
 * describe: map
 */

import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
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

    var self = this

    var latlng = L.latLng(40.07317, 116.5847) //location of Beijing

    mapboxgl.accessToken = 'pk.eyJ1IjoiZGFuc3dpY2siLCJhIjoiY2l1dTUzcmgxMDJ0djJ0b2VhY2sxNXBiMyJ9.25Qs4HNEkHubd4_Awbd8Og';
    self.map = new mapboxgl.Map({
      container: self.el,
      style: 'mapbox://styles/mapbox/dark-v9',
      center: latlng,
      zoom: 12,
      attributionControl: false
    });

    var nav = new mapboxgl.NavigationControl();
    self.map.addControl(nav, 'top-right');

    // disable map rotation using right click + drag
    self.map.dragRotate.disable();
    // var geojson = {
    //   "type": "FeatureCollection",
    //   "features": [],
    // };

    // var feature = {
    //   "type": "Feature",
    //   "geometry": {
    //     "type": "LineString",
    //     "coordinates": [
    //       [0, 0]
    //     ]
    //   }
    // };

    // console.log(geojson)
    // geojson.features.push(feature)
    // console.log(geojson)

    self.arrGeojson = {
      "type": "FeatureCollection",
      "features": [],
    }

    self.depGeojson = {
      "type": "FeatureCollection",
      "features": [],
    }

    self.map.on('load', function() {
      self.map.addLayer({
        "id": "arrTrajlayer",
        "type": "line",
        "source": {
          "type": "geojson",
          "data": self.arrGeojson,
        },
        "layout": {
          "line-join": "round",
          "line-cap": "round"
        },
        "paint": {
          "line-color": "#d14745",
          "line-width": 3
        }
      });

      self.map.addLayer({
        "id": "depTrajlayer",
        "type": "line",
        "source": {
          "type": "geojson",
          "data": self.depGeojson,
        },
        "layout": {
          "line-join": "round",
          "line-cap": "round"
        },
        "paint": {
          "line-color": "#29aae3",
          "line-width": 3
        }
      });
    });

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
    // console.log(data)
    data.arrTrajs.forEach(function(d, i) {
      // console.log(d)
      var feature = {
        "type": "Feature",
        "geometry": {
          "type": "LineString",
          "coordinates": []
        }
      };
      d.data.forEach(function(d, i) {
        // var point = new L.LatLng(+d.latlon[0], +d.latlon[1]);
        feature.geometry.coordinates.push([+d.latlon[1], +d.latlon[0]])
        // feature.geometry.coordinates.push(d.latlon.reverse())
      })
      self.arrGeojson.features.push(feature)
    })

    data.depTrajs.forEach(function(d, i) {
      // console.log(d)
      var feature = {
        "type": "Feature",
        "geometry": {
          "type": "LineString",
          "coordinates": []
        }
      };
      d.data.forEach(function(d, i) {
        // var point = new L.LatLng(+d.latlon[0], +d.latlon[1]);
        feature.geometry.coordinates.push([+d.latlon[1], +d.latlon[0]])
      })
      self.depGeojson.features.push(feature)
    })

    // console.log(self.arrGeojson)
    if (self.map.loaded()) {
      self.map.getSource('arrTrajlayer').setData(self.arrGeojson);
      self.map.getSource('depTrajlayer').setData(self.depGeojson);
    }


  }




}
