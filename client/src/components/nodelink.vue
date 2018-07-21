<template>
  <div id='centerContainer' ref="tableContainer">
    

  </div>
</template>
<script>
import '../../node_modules/bootstrap/dist/css/bootstrap.css'
import '../../node_modules/bootstrap-vue/dist/bootstrap-vue.css'

window.$ = window.jQuery = require('jquery');

import d3Tip from 'd3-tip'
let d3 = require('d3')

import cola from '../../plugins/cola.min.js'
import { mapActions, mapGetters } from 'vuex'
import $ from 'jquery'

import DataTable from 'datatables'
export default {
  components: { },
  data() {
    return {
      // list: []
    }
  },
  mounted() {
    console.log('enter node link')
    console.log(cola)
  },
  computed: {
      ...mapGetters({
        addrData: 'getAddrData',
        newAddress: 'getNewAddress',
        timeRange: 'getTimeRange'
      })
  },
   watch: {
    addrData: function(allData) {
      var self = this
      var newAddress = self.newAddress
      var txData = allData[newAddress]['txData']
      var addrData = allData[newAddress]['addrData']

      var graphAddr=self.processDataAddr(newAddress, addrData) 
      console.log('graphAddr:', graphAddr)
      self.drawGraph(graphAddr)


      console.log('txData: ', txData)
      var graphTx=self.processDataTx(newAddress, txData)
      //self.drawGraph(graphTx)
     //console.log('graphTx:', graphTx)
      // self.drawGraph(graphAddr)

    },
    timeRange: function(timeRange){
      var self=this
      var temp={}
      var newAddress = self.newAddress

      //console.log(self.addrData[newAddress]['txData'])

      self.addrData[newAddress]['txData']['txs'].forEach(function(d){
        if(timeRange[0]<=d.time && d.time<=timeRange[1]){
          d.inputs.forEach(function(index){
            var addr=index['addr']
            if(!temp[addr]) temp[addr]={'addr': addr, 'balance': 0, 'input_n': 0, 'output_n': 0, 'received': 0, 'sent': 0, 'tx_n': 0}
            temp[addr]['sent']+=index['value']
            temp[addr]['input_n']+=1
            temp[addr]['tx_n']+=1
          })

          d.outputs.forEach(function(index){
            var addr=index['addr']
            if(!temp[addr]) temp[addr]={'addr': addr, 'balance': 0, 'input_n': 0, 'output_n': 0, 'received': 0, 'sent': 0, 'tx_n': 0}
            temp[addr]['received']+=index['value']
            temp[addr]['output_n']+=1
            temp[addr]['tx_n']+=1
          })
           
        }
      })

      var addrData=[]
      for(var index in temp){
        temp[index]['balance'] = temp[index]['received']-temp[index]['sent']
        addrData.push(temp[index])
      }

      var graph=self.processDataAddr(newAddress, addrData) 
      self.drawGraph(graph)
      // console.log(addrData)
      // console.log(timeRange)
      // console.log(self.addrData)
    }
  },
  methods: {
    ...mapActions(['setSelectRound', 'setNewAddress']),
    processDataAddr(target, addrData){
      var graph={"nodes":[], "links": []}
      var id=0

      console.log('nodelink: ', addrData)
      addrData.forEach(function(d,i){
        graph['nodes'].push({"addr": d.addr, "name": d.addr.substring(0,3), "id": i, "value": d.value, "txid": d.txid})
        if(d.addr==target) id=i
      })

      addrData.forEach(function(d,i){
        graph['links'].push({"source": id, "target": i})
        
      })
      return graph
    },
    processDataTx(target, txData){
      console.log(11, txData)
      console.log('111', txData)

      var graph={"nodes":[], "links": []}
      var id=0

      var i=1
      txData['txs'].forEach(function(record){
        console.log(record)
        var input_n=record['inputs'].length
        var output_n=record['outputs'].length
        if(true){
          graph['nodes'].push({"addr": 'flag', "name": "flag", "id": i})

          

          var core_id=i

          graph['links'].push({"source": 0, "target": core_id})


          i+=1
          record['inputs'].forEach(function(d){
            graph['nodes'].push({"addr": d.addr, "name": d.addr.substring(0,3), "id": i, "value": d.value, "txid": d.txid})
            graph['links'].push({"source": core_id, "target": i})
            i+=1
          })

          record['outputs'].forEach(function(d){
            graph['nodes'].push({"addr": d.addr, "name": d.addr.substring(0,3), "id": i, "value": d.value, "txid": d.txid})
            graph['links'].push({"source": i, "target": core_id})
            i+=1
          })
          
        }
      })
      return graph
      // console.log('nodelink: ', addrData)
      // addrData.forEach(function(d,i){
      //   graph['nodes'].push({"addr": d.addr, "name": d.addr.substring(0,3), "id": i})
      //   if(d.addr==target) id=i
      // })

      // addrData.forEach(function(d,i){
      //   graph['links'].push({"source": id, "target": i})
        
      // })



    },
    drawTest(graph){
     
          $("#centerContainer").empty()
          const width = $("#centerContainer").width();
          const height = $("#centerContainer").height();

          var color = d3.scaleOrdinal(d3.schemeCategory20);

          var d3cola = cola.d3adaptor(d3)
              .avoidOverlaps(true)
              .size([width, height]);

          var svg = d3.select("#centerContainer").append("svg")
              .attr("width", width)
              .attr("height", height);

          //d3.json("graphdata/chris.json", function (error, graph) {
              d3cola
                  .nodes(graph.nodes)
                  .links(graph.links)
                  .symmetricDiffLinkLengths(10)
                  .start(30);

              svg.append('svg:defs').append('svg:marker')
                  .attr('id', 'end-arrow')
                  .attr('viewBox', '0 -5 10 10')
                  .attr('refX', 6)
                  .attr('markerWidth', 3)
                  .attr('markerHeight', 3)
                  .attr('orient', 'auto')
                .append('svg:path')
                  .attr('d', 'M0,-5L10,0L0,5')
                  .attr('fill', '#000');

              var link = svg.selectAll(".link")
                  .data(graph.links)
                .enter().append("line")
                  .attr("class", "link")
                  .style("stroke-width", function (d) { return Math.sqrt(d.value); });

              var node = svg.selectAll(".node")
                  .data(graph.nodes)
                .enter().append("circle")
                  .attr("class", "node")
                  .attr("r", 5)
                  .style("fill", function (d) { return color(d.group); })
                  .on("click", function (d) {
                      d.fixed = true;
                  })
                  .call(d3cola.drag);

              node.append("title")
                  .text(function (d) { return d.name; });

              d3cola.on("tick", function () {
                  link.attr("x1", function (d) { return d.source.x; })
                      .attr("y1", function (d) { return d.source.y; })
                      .attr("x2", function (d) { return d.target.x; })
                      .attr("y2", function (d) { return d.target.y; });

                  node.attr("cx", function (d) { return d.x; })
                      .attr("cy", function (d) { return d.y; });
              });
          //});


    },
    drawTree(graph){
      $("#centerContainer").empty()
      const width = $("#centerContainer").width();
      const height = $("#centerContainer").height();

      var color = d3.scaleOrdinal(d3.schemeCategory20);

      var d3cola = cola.d3adaptor(d3)
          .avoidOverlaps(true)
          .size([width, height]);

      var svg = d3.select("#centerContainer").append("svg")
          .attr("width", width)
          .attr("height", height);

      //d3.json("graphdata/chris.json", function (error, graph) {
          var nodeRadius = 5;

          graph.nodes.forEach(function (v) { v.height = v.width = 2 * nodeRadius; });

          d3cola
              .nodes(graph.nodes)
              .links(graph.links)
              .flowLayout("y", 50)
              .symmetricDiffLinkLengths(6)
              .start(10,20,20);

          // define arrow markers for graph links
          svg.append('svg:defs').append('svg:marker')
              .attr('id', 'end-arrow')
              .attr('viewBox', '0 -5 10 10')
              .attr('refX', 6)
              .attr('markerWidth', 3)
              .attr('markerHeight', 3)
              .attr('orient', 'auto')
            .append('svg:path')
              .attr('d', 'M0,-5L10,0L0,5')
              .attr('fill', '#000');

          var path = svg.selectAll(".link")
              .data(graph.links)
            .enter().append('svg:path')
              .attr('class', 'link');

          var node = svg.selectAll(".node")
              .data(graph.nodes)
            .enter().append("circle")
              .attr("class", "node")
              .attr("r", nodeRadius)
              .style("fill", function (d) { return color(d.group); })
              .call(d3cola.drag);

          node.append("title")
              .text(function (d) { return d.name; });

          d3cola.on("tick", function () {
              // path.each(function (d) {
              //     if (isIE()) this.parentNode.insertBefore(this, this);
              // });
              // draw directed edges with proper padding from node centers
              path.attr('d', function (d) {
                  var deltaX = d.target.x - d.source.x,
                      deltaY = d.target.y - d.source.y,
                      dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY),
                      normX = deltaX / dist,
                      normY = deltaY / dist,
                      sourcePadding = nodeRadius,
                      targetPadding = nodeRadius + 2,
                      sourceX = d.source.x + (sourcePadding * normX),
                      sourceY = d.source.y + (sourcePadding * normY),
                      targetX = d.target.x - (targetPadding * normX),
                      targetY = d.target.y - (targetPadding * normY);
                  return 'M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY;
              });

              node.attr("cx", function (d) { return d.x; })
                  .attr("cy", function (d) { return d.y; });
          });


    },
    drawGraph(graph){
        var self=this
        $("#centerContainer").empty()
        const width = $("#centerContainer").width();
        const height = $("#centerContainer").height();

        const simulation = d3.forceSimulation()
          .nodes(graph.nodes)
          .force('link', d3.forceLink().id(d => d.id))
          .force('charge', d3.forceManyBody().strength([-250]))
          .force('center', d3.forceCenter(width / 2, height / 2))
          .on('tick', ticked);

        simulation.force('link')
          .links(graph.links)
          .distance([85]);

        const R = 10;

        const svg = d3.select('#centerContainer').append('svg')
          .attr('width', width)
          .attr('height', height);

        // add defs-marker
        // add defs-markers

        svg.append('svg:defs').append('svg:marker')
            .attr('id', 'end-arrow')
            .attr('viewBox', '0 -10 20 20')
            .attr('refX', 10+R)
            .attr('refY', 0)
            .attr('markerWidth', 10)
            .attr('markerHeight', 10)
            .attr('orient', 'auto')
          .append('svg:path')
            // .attr('d', 'M0,-10L20,0L0,10')
            .attr("d", "M0,-5 L10,0 L0,5")
            .attr('fill', '#000');

        

        // svg.append('svg:defs').selectAll('marker')
        //   .data([{ id: 'end-arrow', opacity: 1 }, { id: 'end-arrow-fade', opacity: 0.1 }])
        //   .enter().append('marker')
        //     .attr('id', d => d.id)
        //     .attr('viewBox', '0 -10 20 200')
        //     .attr('refX', 4 + R)
        //     .attr('refY', 0)
        //     .attr('markerWidth', 4)
        //     .attr('markerHeight', 4)
        //     .attr('orient', 'auto')
        //     .append('svg:path')
        //       .attr('d', 'M0,0 L0,10 L10,5 z')
        //       .style('opacity', d => d.opacity);

        let link = svg.selectAll('line')
          .data(graph.links)
          .enter().append('line');

        link  
          .attr('class', 'link')
          .attr('marker-end', 'url(#end-arrow)')
          .on('mouseout', fade(1));

        let node = svg.selectAll('.node')
          .data(graph.nodes)
          .enter().append('g')
          .attr('class', 'node');

        node.append('circle')
          .attr('r', R)
          .on("click", function (d) {
            
            // self.setNewAddress(d.addr)
            console.log(d)
          })    
          .on('mouseover', fade(0.1))
          .on('mouseout', fade(1))
          .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

        node.append('text')
          .attr('x', 0)
          .attr('dy', '.35em')
          .text(d => d.name.toLowerCase())
         // .style('fill', 'darkOrange');

         //console.log(link)


        // svg.append('svg:defs').selectAll('marker')
        //       .data(link)
        //       .enter()
        //             .append("marker")
        //       .attr("class", "marker")
        //       .attr("id", function(d) { return "marker" + node[d.target].id })
        //       .attr("viewBox", "0 -5 10 10")
        //             .attr("refX", function(d) { 
        //               return node[d.target].radius + 10;   // Add the marker's width of 10
        //             })
        //             .attr("refY", 0)
        //       .attr("markerWidth", 10)                        // markerWidth equals viewBox width
        //       .attr("markerHeight", 10)
        //       .attr("orient", "auto")
        //       .append("path")
        //         .attr("d", "M0,-5 L10,0 L0,5")
        //         .style("stroke", "black")
        //         .style("fill", "black")
        //         .style("opacity", "1");

        function ticked() {
          link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

          node
            .attr('transform', d => `translate(${d.x},${d.y})`);
        }

        function dragstarted(d) {
          if (!d3.event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        }

        function dragged(d) {
          d.fx = d3.event.x;
          d.fy = d3.event.y;
        }

        function dragended(d) {
          if (!d3.event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }

        const linkedByIndex = {};
        graph.links.forEach(d => {
          linkedByIndex[`${d.source.index},${d.target.index}`] = 1;
        });

        function isConnected(a, b) {
          return linkedByIndex[`${a.index},${b.index}`] || linkedByIndex[`${b.index},${a.index}`] || a.index === b.index;
        }

        function fade(opacity) {
          return d => {
            node.style('stroke-opacity', function (o) {
              const thisOpacity = isConnected(d, o) ? 1 : opacity;
              this.setAttribute('fill-opacity', thisOpacity);
              return thisOpacity;
            });

            link.style('stroke-opacity', o => (o.source === d || o.target === d ? 1 : opacity));
            link.attr('marker-end', o => (opacity === 1 || o.source === d || o.target === d ? 'url(#end-arrow)' : 'url(#end-arrow-fade)'));
          };
        }
    }
  },
}

</script>
<style lang="less">

#centerContainer {
  position: absolute;
  top: 0%;
  left: 0%;
  width: 100%;
  height: 100%;
  border: 1px solid grey;
  .node circle {
    fill: #DDD;
    stroke: #777;
    stroke-width: 2px;
  }

  .node text {
    color: red;
    font-family: sans-serif;
    text-anchor: middle;
    pointer-events: none;
    user-select: none;
    -webkit-user-select: none;
  }

  .link {
    stroke: #88A;
    stroke-width: 4px;  
    opacity: 0.5;
  }  
  
  .node {
    stroke: grey;
    stroke-width: 0.5px;
  }

  .link {
    fill: none;
    stroke: #000;
    stroke-width: 1.5px;
    opacity: 0.4;
    marker-end: url(#end-arrow);
  }


  text {
    font: 8px sans-serif;
    pointer-events: none;
  }

  #end-arrow {
    fill: #88A;
  }
}




</style>
