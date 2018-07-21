<template>
  <div id="riverview">
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
let d3 = require('d3')
import config from '../commons/config'
import $ from 'jquery'
export default {
  data() {
    return {
      address: null
    }
  },
  mounted() {
    // let path = '../../static/resource/bitcoin.json'
    // let self = this
    // d3.json(path, function(err, data) {
    //   self.process(data['txData'])
    // })

  },
  computed: {
    ...mapGetters({
      addrData: 'getAddrData',
      newAddress: 'getNewAddress',
      selectedTx: 'getSelectedTx',
      timeRange: 'getTimeRange'
    })
  },
  watch: {
    addrData: function(data) {
      // this.allTxs = data['txData']
      var self = this
      console.log('river:', data)
      self.process(data[self.newAddress]['txData']['txs'])
    },
    newAddress: function(data) {
      this.address = data
    },
    selectedTx: function(data) {
      console.log(data)
    },
    timeRange: function(timeRange){
      var self=this
      var newAddress = self.newAddress
      var txs=[]
      self.addrData[self.newAddress]['txData']['txs'].forEach(function(d){
        if(timeRange[0]<=d.time && d.time<=timeRange[1])
          txs.push(d)
      })
      console.log('txs: ', txs)
      self.process(txs)
      console.log()
    }
  },
  methods: {
    submit: function(data) {
      console.log(data)
    },
    process: function(txs) {
      console.log('river:', txs)

      $("#riverview").empty() 


      var self = this
      let address = self.newAddress
      console.log('cc', txs)
      var W = $('#riverview').width(),
        H = $('#riverview').height()

      var svg = d3.select("#riverview").append('svg').attr('width', W * 5).attr('height', H),
        margin = { top: 10, right: 20, bottom: 10, left: 20 },
        width = svg.attr("width"),
        height = svg.attr("height") ,
        viewg = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")")

      let cw = 20
      let middle = height / 2
      let middlespace = height * 0.2
      let cg = viewg.selectAll('.column')
        .data(txs)
        .enter()
        .append('g')
        .attr('transform', function(d, i) {
          return 'translate(' + cw * i + ',' + middle + ')'
        })
        
      viewg.append('line')
        .attr('x1', 0)
        .attr('y1', middle)
        .attr('x2', W * 5)
        .attr('y2', middle)
        .style('stroke', '#f0f0f0')
        .style("stroke-dasharray", ("5, 2"))

      let yh = (height * 0.5 - middlespace) / 2
      var yscale = d3.scaleLog()
        .domain([1, 1e10])
        .range([0, yh])

      let recth = 5
      let rectw = cw / 2

      let upg = cg.selectAll('.up')
        .data(function(d) {
          return d.inputs
        })
        .enter()
        .append('g')
        .attr('class', 'up')
        .attr('transform', function(d) {
          return 'translate(0,' + (-1 * (yh - yscale(d.value)) - middlespace / 2) + ')'
        })


      upg.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', cw / 2)
        .attr('height', recth)
        .style('fill', config.incolor)

      let downg = cg.selectAll('.down')
        .data(function(d) {
          return d.outputs
        })
        .enter()
        .append('g')
        .attr('class', 'down')
        .attr('transform', function(d) {
          return 'translate(0,' + (yh - yscale(d.value) + middlespace / 2) + ')'
        })

      downg.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', rectw)
        .attr('height', recth)
        .style('fill', config.outcolor)

      this.txs = txs
      this.viewg = viewg
      this.recth = recth
      this.rectw = rectw
      this.yscale = yscale
      this.middle = middle
      this.middlespace = middlespace
      this.cw = cw
      this.yh = yh
      this.drawLine(address)
    },
    drawLine: function(address) {
      let locations = []
      let txs = this.txs
      let viewg = this.viewg
      let recth = this.recth
      let rectw = this.rectw
      let yscale = this.yscale
      let middle = this.middle
      let cw = this.cw
      let yh = this.yh,
        middlespace = this.middlespace
      for (let i = 0; i < txs.length; i++) {
        for (let j in txs[i].inputs) {
          if (txs[i].inputs[j]['addr'] == address) {
            // tmp['values'].push({'type': 'input', 'value': txs[i].inputs[j]['value']})
            locations.push({ 'c': i, 'type': 'input', 'value': txs[i].inputs[j]['value'] })
          }
        }
        for (let j in txs[i].outputs) {
          if (txs[i].outputs[j]['addr'] == address) {
            locations.push({ 'c': i, 'type': 'output', 'value': txs[i].outputs[j]['value'] })
          }
        }
      }

      console.log(locations)
      let paths = []

      for (let i = 0; i < locations.length - 1; i++) {
        let path = []
        let sx = locations[i]['c'] * cw + rectw,
          type1 = locations[i]['type'],
          sy = 0,
          value = locations[i]['value'],
          c1 = locations[i]['c']

        if (type1 == 'input') {
          sy = -1 * (yh - yscale(value)) - middlespace / 2 + recth / 2
        } else {
          sy = yh - 1 * yscale(value) + middlespace / 2 + recth / 2
        }
        let ex = locations[i + 1]['c'] * cw
        let ey = 0,
          type2 = locations[i + 1]['type'],
          value2 = locations[i + 1]['value'],
          c2 = locations[i + 1]['c']
        if (type2 == 'input') {
          ey = -1 * (yh - yscale(value2)) - middlespace / 2 + recth / 2
        } else {
          ey = yh - yscale(value2) + middlespace / 2 + recth / 2
        }
        if ((c2 - c1 == 1) || (c2 == c1)) {
          // path = 'M' + sx + ',' + sy + 'L' + ex + ',' + ey
          path.push([sx, sy], [sx + (cw - rectw) * 0.2, sy], [ex - (cw - rectw) * 0.2, ey], [ex, ey])
        }
        else {
          let m1 = 0, m2 = 0
          if(type1 != type2) {
            m1 = [sx + (cw - rectw) * 0.5, middle]
            m2 = [ex - (cw - rectw) * 0.5, middle]
          }
          else {
            if(type1 == 'input') {
              m1 = [sx + (cw - rectw) * 0.5, middle - middlespace * 0.2]
              m2 = [ex - (cw - rectw) * 0.5, middle - middlespace * 0.2]
            }
            else {
              m1 = [sx + (cw - rectw) * 0.5, middle + middlespace * 0.2]
              m2 = [ex - (cw - rectw) * 0.5, middle + middlespace * 0.2]
            }
          }
          path.push([sx, sy], m1, m2, [ex, ey])
        }
        paths.push(path)
      }

      let riverg = viewg.append('g')

      riverg.selectAll('.river')
        .data(paths)
        .enter()
        .append('path')
        .datum(function(d) {
          return d
        })
        .attr('class', 'river')
        .attr('transform', function(d) {
          return 'translate(0,' + middle + ')'
        })
        .attr('d', d3.line()
          .curve(d3.curveBasis)
          .x(function(d) { return d[0] })
          .y(function(d) { return d[1] }))
        .attr("stroke", "grey")
        // .attr("stroke-linejoin", "round")
        // .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr('fill', 'none')

    }

  },


}

</script>
<style scoped>
#riverview {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: scroll;
}

.axis text {
  font: 13px "helvetica neue";
}

</style>
