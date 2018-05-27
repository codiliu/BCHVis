<template>

  <div id="app" class='layout'>
    <div id='top'>
      <searchBox> </searchBox>
    </div>
    <div id="timeline">
      <timeline> </timeline>
    </div>
    <div id="graph">
      <river> </river>
    </div>
    <div id="table">
      <tableBox> </tableBox>
    </div>
    <div id="center">
      <nodelinkBox></nodelinkBox>
    </div>
  </div>
</template>
<script>
// import myGraph from './components/graph.vue'
// import myRank from './components/rank.vue'
import searchBox from './components/top.vue'
import tableBox from './components/table.vue'
import timeline from './components/timeline.vue'
import nodelinkBox from './components/nodelink.vue'
import river from './components/river.vue'
import $ from 'jquery'
import { mapActions, mapGetters } from 'vuex'
import axios from 'axios'
export default {
  name: 'app',
  components: { searchBox, timeline, tableBox, nodelinkBox, river},
  computed: {
      ...mapGetters({
        addrData: 'getAddrData',
        newAddress: 'getNewAddress'
      })
  },
  watch: {
    addrData: function(data) {
      console.log(data)
    },
    newAddress: function(data){
      console.log(data)
      this.sendAddress(data)
    },
  },
  methods: {
    ...mapActions(['setAddData']),
    sendAddress(address) {
      var constraint = {}
      var formData = new URLSearchParams();
      constraint['address'] = address;
      constraint = JSON.stringify(constraint)
      formData.append('constraint', constraint)
      this.sendUrl('searchAddress', formData, 'address', address)
    },
    sendUrl(Url, formData, v_id, info) {
      var self=this
      Url = 'http://127.0.0.1:22068/' + Url
      console.log('Request: ', Url)
      self.$api.post(Url, formData, data => {
        self.setAddData([info, data])
        console.log('get ' + v_id + 'success: ', data)

      })
    }
  },
  async created() {
    var self = this

    var address = '1DUMifqLdCRvx6tAzafwDC2tKRntRAAm3z'

    sendAddress(address)
    function sendAddress(address) {
      var constraint = {}
      var formData = new URLSearchParams();
      constraint['address'] = address;
      constraint = JSON.stringify(constraint)
      formData.append('constraint', constraint)
      sendUrl('searchAddress', formData, 'address', address)
    }

    // function sendTest () {
    //   var constraint = {}
    //   var formData = new URLSearchParams();
    //   constraint = JSON.stringify(constraint)      
    //   formData.append('constraint', constraint)
    //   sendUrl ('ws', formData, 'test')
    // }


    function sendUrl(Url, formData, v_id, info) {
      Url = 'http://127.0.0.1:22068/' + Url
      console.log('Request: ', Url)
      self.$api.post(Url, formData, data => {
        self.setAddData([info, data])
        console.log('get ' + v_id + 'success: ', data)

      })
    }
   
  }
}

</script>
<style lang="less">
#app {
  position: absolute;
  height: 100%;
  width: 100%;
  ul,
  ol {
    padding-left: 5px;
  }
  .navbar {
    height: 2.5em;
    background: black;
    color: grey;
    a,
    .uk-link {
      color: grey;
      font-weight: bolder;
    }
  }
  #top {
    position: absolute;
    left: 30%;
  }
  #timeline {
    position: absolute;
    top: 10%;
    left: 5%;
    width: 65%;
    height: 20%;
    border: 1px solid grey;
    border-radius: 5px;
  }
  #graph {
    position: absolute;
    top: 31%;
    left: 5%;
    width: 65%;
    height: 68%;
    border: 1px solid grey;
    border-radius: 5px;
  }
  #table {
    /*background: green;*/
    position: absolute;
    top: 10%;
    left: 70%;
    width: 30%;
    height: 50%;
  }
  #center{
    position: absolute;
    top: 60%;
    left: 70%;
    width: 30%;
    height: 40%;
  }
}

</style>
