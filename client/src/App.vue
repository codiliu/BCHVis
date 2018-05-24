<template>
  <div id="app">
    <nav class="navbar navbar-default" role="navigation">
      <div class="navbar-header">
        <a class="navbar-brand" href="#">Bitcoin Exlporation</a>
      </div>
    </nav>
    <div id="content">
      <myRank id="rank-container"></myRank>
      <myGlyph id="glyph-container"></myGlyph>
      <!-- <myGraph id="load-balance-container"></myGraph> -->
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

    var self = this

    sendTest()
    sendAddress()

    function sendAddress () {
      var constraint = {}
      var formData = new URLSearchParams();
      constraint['address'] = '1DUMifqLdCRvx6tAzafwDC2tKRntRAAm3z';
      constraint = JSON.stringify(constraint)      
      formData.append('constraint', constraint)
      sendUrl ('searchAddress', formData, 'address')
    }

    function sendTest () {
      var constraint = {}
      var formData = new URLSearchParams();
      constraint = JSON.stringify(constraint)      
      formData.append('constraint', constraint)
      sendUrl ('ws', formData, 'test')
    }

    function sendUrl (Url, formData, v_id){
      Url='http://127.0.0.1:22068/'+Url
      console.log('Request: ', Url)
      self.$api.post(Url,formData, d => {
        console.log('success: ', d)
        
      })
    }   
       
        
        
    var max_round = 15, n_nodes = 64 

    //var min_workload, max_worload;
    var nodes = [], max_nodes = [], links = [], dists = [], transfers = []
    //var transfer_json = {}, dist_json = {};

    var dir = "static/resource/data"+n_nodes+"_2/"

    d3.csv(dir + "block_dist.csv", function (error, data_d1) {
      if (error) throw error;

      data_d1.forEach(function (d, i) {
        if (+d.round <= max_round) {
          dists.push({
            "name": +d.name,
            "blockid": +d.blockid,
            "isLocal": +d.isLocal,
            "workload": +d.wl,
            "estWorkload": +d.estWl,
            "round": +d.round
          })
/*
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
            "isLocal": d.isLocal,
            "workload": d.workload,
            "estWorkload": d.estWorkload
          })
*/
        }
      });

      
      d3.csv(dir + "block_transfer.csv", function (error, data_t1) {
        if (error) throw error;

        data_t1.forEach(function (d, i) {
          if (+d.round < max_round) {
            transfers.push({
              "source": +d.source,
              "target": +d.target,
              "blockid": +d.blockid,
              "isLocal": +d.isLocal,
              //"count": +d.count,
              "round": +d.round
            })
          }
        });

          d3.csv(dir + "nodes.csv", function (error, data2) {
            if (error) throw error;

            var node_json = {};
            data2.forEach(function (d, i) {
              if (+d.round <= max_round) {
                //count++;
                nodes.push({ 
                  "name": +d.name,
                  "count": +d.count,
                  "localCount": +d.localCount,
                  "workload": +d.workload,
                  "estWorkload": +d.estWorkload,
                  "npts": +d.npts,
                  "nfdpts": +d.nfdpts,
                  "round": +d.round 
                });

                if(!node_json[d.round]) node_json[+d.round] = []
                node_json[+d.round].push({
                   // "index": d.index,
                   "name": +d.name,
                   "count": +d.count,
                   "localCount": +d.localCount,
                   "workload": +d.workload,
                   "estWorkload": +d.estWorkload,
                   "npts": +d.npts,
                   "nfdpts": +d.nfdpts,
                   "round": +d.round 
                })
              }
            })

            for (var i = 0; i < max_round; i ++) {
              node_json[parseInt(i)+1].sort(function (a, b) {
                return b["workload"] - a["workload"];
              });

              max_nodes.push({"round": node_json[parseInt(i)+1][0].round, "name": node_json[parseInt(i)+1][0].name});
            }

            console.log(max_nodes)

            d3.csv(dir + "links.csv", function (error, data3) {
              if (error) throw error;

              var link_json = {}
              data3.forEach(function (d) {
                if (+d.round < max_round) {
                  links.push({
                    "source": +d.source,
                    "target": +d.target,
                    "value": +d.value,
                    "count": +d.count,
                    "round": +d.round
                  });
                }
              });

              self.setGraphData({'nodes': nodes, 
                                 'max_nodes': max_nodes,
                                 'links': links, 
                                 'dists': dists,
                                 'transfers': transfers
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
