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
import $ from 'jquery'
import myTimeline from './components/timeline.vue'
import myMap from './components/map.vue'
export default {
  name: 'app',
  components: { myTimeline, myMap },
  created () {

    // var constraint = {};
    // var formData = new FormData();
    // constraint['databasetype'] = 'mongodb';
    // constraint['datasetname'] = 'trajectory';
    // constraint['curtime'] = 1481990400000;
    // constraint['duration'] = 1
    // constraint=JSON.stringify(constraint)
    // formData.append("constraint", constraint);
    // $.ajax({
    //   url: 'http://127.0.0.1:22028/query/curtime',
    //   type: 'POST',
    //   dataType: 'JSON',
    //   data: formData,
    //   processData: false,
    //   contentType: false,
    //   success: function (response) {
    //     var data = response.data
    //     if (data) {
    //       console.log("data111",data) 
    //     }
    //   },
    //   error: function (jqXHR, textStatus, errorMessage) {
    //     console.log('errorMessage') // Optional
    //   }
    // })

    console.log("data loading.....")
    var self = this
    connectDB()
    getMonthSta(147525120000, 14832000000000)
    getDaySta('*')
    getCurtime(1481990400000, 1)

    function getCurtime (curtime, duration) {
      var constraint = {}
      var formData = new URLSearchParams();
      constraint['databasetype'] = 'mongodb'
      constraint['datasetname'] = 'trajectory'
      constraint['curtime'] = 1481990400000
      constraint['duration'] = 1
      constraint = JSON.stringify(constraint)      
      formData.append('constraint', constraint)
      sendUrl ('query/curtime', formData, 'curtimedata')
    }
    function getMonthSta (airport) {
      var constraint = {}
      var formData = new URLSearchParams();
      constraint['databasetype'] = 'mongodb'
      constraint['datasetname'] = 'dayStaMulti'
      constraint['airport'] = airport
      constraint = JSON.stringify(constraint)      
      formData.append('constraint', constraint)
      sendUrl ('query/monthsta', formData, 'monthsta')
    }
    function getDaySta (dateTime) {
      var constraint = {}
      var formData = new URLSearchParams();
      constraint['databasetype'] = 'mongodb'
      constraint['datasetname'] = 'dayStaMulti'
      constraint['dateTime'] = dateTime
      constraint = JSON.stringify(constraint)      
      formData.append('constraint', constraint)
      sendUrl ('query/daysta', formData, 'daydata')

      // self.$api.post('http://127.0.0.1:22028/'+'db/daysta',formData, r => {
      //   console.log("daydata: ",r)
      // })
    }
    function connectDB () {
      var formData = new URLSearchParams();
      formData.append('databasetype', 'mongodb')
      formData.append('dbName', 'flight')
      formData.append('port', 27066)
      formData.append('host', '192.168.10.9')
      // sendUrl ('db/connect', formData, 'connect')
      self.$api.post('http://127.0.0.1:22028/'+'db/connect',formData, r => {
        console.log("connect database success")
      })
    }
    
    function sendUrl (Url, formData, v_id){
      Url='http://127.0.0.1:22028/'+Url
      console.log(Url)
      self.$api.post(Url,formData, d => {
        var data=d.data
        // if (v_id === 'cdm' || v_id === 'curtimedata' || v_id === 'curtimedatahistogram' || v_id === 'filterCircle' || v_id === 'callsign'){
        //   data = JSON.parse(data.replace(/\bNaN\b/g, 'null'))
        // } else {
        //   data = JSON.parse(data)
        // }
        data = JSON.parse(data) 
        console.log('------get '+v_id+"data")
        console.log(data)
      })
    }
         
  }
}

</script>
<style lang="less">
@import "./style/base/style.less";
@import "./style/base/base.vars.less";
@import "./style/base/iview.less";

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
