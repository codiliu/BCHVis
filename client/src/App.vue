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
// import $ from 'jquery'
import myTimeline from './components/timeline.vue'
import myMap from './components/map.vue'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'app',
  components: { myTimeline, myMap },
<<<<<<< HEAD
  methods: {
    ...mapActions(['setMinuteSta', 'setDaySta','setTrajData']),
  },
  //
  //computed:mapGetters(['getDaySta']),
  created () {
     // console.log('this.getDaySta(): ', this.getDaySta())
    //console.log(mapActions)

    console.log("data loading.....")
    var self = this 
   // self.setDaySta(11221)
=======
  // computed: {
  //   ...mapActions(['setDaySta', 'setTrajData']),
  // },
  // methods:mapActions(['setDaySta','setTrajData']),
  //computed:mapGetters(['getDaySta']),
  methods: {
    sleep(time) {
      var now = new Date();
      var exitTime = now.getTime() + time;
      while (true) {
        now = new Date();
        if (now.getTime() > exitTime)
          return;
      }
    },
    ...mapActions(['setDaySta', 'setTrajData']),
  },
  async created() {

    // console.log('this.getDaySta(): ', this.getDaySta())


    console.log("data loading.....")
    var self = this
    // self.setDaySta(11221)
>>>>>>> df4b81bf092e5bfa03ebaec0dd949de220fbfcd8

    //self.setDaySta(111)
    //self.getDaySta()
    this.$Loading.start();
    await connectDB()
    await getMonthSta(147525120000, 14832000000000)
    await getDaySta('*')
    await getCurtime(1481990400000, 1)
    // this.sleep(1000)

    this.$Loading.finish();

    function getCurtime(curtime, duration) {
      var constraint = {}
      var formData = new URLSearchParams();
      constraint['databasetype'] = 'mongodb'
      constraint['datasetname'] = 'trajectory'
      constraint['curtime'] = 1481990400000
      constraint['duration'] = 1
      constraint = JSON.stringify(constraint)
      formData.append('constraint', constraint)
      sendUrl('query/curtime', formData, 'curtimedata')
    }

    function getMonthSta(airport) {
      var constraint = {}
      var formData = new URLSearchParams();
      constraint['databasetype'] = 'mongodb'
      constraint['datasetname'] = 'dayStaMulti'
      constraint['airport'] = airport
      constraint = JSON.stringify(constraint)
      formData.append('constraint', constraint)
<<<<<<< HEAD
      sendUrl ('query/monthsta', formData, 'daysta')
=======
      sendUrl('query/monthsta', formData, 'monthsta')
>>>>>>> df4b81bf092e5bfa03ebaec0dd949de220fbfcd8
    }

    function getDaySta(dateTime) {
      var constraint = {}
      var formData = new URLSearchParams();
      constraint['databasetype'] = 'mongodb'
      constraint['datasetname'] = 'minuteStaMulti'
      constraint['dateTime'] = dateTime
      constraint = JSON.stringify(constraint)
      formData.append('constraint', constraint)
<<<<<<< HEAD
      sendUrl ('query/daysta', formData, 'minutesta')
=======
      sendUrl('query/daysta', formData, 'daysta')
>>>>>>> df4b81bf092e5bfa03ebaec0dd949de220fbfcd8

      // self.$api.post('http://127.0.0.1:22028/'+'db/daysta',formData, r => {
      //   console.log("daydata: ",r)
      // })
    }

    function connectDB() {
      var formData = new URLSearchParams();
      formData.append('databasetype', 'mongodb')
      formData.append('dbName', 'flight')
      formData.append('port', 27066)
      formData.append('host', '192.168.10.9')
      // sendUrl ('db/connect', formData, 'connect')
      self.$api.post('db/connect', formData, r => {
        console.log("connect database success")
      })
    }

    function sendUrl(Url, formData, v_id) {
      // Url='http://127.0.0.1:22028/'+Url
      console.log(Url)
<<<<<<< HEAD
      self.$api.post(Url,formData, d => {
        var data=d.data
        data = JSON.parse(data) 
        console.log('------get '+v_id+" data")
        switch(v_id){
=======
      self.$api.post(Url, formData, d => {
        var data = d.data
        data = JSON.parse(data)
        console.log('------get ' + v_id + " data")
        switch (v_id) {
          case 'monthsta':
            break
>>>>>>> df4b81bf092e5bfa03ebaec0dd949de220fbfcd8
          case 'daysta':
            self.setDaySta(data['PEK'])
            break
          case 'minutesta':
              var temp =[] 
              data['PEK'].forEach(function(d){
                temp=temp.concat(d['data'])
              })
             self.setMinuteSta(temp)
            break
          case 'curtimedata':
            let trajData = data['trajData']
            let airportSelected = 'PEK'
            let arrTrajs = []
            let depTrajs = []
            trajData.forEach(function(d) {
              try {
                var origin = d['origin']['code']['iata']
                var destination = d['destination']['code']['iata']
                if (origin == airportSelected) {
                  depTrajs.push(d)
                }
                if (destination == airportSelected) {
                  arrTrajs.push(d)
                }
              } catch (e) {
                if (airportSelected == 'PEK') {
                  if (d['arr'] == 1) {
                    arrTrajs.push(d)
                  }
                  if (d['arr'] == 0) {
                    depTrajs.push(d)
                  }
                }
              }
            })
<<<<<<< HEAD
            trajData = {'arrTrajs': arrTrajs, 'depTrajs': depTrajs}
            //console.log(trajData)
            self.setTrajData(trajData)
            break
        }  
=======
            trajData = { 'arrTrajs': arrTrajs, 'depTrajs': depTrajs }
            console.log(trajData)

            // self.$store.dispatch('setTrajData',trajData)
            self.setTrajData(trajData)
            break
        }
        console.log(data)
>>>>>>> df4b81bf092e5bfa03ebaec0dd949de220fbfcd8
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
  ul, ol {
      padding-left: 5px;
  }
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
