<template>
  <div>
    <div id='mapContainer' ref="mapContainer">
      <!-- <div ref:"mapContiner"> -->
    </div>
    <!--  -->
    <div id="ProjectTitle">
      Air Traffic Control Visual Analysis System
    </div>
    <!--  -->
    <div id="AirportPanel" style="text-align: center;">
      <div id="CenterAirport">ZBAA</div>
      <div class="small-font">Beijing Capital International Airport</div>
      <div id="mapTimeText">
        &nbsp;<span id="mapDate"></span>
        <span id="mapTime"></span>&nbsp;
      </div>
    </div>
    <!--  -->
    <div id="fixptsHistogram">
      <div style="background-color: #000000;">FixPts Passing <i class="fa fa-caret-down" id="FixptsHistogramShow" style="cursor:pointer;"></i></div>
      <div id="fixptsHistogram_real"></div>
    </div>
    <!--  -->
    <MapControl id="mapControl"> </MapControl>
  </div>
</template>
<script>
// import Map from '../charts/MapView'
import MapGL from '../charts/MapGL'
import MapControl from './mapcontrol.vue'
import { mapActions, mapGetters } from 'vuex'
// import $ from 'jquery'
export default {
  components: { MapControl },
  data() {
    return {
      list: []
    }
  },
  mounted() {
    // this.getData();
    console.log("map loading.....")
    // console.log(this.list)
    // console.log(this.trajData)
    // console.log(this.$refs.mapContainer)

    // this.Map = new Map(this.$refs.mapContainer)
    // if(this.trajData.length!=0){
    //   // this.Map.drawTraj(this.trajData)
    //   this.Map.initLayers(this.trajData)
    // }

    this.Map = new MapGL("mapContainer")
    if (this.trajData.length != 0) {
      this.Map.drawTraj(this.trajData)
      // this.Map.initLayers(this.trajData)
    }
  },
  computed: {
    ...mapGetters({
      trajData: 'getTrajData'
    }),

  },
  watch: {
    trajData: function(val) {
      // Our fancy notification (2).
      console.log('trajdata change')
      console.log(val)
      // this.Map.initLayers(val)

      this.Map.drawTraj(val)

    }
  },

  methods: {
    getData() {
      this.list = this.getTrajData
      console.log(this.list)
    },
  }
}

</script>
<style lang="less">
@import "../style/map.less";
@import "../style/mapboxgl.less";

</style>
