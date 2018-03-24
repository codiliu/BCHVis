function drawLineChart(data) {
  // build the arrow.
  svg.append("svg:defs").selectAll("marker")
    .data(["end"])      // Different link/path types can be defined here
    .enter().append("svg:marker")    // This section adds in the arrows
    .attr("id", String)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 5)
    .attr("refY", 0)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("stroke", "#000")
    .attr("fill", "none")

  lineG.append("line")
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', lineWidth)
    .attr('y2', 0)
    .attr('fill', 'none')
    .attr('stroke', '#000000')
    .attr('stroke-width', 1)
    .attr("marker-end", "url(#end)");

  lineG.append("line")
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', 0)
    .attr('y2', lineHeight)
    .attr('fill', 'none')
    .attr('stroke', '#000000')
    .attr('stroke-width', 1)
    .attr("marker-end", "url(#end)");
  /*
   lineG.append('text')
   .text('Max/Avg Workload')
   .attr('text-anchor', 'middle')
   .attr('font-size', '8px')
   .attr('transform', function() {
   return 'translate(35, 0)'
   });

   lineG.append('text')
   .text('Execution Time')
   .attr('x', 0)
   .attr('y', lineHeight + 15)
   .attr('text-anchor', 'middle')
   .attr('font-size', '8px');
   */
  var line = d3.svg.line()
    .x(function (d, i) {
      return y_line(d.y);
    })
    .y(function (d, i) {
      return i * lineHeight / (lines.length - 1);
    })

  lineG.append("path")
    .datum(data)
    .attr('class', 'load-balance-line')
    .attr('fill', 'none')
    .attr("stroke", "#000")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", function (d) {
      return 1.5;
    })
    .attr("d", line);

  lineG.selectAll(".dot")
    .data(data)
    .enter().append("circle")
    .attr("class", "dot")
    .attr("r", 4)
    .attr("cx", function (d, i) {
      return y_line(d.y);
    })
    .attr("cy", function (d, i) {
      return i * lineHeight / (lines.length - 1);
    })
    .attr("fill", "black")
    .on("mouseover", function (d, i) {
/*
      graphG.selectAll(".nodetexts").remove();
      graphG.selectAll(".noderects").remove();

      complines.attr('opacity', function (u) {
        if (u.round == i + 1 && u.round != 1) 
          return 0.8;
        else {
          if (u.round == 1) return 0;
          else return 0.01;
        }
      });

      node.attr('opacity', function (u) {
        if (u.round == i + 1) {
          return 0.8;
        }
        else return 0.4;
      });

      node2.attr('opacity', function (u) {
        if (u.round == i + 1) {
          return 1;
        }
        else return 0.1;
      });

      link.selectAll('path')
        .attr("stroke-opacity", 0.02);

      for (var i = 0; i < max_round; i ++) {
        nodes_source[i] = {};
        nodes_target[i] = {};
        selected_nodes[i] = {};
      }
*/
      lineG.selectAll(".dottexts").data(lines).enter().append("text")
        .text(function (u, j) {
          if (i == j) return d.y.toFixed(3);
        })
        .attr("class", "dottext")
        .attr('x', function (u) {
          return y_line(u.y) - 18;
        })
        .attr('y', function (u, j) {
          return j * lineHeight / (lines.length - 1) + 4;
        })
        .attr('text-anchor', 'middle')
        .attr('font-size', node_text_size);
    })
    .on("mouseout", function (d) {
      lineG.selectAll(".dottext").remove();
/*
      link.selectAll('path')
        .attr("stroke-width", function (d) {
          var value = d3.select(this).attr("value"),
              count = d3.select(this).attr("count");
          if (value > 100)
            return (value - min_value) * (3.0 - 0.3) / (max_value - min_value) + 0.3;
          else {
            if (count > 0) 
              return (count - min_link_count) * (3.0 - 0.3) / (max_link_count - min_link_count) + 0.3;
            else return 0;
          }
        })
        .attr("stroke", function (d) {
          var value = d3.select(this).attr("value"),
              count = d3.select(this).attr("count");
          if (value > 0 && count > 0) return "black" // both
          if (value > 0 && count <= 0) return "green" // only particles
          if (value <= 0 && count > 0) return "red" // only blocks
          if (value <= 0 && count <= 0) return "white"
      })// TODO
      .attr("stroke-opacity", "0.1");

      complines.attr('opacity', function (d){
        if (d.round == 1) return '0';
        else return '0.8';
      });
      node.attr('opacity', "0.8");
      node2.attr('opacity', "1.0");
*/
    });
}