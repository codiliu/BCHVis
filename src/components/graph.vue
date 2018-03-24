<template>
  <div>
 
  </div>
</template>
<script>

import { mapActions, mapGetters } from 'vuex'
import $ from 'jquery'
import d3 from 'd3'
export default {
  components: { },
  data() {
    return {
      list: []
    }
  },
  mounted() {
    console.log('d3: ',d3)
    console.log("map loading.....")

  },
  computed: {
      ...mapGetters({
        graphData: 'getGraphData'
      }),
  },
  watch: {
    graphData: function(data) {
      console.log('graphData: ', data)
      this.drawGraph(data['nodes'], data['links'], data['nodes_num'], data['lineGenaretor'], data['min_value'], data['max_value'], data['min_link_count'], data['max_link_count'], data['min_nufdpts'], data['max_npts'], data['max_wl_estWl_diff'], data['min_wl_estWl_diff'],data['nodes_ids'], data['min_wl'], data['max_wl'], data['compute'], data['min_nfdpts'], data['max_nfdpts'], data['selected_block'], data['nodes_transfer'], data['selected_nodes'], data['max_round'], data['max_node2_r'], data['min_node2_r'], data['max_compline'], data['max_compline_w'], data['n_nodes'], data['node_r'], data['max_node2_stroke_w'], data['histograms'], data['nodes_source'], data['nodes_target'], data['outdistselected_nodes'], data['outdistnodes_target'], data['indistselected_nodes'],data['indistnodes_source'], data['transfer_json'], data['temp_nodes'], data['dist_json'], data['transfers'])
      //console.log('d3: ',d3)
    }
  },
  methods: {
    drawGraph(nodes, links, nodes_num, lineGenaretor, min_value, max_value, min_link_count, max_link_count, min_nufdpts, max_npts, max_wl_estWl_diff, min_wl_estWl_diff, nodes_ids, min_wl, max_wl, compute, min_nfdpts, max_nfdpts, selected_block, nodes_transfer, selected_nodes, max_round, max_node2_r, min_node2_r, max_compline, max_compline_w, n_nodes, node_r, max_node2_stroke_w, histograms, nodes_source, nodes_target, outdistselected_nodes, outdistnodes_target, indistselected_nodes, indistnodes_source , transfer_json, temp_nodes, dist_json, transfers) {
      var self = this

      var containerWidth = +$('#load-balance-container').width()
      var containerHeight = +$('#load-balance-container').height()

      console.log('containerWidth: ', containerWidth)
      console.log('containerHeight: ', containerHeight)

      var sliderWidth = 0
      var sliderHeight = 0

      var margin = {top: 20, right: 15, bottom: 10, left: 10}
      var globalDistributionObj = {}
      var svg = d3.select("#load-balance-container")
        .append('svg')
        .attr('width', containerWidth)
        .attr('height', containerHeight) // *3
      var width = +containerWidth - margin.left - margin.right
      var height = +containerHeight - margin.top - margin.bottom

      var tg = svg.append("g")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                  .attr('id', 'container-g')
                  // .attr('width', width)
                  // .attr('height', height) // *3

      console.log('tg: ', tg)

      var tooltipId = "gates_tooltip"
      var tool_width = 180

      // $("body").append("<div class='tooltip' id='" + tooltipId + "'></div>");
      // $("#" + tooltipId).css("width", tool_width);
      hideTooltip();

      var topWrapperHeight = height - sliderHeight; // height*1.5

      var lineWidth = width * 0.02,
        lineHeight = topWrapperHeight

      var lineG = tg.append("g")
        .attr('transform', 'translate(0,0)')
        .attr('class', 'line-g');

      var graphWidth = width - lineWidth,
        graphHeight = topWrapperHeight;

      var graphG = tg.append("g")
        .attr('transform', "translate(" + (lineWidth + 20) + ",0)")
        .attr('class', 'graph-g');

      var compareWidth = width,
        compareHeight = height * 0.15 * 0.8,
        compareMargin = {top: compareHeight * 0.2, right: compareWidth * 0.2, bottom: compareHeight * 0.05, left: 0};

      console.log(graphHeight)
      console.log(compareMargin)

      console.log(graphHeight+compareMargin.top * 2)
      var compareG = tg.append("g")
        .attr('transform', "translate(0," + (graphHeight+compareMargin.top * 2) + ")")
        .attr('class', 'compare-g');

      var n_nodes = 32, n_nodes_ratio = 0.5; // 0.15 for 64 nodes

      console.log('max_round: ',max_round)

      var max_node2_r = (graphWidth/(n_nodes + (n_nodes-1)*n_nodes_ratio))/2, // 9
          min_node2_r = max_node2_r/3, // 3, 
          max_node2_stroke_w = max_node2_r/3; // 3
      var max_compline = max_node2_r * 0.8, max_compline_w = max_node2_r * 0.2; // 10
      var node_r = max_node2_r * 1.01; // 10
      var rect_xOffset = node_r * 1.3, rect_yOffset = node_r * 1.3;
      var max_block_rect_w = ((graphHeight-node_r*2)/(max_round-1))/6; // 12
      var max_block_rect_h = max_block_rect_w; // 12
      var node_text_size = max_node2_r * 0.8, node_text_xOffset = max_node2_r*(-1), node_text_yOffset = max_node2_r;


      var line_data = []
      links.forEach(function (d) {
        if (d.value > 0 || d.count > 0) {
          var x1 = parseInt(d.source) * graphWidth / nodes_num[d.round-1],
            y1 = (d.round - 1) * graphHeight / (nodes_num.length - 1),
            x2 = parseInt(d.target) * graphWidth / nodes_num[d.round],
            y2 = d.round * graphHeight / (nodes_num.length - 1);

          var p1 = [x1, y1]
          var p2 = [(x2 + 3 * x1) / 4, (y1 + y2) / 2]
          var p3 = [(3 * x2 + x1) / 4, (y1 + y2) / 2]
          var p4 = [x2, y2]

          line_data.push({
            'points': [p1, p2, p3, p4],
            'attr': {"source": d.source, "target": d.target, "value": d.value, "count": d.count, "round": d.round}
          })
        }
      })

      var link = graphG.append('g');
      var lineIndex = 0
      line_data.forEach(function (line) {
        link.append('path')
          .datum(line.points)
          .attr("d", lineGenaretor)
          .attr("id", "line-" + lineIndex)
          .attr("fill", "none")
          .attr('class', 'node-link')
          .attr('source', line.attr.source)
          .attr('target', line.attr.target)
          .attr("round", line.attr.round)
          .attr("value", line.attr.value)
          .attr("count", line.attr.count)
          .attr("stroke-width", function (d) {
            if (line.attr.value > 100)
              return (line.attr.value - min_value) * (3.0 - 0.3) / (max_value - min_value) + 0.3;
            else {
              if (line.attr.count > 0) 
                return (line.attr.count - min_link_count) * (3.0 - 0.3) / (max_link_count - min_link_count) + 0.3;
              else return 0;
            }
          })
          .attr("stroke", function (d) {
            if (line.attr.value > 0 && line.attr.count > 0) return "black" // both
            if (line.attr.value > 0 && line.attr.count <= 0) return "green" // only particles
            if (line.attr.value <= 0 && line.attr.count > 0) return "red" // only blocks
            if (line.attr.value <= 0 && line.attr.count <= 0) return "white"
          })// TODO
          .attr("stroke-opacity", "0.1")
        lineIndex = lineIndex + 1
      })

      // draw lines for comparison between exact workload and estimated workload
      var complines = graphG.selectAll(".comp_lines")
        .data(nodes)
        .enter()
        .append("line")
        .attr('x1', function (d){
          return parseInt(d.name) * graphWidth / nodes_num[d.round-1];
        })
        .attr('y1', function (d){
          return (d.round - 1) * graphHeight / (nodes_num.length - 1);
        })
        .attr('x2', function (d){
          var ridus =  (d.npts - d.nfdpts - min_nufdpts) * (max_node2_r - min_node2_r) / (max_npts - min_nufdpts) + min_node2_r;
          var diff_estWl = max_wl_estWl_diff[d.round-1] - min_wl_estWl_diff[d.round-1];
          if (d.estWorkload > d.workload) {
            var diff = (d.estWorkload - d.workload - min_wl_estWl_diff[d.round-1])*max_compline/diff_estWl;
            return parseInt(d.name) * graphWidth / nodes_num[d.round-1] - ridus - diff;
          } else {
            var diff = (d.workload - d.estWorkload - min_wl_estWl_diff[d.round-1])*max_compline/diff_estWl;
            return parseInt(d.name) * graphWidth / nodes_num[d.round-1] + ridus + diff;
          }
        })
        .attr('y2', function (d){
          return (d.round - 1) * graphHeight / (nodes_num.length - 1);
        })
        .attr('fill', 'none')
        .attr('opacity', function(d) {
          if (d.round == 1) return '0';
          else return '0.8';
        })
        .attr('stroke', 'black')
        .attr('stroke-width', max_compline_w);

      // draw nodes with max workload TODO
      var node = graphG.selectAll(".max-nodes")
        .data(nodes)
        .enter()
        .append("circle")
        .attr('class', 'node')
        .attr('id', function (d, i) {
          return 'node-' + i
        })
        .attr("r", function (d) {
          if (d.rank == n_nodes-1) return node_r;
          else return 0;
        }) 
        .attr("fill", "none")
        .attr("stroke-opacity", "0.8")
        .attr("stroke", "black")
        .attr("stroke-width", function (d) {
          if (d.rank == n_nodes-1) return 1;
          else return 0;
        }) // TODO
        .attr("cx", function (d) {
          return parseInt(d.name) * graphWidth / nodes_num[d.round-1];
        })
        .attr("cy", function (d) {
          return (d.round - 1) * graphHeight / (nodes_num.length - 1);
        });

      // draw nodes 
      var menu = contextMenu().items('Incoming Block Dist.', 'Outgoing Block Dist.', 'Sources/Targets', 'Focused Sources/Targets');

      var node2 = graphG.selectAll(".nodes")
        .data(nodes)
        .enter()
        .append("circle")
        .attr('class', 'node')
        .attr('id', function (d, i) {
          nodes_ids.push(i);
          return 'node-' + i
        })
        .attr("r", function (d) {
          var unfinished = d.npts - d.nfdpts;
          return (unfinished - min_nufdpts) * (max_node2_r - min_node2_r) / (max_npts - min_nufdpts) + min_node2_r;
        })
        .attr("fill", function (d) {
          var linear = d3.scale.linear()
            .domain([min_wl[d.round - 1], max_wl[d.round - 1]])
            .range([0, 1]);

          return compute(linear(d.workload));
        })
        .attr("opacity", "1.0")
        .attr("cx", function (d) {
          return parseInt(d.name) * graphWidth / nodes_num[d.round-1];
          // return d.rank * graphWidth / nodes_num[d.round - 1];
        })
        .attr("cy", function (d) {
          return (d.round - 1) * graphHeight / (nodes_num.length - 1);
        })
        .attr("stroke", "black")
        .attr("stroke-width", function (d) {
          return (d.nfdpts - min_nfdpts) * max_node2_stroke_w / (max_nfdpts - min_nfdpts);
        })
        //.attr("stroke-opacity", "0.5")
        .on('click', function (d, i) {
          graphG.selectAll(".nodetexts").remove();
          graphG.selectAll(".noderects").remove();

          selected_block = -1;
          nodes_transfer = [];
          for (var i = 0; i < max_round; i ++) 
            nodes_transfer[i] = {};

          if (selected_nodes[d.round-1][d.name] == 1)
            selected_nodes[d.round-1][d.name] = 0;
          else
            selected_nodes[d.round-1][d.name] = 1;

          console.log(selected_nodes)
          //var r_value = drawCompareHistogram(d, n_compares);
          //if (r_value == 1) n_compares ++;

          d3.selectAll('.blockhist').remove();
          d3.selectAll('.blockhist_hint').remove();
          d3.selectAll('.blockhist_maxwl').remove();
          updateCompareHistogram(); // TODO

          computeNodesSourceTarget();

          updateNodesRelated();
          updateNodeSelection_Rects();
          updateNodeSelection_Links(2);

          d3.selectAll('.in_block_path_block').remove();
          d3.selectAll('.in_block_path').remove();
          d3.selectAll('.in_block_path_rect').remove();
          updateInBlockPathDist();
          
          d3.selectAll('.block_path_block').remove();
          d3.selectAll('.block_path').remove();
          d3.selectAll('.block_path_rect').remove();
          updateOutBlockPathDist();
        })
        .on('mouseover', function (d) { showDetails(d) })
        .on("mouseout", function (d) { hideDetails() })
        .on('contextmenu', function (d) { 
          var focused_node = {"name": d.name, "round": d.round}; 
          d3.event.preventDefault();
          console.log('contextmenu')
          menu(d3.mouse(this)[0]+(lineWidth + 20 + margin.left), d3.mouse(this)[1] + margin.top, focused_node);
        });

      function computeInDistNodesSource()
      {
        for (var i = 0; i < max_round; i ++)
          indistnodes_source[i] = {};

        links.forEach(function (link) {
          if (indistselected_nodes[link.round][link.target] == 1 && (link.count > 0)) { // link.value > 100
            indistnodes_source[link.round-1][link.source] = 1;
          }
        });
      }
      function computeOutDistNodesTarget()
      {
        for (var i = 0; i < max_round; i ++)
          outdistnodes_target[i] = {};

        links.forEach(function (link) {
          if (outdistselected_nodes[link.round-1][link.source] == 1 && (link.count > 0)) { // link.value > 100
            outdistnodes_target[link.round][link.target] = 1;
          }
        });
      }
      function computeNodesSourceTarget()
      {
        for (var i = 0; i < max_round; i ++) {
          nodes_source[i] = {};
          nodes_target[i] = {};
        }
        links.forEach(function (link) {
          if (selected_nodes[link.round-1][link.source] == 1 && (link.value > 100 || link.count > 0)) {
            // console.log(link.round)
            // console.log(link.target)
            // console.log(nodes_target[link.round][link.target])
            nodes_target[link.round][link.target] = 1;
            nodes_source[link.round-1][link.source] = 1;
          }
          if (selected_nodes[link.round-1][link.target] == 1 && (link.value > 100 || link.count > 0)) {
            nodes_source[link.round-1][link.source] = 1;
            nodes_target[link.round][link.target] = 1;
          } 
        });

        // console.log(nodes_source)
        // console.log(nodes_target)
      }
      function computeDBLNodesSourceTarget(round, name)
      {
        for (var i = 0; i < max_round; i ++) {
          nodes_source[i] = {};
          nodes_target[i] = {};
        }

        console.log(round, name)

        links.forEach(function (link) {
          if (link.round >= round && link.source == name && (link.value > 100 || link.count > 0)) {
            nodes_target[link.round][link.target] = 1;
            nodes_source[link.round-1][name] = 1;
          } 

          if (link.round < round && link.target == name && (link.value > 100 || link.count > 0)) {
            nodes_source[link.round-1][link.source] = 1;
            nodes_target[link.round][name] = 1;
          }
        })

        //console.log(nodes_source)
        //console.log(nodes_target)
      }
      
      function updateNodeSelection_Rects()
      {
        graphG.selectAll(".rects").data(nodes).enter().append('rect')
          .attr("class", "noderects")
          .attr("x", function (d) {
            return parseInt(d.name) * graphWidth / nodes_num[d.round-1] - rect_xOffset;
          })
          .attr("y", function (d) {
            return (d.round - 1) * graphHeight / (nodes_num.length - 1) - rect_yOffset;
          })
          .attr("width", function (d) {
            if (selected_nodes[d.round-1][d.name] == 1)
              return rect_xOffset*2;
            else return 0;
          })
          .attr("height", function (d) {
            if (selected_nodes[d.round-1][d.name] == 1)
              return graphHeight / (nodes_num.length - 1) + rect_yOffset*2;
            else return 0;
          })
          .attr("opacity", function (d) {
            if (selected_nodes[d.round-1][d.name] == 1) return 1;
            else return 0;
          })
          .attr("fill", "none")
          .attr("stroke", "black")
          .attr("stroke-dasharray", 5)
          .attr("stroke-width", 1);
      }
      function updateNodeSelection_Links(index)
      {
        link.selectAll('path')
          .attr("stroke-width", function (q) {
            var value = d3.select(this).attr('value'),
                count = d3.select(this).attr('count');
            if (value > 100)
              return (value - min_value) * (3.0 - 0.3) / (max_value - min_value) + 0.3;
            else {
              if (count > 0) 
                return (count - min_link_count) * (3.0 - 0.3) / (max_link_count - min_link_count) + 0.3;
              else return 0;
            }
          })
          .attr("stroke", function (q) {
            var value = d3.select(this).attr('value'),
                count = d3.select(this).attr('count');
            if (value > 0 && count > 0) return "black" // both
            if (value > 0 && count <= 0) return "green" // only particles
            if (value <= 0 && count > 0) return "red" // only blocks
            if (value <= 0 && count <= 0) return "white"
          })// TODO
          .attr("stroke-opacity", function (q) {
            var source = d3.select(this).attr('source'),
              target = d3.select(this).attr('target'),
              round = d3.select(this).attr('round');

            if (index == 0) {
              if (selected_nodes[round-1][target] == 1) return 1;
              else return 0.02
            } else if (index == 1) {
              if (selected_nodes[round-1][source] == 1) return 1;
              else return 0.02
            } else if (index == 2) {
              if (selected_nodes[round-1][source] == 1 || selected_nodes[round-1][target] == 1) return 1;
              else return 0.02;
            } else
              alert("Error input parameter!");
          });
      }
      function updateDBLNodeSelection_Links(r, name)
      {
        link.selectAll('path')
          .attr("stroke-width", function (q) {
            var value = d3.select(this).attr('value'),
                count = d3.select(this).attr('count');
            if (value > 100)
              return (value - min_value) * (3.0 - 0.3) / (max_value - min_value) + 0.3;
            else {
              if (count > 0) 
                return (count - min_link_count) * (3.0 - 0.3) / (max_link_count - min_link_count) + 0.3;
              else return 0;
            }
          })
          .attr("stroke", function (q) {
            var value = d3.select(this).attr('value'),
                count = d3.select(this).attr('count');
            if (value > 0 && count > 0) return "black" // both
            if (value > 0 && count <= 0) return "green" // only particles
            if (value <= 0 && count > 0) return "red" // only blocks
            if (value <= 0 && count <= 0) return "white"
          })// TODO
          .attr("stroke-opacity", function (q) {
            var source = d3.select(this).attr('source'),
              target = d3.select(this).attr('target'),
              round = d3.select(this).attr('round');

            if ((round >= r && source == name) || (round < r && target == name)) return 1;
            else return 0.02;
          });
      }
      function showTooltip(content, event) {
        $("#" + tooltipId).html(content);
        $("#" + tooltipId).show();
        updatePosition(event);
      }
      function hideTooltip() {
        $("#" + tooltipId).hide();
      }
      function showDetails(data) {
        var content = "";
        content = "<span class=\"name\">Round: </span><span class=\"address\">" + data.round + "</span><br/>";
        content += "<span class=\"name\">Proc ID: </span><span class=\"address\">" + data.name + "</span><br/>";
        content += "<span class=\"name\">NBlocks: </span><span class=\"address\">" + data.count + "</span><br/>";
        content += "<span class=\"name\">NLocalBlocks: </span><span class=\"address\">" + data.localCount + "</span><br/>";
        content += "<span class=\"name\">Workload: </span><span class=\"address\">" + data.workload + "</span><br/>";
        content += "<span class=\"name\">Est_Workload: </span><span class=\"address\">" + data.estWorkload + "</span><br/>";
        content += "<span class=\"name\">Workload_Diff: </span><span class=\"address\">" + (data.workload - data.estWorkload) + "</span><br/>";
        content += "<span class=\"name\">N_Pts: </span><span class=\"address\">" + data.npts + "</span><br/>";
        content += "<span class=\"name\">N_Finished_Pts: </span><span class=\"address\">" + data.nfdpts + "</span><br/>";
        content += "<span class=\"name\">Workload_Per_Pt: </span><span class=\"address\">" + (data.workload / data.nfdpts).toFixed(3) + "</span><br/>";
        showTooltip(content, d3.event);
      }
      function hideDetails() {
        hideTooltip();
      }
      
      function updatePosition(event) {
        var ttid = "#" + tooltipId;
        var xOffset = 10;
        var yOffset = 10;
        var ttw = $(ttid).width();
        var tth = $(ttid).height();
        var wscrY = $(window).scrollTop();
        var wscrX = $(window).scrollLeft();
        var curX = (document.all) ? event.clientX + wscrX : event.pageX;
        var curY = (document.all) ? event.clientY + wscrY : event.pageY;
        var ttleft = ((curX - wscrX + xOffset * 2 + ttw) > $(window).width()) ? curX - ttw - xOffset * 2 : curX + xOffset;
        if (ttleft < wscrX + xOffset) {
          ttleft = wscrX + xOffset;
        }
        var tttop = ((curY - wscrY + yOffset * 2 + tth) > $(window).height()) ? curY - tth - yOffset * 2 : curY + yOffset;
        if (tttop < wscrY + yOffset) {
          tttop = curY + yOffset;
        }
        $(ttid).css('top', tttop + 'px').css('left', ttleft + 'px');
      } 
      
      function bid2coords(bid)
      {
        var coords = [];

        var dx = 8, dy = 8, dz = 8;
        var dxdy = dx*dy;
        coords[2] = parseInt(bid / dxdy);
        coords[1] = parseInt((bid - coords[2]*dxdy) / dx);
        coords[0] = bid - coords[1]*dx - coords[2]*dxdy;

        return coords;
      }
      function updateCompareHistogram() {
        var selected_procs = [];
        for (var i = 0; i < max_round; i ++) {
          for (var j = 0; j < n_nodes; j ++) {
            if (selected_nodes[i][j] == 1) {
              selected_procs.push({
                "name": j,
                "round": i+1
              });
            }
          }
        }

        // console.log(selected_procs);
        //compareG.selectAll(".comp_histograms").remove();
        selected_procs.forEach(function (da, index) {
          var data_nodes = [];
          var max_his_workload = 0;
          histograms[da.round-1].forEach(function (d, i) {
            if (d.name == da.name && d.workload > 100) {
              if (max_his_workload < d.workload) max_his_workload = d.workload;
              data_nodes.push({
                "blockid": d.blockid,
                "isLocal": d.isLocal,
                "workload": d.workload,
                "estWorkload": d.estWorkload
              });
            }
          });

          // console.log(data_nodes)

          if (max_his_workload == 0) {
            alert("Zero workload!");
            return 0;
          }
          
          //var data_dist;
          data_nodes.sort(function (a, b) {
            return b["workload"] - a["workload"];
          });

          var gap = compareWidth/data_nodes.length;
          var max_gap = 20;

          var compareHistograms = compareG.selectAll(".comp_histograms")
                .data(data_nodes)
                .enter().append("g")
                .attr("class", "blockhist")
                .attr("transform", function(d) {
                  return "translate(0," + (compareMargin.top+compareHeight)*index + ")";
                })
                .append('rect')
                .attr("x", function(d, i) {
                  return Math.min(gap, max_gap) * i;
                })
                .attr("y", function(d, i) {
                  return compareHeight - d.workload/max_his_workload * compareHeight;
                })
                .attr("width", function(d, i) {
                  return Math.min(gap, max_gap);
                })
                .attr("height", function(d) {
                  return d.workload/max_his_workload * compareHeight;
                })
                .attr("opacity", 0.5)
                .attr("fill", function(d){
                  if (d.isLocal == 1) return "black"; // in local repartitioning
                  else return "#666";
                })
                .attr("stroke", "black")
                .attr("stroke-width", 1)
                .on("click", function (d){
                  selected_block = d.blockid;
                  updateBlockTransfer(d.blockid)
                })
                .append("title").text(function(d){
                  var coords = bid2coords(d.blockid);
                  var texts = d.blockid + ": [" + coords[0] + "," + coords[1] + "," + coords[2] + "], " + d.workload;
                  return texts;
                });;

          var textrn = "round " + da.round + ", proc " + da.name;
          compareG.append("g")
              .attr("transform", function(d) {
                return "translate(0," + (compareMargin.top+compareHeight)*index + ")";
              }).append("text")
              .attr("class", "blockhist_hint")
              .attr("x", 0)
              .attr("y", compareHeight + 6)
              .attr("dy", "0.32em")
              .text(textrn);

          compareG.append("g")
              .attr("transform", function(d) {
                return "translate(0," + (compareMargin.top+compareHeight)*index + ")";
              }).append("text")
              .attr("class", "blockhist_maxwl")
              .attr("x", 0)
              .attr("y", 6)
              .attr("dy", "0.32em")
              .text(max_his_workload);

        });
      }
      function updateInBlockPathDist()
      {
        var link3 = graphG.append('g');

        var dblselected_procs = [];
        for (var i = 0; i < max_round; i ++) {
          for (var j = 0; j < n_nodes; j ++) {
            if (indistselected_nodes[i][j] == 1) {
              dblselected_procs.push({
                "name": j,
                "round": i+1
              });
            }
          }
        }

        dblselected_procs.forEach(function (da) {
          var round = da.round,
              process_id = +da.name
          //console.log(transfer_json[d.round][progress_id])
          var blockIdList = [],
              block_pos = {}

          transfers[round-2].forEach(function (u) {
            if (u.target == process_id) {
              //if (blockIdList.indexOf(u) == -1) { // no problem
                blockIdList.push(u)
                block_pos[u.blockid] = []
              //}
            }
          })
        
          blockIdList.sort(function (a, b) {
            return a["blockid"] - b["blockid"];
          }); 

          var block_len = blockIdList.length;

          var x1 = Math.max(process_id * graphWidth / nodes_num[round-1] - max_block_rect_w*block_len/2, 0), 
              y1 = (round-1) * graphHeight / (nodes_num.length - 1) - node_r * 1.1 - max_block_rect_h; 
              x1 = Math.min(x1, graphWidth - max_block_rect_w * (block_len+2));

          var pnode_r;
          temp_nodes[round-1].forEach(function (s) {
            if (s.name == process_id) 
              pnode_r = (s.npts - s.nfdpts - min_nufdpts) * (max_node2_r - min_node2_r) / (max_npts - min_nufdpts) + min_node2_r;
          })

          var xx1 = process_id * graphWidth / nodes_num[round-1],  // node_pos[round][progress_id][0],
              yy1 = (round-1) * graphHeight / (nodes_num.length-1) - pnode_r, // node_pos[round][progress_id][1],
              xx2 = x1 + max_block_rect_w * block_len/2,
              yy2 = y1

          var p1 = [xx1, yy1]
          var p2 = [(xx2 + 3 * xx1)/4, (yy1 + yy2)/2]
          var p3 = [(3 * xx2 + xx1)/4, (yy1 + yy2)/2]
          var p4 = [xx2, yy2]
          link3.append('path')
            .datum([p1, p2, p3, p4])
            .attr("d", lineGenaretor)
            .attr("class", 'in_block_path_block') // "block-path"+round+progress_id+"block")
            .attr("stroke", 'black')// TODO
            .attr("stroke-opacity", 1)
            .attr("stroke-width", 1)

          var max_his_workload = 0, min_his_workload = 1000000000;
          dist_json[round][process_id].forEach(function (u) {
            max_his_workload = Math.max(max_his_workload, u.workload);
            min_his_workload = Math.min(min_his_workload, u.workload);
          })

          graphG.selectAll(".rect"+round+process_id)
            .data(blockIdList)
            .enter().append("rect")
            .attr("class", "in_block_path_rect")
            .attr("x", function (u, i) { 
              block_pos[u.blockid].push(x1 + max_block_rect_w*i+max_block_rect_w/2)
              return x1 + max_block_rect_w*i
            })
            .attr("y", function (u, i) { 
              block_pos[u.blockid].push(y1)
              return y1; 
            })
            .attr("width", max_block_rect_w)
            .attr("height", max_block_rect_h)
            .attr("fill", function (u, i) {
              var linear = d3.scale.linear()
                .domain([min_his_workload, max_his_workload])
                .range([0, 1]);

              var workload = 0;
              dist_json[round][process_id].forEach(function (s) {
                if (u.blockid == s.blockid) workload = s.workload
              })

              return compute(linear(workload));
            })
            .attr("stroke-width", function (u) {
              if (u.blockid == selected_block) return 2
              else return 1
            })
            .attr("stroke", "black")
            .attr('cursor', 'pointer')
            .on('click', function (u, i) {
              if (selected_block == u.blockid) selected_block = -1;
              else selected_block = u.blockid;

              computeBlockTransferBlocks();
              updateBlockTransfer()
            })
            .on('mouseover', function (u) {
              d3.select(this).attr("stroke-width", 2);   

              // d3.selectAll(".block-path"+round+progress_id+".block"+d).attr("stroke", "red").attr("stroke-width", 1.5).attr("stroke-opacity", 0.8)
              blockRectMouseOver(u.blockid);
            })
            .on("mouseout", function (u) { 
              d3.select(this).attr("stroke-width", function (s) {
                if (s.blockid == selected_block) return 2;
                else return 1;
              })
              // d3.selectAll(".block-path"+round+progress_id).attr("stroke", "black").attr("stroke-width", 1).attr("stroke-opacity", 0.4)
              blockRectMouseOut(u.blockid);
            })
            .append("title")
            .text(function (u) { 
              var workload = 0;
              dist_json[round][process_id].forEach(function (s) {
                if (u.blockid == s.blockid) workload = s.workload
              })

              var coords = bid2coords(u.blockid);
              var texts = u.blockid + ": [" + coords[0] + "," + coords[1] + "," + coords[2] + "], " + workload;
              
              return texts;
              //return u; 
            });
      /*
          graphG.selectAll(".rect"+round+process_id)
            .data(blockIdList)
            .enter().append("rect")
            .attr("class", "in_block_path_rect")
            .attr("x", function (u, i) {
              return x1 + max_block_rect_w*i
            })
            .attr("y", function (u, i) {
              return y1 - max_block_rect_h;
            })
            .attr("width", max_block_rect_w)
            .attr("height", max_block_rect_h)
            .attr("fill", function (u, i) {
              linear = d3.scale.linear()
                .domain([min_his_workload, max_his_workload])
                .range([0, 1]);

              var estWorkload = 0;
              dist_json[round][process_id].forEach(function (s) {
                if (u.blockid == s.blockid) estWorkload = s.estWorkload
              })

              return compute(linear(estWorkload));
            })
            .attr("stroke-width", function (u) {
              if (u.blockid == selected_block) return 2
              else return 1
            })
            .attr("stroke", "black")
            .append("title")
            .text(function (u) { 
              var estWorkload = 0;
              dist_json[round][process_id].forEach(function (s) {
                if (u.blockid == s.blockid) estWorkload = s.estWorkload
              })

              return estWorkload;
             })
      */  
          var lineIndex = 0
          blockIdList.forEach(function (u) {
            var snode_r;
            temp_nodes[round-2].forEach(function (s) {
              if (s.name == u.source) 
                snode_r = (s.npts - s.nfdpts - min_nufdpts) * (max_node2_r - min_node2_r) / (max_npts - min_nufdpts) + min_node2_r;
            })

            var x1 = block_pos[u.blockid][0],
                y1 = block_pos[u.blockid][1],
                x2 = u.source * graphWidth / nodes_num[round-1], // node_pos[round+1][index][0],
                y2 = (round-2) * graphHeight / (nodes_num.length - 1) + snode_r; // node_pos[round+1][index][1]

            var p1 = [x1, y1]
            var p2 = [(x2 + 3 * x1)/4, (y1 + y2)/2]
            var p3 = [(3 * x2 + x1)/4, (y1 + y2)/2]
            var p4 = [x2, y2]
            link3.append('path')
              .datum([p1, p2, p3, p4])
              .attr("d", lineGenaretor)
              .attr("class", 'in_block_path') //"block-path"+round+progress_id+" block"+u)
              .attr("id", u.blockid) // "line-block-"+lineIndex)
              .attr('isLocal', u.isLocal)
              .attr("fill", "none")
              .attr("stroke", function () {
                if (u.blockid == selected_block) {
                  if (u.isLocal == 1) return 'red'
                  else return 'green'
                } else return 'black'
              })// TODO
              .attr("stroke-opacity", function () {
                if (u.blockid == selected_block) return 1
                else return 0.3;
              })
              .attr("stroke-width", function () {
                if (u.blockid == selected_block) return 1.5
                else return 0.5;
              })
          })
        })
      }

      function updateOutBlockPathDist()
      {
        var link2 = graphG.append('g');
        // TODO remove click_select
        var dblselected_procs = [];
        for (var i = 0; i < max_round; i ++) {
          for (var j = 0; j < n_nodes; j ++) {
            if (outdistselected_nodes[i][j] == 1) {
              dblselected_procs.push({
                "name": j,
                "round": i+1
              });
            }
          }
        }

        dblselected_procs.forEach(function (da) {
          var round = da.round,
              process_id = +da.name
          //console.log(transfer_json[d.round][progress_id])
          var blockIdList = [],
              block_pos = {}

          var block2proc = [];
          for(var index in transfer_json[da.round][process_id]){
            transfer_json[da.round][process_id][index].forEach(function (u){
              block2proc.push({
                "target": index,
                "blockid": u.blockid
              })
              if(blockIdList.indexOf(u.blockid) == -1) {
                blockIdList.push(u.blockid)
                block_pos[u.blockid] = []
              }
            })
          }
        
          blockIdList.sort(function (a, b) {
            return a - b;
          });

          var block_len = blockIdList.length;

          var x1 = Math.max(process_id * graphWidth / nodes_num[round-1] - max_block_rect_w*block_len/2, 0), 
              y1 = (round-1) * graphHeight / (nodes_num.length - 1) + node_r * 1.1; 
              x1 = Math.min(x1, graphWidth - max_block_rect_w * (block_len+2));

          var pnode_r;
          temp_nodes[round-1].forEach(function (s) {
            if (s.name == process_id) 
              pnode_r = (s.npts - s.nfdpts - min_nufdpts) * (max_node2_r - min_node2_r) / (max_npts - min_nufdpts) + min_node2_r;
          })

          var xx1 = process_id * graphWidth / nodes_num[round-1],  // node_pos[round][progress_id][0],
              yy1 = (round-1) * graphHeight / (nodes_num.length-1) + pnode_r, // node_pos[round][progress_id][1],
              xx2 = x1 + max_block_rect_w * block_len/2,
              yy2 = y1

          var p1 = [xx1, yy1]
          var p2 = [(xx2 + 3 * xx1)/4, (yy1 + yy2)/2]
          var p3 = [(3 * xx2 + xx1)/4, (yy1 + yy2)/2]
          var p4 = [xx2, yy2]
          link2.append('path')
            .datum([p1, p2, p3, p4])
            .attr("d", lineGenaretor)
            .attr("class", 'block_path_block') // "block-path"+round+progress_id+"block")
            .attr("stroke", 'black')// TODO
            .attr("stroke-opacity", 1)
            .attr("stroke-width", 1)

          var max_his_workload = 0, min_his_workload = 1000000000;   
      /*
          dist_json[round][process_id].forEach(function (u) {
            max_his_workload = Math.max(max_his_workload, u.workload);
            min_his_workload = Math.min(min_his_workload, u.workload);
          })
      */

          var blkwl = {}
          blockIdList.forEach(function (d) {
            blkwl[d] = 0;
            var flag = 0;
            block2proc.forEach(function (u) {
              if (u.blockid == d)  {
                if (u.target < n_nodes) {
                  dist_json[round+1][u.target].forEach(function (s) {
                    if (s.blockid == u.blockid)
                      blkwl[d] += s.workload
                  })
                } else flag = 1;
              }
            })

            if (flag == 0) {
              max_his_workload = Math.max(max_his_workload, blkwl[d]);
              min_his_workload = Math.min(min_his_workload, blkwl[d]);
            }
          })

          // console.log(max_his_workload, min_his_workload)

          graphG.selectAll(".rect"+round+process_id)
            .data(blockIdList)
            .enter().append("rect")
            .attr("class", "block_path_rect")
            .attr("x", function (u, i) { 
              block_pos[u].push(x1 + max_block_rect_w*i+max_block_rect_w/2)
              return x1 + max_block_rect_w*i
            })
            .attr("y", function (u, i) { 
              block_pos[u].push(y1+max_block_rect_h)
              return y1; 
            })
            .attr("width", max_block_rect_w)
            .attr("height", max_block_rect_h)
            .attr("fill", function (u, i) {
              var flag = 0
              if (transfer_json[round][process_id][n_nodes]) {
                transfer_json[round][process_id][n_nodes].forEach(function (s){
                  if(s.blockid == u) flag = 1
                })
              }

              if (flag == 1) return 'white'
              else {
                var linear = d3.scale.linear()
                  .domain([min_his_workload, max_his_workload])
                  .range([0, 1]);
      /*
                var workload = -1;
                dist_json[round][process_id].forEach(function (s) {
                  if (u == s.blockid) workload = s.workload
                })
      */
                var workload = blkwl[u]
                if (workload < 0) alert("Error block workload!");

                return compute(linear(workload));
              }
            })
            .attr("stroke-width", function (u) {
              if (u == selected_block) return 2
              else return 1
            })
            .attr("stroke", "black")
            .attr('cursor', 'pointer')
            .on('click', function (u, i) {
              console.log('click block_path_rect')
              console.log(selected_block)
              if (u == selected_block) selected_block = -1;
              else selected_block = u;

              computeBlockTransferBlocks();
              updateBlockTransfer()
            })
            .on('mouseover', function (u) {
              d3.select(this).attr("stroke-width", 2);   

              // d3.selectAll(".block-path"+round+progress_id+".block"+d).attr("stroke", "red").attr("stroke-width", 1.5).attr("stroke-opacity", 0.8)
              blockRectMouseOver(u);
            })
            .on("mouseout", function (u) { 
              d3.select(this).attr("stroke-width", function (s) {
                if (s == selected_block) return 2;
                else return 1;
              })
              // d3.selectAll(".block-path"+round+progress_id).attr("stroke", "black").attr("stroke-width", 1).attr("stroke-opacity", 0.4)
              blockRectMouseOut(u);
            })
            .append("title")
            .text(function (u) { 
              var workload = 0;
      /*
              dist_json[round][process_id].forEach(function (s) {
                if (u == s.blockid) workload = s.workload
              })    
      */
              workload = blkwl[u]
              var coords = bid2coords(u);
              var texts = u + ": [" + coords[0] + "," + coords[1] + "," + coords[2] + "], " + workload;
              
              return texts;
              //return u; 
            });
        
          var lineIndex = 0
          for(var index in transfer_json[round][process_id]){
            transfer_json[round][process_id][index].forEach(function (u){
              if (index < n_nodes) {
                var snode_r;
                temp_nodes[round].forEach(function (s) {
                  if (s.name == index) 
                    snode_r = (s.npts - s.nfdpts - min_nufdpts) * (max_node2_r - min_node2_r) / (max_npts - min_nufdpts) + min_node2_r;
                })

                var x1 = block_pos[u.blockid][0],
                    y1 = block_pos[u.blockid][1],
                    x2 = index * graphWidth / nodes_num[round], // node_pos[round+1][index][0],
                    y2 = round * graphHeight / (nodes_num.length - 1) - snode_r; // node_pos[round+1][index][1]

                var p1 = [x1, y1]
                var p2 = [(x2 + 3 * x1)/4, (y1 + y2)/2]
                var p3 = [(3 * x2 + x1)/4, (y1 + y2)/2]
                var p4 = [x2, y2]
                link2.append('path')
                  .datum([p1, p2, p3, p4])
                  .attr("d", lineGenaretor)
                  .attr("class", 'block_path') //"block-path"+round+progress_id+" block"+u)
                  .attr("id", u.blockid) // "line-block-"+lineIndex)
                  .attr("isLocal", u.isLocal)
                  .attr("fill", "none")
                  .attr("stroke", function () {
                    if (u.blockid == selected_block) {
                      if (u.isLocal == 1) return 'red'
                      else return 'green'
                    } else return 'black'
                  })// TODO
                  .attr("stroke-opacity", function () {
                    if (u.blockid == selected_block) return 1
                    else return 0.3;
                  })
                  .attr("stroke-width", function () {
                    if (u.blockid == selected_block) return 1.5
                    else return 0.5;
                  })
                //lineIndex+=1
              }
            })
          }
        })
      }

      function blockRectMouseOver(u) 
      {
        d3.selectAll(".block_path")
          .attr("stroke", function () {
            if (d3.select(this).attr('id') == selected_block) {
              if (d3.select(this).attr('isLocal') == 1) return "red";
              else return 'green'
            } else return "black"
          })
          .attr("stroke-width", function () {
            if (d3.select(this).attr('id') == u || d3.select(this).attr('id') == selected_block) return 1.5;
            else return 0.5;
          })
          .attr("stroke-opacity", function () {
            if (d3.select(this).attr('id') == u || d3.select(this).attr('id') == selected_block) return 1;
            else return 0.3;
          })

        d3.selectAll(".in_block_path")
          .attr("stroke", function () {
            if (d3.select(this).attr('id') == selected_block) {
              if (d3.select(this).attr('isLocal') == 1) return "red";
              else return 'green'
            } else return "black"
          })
          .attr("stroke-width", function () {
            if (d3.select(this).attr('id') == u || d3.select(this).attr('id') == selected_block) return 1.5;
            else return 0.5;
          })
          .attr("stroke-opacity", function () {
            if (d3.select(this).attr('id') == u || d3.select(this).attr('id') == selected_block) return 1;
            else return 0.3;
          })
      }

      function blockRectMouseOut(u) 
      {
        d3.selectAll(".block_path")
          .attr("stroke", function () {
            if (d3.select(this).attr('id') == selected_block) {
              if (d3.select(this).attr('isLocal') == 1) return "red";
              else return 'green'
            } else return 'black'
          })
          .attr("stroke-width", function () {
            if (d3.select(this).attr('id') == selected_block) return 1.5
            else return 0.5;
          })
          .attr("stroke-opacity", function () {
            if (d3.select(this).attr('id') == selected_block) return 1
            else return 0.3;
          })

        d3.selectAll(".in_block_path")
          .attr("stroke", function () {
            if (d3.select(this).attr('id') == selected_block) {
              if (d3.select(this).attr('isLocal') == 1) return "red";
              else return 'green'
            } else return 'black'
          })
          .attr("stroke-width", function () {
            if (d3.select(this).attr('id') == selected_block) return 1.5
            else return 0.5;
          })
          .attr("stroke-opacity", function () {
            if (d3.select(this).attr('id') == selected_block) return 1
            else return 0.3;
          })
      }

      function computeBlockTransferBlocks()
      {
        for (var i = 0; i < max_round; i ++) {
          nodes_source[i] = {};
          nodes_target[i] = {};
          selected_nodes[i] = {};
        }
        
        nodes_transfer = [];
        for (var i = 0; i < max_round; i ++) {
          nodes_transfer[i] = {}
          histograms[i].forEach(function (u, j){
            if (u.blockid == selected_block) nodes_transfer[i][u.name] = 1;
          })
        }
        console.log('nodes_transfer: ', nodes_transfer)
      }
      function updateNodesRelated()
      {
        var highlighted_nodes = [];
        for (var i = 0; i < max_round; i ++) {
          highlighted_nodes[i] = {}
          for (var j = 0; j < n_nodes; j ++) {
            if (nodes_target[i][j] == 1 || nodes_source[i][j] == 1 || outdistselected_nodes[i][j] == 1 || outdistnodes_target[i][j] == 1 || indistselected_nodes[i][j] == 1 || indistnodes_source[i][j] == 1 || nodes_transfer[i][j] == 1)
              highlighted_nodes[i][j] = 1;
          }
        }

        complines.attr('opacity', function (u) {
          if (highlighted_nodes[u.round-1][u.name] == 1) 
            return 0.8;
          else {
            if (u.round == 1) return 0;
            else return 0.02;
          }
        });

        node.attr('opacity', function (u) {
          if (highlighted_nodes[u.round-1][u.name] == 1) 
            return 0.8;
          else return 0.4;
        });

        node2.attr('opacity', function (u) {
          if (highlighted_nodes[u.round-1][u.name] == 1) 
            return 1;
          else return 0.25;
        });

        graphG.selectAll(".texts").data(nodes).enter().append("text")
          .text(function (u) {
            if (highlighted_nodes[u.round-1][u.name] == 1)
              return u.name;
          })
          .attr("class", "nodetexts")
          .attr('x', function (u) {
            return parseInt(u.name) * graphWidth / nodes_num[u.round-1] + node_text_xOffset;
          })
          .attr('y', function (u) {
            return (u.round - 1) * graphHeight / (nodes_num.length - 1) + node_text_yOffset;
          })
          .attr('text-anchor', 'middle')
          .style('font-size', node_text_size);
      }

      function updateBlockTransfer()
      {
        graphG.selectAll(".nodetexts").remove();
        graphG.selectAll(".noderects").remove();

        updateNodesRelated(); 
        
        updateBlockTransferPath(selected_block);


        d3.selectAll('.block_path')
          .attr("stroke", function () {
            if (d3.select(this).attr('id') == selected_block) {
              if (d3.select(this).attr('isLocal') == 1) return "red";
              else return 'green'
            } else return "black"
          })
          .attr("stroke-width", function () {
            if (d3.select(this).attr('id') == selected_block) return 1.5;
            else return 0.5;
          })
          .attr("stroke-opacity", function () {
            if (d3.select(this).attr('id') == selected_block) return 1;
            else return 0.3;
          })

        d3.selectAll('.in_block_path')
          .attr("stroke", function () {
            if (d3.select(this).attr('id') == selected_block) {
              if (d3.select(this).attr('isLocal') == 1) return "red";
              else return 'green'
            } else return "black"
          })
          .attr("stroke-width", function () {
            if (d3.select(this).attr('id') == selected_block) return 1.5;
            else return 0.5;
          })
          .attr("stroke-opacity", function () {
            if (d3.select(this).attr('id') == selected_block) return 1;
            else return 0.3;
          })

        d3.selectAll('.block_path_rect')
          .attr("stroke-width", function (u){
            if (u == selected_block) return 2;
            else return 1;
          })

        d3.selectAll('.in_block_path_rect')
          .attr("stroke-width", function (u){
            if (u.blockid == selected_block) return 2;
            else return 1;
          })
      }

      function updateBlockTransferPath(blockid)
      {
        link.selectAll('path')
          .attr('stroke', function (u){
            var source = d3.select(this).attr('source'),
                target = d3.select(this).attr('target'),
                round = d3.select(this).attr('round');

            var temp = 0;
            transfers[round-1].forEach(function (s){
              if (s.source == source && s.target == target && s.blockid == blockid && outdistselected_nodes[round-1][source] != 1 && indistselected_nodes[round][target] != 1) {
                if (s.isLocal == 1) temp = 1
                else temp = -1;
              }
            })

            if (temp == 1) return 'red'; // local 
            else if (temp == -1) return 'green'; 
            else return 'white';
          })
          .attr('stroke-width', 1)
          .attr('stroke-opacity', function (u) {
            var source = d3.select(this).attr('source'),
                target = d3.select(this).attr('target'),
                round = d3.select(this).attr('round');

            var temp = 0;
            transfers[round-1].forEach(function (s){
              if (s.source == source && s.target == target && s.blockid == blockid && outdistselected_nodes[round-1][source] != 1 && indistselected_nodes[round][target] != 1) {
                //nodes_texts[round-1][s.source] = 1;
                //nodes_texts[round][s.target] = 1;
                temp = 1;
              }
            })

            if (temp == 1) return 1;
            else return 0.02;
          });
      }
      function contextMenu() {
        var height,
            width, 
            margin = 0.1, // fraction of width
            items = [], 
            rescale = false, 
            style = {
              'rect': {
                'mouseout': {
                  'fill': 'rgb(244,244,244)', 
                  'stroke': 'white', 
                  'stroke-width': '1px'
                }, 
                'mouseover': {
                  'fill': 'rgb(200,200,200)'
                }
              }, 
              'text': {
                'fill': 'steelblue', 
                'font-size': '13'
              }
            }; 
          
        function menu(x, y, focused_node) {
          d3.select('.context-menu').remove();
          scaleItems();

          // Draw the menu
          d3.select('svg')
            .append('g').attr('class', 'context-menu')
            .selectAll('tmp')
            .data(items).enter()
            .append('g').attr('class', 'menu-entry')
            .style({'cursor': 'pointer'})
            .on('mouseover', function(){ 
              d3.select(this).select('rect').style(style.rect.mouseover) })
            .on('mouseout', function(){ 
              d3.select(this).select('rect').style(style.rect.mouseout) });
              
          d3.selectAll('.menu-entry')
            .append('rect')
            .attr('class', style.text)
            .attr('x', x)
            .attr('y', function(d, i){ return y + (i * height); })
            .attr('width', width)
            .attr('height', height)
            .style(style.rect.mouseout);
              
          d3.selectAll('.menu-entry')
            .append('text')
            .text(function(d){ return d; })
            .attr('x', x)
            .attr('y', function(d, i){ return y + (i * height); })
            .attr('dy', height - margin / 2)
            .attr('dx', margin)
            .style(style.text);

          d3.selectAll('.menu-entry')
            .on('click', function (d, index){ 
              var name = focused_node.name, round = focused_node.round;
              
              if (index == 0) { // Incoming Block Dist.
                if (round == 1) { alert("First round no incoming!"); return; }
                
                graphG.selectAll(".nodetexts").remove();
                d3.selectAll('.in_block_path_block').remove();
                d3.selectAll('.in_block_path').remove();
                d3.selectAll('.in_block_path_rect').remove();
                updateNodeSelection_Links(2);
      /*
                selected_block = -1;
                nodes_transfer = [];
                for (var i = 0; i < max_round; i ++) 
                  nodes_transfer[i] = {};
      */
                if (indistselected_nodes[round-1][name] == 1)
                  indistselected_nodes[round-1][name] = 0;
                else 
                  indistselected_nodes[round-1][name] = 1;

                computeInDistNodesSource();
       
                if (selected_block == -1)
                  updateNodesRelated(); 
                updateInBlockPathDist(); 
                if (selected_block != -1)
                  updateBlockTransfer(); // TODO
              } else if (index == 1) { // Outgoing Block Dist.
                graphG.selectAll(".nodetexts").remove();
                d3.selectAll('.block_path_block').remove();
                d3.selectAll('.block_path').remove();
                d3.selectAll('.block_path_rect').remove();
                updateNodeSelection_Links(2);
   
                if (outdistselected_nodes[round-1][name] == 1)
                  outdistselected_nodes[round-1][name] = 0;
                else 
                  outdistselected_nodes[round-1][name] = 1;

                computeOutDistNodesTarget()

                if (selected_block == -1)
                  updateNodesRelated();
                updateOutBlockPathDist();
                if (selected_block != -1)
                  updateBlockTransfer(); // TODO
              } else {
                graphG.selectAll(".noderects").remove();
                graphG.selectAll(".nodetexts").remove();

                d3.selectAll('.in_block_path_block').remove();
                d3.selectAll('.in_block_path').remove();
                d3.selectAll('.in_block_path_rect').remove();

                d3.selectAll('.block_path_block').remove();
                d3.selectAll('.block_path').remove();
                d3.selectAll('.block_path_rect').remove();
              
                for (var i = 0; i < max_round; i ++) {
                  selected_nodes[i] = {};
                  selected_nodes[i][name] = 1;

                  outdistnodes_target[i] = {};
                  outdistselected_nodes[i] = {};

                  indistnodes_source[i] = {};
                  indistselected_nodes[i] = {};
                }

                if (index == 2) { // Sources/Targets
                  computeNodesSourceTarget();
                  updateNodesRelated();
                  updateNodeSelection_Links(2);
                } else { // 'Focused Sources/Targets'
                  computeDBLNodesSourceTarget(round, name);
                  updateNodesRelated(); 
                  updateDBLNodeSelection_Links(round, name);
                }

                for (var i = 0; i < max_round; i ++) {
                  nodes_source[i] = {};
                  nodes_target[i] = {};
                  selected_nodes[i] = {};
                }
              }
            });

          // Other interactions
          d3.select('body')
            .on('click', function() {
              d3.select('.context-menu').remove();
            });
        }
          
        menu.items = function(e) {
          if (!arguments.length) return items;
          for (var i in arguments) items.push(arguments[i]);
          rescale = true;
          return menu;
        }

        // Automatically set width, height, and margin;
        function scaleItems() {
          if (rescale) {
            d3.select('svg').selectAll('tmp')
              .data(items).enter()
              .append('text')
              .text(function(d){ return d; })
              .style(style.text)
              .attr('x', -1000)
              .attr('y', -1000)
              .attr('class', 'tmp');
            
            var z = d3.selectAll('.tmp')[0]
                      .map(function(x){ return x.getBBox(); });
            width = d3.max(z.map(function(x){ return x.width; }));
            margin = margin * width;
            width =  width + 2 * margin;
            height = d3.max(z.map(function(x){ return x.height + margin / 2; }));
                  
            // cleanup
            d3.selectAll('.tmp').remove();
            rescale = false;
          }
        }

        return menu;
      }
    
    }
  }
}

</script>
<style lang="less">
@import "../style/style.css";
@import "../style/d3.slider.css";

</style>
