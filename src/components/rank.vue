<template>
  <div id='rankContainer' ref="rankContainer">
    <div id="rank-control">
      <div id="rank-control-top">
        <div class="checkbox" id="checkbox-left">
          <label><input type="checkbox" value="">Workload</label>
        </div>
        <div class="checkbox" id="checkbox-right">
          <label><input type="checkbox" value="">Block</label>
        </div>
      </div>
      <div id="rank-control-bottom">
      </div>
    </div>
    <div id="rank-bar">
    </div>
  </div>
  
</template>
<script>
// import Map from '../charts/MapView'
import '../../node_modules/bootstrap/dist/css/bootstrap.css'
import '../../node_modules/bootstrap-vue/dist/bootstrap-vue.css'
import BootstrapVue from 'bootstrap-vue'
import { mapActions, mapGetters } from 'vuex'
import $ from 'jquery'
export default {
  components: { },
  data() {
    return {
      // list: []
    }
  },
  mounted() {
    // this.getData();
    console.log("map loading.....")
    
  },
  computed: {
      ...mapGetters({
        graphData: 'getGraphData'
      }),
  },
  watch: {
    graphData: function(data) {
      console.log('graphData: ', data['nodes'][0])
      var processData = this.extractProcess(data['nodes'])
      this.drawBarchart(processData)
    }
  },

  methods: {
    extractProcess(data){
      var processData={}
      data.forEach(function(d){
        if(!processData[d['name']])  processData[d['name']]={'workload':0}
        processData[d['name']]['workload']+=d['workload']
      })
      
      var aa=[]
      for(var index in processData){
        aa.push(processData[index])
      }
      console.log('processData:', aa)
      return aa
      
    },
    drawBarchart(data){
      var containerWidth = +$('#rank-bar').width()
      var containerHeight = +$('#rank-bar').height()

      var barWidth = containerHeight/(data.length*1.1)
      var x = d3.scale.linear()
          .domain([0, d3.max(data.map(function(d){return d['workload']}))])
          .range([0, containerWidth]);

      console.log('containerHeight:', containerHeight)
      console.log('barWidth:',barWidth)

      d3.select("#rank-bar")
        .selectAll("div")
          .data(data)
        .enter().append("div")
          .style("width", function(d) { return x(d.workload) + "px"; })
          .style("height", barWidth + "px")
          .text(function(d) { return d.workload; });
    }
  }
}

</script>
<style lang="less">
  

  #rank-control {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 10%;
    border-bottom: 1px solid grey;
    padding:5px 5px 5px 5px;
    #rank-control-top{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 50%;
      padding:5px 10% 5px 10%;
      #checkbox-left{
        float:left;
      }
      #checkbox-right{
        float:right;
      }
    }
    #rank-control-bottom{
      position: absolute;
      top: 50%;
      left: 0;
      width: 100%;
      height: 50%;
    }
  }
  #rank-bar {
    position: absolute;
    top: 10%;
    left: 00%;
    width: 100%;
    height: 90%;
    padding:5px 5px 5px 5px;
    div {
      font: 10px sans-serif;
      background: steelblue;
      text-align: right;
      padding: 3px;
      margin: 1px;
      color: white;
    }
    
  }


</style>
