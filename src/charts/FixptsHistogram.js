/**
 * data: 2017-12-02 10:03:57
 * author: yuechenglei
 * describe: 
 */


import d3 from 'd3'
import config from '../commons/config'
let { A_D, fixpot_total, fixpot_arrival, fixpot_departure } = config

// A_D: ['dep', 'arr'],
//   fixpot_total: ['BOBAK', 'DOGAR', 'GITUM', 'KM', 'VYK', 'LADIX', 'RENOB', 'SOSDI', 'TONIL', 'YV', 'CDY'],
//   fixpot_arrival: ['BOBAK', 'DOGAR', 'GITUM', 'KM', 'VYK'],
//   fixpot_departure: ['LADIX', 'RENOB', 'SOSDI', 'TONIL', 'YV', 'CDY'],

export default class {
  constructor(el) {
      this.el = el
    },
//change
    dataProcess() {
      var self = this;
      var fixpot_filter = Datacenter.get("fixpot_filter");
      // console.warn(fixpot_filter);

      var timestamp = Config.get("curtime")
      var dateStr = timeuitl.formateDate(timestamp);

      var fixpot_histogram = { 'dep': {}, 'arr': {} };

      self.A_D.forEach(function(n) {
        if (n == 'dep') {
          self.fixpot_departure.forEach(function(d) {
            fixpot_histogram[n][d] = [];
            for (var i = 0; i < 24; i++)
              fixpot_histogram['dep'][d][i] = { 'num': 0, 'trajList': [] };
          });
        }
        if (n == 'arr') {
          self.fixpot_arrival.forEach(function(d) {
            fixpot_histogram[n][d] = [];
            for (var i = 0; i < 24; i++)
              fixpot_histogram['arr'][d][i] = { 'num': 0, 'trajList': [] };
          });
        }
      });

      self.A_D.forEach(function(n) {
        var array = (n == 'dep' ? self.fixpot_departure : self.fixpot_arrival);
        array.forEach(function(k) {
          // console.warn(fixpot_filter[n])
          fixpot_filter[n][k].forEach(function(d) {
            var time = (n == 'dep' ? d.select_traj.sTime : d.select_traj.eTime);
            var this_dateStr = timeuitl.formateDate(time);
            if (this_dateStr == dateStr) {
              var this_timeStr = parseInt(timeuitl.formateTime(time).substr(0, 2));
              fixpot_histogram[n][k][this_timeStr]['num']++;
              fixpot_histogram[n][k][this_timeStr]['trajList'].push(d);
            }
          });
        });
      });

      self.histogram_render(fixpot_histogram);
    },
    histogram_render(data) {
      var self = this;
      $('.histogram_simple_div').remove();

      var number = self.fixpot_total.length;
      var div_width = $('#fixptsHistogram_real').width(),
        div_height = $('#fixptsHistogram_real').height() / number;

      var margin = { top: 10, right: 10, bottom: 20, left: 20 },
        width = div_width - margin.left - margin.right,
        height = div_height - margin.top - margin.bottom;

      var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .15);

      var y = d3.scale.linear()
        .range([height, 0]);

      var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickValues(d3.range(0, 23, 4))
        .tickFormat(function(d) {
          if (d > 9) {
            return d.toString() + ':00';
          } else {
            return '0' + d.toString() + ':00';
          }
        });

      var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(d3.format("d"));


      self.fixpot_total.forEach(function(fixpot_name) {
        var this_A_D = ($.inArray(fixpot_name, self.fixpot_arrival) == -1) ? 'dep' : 'arr';

        var histogram_simple_div = d3.select('#fixptsHistogram_real')
          .append('div')
          .attr({
            'class': 'histogram_simple_div',
          })
          .style({
            'width': div_width + 'px',
            'height': div_height + 'px',
            'background-color': '#000000',
          });

        var svg = histogram_simple_div.append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x.domain(Object.keys(data[this_A_D][fixpot_name]));
        var max_num = d3.max(data[this_A_D][fixpot_name], function(d) { return d.num; }) + 1;
        //只显示最小值和最大值
        yAxis.tickValues([0, max_num]);

        y.domain([0, max_num]);

        var gXAxis = svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

        var gYAxis = svg.append("g")
          .attr("class", "y axis")
          .call(yAxis);

        var bars = svg.selectAll(".fixpot_histogram_bar")
          .data(data[this_A_D][fixpot_name])
          .enter().append("rect")
          .attr("class", "fixpot_histogram_bar");

        bars.attr("x", function(d, i) {
            return x(i.toString()) + x.rangeBand() / 2;
          })
          .attr("y", function(d) { return y(d.num); })
          .attr("height", function(d) {
            return height - y(d.num);
          })
          .attr("width", x.rangeBand())
          .style({
            'fill': function() {
              return (this_A_D == 'dep') ? 'rgb(41, 170, 227)' : 'rgb(209, 71, 69)';
            }
          });

        svg.append('text')
          .attr({
            'x': width - 3,
            'y': 3,
          })
          .style({
            'font-size': '0.7em',
            'text-anchor': 'end',
            'fill': 'yellow',
          })
          .html(fixpot_name);

      });

    },
}
