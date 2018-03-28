<template>
  <div id="app">
    <nav class="navbar navbar-default" role="navigation">
      <div class="navbar-header">
        <a class="navbar-brand" href="#">Interactive Visualizing the Dynamic Load Balancing in Parallel Particle Tracing</a>
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

    var self = this

    var max_round = 15, n_nodes = 32, n_nodes_ratio = 0.5; // 0.15 for 64 nodes

    //var min_workload, max_worload;
    var nodes = [], links = []
    var transfer_json = {}, dist_json = {};

    var max_wl = [], min_wl = [];
    var max_est_wl = [], min_est_wl = [];
    var max_wl_estWl_diff = [], min_wl_estWl_diff = [];

    var min_all_npts, max_all_npts;
    var min_npts, max_npts;
    var min_nfdpts, max_nfdpts;
    var min_nufdpts, max_nufdpts;
    var min_value, max_value;
    var min_link_count, max_link_count;

    var no = "";
    var dir = "static/resource/data"+n_nodes+"_2/"

    d3.csv(dir + "block_dist" + no + ".csv", function (error, data_d1) {
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

      
      d3.csv(dir + "block_transfer" + no + ".csv", function (error, data_t1) {
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

          d3.csv(dir + "nodes" + no + ".csv", function (error, data2) {
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

            for (var i = 0; i < max_round; i++) {
              min_wl[i] = 1000000000;
              max_wl[i] = 0;

              min_est_wl[i] = 1000000000;
              max_est_wl[i] = 0;

              min_wl_estWl_diff[i] = 1000000000;
              max_wl_estWl_diff[i] = 0;

              nodes.forEach(function (d, j) {
                if (d.round == i + 1) {
                  min_wl[i] = Math.min(min_wl[i], parseInt(d.workload))
                  max_wl[i] = Math.max(max_wl[i], parseInt(d.workload))

                  min_est_wl[i] = Math.min(min_est_wl[i], parseInt(d.estWorkload))
                  max_est_wl[i] = Math.max(max_est_wl[i], parseInt(d.estWorkload))

                  min_wl_estWl_diff[i] = Math.min(min_wl_estWl_diff[i], Math.abs(parseInt(d.workload) - parseInt(d.estWorkload)))
                  max_wl_estWl_diff[i] = Math.max(max_wl_estWl_diff[i], Math.abs(parseInt(d.workload) - parseInt(d.estWorkload)))
                }
              });
            }
            min_npts = d3.min(nodes, function (d) { return d.npts });
            max_npts = d3.max(nodes, function (d) { return d.npts });
            min_nfdpts = d3.min(nodes, function (d) { return d.nfdpts });
            max_nfdpts = d3.max(nodes, function (d) { return d.nfdpts });
            min_nufdpts = d3.min(nodes, function (d) { return d.npts - d.nfdpts });
            max_nufdpts = d3.max(nodes, function (d) { return d.npts - d.nfdpts });
            //compute = d3.interpolate(a, b);

            d3.csv(dir + "links" + no + ".csv", function (error, data3) {
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

              min_value = d3.min(links, function (d) {
                return d.value;
              });
              max_value = d3.max(links, function (d) {
                return d.value;
              });

              min_link_count = d3.min(links, function (d) {
                return d.count;
              });
              max_link_count = d3.max(links, function (d) {
                return d.count;
              });

              self.setGraphData({'nodes': nodes, 
                                 'links': links, 
                                 'min_value': min_value,
                                 'max_value': max_value,
                                 'min_link_count': min_link_count,
                                 'max_link_count': max_link_count,
                                 'min_nufdpts': min_nufdpts,
                                 'max_npts': max_npts,
                                 'max_wl_estWl_diff': max_wl_estWl_diff,
                                 'min_wl_estWl_diff': min_wl_estWl_diff,
                                 'min_wl': min_wl,
                                 'max_wl': max_wl,
                                 'min_nfdpts': min_nfdpts,
                                 'max_nfdpts': max_nfdpts,
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
