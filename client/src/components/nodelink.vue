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

      $('#title_left').text('#TXS: '+ allData[Object.keys(allData)[0]]['txData']['n_tx'])
      $('#title_middle').text('#ADDRS: '+ allData[Object.keys(allData)[0]]['addrData'].length)
      
      var txData = allData[Object.keys(allData)[0]]['txData']
      var addrData = allData[Object.keys(allData)[0]]['addrData']
      console.log('d3', d3.version)
      var graph={"nodes": [
        {
            "name": "A",
            "id": 0
        },
        {
            "name": "D",
            "id": 1
        },
        {
            "name": "K",
            "id": 2
        },
        {
            "name": "B",
            "id": 3
        },
        {
            "name": "G",
            "id": 4
        },
        {
            "name": "H",
            "id": 5
        },
        {
            "name": "C",
            "id": 6
        },
        {
            "name": "L",
            "id": 7
        },
        {
            "name": "E",
            "id": 8
        },
        {
            "name": "F",
            "id": 9
        },
        {
            "name": "J",
            "id": 10
        },
        {
            "name": "I",
            "id": 11
        },
        {
            "name": "M",
            "id": 12
        }],"links": [
        {
            "source": 0,
            "target": 1,
            "type": "high"
        },
        {
            "source": 0,
            "target": 2,
            "type": "high"
        },
        {
            "source": 3,
            "target": 4,
            "type": "high"
        },
        {
            "source": 5,
            "target": 3,
            "type": "high"
        },
        {
            "source": 6,
            "target": 0,
            "type": "low"
        },
        {
            "source": 6,
            "target": 7,
            "type": "low"
        },
        {
            "source": 8,
            "target": 0,
            "type": "low"
        },
        {
            "source": 9,
            "target": 3,
            "type": "low"
        },
        {
            "source": 9,
            "target": 4,
            "type": "low"
        },
        {
            "source": 2,
            "target": 10,
            "type": "low"
        },
        {
            "source": 9,
            "target": 11,
            "type": "low"
        },
        {
            "source": 4,
            "target": 5,
            "type": "low"
        },
        {
            "source": 8,
            "target": 2,
            "type": "high"
        },
        {
            "source": 8,
            "target": 4,
            "type": "low"
        },
        {
            "source": 8,
            "target": 9,
            "type": "high"
        },
        {
            "source": 8,
            "target": 12,
            "type": "high"
        }]}
      self.drawGraph(graph)

    },
  },
  methods: {
    ...mapActions(['setSelectRound']),
    drawGraph(graph){
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

        const R = 18;

        const svg = d3.select('#centerContainer').append('svg')
          .attr('width', width)
          .attr('height', height);

        // add defs-marker
        // add defs-markers
        svg.append('svg:defs').selectAll('marker')
          .data([{ id: 'end-arrow', opacity: 1 }, { id: 'end-arrow-fade', opacity: 0.1 }])
          .enter().append('marker')
            .attr('id', d => d.id)
            .attr('viewBox', '0 0 10 10')
            .attr('refX', 2 + R)
            .attr('refY', 5)
            .attr('markerWidth', 4)
            .attr('markerHeight', 4)
            .attr('orient', 'auto')
            .append('svg:path')
              .attr('d', 'M0,0 L0,10 L10,5 z')
              .style('opacity', d => d.opacity);

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
          .on('mouseover', fade(0.1))
          .on('mouseout', fade(1))
          .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

        node.append('text')
          .attr('x', 0)
          .attr('dy', '.35em')
          .text(d => d.name);

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
    font-family: sans-serif;
    text-anchor: middle;
    pointer-events: none;
    user-select: none;
    -webkit-user-select: none;
  }

  .link {
    stroke: #88A;
    stroke-width: 4px;  
  }  
   

  text {
    font: 18px sans-serif;
    pointer-events: none;
  }

  #end-arrow {
    fill: #88A;
  }
}




</style>
