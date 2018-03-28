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
    //console.log("map loading.....")
    
  },
  computed: {
      ...mapGetters({
        graphData: 'getGraphData'
      }),
  },
  watch: {
    graphData: function(data) {
      //console.log('graphData: ', data['nodes'][0])
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
      
      var changeData=[]
      //console.log('processData:', processData)
      for(var index in processData){
        var record= processData[index];
        record['processId'] = index
        changeData.push(record)
      }
      //console.log('processData:', changeData)
      return changeData
      
    },
    drawBarchart(data){

      data.sort(function(a,b){
        return b.workload-a.workload
      })
      var containerWidth = +$('#rank-bar').width()
      var containerHeight = +$('#rank-bar').height()

      var margin = {top: 10, right: 20, bottom: 20, left: 20},
          width = containerWidth - margin.left - margin.right,
          height = containerHeight - margin.top - margin.bottom;
      var barHeight = height/(data.length*1.1)
      // Parse the date / time
      var parseDate = d3.time.format("%Y-%m").parse;

      var x = d3.scale.linear().range([0, width]);

      var y = d3.scale.ordinal().rangePoints([0, height]);

      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom")
          .tickFormat(d3.time.format("%Y-%m"));

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left")
          .ticks(10);

      var rankSvg = d3.select("#rank-bar").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", 
                "translate(" + margin.left + "," + margin.top + ")");

      x.domain([0, d3.max(data, function(d) { return d.workload; })]);
      y.domain(data.map(function(d){ return d.processId}))

      //console.log('x:', x.domain())

      rankSvg.append("g")
           .attr("class", "y axis")
           .call(yAxis)
         .append("text")
           .attr("transform", "rotate(-90)")
           .attr("y", 6)
           .attr("dy", ".71em")
           .style("text-anchor", "end")
           //.text("Value ($)");

       var bars = rankSvg.selectAll("bar")
           .data(data)
         .enter().append("rect")
           .style("fill", "grey")
           .attr("y", function(d,i) { return y(d.processId)-barHeight/2; })
           .attr("width", function(d){return x(d.workload)})
           .attr("x", 0)
           .attr("height", barHeight);

       bars.append("text")
                   .attr("class", "value")
                   .attr("y", function(d,i) { return y(d.processId)-barHeight/2;})
                   .attr("dx", 2) //margin right
                   .attr("dy", ".35em") //vertical align middle
                   .attr("text-anchor", "end")
                   .text(function(d){
                       return (d.workload);
                   })
                   .attr("x", function(d){
                       var width = this.getBBox().width;
                       return Math.max(width + 2, y(d.processId));
                   });

      // var barWidth = containerHeight/(data.length*1.1)
      // var x = d3.scale.linear()
      //     .domain([0, d3.max(data.map(function(d){return d['workload']}))])
      //     .range([0, containerWidth]);

      // console.log('containerHeight:', containerHeight)
      // console.log('barWidth:',barWidth)

      // d3.select("width")
      //   .selectAll("div")
      //     .data(data)
      //   .enter().append("div")
      //     .style("width", function(d) { return x(d.workload) + "px"; })
      //     .style("height", barWidth + "px")
      //     .text(function(d) { return d.workload; });
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
    left: 0%;
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
