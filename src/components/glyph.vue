<template>
  <div id='glyphContainer' ref="glyphContainer">
    <div id="workloadDiv">
    </div>
    <div id="blockDiv">
    </div>
  </div>
</template>
<script>
// import Map from '../charts/MapView'
import '../../node_modules/bootstrap/dist/css/bootstrap.css'
import '../../node_modules/bootstrap-vue/dist/bootstrap-vue.css'
import BootstrapVue from 'bootstrap-vue'
import d3Tip from 'd3-tip'
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
      })
  },
  watch: {
    graphData: function(data) {
      var maxRound = d3.max(data['nodes'], function(d){ return d.round})
      // var selectRound = []
      // for(var i=0;i<=maxRound;i++){
      //   selectRound[i]=0
      // }
      var self = this
      var workloadData = this.extractProcess(data['nodes'], 'workload')
      var blockData = this.extractProcess(data['nodes'], 'count')

      var colorScale
      for(var i=0; i<workloadData.length; i++){
        var data = workloadData[i]
        var minValue = d3.min(data, function(d) { return d['workload']; })
        var maxValue = d3.max(data, function(d) { return d['workload']; })

        colorScale = d3.scale.linear().domain([minValue, maxValue])
              .interpolate(d3.interpolateHcl)
              .range([d3.rgb("green"), d3.rgb('red')]);
        for(var j=0;j<workloadData[i].length;j++){
          workloadData[i][j]['color'] = colorScale(workloadData[i][j]['workload'])
          blockData[i][j]['color'] = colorScale(workloadData[i][j]['workload'])
        }
      }

      this.drawGlyph(workloadData, '#workloadDiv', 'workload')
      this.drawGlyph(blockData, '#blockDiv', 'count')
    }
  },
  methods: {
    ...mapActions(['setSelectRound']),
    extractProcess(data, keyValue){
     // console.log(data[0])
      var processData={}
      data.forEach(function(d){
        if(!processData[d['round']])  processData[d['round']]=[]
        var re = {}
        re['name'] = d['name']
        re[keyValue] = +d[keyValue]
        processData[d['round']].push(re)
      })
      var filterData=[]
      for(var index in processData){
        processData[index].sort(function(a,b){
          return a.name-b.name
        })
        filterData.push(processData[index])
      }
     //   .log('filterData:', filterData)
      return filterData
    },
    drawGlyph(data, divClass, keyValue){
      var self = this
      var maxKey = 0
      for(var index in data){
        maxKey = Math.max(maxKey, d3.max(data[index], function(d) { 
          return d[keyValue]; 
        }))
      }

      var clientWidth = +$(divClass).width(),
          clientHeight = +$(divClass).height(),
          len = data.length,
          width = clientWidth,
          height = clientHeight/len,
          radius = Math.min(width, height) / 2
      

      d3.select(divClass)
        .selectAll("div")
          .data(data)
        .enter().append("div")
          .attr("class", keyValue+"Class")
          .attr("id", function(d, i){ return keyValue + i })
          .style("height", height+"px")
          .style("width", width)
  
      var innerRadius = 0.3 * radius

      var pie = d3.layout.pie()
          .sort(null)
          .value(function(d) { 
            return d[keyValue]; 
          });
      var allData = data
      for(var i=0; i<allData.length; i++){
        var data = allData[i]
        var maxValue = d3.max(data, function(d) { return d[keyValue]; })
        

        var tip = d3Tip()
          .attr('class', 'd3-tip')
          .offset([0, 0])
          .html(function(d) {
            return "processId: "+d.data.name+"<br>"+ keyValue + ": " + d.data[keyValue] + "";
            //return "workload" + ": <span style='color:orangered'>" + d.data.workload + "</span>";
          });


        var arc = d3.svg.arc()
          .innerRadius(innerRadius)
          .outerRadius(function (d) { 
            return (radius - innerRadius) * (d.data[keyValue] / maxValue) + innerRadius; 
          });

        var outlineArc = d3.svg.arc()
                .innerRadius(innerRadius)
                .outerRadius(radius);

        var svg = d3.select("#"+keyValue+i).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        svg.call(tip);

        var path = svg.selectAll(".solidArc")
             .data(pie(data))
           .enter().append("path")
             .attr("class", "solidArc")
             .attr("stroke", "gray")
             .attr("d", arc)
             .style("fill", function(d){
                //console.log(d.data)
                return d.data['color'];
             })
             .on('mouseover', function(d){
                d3.select(this).attr('cursor', 'pointer')
                tip.show(d, this)
              })
             .on('mouseout', function(d){ tip.hide(d, this) });

        d3.selectAll('.workloadClass').style('background', "rgb(255, 255, 255) none repeat scroll 0% 0% / auto padding-box border-box")


        var selectRound =[]
        d3.selectAll('.workloadClass')
          .on('mouseover', function(d){
            d3.select(this).style('cursor', 'pointer')
          })
          .on('click', function(){
            

            var roundID = d3.select(this).attr("id")
            var round = parseInt(roundID.split('d')[1])+1
            console.log('round: ', round)

            if(d3.select(this).style("background")=="rgb(255, 255, 255) none repeat scroll 0% 0% / auto padding-box border-box"){
              d3.select(this)
                .style('background', '#e0dbdb')

              d3.select('#count'+(round-1))
                .style('background', '#e0dbdb')

              selectRound.push(round)
              // selectRound[round] = 1
            }
            else{
              d3.select(this)
                .style('background', "rgb(255, 255, 255) none repeat scroll 0% 0% / auto padding-box border-box")
              
              d3.select('#count'+(round-1))
                .style('background', "rgb(255, 255, 255) none repeat scroll 0% 0% / auto padding-box border-box")

              selectRound.splice(selectRound.indexOf(round),1)
              // selectRound[round] = 0
            }
           
            self.setSelectRound(selectRound)
          })


          d3.selectAll('.countClass')
            .on('mouseover', function(d){
              d3.select(this).style('cursor', 'pointer')
            })
            .on('click', function(){
              var roundID = d3.select(this).attr("id")
              var round = parseInt(roundID.split('t')[1])+1
              console.log('round: ', round)

              if(d3.select(this).style("background")=="rgb(255, 255, 255) none repeat scroll 0% 0% / auto padding-box border-box"){
                d3.select(this)
                  .style('background', '#e0dbdb')

                d3.select('#workload'+(round-1))
                  .style('background', '#e0dbdb')

                selectRound.push(round)
              }
              else{
                d3.select(this)
                  .style('background', "rgb(255, 255, 255) none repeat scroll 0% 0% / auto padding-box border-box")
                
                d3.select('#workload'+(round-1))
                  .style('background', "rgb(255, 255, 255) none repeat scroll 0% 0% / auto padding-box border-box")

                selectRound.splice(selectRound.indexOf(round),1)
              }
              //console.log(selectRound)
              self.setSelectRound(selectRound)
            })

      }
      

    }
  }
}

