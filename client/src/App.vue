<template>
  <div id="app">
    <nav class="navbar navbar-default" role="navigation">
      <div class="navbar-header">
        <a class="navbar-brand" href="#">LBVis: Interactively Visualizing the Dynamic Load Balancing in Parallel Particle Tracing</a>
      </div>
    </nav>
    <div id="content">
      <myRank id="rank-container"></myRank>
      <myGlyph id="glyph-container"></myGlyph>
      <myGraph id="load-balance-container"></myGraph>
    </div>
  </div>
</template>
<script>
import '../node_modules/bootstrap/dist/css/bootstrap.css'
import '../node_modules/bootstrap-vue/dist/bootstrap-vue.css'
import BootstrapVue from 'bootstrap-vue'
import myGraph from './components/graph.vue'
import myRank from './components/rank.vue'
import myGlyph from './components/glyph.vue'
import $ from 'jquery'
import { mapActions, mapGetters } from 'vuex'
import axios from 'axios'
export default {
  name: 'app',
  components: { myGraph, myRank, myGlyph },
  methods: {
    ...mapActions(['setGraphData', 'setSelectRound']),
  },
  async created() {
    // axios.get("../static/resource/data32_2/block_transfer.csv").then(response => {  
          
    //       console.log(response) 
    // });

    console.log("data loading.....")
    var self = this
    // connectDB()

    sendTest()

    function sendTest () {
      var constraint = {}
      var formData = new URLSearchParams();
      constraint = JSON.stringify(constraint)      
      formData.append('constraint', constraint)
      sendUrl ('ws', formData, 'test')
    }

    // function getCurtime (curtime, duration) {
    //   var constraint = {}
    //   var formData = new URLSearchParams();
    //   constraint['databasetype'] = 'mongodb'
    //   constraint['datasetname'] = 'trajectory'
    //   constraint['curtime'] = 1481990400000
    //   constraint['duration'] = 1
    //   constraint = JSON.stringify(constraint)      
    //   formData.append('constraint', constraint)
    //   sendUrl ('query/curtime', formData, 'curtimedata')
    // }
   
    function sendUrl (Url, formData, v_id){
      Url='http://127.0.0.1:22068/'+Url
      console.log('Request: ', Url)
      self.$api.post(Url,formData, d => {
        console.log('success: ', d)
        
      })
    }
    var self = this

    var max_round = 15, n_nodes = 32, n_nodes_ratio = 0.5; // 0.15 for 64 nodes

    //var min_workload, max_worload;
    var nodes = [], links = []
    var transfer_json = {}, dist_json = {};
    var dir = "static/resource/data"+n_nodes+"_2/"
    d3.csv(dir + "block_dist.csv", function (error, data_d1) {
      if (error) throw error;
      data_d1.forEach(function (d, i) {
        if (+d.round <= max_round) {
          d = {
            "name": +d.name,
            "blockid": +d.blockid,
            "isLocal": +d.isLocal,
            "workload": +d.wl,
            "estWorkload": +d.estWl,
            "round": +d.round
          }

          if(!dist_json[d.round]) dist_json[d.round] = {}
          if(!dist_json[d.round][d.name]) dist_json[d.round][d.name] = []

          dist_json[d.round][d.name].push({
            "blockid": d.blockid,
            "workload": d.workload,
            "estWorkload": d.estWorkload
          })
        }
      });

      
      d3.csv(dir + "block_transfer.csv", function (error, data_t1) {
        if (error) throw error;

        data_t1.forEach(function (d, i) {
          if (+d.round < max_round) {
            // store by json structure
            d = {
              "source": +d.source,
              "target": +d.target,
              "blockid": +d.blockid,
              "isLocal": +d.isLocal,
              "count": +d.count,
              "round": +d.round
            }
          
            if(!transfer_json[d.round]) transfer_json[d.round] = {}
            if(!transfer_json[d.round][d.source]) transfer_json[d.round][d.source] = {}

            if(!transfer_json[d.round][d.source][d.target]) transfer_json[d.round][d.source][d.target] = []

            //transfer_json[d.round][d.source][d.target].push(d.blockid)
            transfer_json[d.round][d.source][d.target].push({"blockid": d.blockid, "isLocal": d.isLocal})
          }
        });

          d3.csv(dir + "nodes.csv", function (error, data2) {
            if (error) throw error;

            data2.forEach(function (d, i) {
              if (+d.round <= max_round) {
                //count++;
                nodes.push({ 
                  "name": d.name,
                  "count": +d.count,
                  "localCount": +d.localCount,
                  "workload": +d.workload,
                  "estWorkload": +d.estWorkload,
                  "npts": +d.npts,
                  "nfdpts": +d.nfdpts,
                  "round": +d.round 
                });
              }
            });

            //compute = d3.interpolate(a, b);

            d3.csv(dir + "links.csv", function (error, data3) {
              if (error) throw error;

              data3.forEach(function (d) {
                if (+d.round < max_round) {
                  links.push({
                    "source": d.source,
                    "target": d.target,
                    "value": parseInt(d.value),
                    "count": parseInt(d.count),
                    "round": parseInt(d.round)
                  });
                }
              });

              self.setGraphData({'nodes': nodes, 
                                 'links': links, 
                                 'transfer_json': transfer_json,
                                 'dist_json': dist_json
                               })

              console.log({'nodes': nodes, 
                                 'links': links, 
                                 'transfer_json': transfer_json,
                                 'dist_json': dist_json
                               })
            });
          });
      });
    });

  }
}

</script>
<style lang="less">

#app {
  position: absolute;
  height: 100%;
  width: 100%;
  ul, ol {
      padding-left: 5px;
  }
  .navbar{
    height: 2.5em;
    background: black;
    color: grey;
    a, .uk-link{
      color:grey;
      font-weight: bolder;
    }
  }
  #content {
    position: absolute;
    width: 100%;
    top: 2.5em; 
    height: calc(~"100% - 2.5em"); 
    border-left: 2px solid grey;
    border-right: 2px solid grey;
    border-bottom: 2px solid grey;
    #rank-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 12%;
      height: 100%;
      border: 1px solid grey;
    }
    #glyph-container {
      position: absolute;
      top: 0;
      left: 12%;
      width: 8%;
      height: 100%;
      border: 1px solid grey;
    }
    #load-balance-container {
      position: absolute;
      top: 0;
      left: 20%;
      width: 80%;
      height: 100%;
    }
  }
}

</style>
