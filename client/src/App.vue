<template>
  <div id="app" class='layout'>
    <div id='top'>
      <searchBox> </searchBox>
    </div>
    <div id="timeline">
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
import $ from 'jquery'
import { mapActions, mapGetters } from 'vuex'
import axios from 'axios'
export default {
  name: 'app',
  components: { searchBox },
  methods: {
    ...mapActions(['setGraphData', 'setSelectRound']),
  },
  async created() {


    var self = this

    // sendTest()

    function sendTest() {
      var constraint = {}
      var formData = new URLSearchParams();
      constraint = JSON.stringify(constraint)
      formData.append('constraint', constraint)
      sendUrl('ws', formData, 'test')
    }



    function sendUrl(Url, formData, v_id) {
      Url = 'http://127.0.0.1:22068/' + Url
      console.log('Request: ', Url)
      self.$api.post(Url, formData, d => {
        console.log('success: ', d)

      })
    }

    // var dir = "static/resource/data" + n_nodes + "_2/"

    // d3.csv(dir + "block_dist.csv", function(error, data_d1) {
    //   if (error) throw error;

    // })

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
