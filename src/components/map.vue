<template>
  <div>
  <div class = 'mapContainer' ref="mapContainer">
    <!-- <div ref:"mapContiner"> -->
  </div>
  <div id="ProjectTitle">
    Air Traffic Control Visual Analysis System
  </div>
  <MapControl id="mapControl"> </MapControl>
  </div>
</template>
<script>
import Map from '../charts/MapView'
import MapControl from './mapcontrol.vue'
// import $ from 'jquery'
export default {
  components: { MapControl },
  data() {
    return {
      list: []
    }
  },
  mounted() {
    this.getData();
    // console.log(this.$refs.mainTable)
    // console.log(this.$refs.mapContainer)

    this.Map = new Map(this.$refs.mapContainer)
  },
  methods: {
    getData() {
      // this.$api.get('topics', null, r => {
      //   this.list = r.data
      // })
    }
  }
}

</script>
<style lang="less">
@import "../style/map.less";
</style>
