<template>
  <div id="view">
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
let d3 = require('d3')
import $ from 'jquery'
export default {
  data() {
    return {
      address: null
    }
  },
  mounted() {
    let path = '../../static/resource/bitcoin.json'
    let self = this
    d3.json(path, function(err, data) {
      self.process(data)
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
    submit: function(data) {
      console.log(data)
    },
    process: function(data) {

      let txs = data['txs']
      let address = data['address']
      txs.forEach(tx => {
        tx.date = new Date(tx.time * 1000)
        tx.value = tx.value
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
        balances.push({ 'value': x, date: tx.date })
      })
      console.log(balances)

      var W = $('#view').width(),
        H = $('#view').height()
      var svg = d3.select("#view").append('svg').attr('width', W * 5).attr('height', H),
        margin = { top: 20, right: 20, bottom: 30, left: 50 },
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
        .y(function(d) { return yscale(d.value + 1); })


      xscale.domain(d3.extent(balances, v => v.date)).nice()
      yscale.domain(d3.extent(balances, v => v.value + 1))
      var superscript = "⁰¹²³⁴⁵⁶⁷⁸⁹",
        formatPower = function(d) { return (d + "").split("").map(function(c) { return superscript[c]; }) }

      g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xscale).tickSize(2).tickFormat(d3.timeFormat("%Y-%m-%d")))


      g.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(yscale).tickSize(2).ticks(10, function(d) {
          let t = (10 + formatPower(Math.round(Math.log(d) / Math.LN10))).split(',')
          let tk = ''
          for(let i in t) {
            tk = tk + t[i]
          }
          return tk
        }))
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

    }
  },

}

</script>
<style scoped>
#view {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: scroll;
}
.axis text {
  font: 13px "helvetica neue";
}

</style>