</script>
<style lang="less">
.d3-tip {
  line-height: 1;
  font-weight: bold;
  padding: 12px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  border-radius: 2px;
}

/* Creates a small triangle extender for the tooltip */
.d3-tip:after {
  box-sizing: border-box;
  display: inline;
  font-size: 10px;
  width: 100%;
  line-height: 1;
  color: rgba(0, 0, 0, 0.8);
  content: "\25BC";
  position: absolute;
  text-align: center;
}

/* Style northward tooltips differently */
.d3-tip.n:after {
  margin: -1px 0 0 0;
  top: 100%;
  left: 0;
}

.axis path,
.axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}

.bar {
  fill: orange;
}

.solidArc:hover {
  stroke: white;
}

.solidArc {
    -moz-transition: all 0.3s;
    -o-transition: all 0.3s;
    -webkit-transition: all 0.3s;
    transition: all 0.3s;
}

.x.axis path {
  display: none;
}

.aster-score { 
  line-height: 1;
  font-weight: bold;
  font-size: 500%;
}

#workloadDiv div {
  font: 10px sans-serif;
  text-align: right;
  padding: 0;
  margin: 0;
  color: white;
  border-bottom: 1.5px solid grey; 
}
#blockDiv div {
  font: 10px sans-serif;
  text-align: right;
  padding: 0;
  margin: 0;
  color: white;
  border-bottom: 1.5px solid grey; 
  
}

#workloadDiv{
  float: left;
  width: 50%;
  height: 100%;
   
}

#blockDiv{
  float: right;
  width: 50%;
  height: 100%;
 
}

</style>
