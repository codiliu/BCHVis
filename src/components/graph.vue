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
        graphData: 'getGraphData',
        selectRound: 'getSelectRound'
      }),
  },
  watch: {
    graphData: function(data) {
      console.log('graphData: ', data)
      this.drawGraph(data['nodes'], data['links'], data['transfer_json'], data['dist_json'])
      //console.log('d3: ',d3)
    },
    selectRound: function(data){
      console.log('data: ', data)
      // this.rerankGraph(data)
    }
  },
  methods: {
    drawGraph(nodes, links, transfer_json, dist_json) {
      var self = this

      var containerWidth = +$('#load-balance-container').width()
      var containerHeight = +$('#load-balance-container').height()

      var margin = {top: 20, right: 15, bottom: 20, left: 10}
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

      $("body").append("<div class='tooltip' id='" + tooltipId + "'></div>");
      $("#" + tooltipId).css("width", tool_width);
      hideTooltip();

      var topWrapperHeight = height; // height*1.5

      var lineWidth = 0, // no line view
        lineHeight = topWrapperHeight

      var lineG = tg.append("g")
        .attr('transform', 'translate(0,0)')
        .attr('class', 'line-g');

      var graphWidth = width - lineWidth,
        graphHeight = topWrapperHeight;

      var graphG = tg.append("g")
        .attr('transform', "translate(" + (lineWidth + 20) + ",0)")
        .attr('class', 'graph-g');



      var color = d3.scale.category10();
      var a = d3.rgb(0, 255, 0); //红色               设置渐变颜色的起始
      var b = d3.rgb(255, 0, 0); //绿色
      var compute = d3.interpolate(a, b);

      var lineGenaretor = d3.svg.line()
        .interpolate("basis")
        .x(function (d) {
          return d[0]
        })
        .y(function (d) {
          return d[1]
        });


      

      var max_round = 15, n_nodes = 32, n_nodes_ratio = 0.5; // 0.15 for 64 nodes
      var max_node2_r = (graphWidth/(n_nodes + (n_nodes-1)*n_nodes_ratio))/2, // 9
          min_node2_r = max_node2_r/3, // 3, 
          max_node2_stroke_w = max_node2_r/3; // 3
      var max_compline = max_node2_r * 0.8, max_compline_w = max_node2_r * 0.2; // 10
      var node_r = max_node2_r * 1.01; // 10
      var rect_xOffset = node_r * 1.3, rect_yOffset = node_r * 1.3;
      var max_block_rect_w = ((graphHeight-node_r*2)/(max_round-1))/6; // 12
      var max_block_rect_h = max_block_rect_w; // 12
      var node_text_size = max_node2_r * 0.8, node_text_xOffset = max_node2_r*(-1), node_text_yOffset = max_node2_r;




      var selected_block = -1;
      var selected_nodes = []
      var highlighted_nodes = [];          
      var nodes_source = [], nodes_target = [];
      var nodes_transfer = [];
      var indistpath_nodes = [];
      for (var i = 0; i < max_round; i ++) {
        nodes_source[i] = {};
        nodes_target[i] = {};
        selected_nodes[i] = {};
        highlighted_nodes[i] = {}
        nodes_transfer[i] = {};
        indistpath_nodes[i] = {};
      }
      var outdistselected_nodes = [], indistselected_nodes = [];
      var outdistnodes_target = [], indistnodes_source = [];
      for (var i = 0; i < max_round; i ++) {
        outdistnodes_target[i] = {};
        outdistselected_nodes[i] = {};

        indistnodes_source[i] = {};
        indistselected_nodes[i] = {};
      }
      var focused_round = -1, focused_name = -1;

      var rankings = {};
      for (var i = 0; i < n_nodes; i ++) rankings[i] = i;



      var max_wl = [], min_wl = [];
      var max_est_wl = [], min_est_wl = [];
      var max_wl_estWl_diff = [], min_wl_estWl_diff = [];

      var min_all_npts, max_all_npts;
      var min_npts, max_npts;
      var min_nfdpts, max_nfdpts;
      var min_nufdpts, max_nufdpts;
      var min_value, max_value;
      var min_link_count, max_link_count;
      for (var i = 0; i < max_round; i++) {
        min_wl[i] = 1000000000;
        max_wl[i] = 0;

        min_est_wl[i] = 1000000000;
        max_est_wl[i] = 0;

        min_wl_estWl_diff[i] = 1000000000;
        max_wl_estWl_diff[i] = 0;

        nodes.forEach(function (d, j) {
          if (d.round == i + 1) {
            min_wl[i] = Math.min(min_wl[i], parseInt(d.workload))
            max_wl[i] = Math.max(max_wl[i], parseInt(d.workload))

            min_est_wl[i] = Math.min(min_est_wl[i], parseInt(d.estWorkload))
            max_est_wl[i] = Math.max(max_est_wl[i], parseInt(d.estWorkload))

            min_wl_estWl_diff[i] = Math.min(min_wl_estWl_diff[i], Math.abs(parseInt(d.workload) - parseInt(d.estWorkload)))
            max_wl_estWl_diff[i] = Math.max(max_wl_estWl_diff[i], Math.abs(parseInt(d.workload) - parseInt(d.estWorkload)))
          }
        });
      }
      min_npts = d3.min(nodes, function (d) { return d.npts });
      max_npts = d3.max(nodes, function (d) { return d.npts });
      min_nfdpts = d3.min(nodes, function (d) { return d.nfdpts });
      max_nfdpts = d3.max(nodes, function (d) { return d.nfdpts });
      min_nufdpts = d3.min(nodes, function (d) { return d.npts - d.nfdpts });
      max_nufdpts = d3.max(nodes, function (d) { return d.npts - d.nfdpts });
      min_value = d3.min(links, function (d) { return d.value });
      max_value = d3.max(links, function (d) { return d.value });
      min_link_count = d3.min(links, function (d) { return d.count });
      max_link_count = d3.max(links, function (d) { return d.count });
    


      var node_json = {}
      nodes.forEach(function (d, i) {
        if(!node_json[d.round]) node_json[d.round] = []
        node_json[d.round].push({
           "name": d.name,
           "count": d.count,
           "localCount": d.localCount,
           "workload": d.workload,
           "estWorkload": d.estWorkload,
           "npts": d.npts,
           "nfdpts": d.nfdpts,
           "round": d.round 
        })
      })

      var max_nodes = [];
      for (var i = 0; i < max_round; i ++) {
        node_json[i+1].sort(function (a, b) {
          return b["workload"] - a["workload"];
        });

        max_nodes.push({"round": node_json[i+1][0].round, "name": node_json[i+1][0].name});
      }
      //if (d.rank == n_nodes-1) max_nodes.push({"round": d.round, "name": d.name});


      var menu = contextMenu().items('Incoming Block Dist.', 'Outgoing Block Dist.', 'Sources/Targets', 'Focused Sources/Targets');

      var proc_link = graphG.append('g');
      var outdist_link = graphG.append('g');
      var indist_link = graphG.append('g');
      var transpath_link = graphG.append('g');

      var line_data = []
      links.forEach(function (d) {
        if (d.value > 0 || d.count > 0) {
          var x1 = parseInt(d.source) * graphWidth / n_nodes,
            y1 = (d.round - 1) * graphHeight / (max_round - 1),
            x2 = parseInt(d.target) * graphWidth / n_nodes,
            y2 = d.round * graphHeight / (max_round - 1);

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

      // draw links between proc. nodes 
      line_data.forEach(function (line) {
        proc_link.append('path')
          .datum(line.points)
          .attr("d", lineGenaretor)
          .attr("id", "line-" + line.attr.round + line.attr.source + line.attr.target)
          .attr("fill", "none")
          .attr('class', 'proc-link')
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
          .attr("stroke-opacity", 0.1)
      })

      // draw nodes representing procs
      var node = graphG.selectAll(".nodes").data(nodes).enter()
        .append("circle")
        .attr('class', 'node')
        .attr('id', function (d, i) {
          //nodes_ids.push(i);
          return 'node-' + i
        })
        .attr("r", function (d) {
          //if (d.rank == n_nodes-1) max_nodes.push({"round": d.round, "name": d.name});

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
          return rankings[d.name] * graphWidth / n_nodes;
        })
        .attr("cy", function (d) {
          return (d.round - 1) * graphHeight / (max_round - 1);
        })
        .attr("stroke", "black")
        .attr("stroke-width", function (d) {
          return (d.nfdpts - min_nfdpts) * max_node2_stroke_w / (max_nfdpts - min_nfdpts);
        })
        //.attr("stroke-opacity", "0.5")
        .on('click', function (d, i) {
     

 //
          if (d.round == 10 && d.name == 10) {  // TODO just for test
            var rounds = {};
            rounds[1] = 1
            computeRerankOrder(rounds);
            updateGraph()
            return 
          }


          graphG.selectAll(".nodetexts").remove();
          graphG.selectAll(".noderects").remove();
          focused_round = focused_name = -1;

          // select or disselect node
          if (selected_nodes[d.round-1][d.name] == 1)
            selected_nodes[d.round-1][d.name] = 0;
          else
            selected_nodes[d.round-1][d.name] = 1;

          updateProcLinks(-1, -1);
          updateProcNodes();
          updateProcNodeRects();

          if (isNoneNodesHighlighted()) recoveryProcNodesLinks();
        })
        .on('mouseover', function (d) { showDetails(d) })
        .on("mouseout", function (d) { hideDetails() })
        .on('contextmenu', function (d) { 
          var focused_node = {"name": d.name, "round": d.round}; 
          d3.event.preventDefault();
          console.log('contextmenu')
          menu(d3.mouse(this)[0]+(lineWidth + 20), d3.mouse(this)[1], focused_node);
        });

      // draw nodes with max workload TODO
      var max_node = graphG.selectAll(".max-nodes").data(max_nodes).enter()
        .append("circle")
        .attr('class', 'node')
        .attr('id', function (d, i) {
          return 'maxnode-' + i
        })
        .attr("r", node_r) 
        .attr("fill", "none")
        .attr("stroke-opacity", "0.8")
        .attr("stroke", "black")
        .attr("stroke-width", 1) 
        .attr("cx", function (d) {
          return rankings[d.name] * graphWidth / n_nodes;
        })
        .attr("cy", function (d) {
          return (d.round - 1) * graphHeight / (max_round - 1);
        });






















      function computeRerankOrder(rounds)
      {
        var procwls = []
        for (var i = 0; i < n_nodes; i ++) procwls.push(0);
        nodes.forEach(function (d, i) {
          if (rounds[d.round] == 1)
            procwls[d.name] += d.workload;
        })

        var proc2wls = []
        for (var i = 0; i < n_nodes; i ++)
          proc2wls.push({"name": i, "workload": procwls[i]});
        proc2wls.sort(function (a, b) {
          return b["workload"] - a["workload"];
        });

        rankings = {};
        proc2wls.forEach(function (d, i) {
          rankings[d.name] = i;
        })
      }

      function computeReorderOrder(blockid)
      {
        // TODO
      }

      function updateGraph()
      {
        proc_link.selectAll('path').remove();
        //console.log("proc_link:", proc_link)
        var line_data = []
        links.forEach(function (d) {
          if (d.value > 0 || d.count > 0) {
            var x1 = rankings[d.source] * graphWidth / n_nodes,
              y1 = (d.round - 1) * graphHeight / (max_round - 1),
              x2 = rankings[d.target] * graphWidth / n_nodes,
              y2 = d.round * graphHeight / (max_round - 1);

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

        line_data.forEach(function (line) {
          proc_link.append('path')
            .datum(line.points)
            .attr("d", lineGenaretor)
            .attr("id", "line-" + line.attr.round + line.attr.source + line.attr.target)
            .attr("fill", "none")
            .attr('class', 'proc-link')
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
            })
            .attr("stroke-opacity", 0.1)
        });


        graphG.selectAll(".noderects").remove();
        graphG.selectAll(".nodetexts").remove();
        updateProcLinks(focused_round, focused_name);


        for (var i = 1; i < max_round; i ++) {
          for (var j = 0; j < n_nodes; j ++) {
            if (indistpath_nodes[i][j] == 1 || indistselected_nodes[i][j] == 1) {
              if (indistselected_nodes[i][j] == 1) removeInBlockDist(i+1, j, -1)
              else removeInBlockDist(i+1, j, selected_block)
            }
          }
        }

        for (var i = 0; i < max_round; i ++) {
          for (var j = 0; j < n_nodes; j ++) {
            if (outdistselected_nodes[i][j] == 1) {
              removeOutBlockDist(i+1, j)
            }
          }
        }

        for (var i = 1; i < max_round; i ++) {
          for (var j = 0; j < n_nodes; j ++) {
            if (indistpath_nodes[i][j] == 1 || indistselected_nodes[i][j] == 1) {
              if (indistselected_nodes[i][j] == 1) addInBlockDist(i+1, j, -1)
              else addInBlockDist(i+1, j, selected_block)
            }
          }
        }

        for (var i = 0; i < max_round; i ++) {
          for (var j = 0; j < n_nodes; j ++) {
            if (outdistselected_nodes[i][j] == 1) {
              addOutBlockDist(i+1, j, 0)

              if (indistpath_nodes[i+1][j] == 1 && indistselected_nodes[i+1][j] != 1) {
                removeInBlockDist(i+2, j, selected_block);
                addInBlockDist(i+2, j, selected_block);
              }
            }
          }
        }

        updateProcNodes();
        updateProcNodeRects(); 

        if (isNoneNodesHighlighted()) recoveryProcNodesLinks();
      }


      













      



      // functions for drawings and interations

      // functions for updating nodes and proc links
      function updateProcNodeRects() // TODO do not use .data(nodes) 
      {
        graphG.selectAll(".rects").data(nodes).enter().append('rect')
          .attr("class", "noderects")
          .attr("x", function (d) {
            return rankings[d.name] * graphWidth / n_nodes - rect_xOffset;
          })
          .attr("y", function (d) {
            return (d.round - 1) * graphHeight / (max_round - 1) - rect_yOffset;
          })
          .attr("width", function (d) {
            if (selected_nodes[d.round-1][d.name] == 1)
              return rect_xOffset*2;
            else return 0;
          })
          .attr("height", function (d) {
            if (selected_nodes[d.round-1][d.name] == 1)
              return graphHeight / (max_round - 1) + rect_yOffset*2;
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

      function updateProcNodes()
      {
        highlighted_nodes = [];
        for (var i = 0; i < max_round; i ++) {
          highlighted_nodes[i] = {}
          for (var j = 0; j < n_nodes; j ++) {
            if (nodes_target[i][j] == 1 || nodes_source[i][j] == 1 || outdistselected_nodes[i][j] == 1 || outdistnodes_target[i][j] > 0 || indistselected_nodes[i][j] == 1 || indistnodes_source[i][j] > 0 || nodes_transfer[i][j] == 1 || 
              indistpath_nodes[i][j] == 1)
              highlighted_nodes[i][j] = 1;
          }
        }

        max_node.attr('opacity', function (u) {
            if (highlighted_nodes[u.round-1][u.name] == 1) return 0.8;
            else return 0.4;
          })
          .attr("cx", function (d) {
            return rankings[d.name] * graphWidth / n_nodes;
          })
          .attr("cy", function (d) {
            return (d.round - 1) * graphHeight / (max_round - 1);
          });

        node.attr('opacity', function (u) {
            if (highlighted_nodes[u.round-1][u.name] == 1) return 1;
            else return 0.25;
          })
          .attr("cx", function (d) {
            return rankings[d.name] * graphWidth / n_nodes;
          })
          .attr("cy", function (d) {
            return (d.round - 1) * graphHeight / (max_round - 1);
          });

        graphG.selectAll(".texts").data(nodes).enter().append("text")
          .text(function (u) {
            if (highlighted_nodes[u.round-1][u.name] == 1)
              return u.name;
          })
          .attr("class", "nodetexts")
          .attr('x', function (u) {
            return rankings[u.name] * graphWidth / n_nodes + node_text_xOffset;
          })
          .attr('y', function (u) {
            return (u.round - 1) * graphHeight / (max_round - 1) + node_text_yOffset;
          })
          .attr('text-anchor', 'middle')
          .style('font-size', node_text_size);
      }

      function updateProcLinks(r, name) 
      {
        for (var i = 0; i < max_round; i ++) {
          nodes_source[i] = {};
          nodes_target[i] = {};
        }

        proc_link.selectAll('path')
          .attr("stroke-opacity", function (q) {
            var source = d3.select(this).attr('source'),
              target = d3.select(this).attr('target'),
              round = d3.select(this).attr('round'),
              value = d3.select(this).attr('value'),
              count = d3.select(this).attr('count');
 
            if (r < 0) {
              if (selected_nodes[round-1][source] == 1 || selected_nodes[round-1][target] == 1) {
                if (selected_nodes[round-1][source] == 1 && (value > 100 || count > 0)) {
                  nodes_target[round][target] = 1;
                  nodes_source[round-1][source] = 1;
                }

                if (selected_nodes[round-1][target] == 1 && (value > 100 || count > 0)) {
                  nodes_source[round-1][source] = 1;
                  nodes_target[round][target] = 1;
                }

                return 1;
              }
              else return 0.02;
            }
            else {
              if ((round >= r && source == name) || (round < r && target == name)) {
                if ((round >= r && source == name) && (value > 100 || count > 0)) {
                  nodes_target[round][target] = 1;
                  nodes_source[round-1][name] = 1;
                }

                if ((round < r && target == name) && (value > 100 || count > 0)) {
                  nodes_source[round-1][source] = 1;
                  nodes_target[round][name] = 1;
                }

                return 1;
              }
              else return 0.02;
            }
          });
      }




      // functions for block dist
      function computeBlockPathBlocks(blockid)
      {
        nodes_transfer = [];
        indistpath_nodes = [];
        for (var i = 0; i < max_round; i ++) {
          nodes_transfer[i] = {}
          indistpath_nodes[i] = {};

          for (var index in dist_json[i+1]) {
            dist_json[i+1][index].forEach(function (u, j) {
              if (u.blockid == blockid)  {
                nodes_transfer[i][index] = 1;
                indistpath_nodes[i][index] = 1;
              }
            })
          }
        }
      }

      function addInBlockDist(round, name, blockid) 
      {
        var blockIdList = [],
            block_pos = {}

        var source; // for blockid >= 0

        for(var jsource in transfer_json[round-1]) {
          for (var jtarget in transfer_json[round-1][jsource]) {
            transfer_json[round-1][jsource][jtarget].forEach(function (u) {
              if (jtarget == name && (blockid >= 0 ? u.blockid == blockid : true)) {
                blockIdList.push({"source": jsource, "target": jtarget, "blockid": u.blockid, "isLocal": u.isLocal})
                block_pos[u.blockid] = []

                source = jsource;

                if (indistnodes_source[round-2][jsource]) indistnodes_source[round-2][jsource] += 1;
                else indistnodes_source[round-2][jsource] = 1;
              }
            })
          }
        }

        blockIdList.sort(function (a, b) {
          return a["blockid"] - b["blockid"];
        }); 

        var block_len = blockIdList.length;

        var x1 = Math.max(rankings[name] * graphWidth / n_nodes - max_block_rect_w*block_len/2, -1 *node_r * 1.1), 
            y1 = (round-1) * graphHeight / (max_round - 1) - node_r * 1.1 - max_block_rect_h; 
            x1 = Math.min(x1, graphWidth - max_block_rect_w * (block_len+2));

        var pnode_r;
/*
        temp_nodes[round-1].forEach(function (s) {
          if (s.name == name) 
            pnode_r = (s.npts - s.nfdpts - min_nufdpts) * (max_node2_r - min_node2_r) / (max_npts - min_nufdpts) + min_node2_r;
        })
*/
        node_json[round].forEach(function (s) {
          if (s.name == name) 
            pnode_r = (s.npts - s.nfdpts - min_nufdpts) * (max_node2_r - min_node2_r) / (max_npts - min_nufdpts) + min_node2_r;
        })

        var xx1 = rankings[name] * graphWidth / n_nodes,  // node_pos[round][progress_id][0],
            yy1 = (round-1) * graphHeight / (max_round-1) - pnode_r, // node_pos[round][progress_id][1],
            xx2 = x1 + max_block_rect_w * block_len/2,
            yy2 = y1

        var p1 = [xx1, yy1]
        var p2 = [(xx2 + 3 * xx1)/4, (yy1 + yy2)/2]
        var p3 = [(3 * xx2 + xx1)/4, (yy1 + yy2)/2]
        var p4 = [xx2, yy2]
        indist_link.append('path')
          .datum([p1, p2, p3, p4])
          .attr("d", lineGenaretor)
          .attr("class", 'in_block_dist'+round+name) // "block-path"+round+progress_id+"block")
          .attr("stroke", 'black')// TODO
          .attr("stroke-opacity", 1)
          .attr("stroke-width", 1)

        var max_his_workload = 0, min_his_workload = 1000000000;
        dist_json[round][name].forEach(function (u) {
          max_his_workload = Math.max(max_his_workload, u.workload);
          min_his_workload = Math.min(min_his_workload, u.workload);
        })

        graphG.selectAll(".in_block_rect"+round+name)
          .data(blockIdList)
          .enter().append("rect")
          .attr("class", "in_block_dist_rect"+round+name)
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
            dist_json[round][name].forEach(function (s) {
              if (u.blockid == s.blockid) workload = s.workload
            })

            return compute(linear(workload));
          })
          .attr("stroke-width", function (u) {
            if (u.blockid == selected_block) return 1
            else return 0.5
          })
          .attr("stroke", "black")
          .attr('cursor', 'pointer')
          .on('click', function (u, i) {
            updateBlockTransferPath(u.blockid) 

            if (isNoneNodesHighlighted()) recoveryProcNodesLinks();       
          })
          .on('mouseover', function (u) {
            d3.select(this).attr("stroke-width", 1);   

            blockRectMouseOver(u.blockid);
          })
          .on("mouseout", function (u) { 
            d3.select(this).attr("stroke-width", function (s) {
              if (s.blockid == selected_block) return 1;
              else return 0.5;
            })

            blockRectMouseOut(u.blockid);
          })
          .append("title")
          .text(function (u) { 
            var workload = 0;
            dist_json[round][name].forEach(function (s) {
              if (u.blockid == s.blockid) workload = s.workload
            })

            var coords = bid2coords(u.blockid);
            var texts = u.blockid + ": [" + coords[0] + "," + coords[1] + "," + coords[2] + "], " + workload;
            
            return texts;
            //return u; 
          });

        if (blockid >= 0) { // for connecting outdist blocks and indist blocks (along the block transfer path)

          for (var i = 0; i < n_nodes; i ++)
            if (outdistselected_nodes[round-2][i] == 1 && i == source) return;
        }

        blockIdList.forEach(function (u) {
          var snode_r;
/*
          temp_nodes[round-2].forEach(function (s) {
            if (s.name == u.source) 
              snode_r = (s.npts - s.nfdpts - min_nufdpts) * (max_node2_r - min_node2_r) / (max_npts - min_nufdpts) + min_node2_r;
          })
*/
          node_json[round-1].forEach(function (s) {
            if (s.name == u.source) 
              snode_r = (s.npts - s.nfdpts - min_nufdpts) * (max_node2_r - min_node2_r) / (max_npts - min_nufdpts) + min_node2_r;
          })

          var x1 = block_pos[u.blockid][0],
              y1 = block_pos[u.blockid][1],
              x2 = rankings[u.source] * graphWidth / n_nodes, // node_pos[round+1][index][0],
              y2 = (round-2) * graphHeight / (max_round - 1) + snode_r; // node_pos[round+1][index][1]

          var p1 = [x1, y1]
          var p2 = [(x2 + 3 * x1)/4, (y1 + y2)/2]
          var p3 = [(3 * x2 + x1)/4, (y1 + y2)/2]
          var p4 = [x2, y2]
          indist_link.append('path')
            .datum([p1, p2, p3, p4])
            .attr("d", lineGenaretor)
            .attr("class", 'in_block_dist'+round+name) //"block-path"+round+progress_id+" block"+u)
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
              else return 1;
            })
        })
      }

      function removeInBlockDist(round, name, blockid)
      {
        for(var jsource in transfer_json[round-1]) {
          for (var jtarget in transfer_json[round-1][jsource]) {
            transfer_json[round-1][jsource][jtarget].forEach(function (u) {
              if (jtarget == name && (blockid >= 0 ? u.blockid == blockid : true)) {
                indistnodes_source[round-2][jsource] = Math.max(indistnodes_source[round-2][jsource]-1, 0);
              }
            })
          }
        }

        d3.selectAll('.in_block_dist'+round+name).remove();
        d3.selectAll('.in_block_dist_rect'+round+name).remove();
      }

      function addOutBlockDist(round, name, flag) // add a flag only for connecting ...
      {
        var blockIdList = [],
            block_pos = {}

        var block2proc = [];
        for(var index in transfer_json[round][name]){
          transfer_json[round][name][index].forEach(function (u){

            block2proc.push({
              "target": index,
              "blockid": u.blockid
            })
            if (index < n_nodes) {
              if (outdistnodes_target[round][index]) outdistnodes_target[round][index] += 1;
              else outdistnodes_target[round][index] = 1;
            }

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

        var x1 = Math.max(rankings[name] * graphWidth / n_nodes - max_block_rect_w*block_len/2, -1 *node_r * 1.1), 
            y1 = (round-1) * graphHeight / (max_round - 1) + node_r * 1.1; 
            x1 = Math.min(x1, graphWidth - max_block_rect_w * (block_len+2));

        var pnode_r;
/*
        temp_nodes[round-1].forEach(function (s) {
          if (s.name == name) 
            pnode_r = (s.npts - s.nfdpts - min_nufdpts) * (max_node2_r - min_node2_r) / (max_npts - min_nufdpts) + min_node2_r;
        })
*/
        node_json[round].forEach(function (s) {
          if (s.name == name) 
            pnode_r = (s.npts - s.nfdpts - min_nufdpts) * (max_node2_r - min_node2_r) / (max_npts - min_nufdpts) + min_node2_r;
        })

        var xx1 = rankings[name] * graphWidth / n_nodes,  // node_pos[round][progress_id][0],
            yy1 = (round-1) * graphHeight / (max_round-1) + pnode_r, // node_pos[round][progress_id][1],
            xx2 = x1 + max_block_rect_w * block_len/2,
            yy2 = y1

        var p1 = [xx1, yy1]
        var p2 = [(xx2 + 3 * xx1)/4, (yy1 + yy2)/2]
        var p3 = [(3 * xx2 + xx1)/4, (yy1 + yy2)/2]
        var p4 = [xx2, yy2]
        outdist_link.append('path')
          .datum([p1, p2, p3, p4])
          .attr("d", lineGenaretor)
          .attr("class", 'out_block_dist'+round+name) // "block-path"+round+progress_id+"block")
          .attr("stroke", 'black')// TODO
          .attr("stroke-opacity", 1)
          .attr("stroke-width", 1)

        var max_his_workload = 0, min_his_workload = 1000000000;   

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

        graphG.selectAll(".out_block_rect"+round+name)
          .data(blockIdList)
          .enter().append("rect")
          .attr("class", "out_block_dist_rect"+round+name)
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
            if (transfer_json[round][name][n_nodes]) {
              transfer_json[round][name][n_nodes].forEach(function (s){
                if(s.blockid == u) flag = 1
              })
            }

            if (flag == 1) return 'white'
            else {
              var linear = d3.scale.linear()
                .domain([min_his_workload, max_his_workload])
                .range([0, 1]);

              var workload = blkwl[u]
              if (workload < 0) alert("Error block workload!");

              return compute(linear(workload));
            }
          })
          .attr("stroke-width", function (u) {
            if (u == selected_block) return 1
            else return 0.5
          })
          .attr("stroke", "black")
          .attr('cursor', 'pointer')
          .on('click', function (u, i) {
            updateBlockTransferPath(u);

            if (isNoneNodesHighlighted()) recoveryProcNodesLinks();
          })
          .on('mouseover', function (u) {
            d3.select(this).attr("stroke-width", 1);   

            blockRectMouseOver(u);
          })
          .on("mouseout", function (u) { 
            d3.select(this).attr("stroke-width", function (s) {
              if (s == selected_block) return 1;
              else return 0.5;
            })

            blockRectMouseOut(u);
          })
          .append("title")
          .text(function (u) { 
            var workload = 0;

            workload = blkwl[u]
            var coords = bid2coords(u);
            var texts = u + ": [" + coords[0] + "," + coords[1] + "," + coords[2] + "], " + workload;
            
            return texts;
            //return u; 
          });
      
        for(var index in transfer_json[round][name]){
          transfer_json[round][name][index].forEach(function (u){
            if (index < n_nodes) {
              var snode_r;
/*
              temp_nodes[round].forEach(function (s) {
                if (s.name == index) 
                  snode_r = (s.npts - s.nfdpts - min_nufdpts) * (max_node2_r - min_node2_r) / (max_npts - min_nufdpts) + min_node2_r;
              })
*/
              node_json[round+1].forEach(function (s) {
                if (s.name == index) 
                  snode_r = (s.npts - s.nfdpts - min_nufdpts) * (max_node2_r - min_node2_r) / (max_npts - min_nufdpts) + min_node2_r;
              })

              var x1 = block_pos[u.blockid][0],
                  y1 = block_pos[u.blockid][1],
                  x2 = rankings[index] * graphWidth / n_nodes, // node_pos[round+1][index][0],
                  y2 = round * graphHeight / (max_round - 1) - snode_r; // node_pos[round+1][index][1]

              if (flag >= 0 && (indistpath_nodes[round][index] == 1 && indistselected_nodes[round][index] != 1)) // for connecting outdist blocks and indist blocks (along the block transfer path)
                y2 = y2 + snode_r - node_r * 1.1 - max_block_rect_h;
              
              var p1 = [x1, y1]
              var p2 = [(x2 + 3 * x1)/4, (y1 + y2)/2]
              var p3 = [(3 * x2 + x1)/4, (y1 + y2)/2]
              var p4 = [x2, y2]
              outdist_link.append('path')
                .datum([p1, p2, p3, p4])
                .attr("d", lineGenaretor)
                .attr("class", 'out_block_dist'+round+name) //"block-path"+round+progress_id+" block"+u)
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
                  else return 1;
                })
              //lineIndex+=1
            }
          })
        }
      }

      function removeOutBlockDist(round, name)
      {
        for(var index in transfer_json[round][name]){
          transfer_json[round][name][index].forEach(function (u){
            if (index < n_nodes) outdistnodes_target[round][index] = Math.max(outdistnodes_target[round][index]-1, 0);
          })
        }

        d3.selectAll('.out_block_dist'+round+name).remove();
        d3.selectAll('.out_block_dist_rect'+round+name).remove();
      }

      function updateBlockTransferPath(blockid) 
      {
        graphG.selectAll(".nodetexts").remove();
        if (blockid == selected_block) {
          for (var i = 1; i < max_round; i ++) {
            for (var j = 0; j < n_nodes; j ++) {
              if (indistpath_nodes[i][j] == 1) {
                // indistpath_nodes[i][j] = 0;
                if (indistselected_nodes[i][j] == 1) 
                  updateBlockTransferPathRelated(i+1, j, -1);
                else {
                  removeInBlockDist(i+1, j, selected_block);

                  if (outdistselected_nodes[i-1][j] == 1) { // for connecting outdist blocks and indist blocks (along the block transfer path)
                    removeOutBlockDist(i, j);
                    //outdistselected_nodes[i-1][j] = 0
                    addOutBlockDist(i, j, -1)
                    //outdistselected_nodes[i-1][j] = 1
                  }
                }
              }
            }
          }

          selected_block = -1;
          for (var i = 0; i < max_round; i ++) {
            nodes_transfer[i] = {}
            indistpath_nodes[i] = {};
          }
        }
        else {
          // remove previous one first
          for (var i = 1; i < max_round; i ++) {
            for (var j = 0; j < n_nodes; j ++) {
              if (indistpath_nodes[i][j] == 1) {
                //indistpath_nodes[i][j] = 0;
                if (indistselected_nodes[i][j] == 1) 
                  updateBlockTransferPathRelated(i+1, j, -1);
                else {
                  removeInBlockDist(i+1, j, selected_block);

                  if (outdistselected_nodes[i-1][j] == 1) { // for connecting outdist blocks and indist blocks (along the block transfer path)
                    removeOutBlockDist(i, j);
                    //outdistselected_nodes[i-1][j] = 0
                    addOutBlockDist(i, j, -1)
                    //outdistselected_nodes[i-1][j] = 1
                  }
                }
              }
            }
          }

          selected_block = blockid;
          computeBlockPathBlocks(selected_block);

          for (var i = 1; i < max_round; i ++) {
            for (var j = 0; j < n_nodes; j ++) {
              if (indistpath_nodes[i][j] == 1) {
                if (indistselected_nodes[i][j] == 1) 
                  updateBlockTransferPathRelated(i+1, j, selected_block);
                else {
                  addInBlockDist(i+1, j, selected_block);
                  if (outdistselected_nodes[i-1][j] == 1) { // for connecting outdist blocks and indist blocks (along the block transfer path)
                    removeOutBlockDist(i, j);
                    addOutBlockDist(i, j, 0)
                  }
                }
              }
            }
          }
        }

        updateProcNodes();
      }

      function updateBlockTransferPathRelated(round, name, blockid)
      {
        d3.selectAll('.out_block_dist'+round+name)
          .attr("stroke", function () {
            if (d3.select(this).attr('id') == blockid) {
              if (d3.select(this).attr('isLocal') == 1) return "red";
              else return 'green'
            } else return "black"
          })
          .attr("stroke-width", function () {
            if (d3.select(this).attr('id') == blockid) return 1.5;
            else return 1;
          })
          .attr("stroke-opacity", function () {
            if (d3.select(this).attr('id') == blockid) return 1;
            else return 0.3;
          })

        d3.selectAll('.in_block_dist'+round+name)
          .attr("stroke", function () {
            if (d3.select(this).attr('id') == blockid) {
              if (d3.select(this).attr('isLocal') == 1) return "red";
              else return 'green'
            } else return "black"
          })
          .attr("stroke-width", function () {
            if (d3.select(this).attr('id') == blockid) return 1.5;
            else return 1;
          })
          .attr("stroke-opacity", function () {
            if (d3.select(this).attr('id') == blockid) return 1;
            else return 0.3;
          })

        d3.selectAll('.out_block_dist_rect'+round+name)
          .attr("stroke-width", function (u){
            if (u == blockid) return 1;
            else return 0.5;
          })

        d3.selectAll('.in_block_dist_rect'+round+name)
          .attr("stroke-width", function (u){
            if (u.blockid == blockid) return 1;
            else return 0.5;
          })
      }

      function blockRectMouseOver(u) 
      {
        for (var i = 0; i < max_round; i ++) { // TODO to be improved
          for (var j = 0; j < n_nodes; j ++) {
            d3.selectAll(".out_block_dist"+(i+1)+j)
              .attr("stroke", function () {
                if (d3.select(this).attr('id') == selected_block) {
                  if (d3.select(this).attr('isLocal') == 1) return "red";
                  else return 'green'
                } else return "black"
              })
              .attr("stroke-width", function () {
                if (d3.select(this).attr('id') == u || d3.select(this).attr('id') == selected_block) return 1.5;
                else return 1;
              })
              .attr("stroke-opacity", function () {
                if (d3.select(this).attr('id') == u || d3.select(this).attr('id') == selected_block) return 1;
                else return 0.3;
              })

            d3.selectAll(".in_block_dist"+(i+1)+j)
              .attr("stroke", function () {
                if (d3.select(this).attr('id') == selected_block) {
                  if (d3.select(this).attr('isLocal') == 1) return "red";
                  else return 'green'
                } else return "black"
              })
              .attr("stroke-width", function () {
                if (d3.select(this).attr('id') == u || d3.select(this).attr('id') == selected_block) return 1.5;
                else return 1;
              })
              .attr("stroke-opacity", function () {
                if (d3.select(this).attr('id') == u || d3.select(this).attr('id') == selected_block) return 1;
                else return 0.3;
              })
          }
        }
      }

      function blockRectMouseOut(u) 
      {
        for (var i = 0; i < max_round; i ++) { // TODO to be improved
          for (var j = 0; j < n_nodes; j ++) {
            d3.selectAll(".out_block_dist"+(i+1)+j)
              .attr("stroke", function () {
                if (d3.select(this).attr('id') == selected_block) {
                  if (d3.select(this).attr('isLocal') == 1) return "red";
                  else return 'green'
                } else return 'black'
              })
              .attr("stroke-width", function () {
                if (d3.select(this).attr('id') == selected_block) return 1.5
                else return 1;
              })
              .attr("stroke-opacity", function () {
                if (d3.select(this).attr('id') == selected_block) return 1
                else return 0.3;
              })

            d3.selectAll(".in_block_dist"+(i+1)+j)
              .attr("stroke", function () {
                if (d3.select(this).attr('id') == selected_block) {
                  if (d3.select(this).attr('isLocal') == 1) return "red";
                  else return 'green'
                } else return 'black'
              })
              .attr("stroke-width", function () {
                if (d3.select(this).attr('id') == selected_block) return 1.5
                else return 1;
              })
              .attr("stroke-opacity", function () {
                if (d3.select(this).attr('id') == selected_block) return 1
                else return 0.3;
              })
          }
        }
      }




      // functions for checking nodes
      function isNoneNodesHighlighted()
      {
        for (var i = 0; i < max_round; i ++) {
          for (var j = 0; j < n_nodes; j ++) {
            if (highlighted_nodes[i][j] == 1) return false;
          }
        }

        return true;
      }

      function recoveryProcNodesLinks()
      {
        max_node.attr('opacity', 0.8);
        node.attr('opacity', 1)

        proc_link.selectAll('path')
          .attr("stroke-opacity", 0.1)
      }




      // functions for context menu (rignt click events)
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
          d3.select('#container-g')
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

                if (indistselected_nodes[round-1][name] == 1) {
                  indistselected_nodes[round-1][name] = 0;
                  removeInBlockDist(round, name, -1);
                  if (indistpath_nodes[round-1][name] == 1) 
                    addInBlockDist(round, name, selected_block);
                }
                else {
                  indistselected_nodes[round-1][name] = 1;
                  if (indistpath_nodes[round-1][name] == 1) 
                    removeInBlockDist(round, name, selected_block);
                  addInBlockDist(round, name, -1);
                }
                
                updateProcLinks(-1, -1);
                updateProcNodes();
              } else if (index == 1) { // Outgoing Block Dist.
                graphG.selectAll(".nodetexts").remove();

                if (outdistselected_nodes[round-1][name] == 1) {
                  outdistselected_nodes[round-1][name] = 0;
                  removeOutBlockDist(round, name);

                  if (indistpath_nodes[round][name] == 1 && indistselected_nodes[round][name] != 1)
                    addInBlockDist(round+1, name, selected_block); 
                }
                else {
                  outdistselected_nodes[round-1][name] = 1;
                  addOutBlockDist(round, name, 0);

                  if (indistpath_nodes[round][name] == 1 && indistselected_nodes[round][name] != 1) {
                    removeInBlockDist(round+1, name, selected_block);
                    addInBlockDist(round+1, name, selected_block);
                  }
                }

                updateProcLinks(-1, -1);
                updateProcNodes();
              } else {
                graphG.selectAll(".noderects").remove();
                graphG.selectAll(".nodetexts").remove();

                for (var i = 0; i < max_round; i ++) {
                  selected_nodes[i] = {};
                  selected_nodes[i][name] = 1;
                }

                if (index == 2) { // Sources/Targets
                  focused_round = focused_name = -1;
                  updateProcLinks(-1, -1);
                  updateProcNodes();
                } else { // 'Focused Sources/Targets'
                  focused_round = round; focused_name = name;
                  updateProcLinks(round, name);
                  updateProcNodes(); 
                }

                for (var i = 0; i < max_round; i ++) {
                  selected_nodes[i] = {};
                }
              }

              if (isNoneNodesHighlighted()) recoveryProcNodesLinks();
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




      // functions for tooltips
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

        //console.log("context:", content);
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

    }
  }
}

</script>
<style lang="less">
@import "../style/style.css";
@import "../style/d3.slider.css";

</style>