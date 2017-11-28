<template>
  <div id="app">
    <!-- <b-navbar toggleable="md" type="dark" variant="dark" ref="myNavbar"> -->
    <!-- <b-navbar-toggle target="nav_collapse"></b-navbar-toggle> -->
    <!-- <b-navbar-brand href="#">Air Traffic Control Visual Analysis System</b-navbar-brand> -->
    <!-- Right aligned nav items -->
    <!-- <b-navbar-nav class="ml-auto"> -->
    <!-- <b-nav-item href="http://vis.pku.edu.cn" target="_blank">PKU VIS</b-nav-item> -->
    <!-- </b-navbar-nav> -->
    <!-- </b-navbar> -->
    <div id="content">
      <myMap id="map"></myMap>
      <myTimeline id="timeline"></myTimeline>
      <!-- <router-view/> -->
    </div>
  </div>
</template>
<script>
import myTimeline from './components/timeline.vue'
import myMap from './components/map.vue'
export default {
  name: 'app',
  components: { myTimeline, myMap },
}

</script>
<style lang="less">
@import "./style/base/style.less";
@import "./style/base/base.vars.less";
#app {
  position: absolute;
  height: 100%;
  width: 100%;

  #content {
    position: absolute;
    width: 100%;
    height: 100%; //height:calc(~"100% - 56px");
    #map {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 80%;
    }
  
    #timeline {
      position: absolute;
      left: 0;
      top: 80%;
      width: 100%;
      height: 20%;
      background: @bg-color;
    }
  }
}

</style>
