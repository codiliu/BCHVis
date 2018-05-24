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
        balances.push({'value':x, date: tx.date})
      })
      console.log(balances)

      var W = $('#view').width(),
        H = $('#view').height()
      var svg = d3.select("#view").append('svg').attr('width', W).attr('height', H),
      margin = { top: 20, right: 20, bottom: 30, left: 50 },
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var parseTime = d3.timeParse("%d-%b-%y");
      var xscale = d3.scaleTime()
        .rangeRound([0, width]);

      var yscale = d3.scaleLinear()
        .rangeRound([height, 0]);

      var line = d3.line()
        .x(function(d) { return xscale(d.date); })
        .y(function(d) { return yscale(d.value); })


      xscale.domain(d3.extent(balances, v=>v.date))
      yscale.domain(d3.extent(balances, v=>v.value))

      g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xscale))


      g.append("g")
        .call(d3.axisLeft(yscale))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Price ($)");

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
}

</style>
