//version
//dependency:
//d3.js version 4.7.4

// import d3 from 'd3v4'
// import "../../plugins/d3.v4.min.js" 
Array.prototype.remove = function(val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};

(function (root, factory) {
  let lib_name = 'barchart'
  //detect environment
  // 判断是否支持 CommonJS 规范
  // console.log('d3', d3)
  if (typeof module === 'object' && module && typeof module.exports === 'object') {
    module.exports = factory(require('d3')) // CommonJS
  } else {
    // 判断是否支持 AMD 规范
    if (typeof define === 'function' && define.amd) {
      define(lib_name, ['d3'], factory)// AMD

    } else {
      // 不支持 CommonJS，也不支持 AMD
      root.d3 = root['d3'] || {}
      root['d3'][lib_name] = factory(root['d3']) // <script>
    }
  }
}(this, function (d3) {
  let barchart = function() {
    let width = 200,
      height = 100,
      margin = {
        top: 10,
        bottom: 25,
        right: 20,
        left: 50
      },
      duration = 200,
      //
      draw_xAxis = true,
      // 是否绘制X轴
      draw_yAxis = true,
      // 是否绘制X轴
      yTickNum = null,
      // 是否自自定义X刻度
      xTickNum = null,
      // 是否自自定义Y刻度
      xLabel = '',
      // X标签的值
      yLabel = '',
      // Y标签的值
      enable_brush = true,
      start_brush_range = [0, 0],
      set_brush_range = [0, 0],
      null_brush_defalut = false,
      color = '#999',
      handle_color = '#999',
      bar_interval = 0,
      // Bar之间的间隙
      bar_color = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b'],
      brush_g = null,
      x = null,
      y = null,
      brush = null

    let brush_trigger = function(brush_range) {}

    // let _font_style = '10px sans-serif'

    // 判断区间[x1,x2]与[bound1,bound2]的交集长度是否超过[x1,x2]长度的一半
    let _overhalf = function(x1, x2, bound1, bound2) {
      let len_x = x2 - x1

      if (bound1 <= x1 && x2 <= bound2)
        return true
      if (bound1 <= x1 && x1 <= bound2) {
        let ceil = Math.min(bound2, x2)
        let intersection = ceil - x1
        return intersection >= len_x / 2
      }
      if (bound1 <= x2 && x2 <= bound2) {
        let floor = Math.max(bound1, x1)
        let intersection = x2 - floor
        return intersection > len_x / 2
      }
      return false
    }

    function chart(selection) {
      // console.log(selection,'selection')
      selection.each(function(dataset) {
        //
        if(dataset[0]['x']){
          let avg_interval = dataset[1]['x'] - dataset[0]['x']
          dataset = dataset.map(function(d){
            d.x1 = d.x
            d.x2 = d.x + avg_interval

            return d
          })
        }

        // console.log(dataset)

        var y_key = d3.keys(dataset[0])
        y_key.remove('x')
        y_key.remove('x1')
        y_key.remove('x2')

        var y_ley_len = y_key.length

        // console.log(y_key)
        dataset.forEach(function(d){
          let y_value = 0
          for(let value of y_key){
            y_value += d[value]
          }
          d.y = y_value
        })

        // console.log(dataset)
        // console.log(bar_color(1))
        // console.log(y_key)

        let innerWidth = width - margin.left - margin.right
        let innerHeight = height - margin.top - margin.bottom
        let x_min = d3.min(dataset, d => d.x1)
        let x_max = d3.max(dataset, d => d.x2)
        x = d3.scaleTime()
          .domain([x_min, x_max])
          .range([0, innerWidth])
        bar_interval = innerWidth * 0.02 / dataset.length
        // console.log(d3.min(dataset, d => d.x1))
        y = d3.scaleLinear()
          .domain([0, d3.max(dataset, d => d.y)])
          .range([innerHeight, 0])

        let g = selection.selectAll('.container')
          .data([null])
          .enter().append('g')
          .attr('class', 'container')

        selection.selectAll('.container').transition()
          .duration(duration)
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')


        var timeFormatAll = d3.timeFormat('%Y/%m/%d')
        var timeFormatYear = d3.timeFormat('%Y')
        var timeFormatMonth = d3.timeFormat('%m/%d')
        var timeFormatDay = d3.timeFormat('%d %H:%M')
        var timeFormatHour = d3.timeFormat('%H:%M')

        if (draw_xAxis) {
          let xAxis = d3.axisBottom(x)
            .ticks(10)
            .tickFormat(function(d, i) {
              var ticks = xAxis.scale().ticks()
              // console.log('ticks', ticks)
              if(i==0){
                //i==1||i==ticks.length-2
                return timeFormatAll(d)
              }
              else{
                if (d.getFullYear()-ticks[i - 1].getFullYear()!=0) {
                  return timeFormatYear(d)
                }
                else if(d.getMonth()-ticks[i - 1].getMonth()!=0){
                  return timeFormatMonth(d)
                }
                else if(d.getDay()-ticks[i - 1].getDay()!=0){
                  return timeFormatMonth(d)
                }
                else{
                  return timeFormatHour(d)
                }
              }
            })

          if (xTickNum !== null)
            xAxis.ticks(xTickNum)

          let xAxis_g_update = g.selectAll('.x.axis')
            .data([null])

          let xAxis_g_enter = xAxis_g_update.enter()
            .append('g')
            .attr('class', 'x axis')

          g.selectAll('.x.axis').transition()
            .duration(duration)
            .attr('transform', 'translate(0,' + innerHeight + ')')
            .call(xAxis)

          xAxis_g_enter.selectAll('.x.label')
            .data([null])
            .enter()
            .append('text')
            .attr('class', 'x label')
            .attr('dy', '1.5em')
            .attr('dx', '2.5em')
            .attr('x', innerWidth)
            // .attr('fill', 'stroke')
            .text(xLabel)
          // xAxis_g_enter.selectAll('text')
          //   .style('fill', color)
        }

        if (draw_yAxis) {
          let yAxis = d3.axisLeft(y)
          if (yTickNum !== null)
            yAxis.ticks(yTickNum)

          let yAxis_g_update = g.selectAll('.y.axis')
            .data([null])
          let yAxis_g_enter = yAxis_g_update.enter()
            .append('g')
            .attr('class', 'y axis')
          g.selectAll('.y.axis').transition()
            .duration(duration)
            .call(yAxis)

          yAxis_g_enter.selectAll('.y.label')
            .data([null])
            .enter()
            .append('text')
            .attr('class', 'y label')
            .attr('transform', 'rotate(-90)')
            .attr('dy', '-3.5em')
            // .attr('fill', 'black')
            .text(yLabel)

          // yAxis_g_enter.selectAll('text')
          //   .style('color', color)
          // yAxis_g_enter.selectAll('path, line')
          //   .style('stroke', color)
        }

        selection.selectAll('text').attr('fill', color)
        selection.selectAll('path, line').attr('stroke', color)

        // d => x(d.x2 - d.x1) - bar_interval

        for(let i=1; i<= y_ley_len; i++){
          let key = 'y' + i
          // console.log(key)

          let bars = g.selectAll('.bar'+i)
            .data(dataset)
          bars.enter().append('rect')
            .attr('class', 'bar'+i)
          bars.exit().remove()

          g.selectAll('.bar'+i).transition()
            .duration(duration)
            .attr('x', d => x(d.x1))
            .attr('width', function(d){
              return x(x_min + d.x2 - d.x1)  - bar_interval;
            })
            .attr('y', function(d){
              let sum = 0
              for(let j =1; j<=i; j++){
                sum += d['y'+j]
              }
              return y(sum)
            })
            .attr('height', d => innerHeight - y(d[key]))
            .attr('fill', bar_color[i-1])
            .attr('opacity', 1)
        }

        if (enable_brush) {
          // 计算刷选的偏移量
          let left_offset = Math.min(x(start_brush_range[0]), 0)
          let right_offset = Math.max(x(start_brush_range[1]), 0)

          brush = d3.brushX()
            .extent([
              [left_offset, 0],
              [innerWidth + right_offset, innerHeight]
            ])
            // .on('start', brushStart)
            .on('start brush', brushOn)
            .on('end', brushEnd)

          brush_g = g.append('g')
            .attr('class', 'x brush')
            .call(brush)


          let brushResizePath = function(d) {
            var e = +(d.type == "e"),
              x = e ? 1 : -1,
              y = innerHeight;
            return "M" + (.5 * x) + "," + y + "A6,6 0 0 " + e + " " + (4.5 * x) + "," + (y + 6) + "V" + (2 * y - 6) + "A6,6 0 0 " + e + " " + (.5 * x) + "," + (2 * y) + "Z" + "M" + (0.5 * x) + "," + (y + 8) + "V" + (2 * y - 8) + "M" + (2.5 * x) + "," + (y + 8) + "V" + (2 * y - 8);
          }

          d3.select('.selection')
            .attr('stroke', handle_color)
            // .attr('fill','none')

          let handle = brush_g.selectAll(".handle--custom")
            .data([{type: "w"}, {type: "e"}])
            .enter().append("path")
            .attr("class", "handle--custom")
            .attr("stroke", handle_color)
            .attr("cursor", "ew-resize")
            .attr("d", brushResizePath)

          brush_g.call(brush.move, start_brush_range.map(x))

          var extent

          function brushOn() {
            // console.log(321321,d3.event.selection)

            extent = d3.event.selection

            if (extent == null) {
              handle.attr("display", "none")
            } else {
              handle.attr("display", null).attr("transform", function(d, i) { return "translate(" + [ extent[i], - innerHeight] + ")"; });
            }
          }

          function brushEnd() {
            console.log(d3.event.sourceEvent)
            if (!d3.event.sourceEvent) return; // Only transition after input.
            // if (!d3.event.selection) return; // Ignore empty selections.
            if (d3.event.sourceEvent.type === 'end')
              return
            if(extent[0] == extent[1]){
              if(null_brush_defalut){
                handle.attr("display", "none")
              }
              else{
                for(let d of dataset){
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
            brush_trigger([xExtent[0].getTime(), xExtent[1].getTime()])

            // console.log(d3.event.selection.map(x.invert))
            // g.selectAll('.bar')
            //     .classed('highlight', function(d) {
            //         return extent == null ? false : _overhalf(x(d.x1), x(d.x2), extent[0], extent[1])
            //     })
            // // 根据被highlight的bar进行brush的位置校正
            // let brushed_bar_sel = g.selectAll('.bar.highlight')
            // if (brushed_bar_sel.size() != 0) {
            //     let x_range = d3.extent(brushed_bar_sel.data().reduce(function(list, ele) {
            //         list.push(ele.x1, ele.x2)
            //         return list
            //     }, []))
            //     d3.select(this).call(d3.event.target.move, x_range.map(x))
            // }
            // brush_trigger(d3.event, brushed_bar_sel)
          }

          function setBrushRange(set_brush_range) {
            brush_g.transition()
              .duration(duration).call(brush.move, set_brush_range.map(x))
            extent = set_brush_range.map(x)
            let xExtent = extent.map(x.invert)
            brush_trigger([xExtent[0].getTime(), xExtent[1].getTime()])
          }
        }
      })
    }

    chart.width = function(value) {
      if (!arguments.length) return width
      if (typeof(value) != 'number') {
        console.warn('invalid value for width', value)
        return
      }
      width = value
      return chart
    }

    chart.bar_color = function (value) {
      if (!arguments.length) return bar_color
      if (typeof (value) != 'object') {
        console.warn('invalid value for bar color', value)
        return
      }
      bar_color = value
      return chart
    }

    chart.height = function(value) {
      if (!arguments.length) return height
      if (typeof(value) != 'number') {
        console.warn('invalid value for height', value)
        return
      }
      height = value
      return chart
    }

    chart.margin = function(value) {
      if (!arguments.length) return margin
      if (typeof(value) != 'object') {
        console.warn('invalid value for margin', value)
        return
      }
      if (typeof(value.top) == 'number')
        margin.top = value.top
      if (typeof(value.right) == 'number')
        margin.right = value.right
      if (typeof(value.bottom) == 'number')
        margin.bottom = value.bottom
      if (typeof(value.left) == 'number')
        margin.left = value.left
      return chart
    }

    chart.duration = function(value) {
      if (!arguments.length) return duration
      if (typeof(value) != 'number') {
        console.warn('invalid value for duration', value)
        return
      }
      duration = value
      return chart
    }

    chart.draw_xAxis = function(value) {
      if (!arguments.length) return draw_xAxis
      if (typeof(value) != 'boolean') {
        console.warn('invalid value for draw_xAxis', value)
        return
      }
      draw_xAxis = value
      return chart
    }

    chart.draw_yAxis = function(value) {
      if (!arguments.length) return draw_yAxis
      if (typeof(value) != 'boolean') {
        console.warn('invalid value for draw_yAxis', value)
        return
      }
      draw_yAxis = value
      return chart
    }

    chart.yTickNum = function(value) {
      if (!arguments.length) return yTickNum
      if (typeof(value) != 'number') {
        console.warn('invalid value for yTickNum', value)
        return
      }
      yTickNum = value
      return chart
    }

    chart.xTickNum = function(value) {
      if (!arguments.length) return xTickNum
      if (typeof(value) != 'number') {
        console.warn('invalid value for xTickNum', value)
        return
      }
      xTickNum = value
      return chart
    }

    chart.xLabel = function(value) {
      if (!arguments.length) return xLabel
      if (typeof(value) != 'string') {
        console.warn('invalid value for xLabel', value)
        return
      }
      xLabel = value
      return chart
    }

    chart.yLabel = function(value) {
      if (!arguments.length) return yLabel
      if (typeof(value) != 'string') {
        console.warn('invalid value for yLabel', value)
        return
      }
      yLabel = value
      return chart
    }

    chart.brush_trigger = function(value) {
      if (!arguments.length) return brush_trigger
      if (typeof(value) != "function") {
        console.warn("invalid value for brush_trigger", value)
        return
      }
      brush_trigger = value
      return chart
    }

    chart.enable_brush = function(value) {
      //console.log(arguments)
      if (!arguments.length) return enable_brush
      if (typeof(value) != 'boolean') {
        console.warn('invalid value for enable_brush', value)
        return
      }
      enable_brush = value
      return chart
    }

    chart.start_brush_range = function(value) {
      if (!arguments.length) return start_brush_range
      if (typeof(value) != 'object') {
        console.warn('invalid value for start bursh range', value)
        return
      }
      // if (typeof(value[0]) == 'number')
      //   start_brush_range[0] = value[0]
      //
      // if (typeof(value[0]) == 'number')
      //   start_brush_range[1] = value[1]
      start_brush_range = value
      return chart
    }

    chart.set_brush_range = function(value) {
      if (!arguments.length) return set_brush_range
      if (typeof(value) != 'object') {
        console.warn('invalid value for start bursh range', value)
        return
      }
      set_brush_range = value

      console.log('set_brush_range', set_brush_range)
      brush_g.transition()
        .duration(duration).call(brush.move, set_brush_range.map(x))
      return chart
    }

    chart.color = function(value) {
      if (!arguments.length) return color
      if (typeof(value) != 'string') {
        console.warn('invalid value for color', value)
        return
      }
      color = value
      return chart
    }

    chart.bar_interval = function(value) {
      if (!arguments.length) return bar_interval
      if (typeof(value) != 'number') {
        console.warn('invalid value for bar_interval', value)
        return
      }
      bar_interval = value
      return chart
    }

    return chart
  }
  return barchart
}))
