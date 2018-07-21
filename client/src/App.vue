<template>

  <div id="app" class='layout'>
    <div id='nav'>
      <navbar> </navbar>
    </div>
    <div id='top'>
      <searchBox> </searchBox>
    </div>
    <div id="timeline">
      <timeline> </timeline>
    </div>
    <div id="graph">
      <nodelinkBox></nodelinkBox>
      
    </div>
    <div id="table">
      <tableBox> </tableBox>
    </div>
    <div id="center">
      <river> </river>
    </div>
  </div>
</template>
<script>
// import myGraph from './components/graph.vue'
// import myRank from './components/rank.vue'
import navbar from './components/nav.vue'
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
  components: { navbar, searchBox, timeline, tableBox, nodelinkBox, river},
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
    ...mapActions(['setAddData', 'setNewAddress']),
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

    var address = '1Ctj8MbJ8NodXBREu9bztGWyy7HMVY5s9T'
    self.setNewAddress('1Ctj8MbJ8NodXBREu9bztGWyy7HMVY5s9T')
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
  #nav {
    position: fixed;
     width: 90%;
    /*text-align: center;*/
  }
  #top {
    top:13% ;
    position: absolute;
    text-align: center;
  }
  #graph {
    position: absolute;
    top: 20%;
    left: 10%;
    width: 40%;
    height: 80%;
    border: 0px solid grey;
    border-radius: 5px;
  }
  #timeline {
    position: absolute;
    top: 20%;
    left: 50%;
    width: 40%;
    height: 20%;
    border: 0px solid grey;
    border-radius: 5px;
  }

  #center{
    position: absolute;
    top: 40%;
    left: 50%;
    width: 40%;
    height: 30%;
  }
  #table {
    /*background: green;*/
    position: absolute;
    top: 70%;
    left: 50%;
    width: 40%;
    height: 30%;
  }
  .bar1  {
  fill: #337ab7;
  stroke: #337ab7;
}
.bar2  {
  fill: #e4575e;
  stroke: #e4575e;
}

 .header{
  font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
    font-size: 14px;
    line-height: 1.42857143;
margin-left: 120px;
            padding-right: 15px;
            padding-left: 15px;
            padding-bottom: 20px;
            padding-top: 20px;
            border-bottom: 1px solid #e5e5e5;
        }

  .header h3{
    
            margin-top: 0;
            margin-bottom: 0;
            font-size: 1.7em;
            line-height: 40px;
        }
  .nav-pills li.active a, .nav-pills li.active a:focus, .nav-pills li.active a:hover {
    text-decoration: none;
    color: #fff;
    background-color: #337ab7;
}
 .nav li a {

    position: relative;
    border-radius: 4px;
    text-decoration: none;
    display: block;
    padding: 10px 15px;
  }
  a:-webkit-any-link {
    text-decoration: none;
    color: -webkit-link;
    cursor: pointer;
}
li {
  text-decoration: none;
    display: list-item;
    text-align: -webkit-match-parent;
}
  
}

</style>
