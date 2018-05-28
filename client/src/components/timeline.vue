<template>
  <div id="view">
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
      address: null,
      tx_index: null
    }
  },
  mounted() {
    let path = '../../static/resource/bitcoin.json'
    let self = this
    d3.json(path, function(err, data) {
      self.process(data['txData'])
    })

  },
  computed: {
    ...mapGetters({
      addrData: 'getAddrData',
      newAddress: 'getNewAddress'
    })
  },
  watch: {
    addrData: function(data) {
      console.log(this.address)
      console.log(data[this.address])
    },
    newAddress: function(data) {
      this.address = data
    }
  },
  methods: {
    ...mapActions(['setSelectedTx']),
    submit: function(data) {
      console.log(data)
    },
    process: function(data) {
      let self = this
      let txs = data['txs']
      let address = data['address']
      txs.forEach(tx => {
        tx.date = new Date(tx.time * 1000)
        tx.inputs.sort((a, b) => {
          return a.value - b.value
        })
        tx.input_value = d3.sum(tx.inputs, v => v.value)
        tx.inputs.forEach(input => {
          input.all_value = tx.input_value
          input.before_value = s
        })
        let s = 0
        for (let i = 0; i < tx.inputs.length; i++) {
          tx.inputs[i].before_value = s
          s = s + tx.inputs[i].value
        }
        tx.outputs.sort((a, b) => {
          return a.value - b.value
        })
        tx.output_value = d3.sum(tx.outputs, v => v.value)
        tx.outputs.forEach(output => {
          output.all_value = tx.output_value
          output.before_value = s
        })
        s = 0
        for (let i = 0; i < tx.outputs.length; i++) {
          tx.outputs[i].before_value = s
          s = s + tx.outputs[i].value
        }

      })
      let balances = []
      txs.sort((a, b) => {
        return a.time - b.time
      })

      let x = 0
      txs.forEach(tx => {
        tx['inputs'].forEach(input => {
          if (input['addr'] == address) {
            x = x - input['value']
          }
        })
        tx['outputs'].forEach(out => {
          if (out['addr'] == address) {
            x = x + out['value']
          }
        })
        balances.push({ 'value': x + 1, date: tx.date })
      })
      console.log(balances)

      var W = $('#view').width(),
        H = $('#view').height()
      var svg = d3.select("#view").append('svg').attr('width', W).attr('height', H),
        margin = { top: 20, right: 20, bottom: 25, left: 50 },
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var parseTime = d3.timeParse("%d-%b-%y");
      var xscale = d3.scaleTime()
        .rangeRound([0, width]);

      var yscale = d3.scaleLog()
        .range([height, 0]);

      var line = d3.line()
        .x(function(d) { return xscale(d.date); })
        .y(function(d) { return yscale(d.value); })


      xscale.domain(d3.extent(balances, v => v.date)).nice()
      yscale.domain(d3.extent(balances, v => v.value))
      var superscript = "⁰¹²³⁴⁵⁶⁷⁸⁹",
        formatPower = function(d) { return (d + "").split("").map(function(c) { return superscript[c]; }) }

      g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xscale).tickSize(2).tickFormat(d3.timeFormat("%Y-%m-%d")).ticks(7))


      g.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(yscale).tickSize(2).ticks(10, function(d) {
          let t = (10 + formatPower(Math.round(Math.log(d) / Math.LN10))).split(',')
          let tk = ''
          for (let i in t) {
            tk = tk + t[i]
          }
          return tk
        }))

      var brush = d3.brushX()
        .extent([
          [0, 0],
          [width, height]
        ])
        .on("end", brushmoved)

      var gBrush = g.append("g")
        .attr("class", "brush")
        .call(brush)

      function brushmoved() {
        var s = d3.event.selection;
        if (s == null) {
        } else {
          var sx = s.map(xscale.invert);
          console.log(sx)
        }
      }
      // .append("text")
      // .attr("fill", "#000")
      // .attr("transform", "rotate(-90)")
      // .attr("y", 6)
      // .attr("dy", "0.71em")
      // .attr("text-anchor", "end")


      g.append("path")
        .datum(balances)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line);

      console.log(txs)
      let glyphg = g.selectAll('.glyph')
        .data(txs)
        .enter()
        .append('g')
        .attr('class', 'glyph')
        .attr('transform', function(d, i) {
          let x = xscale(balances[i].date)
          let y = yscale(balances[i].value)
          return 'translate(' + x + ',' + y + ')'
        })

      let rscale = d3.scaleLog().domain([1, 100]).range([1, 12])
      // let density = d3.scaleLog().domain([1, 1e8]).range([0.1, 1])
      let density = d3.scaleLinear().domain([1, 1e9]).range(['#fcfbfd', '#3f007d'])
      let R = 8 // fixed tx r

      let densityColor = '#54278f'

      //   glyphg.append('circle')
      //     .attr('class', 'input')
      //     .attr('r', function(d) {
      //       return R + rscale(d.inputs.length)
      //     })
      //     .style('fill', 'none')
      //     .style('stroke', config.incolor) //gren
      //     .style('stroke-width', 2)
      //     .append('title')
      //     .text(function(d){
      //         return d.inputs.length
      //     })


      //   glyphg.append('circle')
      //     .attr('class', 'output')
      //     .attr('r', function(d) {
      //       return R + rscale(d.outputs.length) 
      //     })
      //     .style('fill', 'none')
      //     .style('stroke', config.outcolor) // yellow
      //     .style('stroke-width', 2)
      //     .append('title')
      //     .text(function(d){
      //         return d.outputs.length
      //     })

      // glyphg.append('circle')
      //   .attr('class', 'node')
      //   .style('fill', function(d) {
      //     return densityColor
      //   })
      //   .style('fill-opacity', function(d){
      //       return density(d.input_value) //
      //   })
      //   .attr('r', R)
      //   .on('click', function(d){
      //      self.setSelectedTx(d.tx_index)
      //   })
      //   .append('title')
      //   .text(function(d){
      //       return d.input_value * 1e-8
      //   })



      // let rscale = d3.scaleLog().domain([1, 1e9]).range([0, 15])
      // console.log(rscale(10000))
      // var arc = d3.arc()
      //   .innerRadius(0)
      //   .outerRadius(function(d) {
      //     return rscale(d.all_value)
      //   })
      //   .startAngle(function(d) {
      //     return -1 * d.before_value / d.all_value * Math.PI
      //   })
      //   .endAngle(function(d) {
      //     return -1 * (d.before_value + d.value) / d.all_value * Math.PI
      //   })

      // glyphg.selectAll('.leftCircle')
      //   .data(function(d) {
      //     return d.inputs
      //   })
      //   .enter()
      //   .append('path')
      //   .attr('class', 'leftCircle')
      //   .attr('d', arc)
      //   .attr('transform', 'translate(-1,0)')
      //   .style('fill', config.incolor)
      //   .style('stroke', 'grey')



      // var arc2 = d3.arc()
      //   .innerRadius(0)
      //   .outerRadius(function(d) {
      //     return rscale(d.all_value)
      //   })
      //   .startAngle(function(d) {
      //     return d.before_value / d.all_value * Math.PI
      //   })
      //   .endAngle(function(d) {
      //     return (d.before_value  + d.value) / d.all_value * Math.PI
      //   })

      // glyphg.selectAll('.rightCircle')
      //   .data(function(d) {
      //     return d.outputs
      //   })
      //   .enter()
      //   .append('path')
      //   .attr('class', 'rightCircle')
      //   .attr('d', arc2)
      //   .attr('transform', 'translate(1,0)')
      //   .style('fill', config.outcolor)
      //   .style('stroke', 'grey')

    }
  },

}

</script>
<style scoped>
#view {
  position: absolute;
  width: 100%;
  height: 99%;
  overflow: scroll;
}

.highlight {}

.axis text {
  font: 13px "helvetica neue";
}

</style>
