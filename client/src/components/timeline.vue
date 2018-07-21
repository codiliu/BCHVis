<template>
  <div id="view">
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
let d3 = require('d3')
import config from '../commons/config'
import $ from 'jquery'
//import d3 from 'd3'

import d3Tip from 'd3-tip'
//import d3Tip from '../../plugins/d3.tip.js'

export default {
  data() {
    return {
      address: null,
      tx_index: null
    }
  },
  mounted() {
    // let path = '../../static/resource/bitcoin.json'
    // let self = this
    // d3.json(path, function(err, data) {
    //   self.process(data['txData'])
    // })
    //console.log(d3.version)
   // this.drawBarChart();  

  },
  computed: {
    ...mapGetters({
      addrData: 'getAddrData',
      newAddress: 'getNewAddress'
    })
  },
  watch: {
    addrData: function(allData) {
      var self = this


      // console.log('newAddress1:', self.newAddress)
      console.log('allData:', allData)
      var newAddress = self.newAddress

      // $('#title_left').text('#TXS: '+ allData[newAddress]['txData']['n_tx'])
      // $('#title_middle').text('#ADDRS: '+ allData[newAddress]['addrData'].length)
      
      

      var txData = allData[newAddress]['txData']
      var addrData = allData[newAddress]['addrData']


     // console.log('d3', d3.version)

      
      // console.log(self.newAddress)


      var data=[]


      txData['txs'].forEach(tx=>{
        data.push({time: tx.time*1000, value: tx.in_value, addr: tx.inputs.length+tx.outputs.length})
      })
      

      console.log('timeline:', txData)
      console.log('timeline:', data)

      self.drawBarChart(data);  
     
      
    },
    newAddress: function(data) {
      this.address = data
      console.log('newAddress:', data)
    }
  },
  methods: {
    ...mapActions(['setTimeRange']),
    drawBarChart(data){
      var self=this
      $("#view").empty()
      // Define some sample data
      // console.log(d3.version) 
      // var data = [
      //   { value: 99, time: 'Mon' },
      //   { value: 63, time: 'Tues' },
      //   { value: 41, time: 'Wed' },
      //   { value: 100, time: 'Thur' },
    
      // ];
      // set the dimensions and margins of the graph
      var margin = {top: 20, right: 20, bottom: 20, left: 40},
          // width = $('#view').width() - margin.left - margin.right,
          // height = $('#view').height() - margin.top - margin.bottom;
          width = $('#view').width(),
          height = $('#view').height();

          // var margin = {top: 20, right: 20, bottom: 30, left: 40},
          //     width = 960 - margin.left - margin.right,
          //     height = 500 - margin.top - margin.bottom;
      // parse the date / time
      var parseTime = d3.timeParse("%d-%b-%y");

      window.d3=d3
      // set the ranges
      var x = d3.scaleTime().range([0, width]);
      var y1 = d3.scaleLog().range([height/2, 0]).base(10);
      //var y2 = d3.scaleLog().range([0, height/2]);

      var y2 = d3.scaleLinear().range([0, height/2]);


      var svg = d3.select("#view").append("svg")
          .attr("width", width )
          .attr("height", height )
        .append("g")
          .attr("transform", 
                "translate(" + margin.left + "," + margin.top + ")");

      // Get the data
     // d3.csv("data.csv", function(error, data) {
       // if (error) throw error;

        // format the data
        data.forEach(function(d) {
            d.time = d.time;
            d.value = +d.value;
        });

        console.log('data:', data)
        // Scale the range of the data

        var burshRange = d3.extent(data, function(d) { return d.time; })

        burshRange[0] = parseInt(burshRange[0]/(24*3600*1000))*24*3600*1000

        burshRange[1] = parseInt(burshRange[1]/(24*3600*1000))*24*3600*1000 + 24*3600*1000

        console.log('burshRange:', burshRange)

        x.domain(burshRange);
        y1.domain([10, d3.max(data, function(d) { return d.value; })]);
        y2.domain([0, d3.max(data, function(d) { return d.addr; })]);

        //console.log(d3Tip)


        var formatTime = d3.timeFormat("%Y/%m/%d %H:%M");;

        var tip = d3Tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html(function(d) {
            return "<strong>Time: </strong> <span style='color:red'>" + formatTime(d.time) + "</span><br><strong>Tx volume: </strong> <span style='color:red'>" + d.value + "</span><br><strong>#Addr:</strong> <span style='color:red'>" + d.addr + "</span>";
            // "<strong>Frequency:</strong> <span style='color:red'>" + d + "</span>";
          })

        svg.call(tip)
        // var tip = d3Tip().attr('class', 'd3-tip').html(function(d) { 
        //   console.log(d)
        //   return "dwwqe"; 
        // });


          

          // var div = d3.select("#view").append("div")
          //     .attr("class", "tooltip")
          //     .style("opacity", 0);

          svg.selectAll(".bar1")
              .data(data)
            .enter().append("rect")
              .attr("class", "bar1")
              .attr("x", function(d) { return x(d.time); })
              .attr("width", 3)
              .attr("y", function(d) { return y1(d.value); })
              .attr("height", function(d) { return height/2 - y1(d.value); })
              .on('mouseover', tip.show)
              .on('mouseout', tip.hide);
              // .on("mouseover", function(d) {
              //        div.transition()
              //          .duration(200)
              //          .style("opacity", .9);
              //        div.html(formatTime(d.time) + "<br/>" + d.close)
              //          .style("left", (d3.event.pageX) + "px")
              //          .style("top", (d3.event.pageY - 28) + "px");
              //        })
              //      .on("mouseout", function(d) {
              //        div.transition()
              //          .duration(500)
              //          .style("opacity", 0);
              //        });
              // .on('mouseover', function(d){
              //   console.log(d)
              //   //   
              // })
              // .on('mouseout', function(d){
              //   // tip.hide()
              // })


        svg.selectAll(".bar2")
            .data(data)
          .enter().append("rect")
            .attr("class", "bar2")
            .attr("x", function(d) { return x(d.time); })
            .attr("width", 3)
            .attr("y", function(d) { return height/2; })
            .attr("height", function(d) { return  Math.max(y2(d.addr), 5); console.log(Math.max(y2(d.addr), 5));  })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);
        // Add the X Axis

        var timeFormatYear = d3.timeFormat("%Y");
        var timeFormatMonth = d3.timeFormat("%m/%d");
        var timeFormatDay = d3.timeFormat("%d %H:%M");
        var timeFormatHour = d3.timeFormat("%H:%M");

        var all = d3.timeFormat("%Y/%m/%d");

        var xAxis=d3.axisBottom(x)
                    .tickFormat((d,i)=>{
                      // return all(d)
                      var ticks = xAxis.scale().ticks();
                      
                      if (i == 0) {
                                            //i==1||i==ticks.length-2
                        return timeFormatYear(d)
                                                //return ""
                      } else {
                      if (d.getFullYear() - ticks[i - 1].getFullYear() != 0) {
                        return timeFormatYear(d);
                      } else if (d.getMonth() - ticks[i - 1].getMonth() != 0) {
                        return timeFormatMonth(d);
                      } else if (d.getDay() - ticks[i - 1].getDay() != 0) {
                        return timeFormatMonth(d);
                      } else {
                        return timeFormatHour(d);
                        }
                      }
                    })

        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height/2 + ")")
            .call(xAxis)
            .selectAll("text")  
              .style("text-anchor", "middle")
              .attr("dx", "-.8em")
              .attr("dy", ".45em")
              //.attr("transform", "rotate(-65)");

        var yAxis1=d3.axisLeft(y1)
                    .ticks(7, ",.1s")

        svg.append("g")
            .attr("class", "axis")
           
            .call(yAxis1);

        var yAxis2=d3.axisLeft(y2)
                     .ticks(5)

        svg.append("g")
            .attr("transform", "translate(0," + height/2 + ")")
            .attr("class", "axis")
            .call(yAxis2);

      var brush = d3.brushX()
          .extent([[0, 0], [width, height/2-10]])
          .on('start brush', brushOn)
          .on('end', brushEnd)
          // .on("start brush end", brushmoved);

      var gBrush = svg.append("g")
          .attr("class", "brush")
          .call(brush);



      // style brush resize handle
      // https://github.com/crossfilter/crossfilter/blob/gh-pages/index.html#L466



      // var brushResizePath = function(d) {
      //     var e = +(d.type == "e"),
      //         x = e ? 1 : -1,
      //         y = height/4;
      //     return "M" + (.5 * x) + "," + y + "A6,6 0 0 " + e + " " + (6.5 * x) + "," + (y + 6) + "V" + (2 * y - 6) + "A6,6 0 0 " + e + " " + (.5 * x) + "," + (2 * y) + "Z" + "M" + (2.5 * x) + "," + (y + 8) + "V" + (2 * y - 8) + "M" + (4.5 * x) + "," + (y + 8) + "V" + (2 * y - 8);
      // }



      // var handle = gBrush.selectAll(".handle--custom")
      //   .data([{type: "w"}, {type: "e"}])
      //   .enter().append("path")
      //     .attr("class", "handle--custom")
      //     .attr("stroke", "#000")
      //     .attr("cursor", "ew-resize")
      //     .attr("d", brushResizePath);

      gBrush.call(brush.move, [0.3, 0.5].map(x));


      var extent

      function brushOn() {
        // console.log(321321,d3.event.selection)

        extent = d3.event.selection

        // if (extent == null) {
        //   handle.attr("display", "none")
        // } else {
        //   handle.attr("display", null).attr("transform", function(d, i) { return "translate(" + [ extent[i], - innerHeight] + ")"; });
        // }
        var s = d3.event.selection;
        if (s == null) {
          //handle.attr("display", "none");
          // circle.classed("active", false);
        } else {
          var sx = s.map(x.invert);
          // circle.classed("active", function(d) { return sx[0] <= d && d <= sx[1]; });
          //handle.attr("display", null).attr("transform", function(d, i) { return "translate(" + [ s[i], - height / 4] + ")"; });
        }
      }

      function brushEnd() {
        console.log(d3.event.sourceEvent)
        if (!d3.event.sourceEvent) return; // Only transition after input.
        // if (!d3.event.selection) return; // Ignore empty selections.
        if (d3.event.sourceEvent.type === 'end')
          return
        if(extent[0] == extent[1]){
          if(false){
            handle.attr("display", "none")
          }
          else{
            for(let d of data){
              if(extent[0] < x(d.x2) && extent[0] > x(d.x1)){
                brush_g.transition()
                  .duration(duration).call(brush.move, [d.x1, d.x2].map(x))
                extent = [d.x1, d.x2].map(x)
                break
              }
            }
          }
        }
        let xExtent = extent.map(x.invert)
        xExtent=[xExtent[0].getTime()/1000, xExtent[1].getTime()/1000]

        // xExtent)=d3.extent(data, function(d) { return d.time; })

        // console.log(xExtent)
        // console.log(console.log(xExtent))

        if(xExtent[0]==xExtent[1]){
          xExtent=d3.extent(data, function(d) { return d.time; })
          console.log(burshRange)
          xExtent=[burshRange[0]/1000, burshRange[1]/1000]
        }
        
        self.setTimeRange(xExtent)
       
        //console.log('xExtent:', xExtent)
      }

      

      // function brushmoved() {
      //   var s = d3.event.selection;
      //   if (s == null) {
      //     handle.attr("display", "none");
      //     // circle.classed("active", false);
      //   } else {
      //     var sx = s.map(x.invert);
      //     // circle.classed("active", function(d) { return sx[0] <= d && d <= sx[1]; });
      //     handle.attr("display", null).attr("transform", function(d, i) { return "translate(" + [ s[i], - height / 4] + ")"; });
      //   }
      // }



      // // set the ranges
      // var x = d3.scaleBand()
      //           .range([0, width])
      //           .padding(0.1);

      // var y = d3.scaleLinear()
      //           .range([height, 0]);
                
      // var svg = d3.select("#view").append("svg")
      //     .attr("width", width + margin.left + margin.right)
      //     .attr("height", height + margin.top + margin.bottom)
      //   .append("g")
      //     .attr("transform", 
      //           "translate(" + margin.left + "," + margin.top + ")");

 
      //   x.domain(data.map(function(d) { return d.time; }));
      //   y.domain([0, d3.max(data, function(d) { return d.value; })]);

      //   svg.selectAll(".bar")
      //       .data(data)
      //     .enter().append("rect")
      //       .attr("class", "bar")
      //       .attr("x", function(d) { return x(d.time); })
      //       .attr("width", x.bandwidth())
      //       .attr("y", function(d) { return y(d.value); })
      //       .attr("height", function(d) { return height - y(d.value); });

      //   svg.append("g")
      //       .attr("transform", "translate(0," + height + ")")
      //       .call(d3.axisBottom(x));

      //   svg.append("g")
      //       .call(d3.axisLeft(y));

 

    }
    // submit: function(data) {
    //   console.log(data)
    // },
    // process: function(data) {
    //   let self = this
    //   let txs = data['txs']
    //   let address = data['address']
    //   txs.forEach(tx => {
    //     tx.date = new Date(tx.time * 1000)
    //     tx.inputs.sort((a, b) => {
    //       return a.value - b.value
    //     })
    //     tx.input_value = d3.sum(tx.inputs, v => v.value)
    //     tx.inputs.forEach(input => {
    //       input.all_value = tx.input_value
    //       input.before_value = s
    //     })
    //     let s = 0
    //     for (let i = 0; i < tx.inputs.length; i++) {
    //       tx.inputs[i].before_value = s
    //       s = s + tx.inputs[i].value
    //     }
    //     tx.outputs.sort((a, b) => {
    //       return a.value - b.value
    //     })
    //     tx.output_value = d3.sum(tx.outputs, v => v.value)
    //     tx.outputs.forEach(output => {
    //       output.all_value = tx.output_value
    //       output.before_value = s
    //     })
    //     s = 0
    //     for (let i = 0; i < tx.outputs.length; i++) {
    //       tx.outputs[i].before_value = s
    //       s = s + tx.outputs[i].value
    //     }

    //   })
    //   let balances = []
    //   txs.sort((a, b) => {
    //     return a.time - b.time
    //   })

    //   let x = 0
    //   txs.forEach(tx => {
    //     tx['inputs'].forEach(input => {
    //       if (input['addr'] == address) {
    //         x = x - input['value']
    //       }
    //     })
    //     tx['outputs'].forEach(out => {
    //       if (out['addr'] == address) {
    //         x = x + out['value']
    //       }
    //     })
    //     balances.push({ 'value': x + 1, date: tx.date })
    //   })
    //   console.log(balances)

    //   var W = $('#view').width(),
    //     H = $('#view').height()
    //   var svg = d3.select("#view").append('svg').attr('width', W).attr('height', H),
    //     margin = { top: 20, right: 20, bottom: 25, left: 50 },
    //     width = +svg.attr("width") - margin.left - margin.right,
    //     height = +svg.attr("height") - margin.top - margin.bottom,
    //     g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //   var parseTime = d3.timeParse("%d-%b-%y");
    //   var xscale = d3.scaleTime()
    //     .rangeRound([0, width]);

    //   var yscale = d3.scaleLog()
    //     .range([height, 0]);

    //   var line = d3.line()
    //     .x(function(d) { return xscale(d.date); })
    //     .y(function(d) { return yscale(d.value); })


    //   xscale.domain(d3.extent(balances, v => v.date)).nice()
    //   yscale.domain(d3.extent(balances, v => v.value))
    //   var superscript = "⁰¹²³⁴⁵⁶⁷⁸⁹",
    //     formatPower = function(d) { return (d + "").split("").map(function(c) { return superscript[c]; }) }

    //   g.append("g")
    //     .attr("class", "axis")
    //     .attr("transform", "translate(0," + height + ")")
    //     .call(d3.axisBottom(xscale).tickSize(2).tickFormat(d3.timeFormat("%Y-%m-%d")).ticks(7))


    //   g.append("g")
    //     .attr("class", "axis")
    //     .call(d3.axisLeft(yscale).tickSize(2).ticks(10, function(d) {
    //       let t = (10 + formatPower(Math.round(Math.log(d) / Math.LN10))).split(',')
    //       let tk = ''
    //       for (let i in t) {
    //         tk = tk + t[i]
    //       }
    //       return tk
    //     }))

    //   var brush = d3.brushX()
    //     .extent([
    //       [0, 0],
    //       [width, height]
    //     ])
    //     .on("end", brushmoved)

    //   var gBrush = g.append("g")
    //     .attr("class", "brush")
    //     .call(brush)

    //   function brushmoved() {
    //     var s = d3.event.selection;
    //     if (s == null) {
    //     } else {
    //       var sx = s.map(xscale.invert);
    //       console.log(sx)
    //     }
    //   }
    //   // .append("text")
    //   // .attr("fill", "#000")
    //   // .attr("transform", "rotate(-90)")
    //   // .attr("y", 6)
    //   // .attr("dy", "0.71em")
    //   // .attr("text-anchor", "end")


    //   g.append("path")
    //     .datum(balances)
    //     .attr("fill", "none")
    //     .attr("stroke", "steelblue")
    //     .attr("stroke-linejoin", "round")
    //     .attr("stroke-linecap", "round")
    //     .attr("stroke-width", 1.5)
    //     .attr("d", line);

    //   console.log(txs)
    //   let glyphg = g.selectAll('.glyph')
    //     .data(txs)
    //     .enter()
    //     .append('g')
    //     .attr('class', 'glyph')
    //     .attr('transform', function(d, i) {
    //       let x = xscale(balances[i].date)
    //       let y = yscale(balances[i].value)
    //       return 'translate(' + x + ',' + y + ')'
    //     })

    //   let rscale = d3.scaleLog().domain([1, 100]).range([1, 12])
    //   // let density = d3.scaleLog().domain([1, 1e8]).range([0.1, 1])
    //   let density = d3.scaleLinear().domain([1, 1e9]).range(['#fcfbfd', '#3f007d'])
    //   let R = 8 // fixed tx r

    //   let densityColor = '#54278f'

    // }
  },

}

</script>
<style scoped>
#view {
  position: absolute;
  width: 100%;
  height: 100%;
  /*overflow: scroll;*/
}

.bar-line {
  fill: #F38630;
}
.domain,
.tick,
.tick line {
  stroke: #62D2E7;
}
.bar1  {
  fill: #acf;
  stroke: #acf;
}
rect  {
  fill: #acf;
  stroke: #acf;
    /*fill: steelblue;*/
  /*stroke: steelblue;*/
}
.highlight {}

.axis text {
  font: 13px "helvetica neue";
}

.d3-tip {
  line-height: 1;
  font-weight: bold;
  padding: 12px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  border-radius: 2px;
}

/*div.tooltip {
  position: absolute;
  text-align: center;
  width: 60px;
  height: 28px;
  padding: 2px;
  font: 12px sans-serif;
  background: lightsteelblue;
  border: 0px;
  border-radius: 8px;
  pointer-events: none;
}*/
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

</style>
