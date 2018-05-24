<template>

  <div id="app" class='layout'>
    <div id='top'>
      <searchBox> </searchBox>
    </div>
    <div id="timeline">
      <timeline> </timeline>
    </div>
    <div id="graph">
    </div>
    <div id="table">
    </div>
  </div>
</template>
<script>
// import myGraph from './components/graph.vue'
// import myRank from './components/rank.vue'
import searchBox from './components/top.vue'
import timeline from './components/timeline.vue'
import $ from 'jquery'
import { mapActions, mapGetters } from 'vuex'
import axios from 'axios'
export default {
  name: 'app',
  components: { searchBox },
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
    top: 1.5em;
    left: 25%;
  }

  #timeline {
    background: red;
    position: absolute;
    top: 10%;
    left: 5%;
    width: 70%;
    height: 20%;
    border: 1px solid grey;
  }
  #graph {
    background: blue;
    position: absolute;
    top: 30%;
    left: 5%;
    width: 70%;
    height: 70%;
    border: 1px solid grey;
  }
  #table {
    background: green;
    position: absolute;
    top: 10%;
    left: 75%;
    width: 20%;
    height: 90%;
  }
}

</style>
