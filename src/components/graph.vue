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
    this.init();

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
      this.drawGraph(data['nodes'], data['max_nodes'], data['links'], data['dists'], data['transfers'])
      //console.log('d3: ',d3)
    },
    selectRound: function(data) {
      console.log('selected rounds: ', data)
      self.rounds = data
      this.reRankGraph(data, this.graphData['nodes'], this.graphData['links'], this.graphData['dists'], this.graphData['transfers'])
    }
  },
  methods: {
    init(){
      var self = this;

      self.graphWidth = 0
      self.graphHeight = 0
      self.graphG = null;
      self.tooltipId = "gates_tooltip"

      self.compute = null
      self.lineGenaretor = null

      self.max_round = 0
      self.n_nodes = 0
      self.n_limited_nodes = 0
      self.n_display_nodes = 0

      self.n_nodes_ratio = 0
      self.max_node2_r = 0
      self.min_node2_r = 0
      self.max_node2_stroke_w = 0
      self.node_r = 0
      self.super_node_r = 0
      self.rect_xOffset = 0
      self.rect_yOffset = 0
      self.max_block_rect_w = 0
      self.max_block_rect_h = 0
      self.node_text_size = 0
      self.node_text_xOffset = 0
      self.node_text_yOffset = 0

      self.selected_block = -1;
      self.selected_nodes = []
      self.highlighted_nodes = [];          
      self.nodes_source = []
      self.nodes_target = [];
      self.nodes_transfer = [];
      self.indistpath_nodes = [];

      self.outdistselected_nodes = []
      self.indistselected_nodes = [];
      self.outdistnodes_target = []
      self.indistnodes_source = [];

      self.focused_round = -1
      self.focused_name = -1;

      self.rankings = {};
      self.filtered_nodes = {}
      self.display_nodes_array = []

      self.max_wl = []
      self.min_wl = [];
      //self.max_est_wl = []
      //self.min_est_wl = [];
      //self.max_wl_estWl_diff = []
      //self.min_wl_estWl_diff = [];

      self.min_all_npts = 0
      self.max_all_npts = 0
      self.min_npts = 0
      self.max_npts = 0
      self.min_nfdpts = 0
      self.max_nfdpts = 0
      self.min_nufdpts = 0
      self.max_nufdpts = 0
      self.min_value = 0
      self.max_value = 0
      self.min_link_count = 0
      self.max_link_count = 0
 
      //self.nodes = []
      self.max_nodes = []
      //self.links = []
      self.node_json = {}
      self.link_json = {}
      self.transfer_json = {}
      self.dist_json = {}

      self.menu = null;

      self.node = null
      self.proc_link = null
      self.outdist_link = null
      self.indist_link = null
      self.transpath_link = null
      self.max_node = null
    },

    drawGraph(nodes, max_nodes, links, dists, transfers) {
      var self = this

      //self.nodes = nodes,
      self.max_nodes = max_nodes
      //self.links = links,
      //self.transfer_json = transfer_json,
      //self.dist_json = dist_json

      var containerWidth = +$('#load-balance-container').width()
      var containerHeight = +$('#load-balance-container').height()
      var margin = {top: 20, right: 15, bottom: 20, left: 10}
      var svg = d3.select("#load-balance-container")
        .append('svg')
        .attr('width', containerWidth)
        .attr('height', containerHeight) // *3
      var width = +containerWidth - margin.left - margin.right
      var height = +containerHeight - margin.top - margin.bottom

      var tg = svg.append("g")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                  .attr('id', 'container-g')

      var tool_width = 180

      $("body").append("<div class='tooltip' id='" + self.tooltipId + "'></div>");
      $("#" + self.tooltipId).css("width", tool_width);
      self.hideTooltip();

      var topWrapperHeight = height; // height*1.5

      self.graphWidth = width
      self.graphHeight = topWrapperHeight

      self.graphG = tg.append("g")
        .attr('transform', "translate(" + 20 + ",0)")
        .attr('class', 'graph-g');

      self.node = self.graphG.append('g');
      self.proc_link = self.graphG.append('g');
      self.outdist_link = self.graphG.append('g');
      self.indist_link = self.graphG.append('g');
      self.transpath_link = self.graphG.append('g');

      self.menu = self.contextMenu().items('Incoming Block Dist.', 'Outgoing Block Dist.', 'Sources/Targets', 'Focused Sources/Targets');

      var a = d3.rgb(0, 255, 0); //红色               设置渐变颜色的起始
      var b = d3.rgb(255, 0, 0); //绿色
      self.compute = d3.interpolate(a, b);
      self.lineGenaretor = d3.svg.line()
        .interpolate("basis")
        .x(function (d) { return d[0] })
        .y(function (d) { return d[1] });

      self.max_round = 15
      self.n_nodes = 64
      self.n_limited_nodes = 32
      if (self.n_nodes > self.n_limited_nodes) self.n_display_nodes = self.n_limited_nodes + 1;
      else self.n_display_nodes = self.n_limited_nodes

      self.n_nodes_ratio = 0.5 // 0.15 for 64 nodes
      self.max_node2_r = (self.graphWidth/(self.n_display_nodes + (self.n_display_nodes-1)*self.n_nodes_ratio))/2 // 9
      self.min_node2_r = self.max_node2_r/3 // 3, 
      self.max_node2_stroke_w = self.max_node2_r/3 // 3
      self.node_r = self.max_node2_r * 1.01 // 10
      self.super_node_r = self.node_r * 1.2
      self.rect_xOffset = self.node_r * 1.3
      self.rect_yOffset = self.node_r * 1.3
      self.max_block_rect_w = ((self.graphHeight-self.node_r*2)/(self.max_round-1))/6 // 12
      self.max_block_rect_h = self.max_block_rect_w // 12
      self.node_text_size = self.max_node2_r * 0.8
      self.node_text_xOffset = self.max_node2_r*(-1)
      self.node_text_yOffset = self.max_node2_r

      for (var i = 0; i < self.max_round; i ++) { // 初始化的变量，reranking后有的要变空
        self.nodes_source[i] = {};
        self.nodes_target[i] = {};
        self.selected_nodes[i] = {};
        self.highlighted_nodes[i] = {}
        self.nodes_transfer[i] = {};
        self.indistpath_nodes[i] = {};
      }

      for (var i = 0; i < self.max_round; i ++) {
        self.outdistnodes_target[i] = {};
        self.outdistselected_nodes[i] = {};

        self.indistnodes_source[i] = {};
        self.indistselected_nodes[i] = {};

        for (var j = 0; j < self.display_nodes_array.length; j ++) {
          var dnode = display_nodes_array[j];

          self.outdistnodes_target[i][dnode] = 0
          self.indistnodes_source[i][dnode] = 0
        }
      }
/*
      var max_nodes = []; // TODO 这个应该在原始数据中算出来，并且只需算一次
      for (var i = 0; i < self.max_round; i ++) {
        self.node_json[i+1].sort(function (a, b) {
          return b["workload"] - a["workload"];
        });

        max_nodes.push({"round": self.node_json[i+1][0].round, "name": self.node_json[i+1][0].name});
      }
*/
      self.filterData([], nodes, links, dists, transfers);
/*
      links.forEach(function (d) {
        if (d.value > 0 || d.count > 0) {
          var x1 = self.rankings[d.source] * self.graphWidth / self.n_display_nodes,
            y1 = (d.round - 1) * self.graphHeight / (self.max_round - 1),
            x2 = self.rankings[d.target] * self.graphWidth / self.n_display_nodes,
            y2 = d.round * self.graphHeight / (self.max_round - 1);

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
*/

/*
      var line_data = []
      for (var r in self.link_json) {
        for (var source in self.link_json[r]) {
          for (var target in self.link_json[r][source]) {
            var d = self.link_json[r][source][target]

            if (d.value > 0 || d.count > 0) {
              var x1 = self.rankings[parseInt(source)] * self.graphWidth / self.n_display_nodes,
                y1 = (parseInt(r) - 1) * self.graphHeight / (self.max_round - 1),
                x2 = self.rankings[parseInt(target)] * self.graphWidth / self.n_display_nodes,
                y2 = parseInt(r) * self.graphHeight / (self.max_round - 1);

              var p1 = [x1, y1]
              var p2 = [(x2 + 3 * x1) / 4, (y1 + y2) / 2]
              var p3 = [(3 * x2 + x1) / 4, (y1 + y2) / 2]
              var p4 = [x2, y2]

              line_data.push({
                'points': [p1, p2, p3, p4],
                'attr': {"source": parseInt(source), "target": parseInt(target), "value": d.value, "count": d.count, "round": parseInt(r)}
              })
            }
          }
        }
      }
      //console.log("line_data:", line_data)

      // draw links between proc. nodes 
      line_data.forEach(function (line) {
        self.proc_link.append('path')
          .datum(line.points)
          .attr("d", self.lineGenaretor)
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
              return (line.attr.value - self.min_value) * (3.0 - 0.3) / (self.max_value - self.min_value) + 0.3;
            else {
              if (line.attr.count > 0) 
                return (line.attr.count - self.min_link_count) * (3.0 - 0.3) / (self.max_link_count - self.min_link_count) + 0.3;
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
*/
      self.drawProcLinks();

/*
      for (var r in self.node_json) {
        for (var name in self.node_json[r]) {
          var d = {
            "name": name,
            "count": self.node_json[r][name].count,
            "localCount": self.node_json[r][name].localCount,
            "workload": self.node_json[r][name].workload,
            "estWorkload": self.node_json[r][name].estWorkload,
            "npts": self.node_json[r][name].npts,
            "nfdpts": self.node_json[r][name].nfdpts,
            "round": r
          }

          self.node.append('circle')
            .datum(d)
            .attr('class', 'node')
            //.attr('id', function (d, i) { return 'node-' + i })
            .attr("round", d.round)
            .attr("name", d.name)
            .attr("r", function () {
              if (d.name == self.n_nodes) return self.super_node_r;
              else return (d.npts - d.nfdpts - self.min_nufdpts) * (self.max_node2_r - self.min_node2_r) / (self.max_npts - self.min_nufdpts) + self.min_node2_r;
            })
            .attr("fill", function () {
              if (d.name == self.n_nodes) return '#666'
              else {
                var linear = d3.scale.linear()
                  .domain([self.min_wl[d.round - 1], self.max_wl[d.round - 1]])
                  .range([0, 1]);

                return self.compute(linear(d.workload));
              }
            })
            .attr("opacity", "1.0")
            .attr("cx", function () {
              return self.rankings[d.name] * self.graphWidth / self.n_display_nodes;
            })
            .attr("cy", function () {
              return (d.round - 1) * self.graphHeight / (self.max_round - 1);
            })
            .attr("stroke", "black")
            .attr("stroke-width", function () {
              if (d.name == self.n_nodes) return 0; // TODO 统一处理
              else return (d.nfdpts - self.min_nfdpts) * self.max_node2_stroke_w / (self.max_nfdpts - self.min_nfdpts);
            })
            .on('click', function () {
              if (d.name == self.n_nodes) alert("It is a super node!!");
              else {
                self.graphG.selectAll(".nodetexts").remove();
                self.graphG.selectAll(".noderects").remove();
                self.focused_round = self.focused_name = -1;

                // select or disselect node
                if (self.selected_nodes[d.round-1][d.name] == 1)
                  self.selected_nodes[d.round-1][d.name] = 0;
                else
                  self.selected_nodes[d.round-1][d.name] = 1;

                self.updateProcLinks(-1, -1);
                self.updateProcNodes();
                self.updateProcNodeRects();

                if (self.isNoneNodesHighlighted()) self.recoveryProcNodesLinks();
              }
            })
            .on('mouseover', function () { 
              if (d.name != self.n_nodes) self.showDetails(d) 
            })
            .on("mouseout", function () { 
              if (d.name != self.n_nodes) self.hideDetails()
            })
            .on('contextmenu', function () { 
              if (d.name == self.n_nodes) alert("It is a super node!!");
              else {
                var focused_node = {"name": d.name, "round": d.round}; 
                d3.event.preventDefault();
                console.log('contextmenu')
                self.menu(d3.mouse(this)[0]+20, d3.mouse(this)[1], focused_node);
              }
            });
        }
      }
*/
      self.drawProcNodes();

      // draw nodes with max workload TODO
      self.max_node = self.graphG.selectAll(".max-nodes").data(max_nodes).enter()
        .append("circle")
        .attr('class', 'max-node')
        .attr('id', function (d, i) {
          return 'maxnode-' + i
        })
        .attr("r", self.node_r) 
        .attr("fill", "none")
        .attr("stroke-opacity", function (d) {
          if (self.filtered_nodes[d.name] == 1) return 0.8
          else return 0
        })
        .attr("stroke", "black")
        .attr("stroke-width", 1) 
        .attr("cx", function (d) {
          if (self.filtered_nodes[d.name] == 1) 
            return self.rankings[d.name] * self.graphWidth / self.n_display_nodes;
          else return 0
        })
        .attr("cy", function (d) {
          if (self.filtered_nodes[d.name] == 1)
            return (d.round - 1) * self.graphHeight / (self.max_round - 1);
          else return 0
        });
    },

    computeRankings(rounds, data) 
    {
      var self = this;

      self.rankings = {}
      self.filtered_nodes = {}
      self.display_nodes_array = []

      if (rounds.length == 0) {
        for (var i = 0; i < self.n_limited_nodes; i ++) {
          self.rankings[i] = i;
          self.filtered_nodes[i] = 1;
          self.display_nodes_array.push(i);
        }
      } else {
        var procwls = []
        for (var i = 0; i < self.n_nodes; i ++) procwls.push(0);
        data.forEach(function (d) {
          for (var j = 0; j < rounds.length; j ++)
            if (rounds[j] == d.round) 
              procwls[d.name] += d.workload;
        })

        var proc2wls = []
        for (var i = 0; i < self.n_nodes; i ++)
          proc2wls.push({"name": i, "workload": procwls[i]});
        proc2wls.sort(function (a, b) {
          return b["workload"] - a["workload"];
        });

        proc2wls.forEach(function (d, i) { 
          if (i < self.n_limited_nodes) {
            self.rankings[d.name] = i; 
            self.filtered_nodes[d.name] = 1;
            self.display_nodes_array.push(d.name);
          }
        })
      }

      if (self.n_nodes > self.n_limited_nodes) {
        self.rankings[self.n_nodes] = self.n_limited_nodes
        self.filtered_nodes[self.n_nodes] = 1
         self.display_nodes_array.push(self.n_nodes)
      }

      console.log("rankings:", self.rankings);
    },

    reRankGraph(rounds, nodes, links, dists, transfers) { // TODO
      var self = this;

      self.filterData(rounds, nodes, links, dists, transfers)
      
      if (self.n_nodes == self.n_limited_nodes) self.updateGraph();
      else {
        self.drawProcNodes();
        self.drawProcLinks();

        self.graphG.selectAll(".noderects").remove();
        self.graphG.selectAll(".nodetexts").remove();

        for (var i = 0; i < self.max_round; i ++) {
          for (var j = 0; j < self.n_nodes; j ++) {
            if (self.indistselected_nodes[i][j] == 1 || self.indistpath_nodes[i][j] == 1) {
              d3.selectAll('.in_block_dist'+(i+1)+j).remove();
              d3.selectAll('.in_block_dist_rect'+(i+1)+j).remove();
            }

            if (self.outdistselected_nodes[i][j] == 1) {
              d3.selectAll('.out_block_dist'+(i+1)+j).remove();
              d3.selectAll('.out_block_dist_rect'+(i+1)+j).remove();
            }
          }
        }

        for (var i = 0; i < self.max_round; i ++) {
          self.outdistnodes_target[i] = {};
          self.indistnodes_source[i] = {};

          for (var j = 0; j < self.display_nodes_array.length; j ++) {
            var dnode = self.display_nodes_array[j];
            self.outdistnodes_target[i][dnode] = 0
            self.indistnodes_source[i][dnode] = 0
          }
        }
    
        for (var i = 0; i < self.max_round; i ++) {
          for (var j = 0; j < self.n_nodes; j ++) {
            if (self.selected_nodes[i][j] == 1 && self.filtered_nodes[j] != 1) 
              self.selected_nodes[i][j] = 0

            if (self.outdistselected_nodes[i][j] == 1 && self.filtered_nodes[j] != 1) 
              self.outdistselected_nodes[i][j] = 0

            if (self.indistselected_nodes[i][j] == 1 && self.filtered_nodes[j] != 1) 
              self.indistselected_nodes[i][j] = 0
          }
        }

        /*
        self.selected_block = -1; //
      self.selected_nodes = [] //
      self.highlighted_nodes = []; //         
      self.nodes_source = []
      self.nodes_target = [];
      self.nodes_transfer = [];
      self.indistpath_nodes = [];

      self.outdistselected_nodes = [] //
      self.indistselected_nodes = []; //
      self.outdistnodes_target = [] //
      self.indistnodes_source = []; //

      self.focused_round = -1 //
      self.focused_name = -1; //
        */

        if (self.filtered_nodes[self.focused_name] != 1) {
          self.focused_round = -1;
          self.focused_name = -1;
        }

        for (var i = 1; i < self.max_round; i ++) {
          for (var j = 0; j < self.n_nodes; j ++) {
            if (self.indistselected_nodes[i][j] == 1) {
              self.addInBlockDist(i+1, j, -1)
            }
          }
        }

        for (var i = 0; i < self.max_round; i ++) {
          for (var j = 0; j < self.n_nodes; j ++) {
            if (self.outdistselected_nodes[i][j] == 1) {
              self.addOutBlockDist(i+1, j, 0)
            }
          }
        }

        if (self.selected_block != -1) {
          self.computeBlockPathBlocks(self.selected_block);
          for (var i = 1; i < self.max_round; i ++) {
            for (var j = 0; j < self.display_nodes_array.length; j ++) {
              var dnode = self.display_nodes_array[j];

              if (self.indistpath_nodes[i][dnode] == 1) {
                if (self.indistselected_nodes[i][dnode] == 1) 
                  self.updateBlockTransferPathRelated(i+1, dnode, self.selected_block);
                else {
                  self.addInBlockDist(i+1, dnode, self.selected_block);
                  if (self.outdistselected_nodes[i-1][dnode] == 1) { // for connecting outdist blocks and indist blocks (along the block transfer path)
                    self.removeOutBlockDist(i, dnode);
                    self.addOutBlockDist(i, dnode, 0)
                  }
                }
              }
            }
          }
        }

        self.updateProcLinks(self.focused_round, self.focused_name);
        self.updateProcNodes();
        self.updateProcNodeRects(); 

        if (self.isNoneNodesHighlighted()) self.recoveryProcNodesLinks();
      } 
    },


    reOrderGraph(blockid) // TODO
    {
      var self = this;

      // Compute rankings TODO
      // self.computeRankings(rounds, nodes);

      self.updateGraph()
    },

    updateGraph()
    {
      var self = this

/*
      self.links.forEach(function (d) {
        if (d.value > 0 || d.count > 0) {
          var x1 = self.rankings[d.source] * self.graphWidth / self.n_nodes,
            y1 = (d.round - 1) * self.graphHeight / (self.max_round - 1),
            x2 = self.rankings[d.target] * self.graphWidth / self.n_nodes,
            y2 = d.round * self.graphHeight / (self.max_round - 1);

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
*/
      self.drawProcLinks();

      self.graphG.selectAll(".noderects").remove();
      self.graphG.selectAll(".nodetexts").remove();
      // self.updateProcLinks(self.focused_round, self.focused_name);

      for (var i = 1; i < self.max_round; i ++) {
        for (var j = 0; j < self.n_nodes; j ++) {
          if (self.indistpath_nodes[i][j] == 1 || self.indistselected_nodes[i][j] == 1) {
            if (self.indistselected_nodes[i][j] == 1) self.removeInBlockDist(i+1, j, -1)
            else self.removeInBlockDist(i+1, j, self.selected_block)
          }
        }
      }

      for (var i = 0; i < self.max_round; i ++) {
        for (var j = 0; j < self.n_nodes; j ++) {
          if (self.outdistselected_nodes[i][j] == 1) {
            self.removeOutBlockDist(i+1, j)
          }
        }
      }

      for (var i = 1; i < self.max_round; i ++) {
        for (var j = 0; j < self.n_nodes; j ++) {
          if (self.indistpath_nodes[i][j] == 1 || self.indistselected_nodes[i][j] == 1) {
            if (self.indistselected_nodes[i][j] == 1) self.addInBlockDist(i+1, j, -1)
            else self.addInBlockDist(i+1, j, self.selected_block)
          }
        }
      }

      for (var i = 0; i < self.max_round; i ++) {
        for (var j = 0; j < self.n_nodes; j ++) {
          if (self.outdistselected_nodes[i][j] == 1) {
            self.addOutBlockDist(i+1, j, 0)

            if (self.indistpath_nodes[i+1][j] == 1 && self.indistselected_nodes[i+1][j] != 1) {
              self.removeInBlockDist(i+2, j, self.selected_block);
              self.addInBlockDist(i+2, j, self.selected_block);
            }
          }
        }
      }

      self.updateProcNodes();
      self.updateProcNodeRects(); 

      if (self.isNoneNodesHighlighted()) self.recoveryProcNodesLinks();
      else self.updateProcLinks(self.focused_round, self.focused_name);
    },


    filterData(rounds, nodes, links, dists, transfers) 
    {
      var self = this
      self.computeRankings(rounds, nodes);

      // nodes
      self.node_json = {}
      nodes.forEach(function (d, i) {
        if (!self.node_json[d.round]) self.node_json[d.round] = {}

        var name = self.filtered_nodes[d.name] == 1 ? d.name : self.n_nodes // d.name can not be n_nodes
        if (!self.node_json[d.round][name]) 
          self.node_json[d.round][name] = {
            "count": 0,
            "localCount": 0,
            "workload": 0,
            "estWorkload": 0,
            "npts": 0,
            "nfdpts": 0
          }

        self.node_json[d.round][name].count += d.count
        self.node_json[d.round][name].localCount += d.localCount
        self.node_json[d.round][name].workload += d.workload
        self.node_json[d.round][name].estWorkload += d.estWorkload
        self.node_json[d.round][name].npts += d.npts
        self.node_json[d.round][name].nfdpts += d.nfdpts
      })

      // links
      self.link_json = {}
      links.forEach(function (d, i) {
        if (!self.link_json[d.round]) self.link_json[d.round] = {}

        var source = self.filtered_nodes[d.source] == 1 ? d.source : self.n_nodes
        if (!self.link_json[d.round][source]) self.link_json[d.round][source] = {}

        var target = self.filtered_nodes[d.target] == 1 ? d.target : self.n_nodes
        if (!self.link_json[d.round][source][target]) self.link_json[d.round][source][target] = {"value": 0, "count": 0}

        self.link_json[d.round][source][target].value += d.value
        self.link_json[d.round][source][target].count += d.count
      })

      //console.log(self.link_json[1])

      // dist_json
      self.dist_json = {}
      dists.forEach(function (d, i) {
        if (!self.dist_json[d.round]) self.dist_json[d.round] = {}

        var name = self.filtered_nodes[d.name] == 1 ? d.name : self.n_nodes
        if (!self.dist_json[d.round][name]) self.dist_json[d.round][name] = {}

        if (!self.dist_json[d.round][name][d.blockid]) 
          self.dist_json[d.round][name][d.blockid] = {
            "workload": 0,
            "estWorkload": 0,
            "isLocal": 0
          }

        self.dist_json[d.round][name][d.blockid].workload += d.workload
        self.dist_json[d.round][name][d.blockid].estWorkload += d.estWorkload
        self.dist_json[d.round][name][d.blockid].isLocal = self.dist_json[d.round][name][d.blockid].isLocal==1 ? 1 : d.isLocal
      })

      //console.log("770 dist_json", Object.keys(self.dist_json))
      //console.log(self.dist_json[1][1])

      // transfer_json
      self.transfer_json = {}
      transfers.forEach(function (d, i) {
        if (!self.transfer_json[d.round]) self.transfer_json[d.round] = {}

        var source = self.filtered_nodes[d.source] == 1 ? d.source : self.n_nodes
        if (!self.transfer_json[d.round][source]) self.transfer_json[d.round][source] = {}

        var target = (self.filtered_nodes[d.target] == 1 || d.target == self.n_nodes+1) ? d.target : self.n_nodes
        if (!self.transfer_json[d.round][source][target]) self.transfer_json[d.round][source][target] = {}

        if (!self.transfer_json[d.round][source][target][d.blockid])
          self.transfer_json[d.round][source][target][d.blockid] = {"isLocal": 0}

        self.transfer_json[d.round][source][target][d.blockid].isLocal = self.transfer_json[d.round][source][target][d.blockid].isLocal==1 ? 1 : d.isLocal
      })


      self.min_npts = 1000000000
      self.max_npts = 0
      self.min_nfdpts = 1000000000
      self.max_nfdpts = 0
      self.min_nufdpts = 1000000000
      self.max_nufdpts = 0
      self.max_wl = []
      self.min_wl = []
      for (var r in self.node_json) {
        self.min_wl[parseInt(r)-1] = 1000000000;
        self.max_wl[parseInt(r)-1] = 0;

        for (var name in self.node_json[r]) {
          var u = self.node_json[r][name]

          if (self.filtered_nodes[parseInt(name)] == 1 && parseInt(name) != self.n_nodes) {
            self.min_wl[parseInt(r)-1] = Math.min(self.min_wl[parseInt(r)-1], u.workload)
            self.max_wl[parseInt(r)-1] = Math.max(self.max_wl[parseInt(r)-1], u.workload)

            self.min_npts = Math.min(self.min_npts, u.npts)
            self.max_npts = Math.max(self.max_npts, u.npts)

            self.min_nfdpts = Math.min(self.min_nfdpts, u.nfdpts)
            self.max_nfdpts = Math.max(self.max_nfdpts, u.nfdpts)

            self.min_nufdpts = Math.min(self.min_nufdpts, u.npts - u.nfdpts)
            self.max_nufdpts = Math.max(self.max_nufdpts, u.npts - u.nfdpts)
          }
        }
      }

      console.log(self.min_npts, self.max_npts, self.min_nfdpts, self.max_nfdpts, self.min_nufdpts, self.max_nufdpts)
/*
      // 根据数据和rankings计算最值 TODO
      for (var i = 0; i < self.max_round; i++) {
        self.min_wl[i] = 1000000000;
        self.max_wl[i] = 0;

        nodes.forEach(function (d, j) { 
          if (d.round == i + 1 && self.filtered_nodes[d.name] == 1 && d.name != self.n_nodes) {
            self.min_wl[i] = Math.min(self.min_wl[i], parseInt(d.workload))
            self.max_wl[i] = Math.max(self.max_wl[i], parseInt(d.workload))
          }
        });
      }

      self.min_npts = d3.min(self.nodes, function (d) { 
        if (self.filtered_nodes[d.name] == 1 && d.name != self.n_nodes) return d.npts 
      });
      self.max_npts = d3.max(self.nodes, function (d) { 
        if (self.filtered_nodes[d.name] == 1 && d.name != self.n_nodes) return d.npts 
      });
      self.min_nfdpts = d3.min(self.nodes, function (d) { 
        if (self.filtered_nodes[d.name] == 1 && d.name != self.n_nodes) return d.nfdpts 
      });
      self.max_nfdpts = d3.max(self.nodes, function (d) { 
        if (self.filtered_nodes[d.name] == 1 && d.name != self.n_nodes) return d.nfdpts 
      });
      self.min_nufdpts = d3.min(self.nodes, function (d) { 
        if (self.filtered_nodes[d.name] == 1 && d.name != self.n_nodes) return d.npts - d.nfdpts 
      });
      self.max_nufdpts = d3.max(self.nodes, function (d) { 
        if (self.filtered_nodes[d.name] == 1 && d.name != self.n_nodes) return d.npts - d.nfdpts 
      });
*/

      self.min_value = 1000000000
      self.max_value = 0
      self.min_link_count = 1000000000
      self.max_link_count = 0
      for (var r in self.link_json) {
        for (var source in self.link_json[r]) {
          for (var target in self.link_json[r][source]) {
            var u = self.link_json[r][source][target]

            self.min_value = Math.min(self.min_value, u.value)
            self.max_value = Math.max(self.max_value, u.value)

            self.min_link_count = Math.min(self.min_link_count, u.count)
            self.max_link_count = Math.max(self.max_link_count, u.count)
          }
        } 
      }

      console.log(self.min_value, self.max_value, self.min_link_count, self.max_link_count)
/*
      self.min_value = d3.min(self.links, function (d) { return d.value }); // super node 的也一同考虑进去了
      self.max_value = d3.max(self.links, function (d) { return d.value }); // 
      self.min_link_count = d3.min(self.links, function (d) { return d.count }); // 
      self.max_link_count = d3.max(self.links, function (d) { return d.count }); // 
*/
    }, 

    drawProcNodes()
    {
      var self = this

      var temp_nodes = []
      self.node.remove();
      for (var r in self.node_json) {
        for (var name in self.node_json[r]) {
          temp_nodes.push({
            "name": parseInt(name),
            "count": self.node_json[r][name].count,
            "localCount": self.node_json[r][name].localCount,
            "workload": self.node_json[r][name].workload,
            "estWorkload": self.node_json[r][name].estWorkload,
            "npts": self.node_json[r][name].npts,
            "nfdpts": self.node_json[r][name].nfdpts,
            "round": parseInt(r)
          })
        }
      }

      // draw nodes representing procs
      self.node = self.graphG.selectAll(".nodes").data(temp_nodes).enter()
        .append("circle")
        .attr('class', 'node')
        .attr('id', function (d, i) { return 'node-' + i })
        .attr("r", function (d) {
          if (d.name == self.n_nodes) return self.super_node_r;
          else return (d.npts - d.nfdpts - self.min_nufdpts) * (self.max_node2_r - self.min_node2_r) / (self.max_npts - self.min_nufdpts) + self.min_node2_r;
        })
        .attr("fill", function (d) {
          if (d.name == self.n_nodes) return '#666'
          else {
            var linear = d3.scale.linear()
              .domain([self.min_wl[d.round - 1], self.max_wl[d.round - 1]])
              .range([0, 1]);

            return self.compute(linear(d.workload));
          }
        })
        .attr("opacity", "1.0")
        .attr("cx", function (d) {
          return self.rankings[d.name] * self.graphWidth / self.n_display_nodes;
        })
        .attr("cy", function (d) {
          return (d.round - 1) * self.graphHeight / (self.max_round - 1);
        })
        .attr("stroke", "black")
        .attr("stroke-width", function (d) {
          if (d.name == self.n_nodes) return 0; // TODO 统一处理
          else return (d.nfdpts - self.min_nfdpts) * self.max_node2_stroke_w / (self.max_nfdpts - self.min_nfdpts);
        })
        .on('click', function (d, i) {
          if (d.name == self.n_nodes) alert("It is a super node!!");
          else {
            self.graphG.selectAll(".nodetexts").remove();
            self.graphG.selectAll(".noderects").remove();
            self.focused_round = self.focused_name = -1;

            // select or disselect node
            if (self.selected_nodes[d.round-1][d.name] == 1)
              self.selected_nodes[d.round-1][d.name] = 0;
            else
              self.selected_nodes[d.round-1][d.name] = 1;

            self.updateProcLinks(-1, -1);
            self.updateProcNodes();
            self.updateProcNodeRects();

            if (self.isNoneNodesHighlighted()) self.recoveryProcNodesLinks();
          }
        })
        .on('mouseover', function (d) { 
          if (d.name != self.n_nodes) self.showDetails(d) 
        })
        .on("mouseout", function (d) { 
          if (d.name != self.n_nodes) self.hideDetails()
        })
        .on('contextmenu', function (d) { 
          if (d.name == self.n_nodes) alert("It is a super node!!");
          else {
            var focused_node = {"name": d.name, "round": d.round}; 
            d3.event.preventDefault();
            console.log('contextmenu')
            self.menu(d3.mouse(this)[0]+20, d3.mouse(this)[1], focused_node);
          }
        });
    },

    drawProcLinks()
    {
      var self = this

      var line_data = []
      self.proc_link.selectAll('path').remove();
      for (var r in self.link_json) {
        for (var source in self.link_json[r]) {
          for (var target in self.link_json[r][source]) {
            var d = self.link_json[r][source][target]

            if (d.value > 0 || d.count > 0) {
              var x1 = self.rankings[parseInt(source)] * self.graphWidth / self.n_display_nodes,
                y1 = (parseInt(r) - 1) * self.graphHeight / (self.max_round - 1),
                x2 = self.rankings[parseInt(target)] * self.graphWidth / self.n_display_nodes,
                y2 = parseInt(r) * self.graphHeight / (self.max_round - 1);

              var p1 = [x1, y1]
              var p2 = [(x2 + 3 * x1) / 4, (y1 + y2) / 2]
              var p3 = [(3 * x2 + x1) / 4, (y1 + y2) / 2]
              var p4 = [x2, y2]

              line_data.push({
                'points': [p1, p2, p3, p4],
                'attr': {"source": parseInt(source), "target": parseInt(target), "value": d.value, "count": d.count, "round": parseInt(r)}
              })
            }
          }
        }
      }

      line_data.forEach(function (line) {
        self.proc_link.append('path')
          .datum(line.points)
          .attr("d", self.lineGenaretor)
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
              return (line.attr.value - self.min_value) * (3.0 - 0.3) / (self.max_value - self.min_value) + 0.3;
            else {
              if (line.attr.count > 0) 
                return (line.attr.count - self.min_link_count) * (3.0 - 0.3) / (self.max_link_count - self.min_link_count) + 0.3;
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
    },


    // functions for updating nodes and proc links
    updateProcNodeRects() // TODO do not use .data(nodes) 
    {
      var self = this;

      var rnodes = []
      for (var i = 0; i < self.max_round; i ++) {
        for (var j = 0; j < self.display_nodes_array.length; j ++) {
          var dnode = self.display_nodes_array[j]
          if (self.selected_nodes[i][dnode] == 1)
            rnodes.push({
              "name": dnode,
              "round": i+1
            })
        }
      }
/*
      self.graphG.selectAll(".rects").data(self.nodes).enter().append('rect')
        .attr("class", "noderects")
        .attr("x", function (d) {
          return self.rankings[d.name] * self.graphWidth / self.n_display_nodes - self.rect_xOffset;
        })
        .attr("y", function (d) {
          return (d.round - 1) * self.graphHeight / (self.max_round - 1) - self.rect_yOffset;
        })
        .attr("width", function (d) {
          if (self.selected_nodes[d.round-1][d.name] == 1)
            return self.rect_xOffset*2;
          else return 0;
        })
        .attr("height", function (d) {
          if (self.selected_nodes[d.round-1][d.name] == 1)
            return self.graphHeight / (self.max_round - 1) + self.rect_yOffset*2;
          else return 0;
        })
        .attr("opacity", function (d) {
          if (self.selected_nodes[d.round-1][d.name] == 1) return 1;
          else return 0;
        })
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-dasharray", 5)
        .attr("stroke-width", 1);
*/
      self.graphG.selectAll(".rects").data(rnodes).enter().append('rect')
        .attr("class", "noderects")
        .attr("x", function (d) {
          return self.rankings[d.name] * self.graphWidth / self.n_display_nodes - self.rect_xOffset;
        })
        .attr("y", function (d) {
          return (d.round - 1) * self.graphHeight / (self.max_round - 1) - self.rect_yOffset;
        })
        .attr("width", self.rect_xOffset*2)
        .attr("height", self.graphHeight / (self.max_round - 1) + self.rect_yOffset*2)
        .attr("opacity", 1)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-dasharray", 5)
        .attr("stroke-width", 1);
    },

    updateProcNodes()
    {
      var self = this;

      self.highlighted_nodes = [];
      var hnodes = []
      for (var i = 0; i < self.max_round; i ++) {
        self.highlighted_nodes[i] = {}
/*
        for (var j = 0; j < self.n_nodes; j ++) {
          if (self.nodes_target[i][j] == 1 || self.nodes_source[i][j] == 1 || self.outdistselected_nodes[i][j] == 1 || self.outdistnodes_target[i][j] > 0 || self.indistselected_nodes[i][j] == 1 || self.indistnodes_source[i][j] > 0 || self.nodes_transfer[i][j] == 1 || 
            self.indistpath_nodes[i][j] == 1)
            self.highlighted_nodes[i][j] = 1;
        }
*/
        for (var j = 0; j < self.display_nodes_array.length; j ++) {
          var dnode = self.display_nodes_array[j]

          if (self.nodes_target[i][dnode] == 1 || 
            self.nodes_source[i][dnode] == 1 || 
            self.outdistselected_nodes[i][dnode] == 1 || 
            self.outdistnodes_target[i][dnode] > 0 || 
            self.indistselected_nodes[i][dnode] == 1 || 
            self.indistnodes_source[i][dnode] > 0 || 
            self.nodes_transfer[i][dnode] == 1 || 
            self.indistpath_nodes[i][dnode] == 1) 
          {
            self.highlighted_nodes[i][dnode] = 1;
            hnodes.push({
              "name": dnode,
              "round": i+1
            })
          }
        }
      }

      self.max_node.attr('stroke-opacity', function (d) {
          if (self.highlighted_nodes[d.round-1][d.name] == 1) {
            if (self.filtered_nodes[d.name] == 1) return 0.8
            else return 0
          } else {
            if (self.filtered_nodes[d.name] == 1) return 0.4
            else return 0
          }
        })
        .attr("cx", function (d) {
          if (self.filtered_nodes[d.name] == 1) 
            return self.rankings[d.name] * self.graphWidth / self.n_display_nodes;
        })
        .attr("cy", function (d) {
          if (self.filtered_nodes[d.name] == 1) 
            return (d.round - 1) * self.graphHeight / (self.max_round - 1);
        })

      self.node.attr('opacity', function (u) {
          if (self.highlighted_nodes[u.round-1][u.name] == 1) return 1;
          else return 0.25;
        })
        .attr("cx", function (d) { // super node 肯定排最后一位
          return self.rankings[d.name] * self.graphWidth / self.n_display_nodes;
        })
        .attr("cy", function (d) {
          return (d.round - 1) * self.graphHeight / (self.max_round - 1);
        });

/*
      self.graphG.selectAll(".texts").data(self.nodes).enter().append("text")
        .text(function (u) {
          if (self.highlighted_nodes[u.round-1][u.name] == 1 && u.name != self.n_nodes)
            return u.name;
        })
        .attr("class", "nodetexts")
        .attr('x', function (u) {
          return self.rankings[u.name] * self.graphWidth / self.n_display_nodes + self.node_text_xOffset;
        })
        .attr('y', function (u) {
          return (u.round - 1) * self.graphHeight / (self.max_round - 1) + self.node_text_yOffset;
        })
        .attr('text-anchor', 'middle')
        .style('font-size', self.node_text_size);
*/
      self.graphG.selectAll(".texts").data(hnodes).enter().append("text")
        .text(function (u) {
          if (u.name != self.n_nodes) return u.name;
        })
        .attr("class", "nodetexts")
        .attr('x', function (u) {
          return self.rankings[u.name] * self.graphWidth / self.n_display_nodes + self.node_text_xOffset;
        })
        .attr('y', function (u) {
          return (u.round - 1) * self.graphHeight / (self.max_round - 1) + self.node_text_yOffset;
        })
        .attr('text-anchor', 'middle')
        .style('font-size', self.node_text_size);
    },

    updateProcLinks(r, name) 
    {
      var self = this

      for (var i = 0; i < self.max_round; i ++) {
        self.nodes_source[i] = {};
        self.nodes_target[i] = {};
      }

      self.proc_link.selectAll('path')
        .attr("stroke-opacity", function (q) {
          var source = d3.select(this).attr('source'),
            target = d3.select(this).attr('target'),
            round = d3.select(this).attr('round'),
            value = d3.select(this).attr('value'),
            count = d3.select(this).attr('count');

          if (r < 0) {
            if (self.selected_nodes[round-1][source] == 1 || self.selected_nodes[round-1][target] == 1) {
              if (self.selected_nodes[round-1][source] == 1 && (value > 100 || count > 0)) {
                self.nodes_target[round][target] = 1;
                self.nodes_source[round-1][source] = 1;
              }

              if (self.selected_nodes[round-1][target] == 1 && (value > 100 || count > 0)) {
                self.nodes_source[round-1][source] = 1;
                self.nodes_target[round][target] = 1;
              }

              return 1;
            }
            else return 0.02;
          }
          else {
            if ((round >= r && source == name) || (round < r && target == name)) {
              if ((round >= r && source == name) && (value > 100 || count > 0)) {
                self.nodes_target[round][target] = 1;
                self.nodes_source[round-1][name] = 1;
              }

              if ((round < r && target == name) && (value > 100 || count > 0)) {
                self.nodes_source[round-1][source] = 1;
                self.nodes_target[round][name] = 1;
              }

              return 1;
            }
            else return 0.02;
          }
        });
    },

    // functions for block dist
    computeBlockPathBlocks(blockid)
    { 
      var self = this;

      self.nodes_transfer = [];
      self.indistpath_nodes = [];
      for (var i = 0; i < self.max_round; i ++) {
        self.nodes_transfer[i] = {}
        self.indistpath_nodes[i] = {};
/*
        for (var index in self.dist_json[i+1]) {
          self.dist_json[i+1][index].forEach(function (u, j) {
            if (u.blockid == blockid)  {
              self.nodes_transfer[i][index] = 1;
              self.indistpath_nodes[i][index] = 1;
            }
          })
        }
*/
        for (var name in self.dist_json[parseInt(i)+1]) {
          for (var bid in self.dist_json[parseInt(i)+1][name]) {
            if (parseInt(bid) == blockid) {
              self.nodes_transfer[i][parseInt(name)] = 1;
              self.indistpath_nodes[i][parseInt(name)] = 1;
            }
          }
        }
      }
    },

    addInBlockDist(round, name, blockid) 
    {
      var self = this;

      var blockIdList = [],
          block_pos = {}

      var source; // for blockid >= 0
/*
      for(var jsource in self.transfer_json[round-1]) {
        for (var jtarget in self.transfer_json[round-1][jsource]) {
          self.transfer_json[round-1][jsource][jtarget].forEach(function (u) {
            if (jtarget == name && (blockid >= 0 ? u.blockid == blockid : true)) {
              blockIdList.push({"source": jsource, "target": jtarget, "blockid": u.blockid, "isLocal": u.isLocal})
              block_pos[u.blockid] = []

              source = jsource;

              if (self.indistnodes_source[round-2][jsource]) self.indistnodes_source[round-2][jsource] += 1;
              else self.indistnodes_source[round-2][jsource] = 1;
            }
          })
        }
      }
*/
      for(var jsource in self.transfer_json[round-1]) {
        for (var jtarget in self.transfer_json[round-1][jsource]) {
          for (var bid in self.transfer_json[round-1][jsource][jtarget]) {
            var u = self.transfer_json[round-1][jsource][jtarget][bid]

            if (parseInt(jtarget) == name && (blockid >= 0 ? parseInt(bid) == blockid : true)) {
              blockIdList.push({"source": parseInt(jsource), "target": parseInt(jtarget), "blockid": parseInt(bid), "isLocal": u.isLocal})
              block_pos[parseInt(bid)] = []

              source = parseInt(jsource);

              if (self.indistnodes_source[round-2][parseInt(jsource)]) self.indistnodes_source[round-2][parseInt(jsource)] += 1;
              else self.indistnodes_source[round-2][parseInt(jsource)] = 1;
            }
          }
        }
      }

      blockIdList.sort(function (a, b) { return a["blockid"] - b["blockid"]; }); 

      var block_len = blockIdList.length;

      var x1 = Math.max(self.rankings[name] * self.graphWidth / self.n_display_nodes - self.max_block_rect_w*block_len/2, -1 *self.node_r * 1.1), 
          y1 = (round-1) * self.graphHeight / (self.max_round - 1) - self.node_r * 1.1 - self.max_block_rect_h; 
          x1 = Math.min(x1, self.graphWidth - self.max_block_rect_w * (block_len+2));

      var pnode_r;

/*
      self.node_json[round].forEach(function (s) {
        if (s.name == name) {
          if (name == self.n_nodes) pnode_r = self.super_node_r;
          else pnode_r = (s.npts - s.nfdpts - self.min_nufdpts) * (self.max_node2_r - self.min_node2_r) / (self.max_npts - self.min_nufdpts) + self.min_node2_r;
        }
      })
*/
      for (var jname in self.node_json[round]) {
        var s = self.node_json[round][jname]

        if (parseInt(jname) == name) {
          if (name == self.n_nodes) pnode_r = self.super_node_r;
          else pnode_r = (s.npts - s.nfdpts - self.min_nufdpts) * (self.max_node2_r - self.min_node2_r) / (self.max_npts - self.min_nufdpts) + self.min_node2_r;
        }
      }

      if (name == self.n_nodes) {
        blockIdList.forEach(function (u) {
          var snode_r;

/*
          self.node_json[round-1].forEach(function (s) {
            if (s.name == u.source) {
              if (s.name == self.n_nodes) snode_r = self.super_node_r
              else snode_r = (s.npts - s.nfdpts - self.min_nufdpts) * (self.max_node2_r - self.min_node2_r) / (self.max_npts - self.min_nufdpts) + self.min_node2_r;
            }
          })
*/
          for (var jname in self.node_json[parseInt(round)-1]) {
            var s = self.node_json[parseInt(round)-1][jname]

            if (parseInt(jname) == u.source) {
              if (parseInt(jname) == self.n_nodes) snode_r = self.super_node_r
              else snode_r = (s.npts - s.nfdpts - self.min_nufdpts) * (self.max_node2_r - self.min_node2_r) / (self.max_npts - self.min_nufdpts) + self.min_node2_r;
            }
          }

          var x1 = self.rankings[name] * self.graphWidth / self.n_display_nodes,
              y1 = (round-1) * self.graphHeight / (self.max_round - 1),
              x2 = self.rankings[u.source] * self.graphWidth / self.n_display_nodes, // node_pos[round+1][index][0],
              y2 = (round-2) * self.graphHeight / (self.max_round - 1) + snode_r; // node_pos[round+1][index][1]

          var p1 = [x1, y1]
          var p2 = [(x2 + 3 * x1)/4, (y1 + y2)/2]
          var p3 = [(3 * x2 + x1)/4, (y1 + y2)/2]
          var p4 = [x2, y2]
          self.indist_link.append('path')
            .datum([p1, p2, p3, p4])
            .attr("d", self.lineGenaretor)
            .attr("class", 'in_block_dist'+round+name) //"block-path"+round+progress_id+" block"+u)
            .attr("id", u.blockid) // "line-block-"+lineIndex)
            .attr('isLocal', u.isLocal)
            .attr("fill", "none")
            .attr("stroke", function () {
              if (u.blockid == self.selected_block) {
                if (u.isLocal == 1) return 'red'
                else return 'green'
              } else return 'black'
            })// TODO
            .attr("stroke-opacity", function () {
              if (u.blockid == self.selected_block) return 1
              else return 0.3;
            })
            .attr("stroke-width", function () {
              if (u.blockid == self.selected_block) return 1.5
              else return 1;
            })
        })

      } else {
        var xx1 = self.rankings[name] * self.graphWidth / self.n_display_nodes,  // node_pos[round][progress_id][0],
            yy1 = (round-1) * self.graphHeight / (self.max_round-1) - pnode_r, // node_pos[round][progress_id][1],
            xx2 = x1 + self.max_block_rect_w * block_len/2,
            yy2 = y1

        var p1 = [xx1, yy1]
        var p2 = [(xx2 + 3 * xx1)/4, (yy1 + yy2)/2]
        var p3 = [(3 * xx2 + xx1)/4, (yy1 + yy2)/2]
        var p4 = [xx2, yy2]
        self.indist_link.append('path')
          .datum([p1, p2, p3, p4])
          .attr("d", self.lineGenaretor)
          .attr("class", 'in_block_dist'+round+name) // "block-path"+round+progress_id+"block")
          .attr("stroke", 'black')// TODO
          .attr("stroke-opacity", 1)
          .attr("stroke-width", 1)

        var max_his_workload = 0, min_his_workload = 1000000000;
/*
        self.dist_json[round][name].forEach(function (u) {
          max_his_workload = Math.max(max_his_workload, u.workload);
          min_his_workload = Math.min(min_his_workload, u.workload);
        })
*/
        for (var bid in self.dist_json[round][name]) {
          var u = self.dist_json[round][name][bid]
          max_his_workload = Math.max(max_his_workload, u.workload);
          min_his_workload = Math.min(min_his_workload, u.workload);
        }

        //console.log("max_min_his_workload", max_his_workload, min_his_workload)

        self.graphG.selectAll(".in_block_rect"+round+name)
          .data(blockIdList)
          .enter().append("rect")
          .attr("class", "in_block_dist_rect"+round+name)
          .attr("x", function (u, i) { 
            block_pos[u.blockid].push(x1 + self.max_block_rect_w*i+self.max_block_rect_w/2)
            return x1 + self.max_block_rect_w*i
          })
          .attr("y", function (u, i) { 
            block_pos[u.blockid].push(y1)
            return y1; 
          })
          .attr("width", self.max_block_rect_w)
          .attr("height", self.max_block_rect_h)
          .attr("fill", function (u, i) {
            var linear = d3.scale.linear()
              .domain([min_his_workload, max_his_workload])
              .range([0, 1]);

            var workload = 0;
/*
            self.dist_json[round][name].forEach(function (s) {
              if (u.blockid == s.blockid) workload = s.workload
            })
*/
            if (self.dist_json[round][name][u.blockid]) {
              workload = self.dist_json[round][name][u.blockid].workload
            }

            return self.compute(linear(workload));
          })
          .attr("stroke-width", function (u) {
            if (u.blockid == self.selected_block) return 1
            else return 0.5
          })
          .attr("stroke", "black")
          .attr('cursor', 'pointer')
          .on('click', function (u, i) {
            self.updateBlockTransferPath(u.blockid) 

            if (self.isNoneNodesHighlighted()) self.recoveryProcNodesLinks();       
          })
          .on('mouseover', function (u) {
            d3.select(this).attr("stroke-width", 1);   

            self.blockRectMouseOver(u.blockid);
          })
          .on("mouseout", function (u) { 
            d3.select(this).attr("stroke-width", function (s) {
              if (s.blockid == self.selected_block) return 1;
              else return 0.5;
            })

            self.blockRectMouseOut(u.blockid);
          })
          .append("title")
          .text(function (u) { 
            var workload = 0;
/*
            self.dist_json[round][name].forEach(function (s) {
              if (u.blockid == s.blockid) workload = s.workload
            })
*/
            if (self.dist_json[round][name][u.blockid]) {
              workload = self.dist_json[round][name][u.blockid].workload
            }

            var coords = self.bid2coords(u.blockid);
            var texts = u.blockid + ": [" + coords[0] + "," + coords[1] + "," + coords[2] + "], " + workload;
            
            return texts;
            //return u; 
          });

        if (blockid >= 0) { // for connecting outdist blocks and indist blocks (along the block transfer path)
/*
          for (var i = 0; i < self.n_limited_nodes; i ++)
            if (self.outdistselected_nodes[round-2][i] == 1 && i == source) return;
*/
          for (var i = 0; i < self.display_nodes_array.length; i ++) {
            var dnode = self.display_nodes_array[i]; // dnode 永远不会是 第n_nodes结点
            if (self.outdistselected_nodes[round-2][dnode] == 1 && dnode == source) return;
          }
        }

        blockIdList.forEach(function (u) {
          var snode_r;

/*
          self.node_json[round-1].forEach(function (s) {
            if (s.name == u.source) {
              if (s.name == self.n_nodes) snode_r = self.super_node_r;
              else snode_r = (s.npts - s.nfdpts - self.min_nufdpts) * (self.max_node2_r - self.min_node2_r) / (self.max_npts - self.min_nufdpts) + self.min_node2_r;
            }
          })
*/
          for (var jname in self.node_json[parseInt(round)-1]) {
            var s = self.node_json[parseInt(round)-1][jname]

            if (parseInt(jname) == u.source) {
              if (parseInt(jname) == self.n_nodes) snode_r = self.super_node_r;
              else snode_r = (s.npts - s.nfdpts - self.min_nufdpts) * (self.max_node2_r - self.min_node2_r) / (self.max_npts - self.min_nufdpts) + self.min_node2_r;
            }
          }

          var x1 = block_pos[u.blockid][0],
              y1 = block_pos[u.blockid][1],
              x2 = self.rankings[u.source] * self.graphWidth / self.n_display_nodes, // node_pos[round+1][index][0],
              y2 = (round-2) * self.graphHeight / (self.max_round - 1) + snode_r; // node_pos[round+1][index][1]

          var p1 = [x1, y1]
          var p2 = [(x2 + 3 * x1)/4, (y1 + y2)/2]
          var p3 = [(3 * x2 + x1)/4, (y1 + y2)/2]
          var p4 = [x2, y2]
          self.indist_link.append('path')
            .datum([p1, p2, p3, p4])
            .attr("d", self.lineGenaretor)
            .attr("class", 'in_block_dist'+round+name) //"block-path"+round+progress_id+" block"+u)
            .attr("id", u.blockid) // "line-block-"+lineIndex)
            .attr('isLocal', u.isLocal)
            .attr("fill", "none")
            .attr("stroke", function () {
              if (u.blockid == self.selected_block) {
                if (u.isLocal == 1) return 'red'
                else return 'green'
              } else return 'black'
            })// TODO
            .attr("stroke-opacity", function () {
              if (u.blockid == self.selected_block) return 1
              else return 0.3;
            })
            .attr("stroke-width", function () {
              if (u.blockid == self.selected_block) return 1.5
              else return 1;
            })
        })
      }
    },

    removeInBlockDist(round, name, blockid)
    {
      var self = this;
/*
      for(var jsource in self.transfer_json[round-1]) {
        for (var jtarget in self.transfer_json[round-1][jsource]) {
          self.transfer_json[round-1][jsource][jtarget].forEach(function (u) {
            if (jtarget == name && (blockid >= 0 ? u.blockid == blockid : true)) {
              self.indistnodes_source[round-2][jsource] = Math.max(self.indistnodes_source[round-2][jsource]-1, 0);
            }
          })
        }
      }
*/
      for(var source in self.transfer_json[round-1]) {
        for (var target in self.transfer_json[round-1][source]) {
          for (var bid in self.transfer_json[round-1][source][target]) {
            if (parseInt(target) == name && (blockid >= 0 ? parseInt(bid) == blockid : true)) {
              self.indistnodes_source[round-2][parseInt(source)] = Math.max(self.indistnodes_source[round-2][parseInt(source)]-1, 0);
            }
          }
        }
      }

      d3.selectAll('.in_block_dist'+round+name).remove();
      d3.selectAll('.in_block_dist_rect'+round+name).remove();
    },

    addOutBlockDist(round, name, flag) // add a flag only for connecting ...
    {
      var self = this;

      var blockIdList = [],
          block_pos = {}

      var block2proc = [];
/*
      for(var index in self.transfer_json[round][name]){
        self.transfer_json[round][name][index].forEach(function (u){

          block2proc.push({
            "target": index,
            "blockid": u.blockid
          })

          if (self.filtered_nodes[index] == 1) {
            if (self.outdistnodes_target[round][index]) self.outdistnodes_target[round][index] += 1;
            else self.outdistnodes_target[round][index] = 1;
          }

          if(blockIdList.indexOf(u.blockid) == -1) {
            blockIdList.push(u.blockid)
            block_pos[u.blockid] = []
          }
        })
      }
*/
      for(var target in self.transfer_json[round][name]){
        for (var bid in self.transfer_json[round][name][target]) {
          block2proc.push({
            "target": parseInt(target),
            "blockid": parseInt(bid)
          })

          if (self.filtered_nodes[parseInt(target)] == 1) {
            if (self.outdistnodes_target[round][parseInt(target)]) self.outdistnodes_target[round][parseInt(target)] += 1;
            else self.outdistnodes_target[round][parseInt(target)] = 1;
          }

          if(blockIdList.indexOf(parseInt(bid)) == -1) {
            blockIdList.push(parseInt(bid))
            block_pos[parseInt(bid)] = []
          }
        }
      }

      blockIdList.sort(function (a, b) {
        return a - b;
      });

      var block_len = blockIdList.length;

      var x1 = Math.max(self.rankings[name] * self.graphWidth / self.n_display_nodes - self.max_block_rect_w*block_len/2, -1 *self.node_r * 1.1), 
          y1 = (round-1) * self.graphHeight / (self.max_round - 1) + self.node_r * 1.1; 
          x1 = Math.min(x1, self.graphWidth - self.max_block_rect_w * (block_len+2));

      var pnode_r;
/*
      self.node_json[round].forEach(function (s) {
        if (s.name == name) {
          if (name == self.n_nodes) pnode_r = self.super_node_r // cannot happen
          else pnode_r = (s.npts - s.nfdpts - self.min_nufdpts) * (self.max_node2_r - self.min_node2_r) / (self.max_npts - self.min_nufdpts) + self.min_node2_r;
        }
      })
*/
      for (var jname in self.node_json[round]) {
        var s = self.node_json[round][jname]

        if (parseInt(jname) == name) {
          if (name == self.n_nodes) pnode_r = self.super_node_r // cannot happen
          else pnode_r = (s.npts - s.nfdpts - self.min_nufdpts) * (self.max_node2_r - self.min_node2_r) / (self.max_npts - self.min_nufdpts) + self.min_node2_r;
        }
      }

      var xx1 = self.rankings[name] * self.graphWidth / self.n_display_nodes,  // node_pos[round][progress_id][0],
          yy1 = (round-1) * self.graphHeight / (self.max_round-1) + pnode_r, // node_pos[round][progress_id][1],
          xx2 = x1 + self.max_block_rect_w * block_len/2,
          yy2 = y1

      var p1 = [xx1, yy1]
      var p2 = [(xx2 + 3 * xx1)/4, (yy1 + yy2)/2]
      var p3 = [(3 * xx2 + xx1)/4, (yy1 + yy2)/2]
      var p4 = [xx2, yy2]
      self.outdist_link.append('path')
        .datum([p1, p2, p3, p4])
        .attr("d", self.lineGenaretor)
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
            if (self.filtered_nodes[u.target] == 1) {
/*
              self.dist_json[round+1][u.target].forEach(function (s) {
                if (s.blockid == u.blockid)
                  blkwl[d] += s.workload
              })
*/
/*
              for (var bid in self.dist_json[round+1][u.target]) {
                var s = self.dist_json[round+1][u.target][bid]
                if (bid == u.blockid) blkwl[d] += s.workload
              }
*/
              if (self.dist_json[parseInt(round)+1][u.target][u.blockid])
                blkwl[d] += self.dist_json[parseInt(round)+1][u.target][u.blockid].workload
            } else flag = 1
          }
        })

        if (flag == 0) {
          max_his_workload = Math.max(max_his_workload, blkwl[d]);
          min_his_workload = Math.min(min_his_workload, blkwl[d]);
        }
      })

      self.graphG.selectAll(".out_block_rect"+round+name)
        .data(blockIdList)
        .enter().append("rect")
        .attr("class", "out_block_dist_rect"+round+name)
        .attr("x", function (u, i) { 
          block_pos[u].push(x1 + self.max_block_rect_w*i+self.max_block_rect_w/2)
          return x1 + self.max_block_rect_w*i
        })
        .attr("y", function (u, i) { 
          block_pos[u].push(y1+self.max_block_rect_h)
          return y1; 
        })
        .attr("width", self.max_block_rect_w)
        .attr("height", self.max_block_rect_h)
        .attr("fill", function (u, i) {
          var flag = 0
/*
          if (self.transfer_json[round][name][self.n_nodes+1]) {
            self.transfer_json[round][name][self.n_nodes+1].forEach(function (s){
              if(s.blockid == u) flag = 1
            })
          }
*/
          if (self.transfer_json[round][name][parseInt(self.n_nodes)+1]) {
            for (bid in self.transfer_json[round][name][parseInt(self.n_nodes)+1]) {
              if (parseInt(bid) == u) flag = 1
            }
          }

          if (flag == 1) return 'white'
          else {
            var linear = d3.scale.linear()
              .domain([min_his_workload, max_his_workload])
              .range([0, 1]);

            var workload = blkwl[u]
            if (workload < 0) alert("Error block workload!");

            return self.compute(linear(workload));
          }
        })
        .attr("stroke-width", function (u) {
          if (u == self.selected_block) return 1
          else return 0.5
        })
        .attr("stroke", "black")
        .attr('cursor', 'pointer')
        .on('click', function (u, i) {
          self.updateBlockTransferPath(u);

          if (self.isNoneNodesHighlighted()) self.recoveryProcNodesLinks();
        })
        .on('mouseover', function (u) {
          d3.select(this).attr("stroke-width", 1);   

          self.blockRectMouseOver(u);
        })
        .on("mouseout", function (u) { 
          d3.select(this).attr("stroke-width", function (s) {
            if (s == self.selected_block) return 1;
            else return 0.5;
          })

          self.blockRectMouseOut(u);
        })
        .append("title")
        .text(function (u) { 
          var workload = 0;

          workload = blkwl[u]
          var coords = self.bid2coords(u);
          var texts = u + ": [" + coords[0] + "," + coords[1] + "," + coords[2] + "], " + workload;
          
          return texts;
          //return u; 
        });
    
      for(var target in self.transfer_json[round][name]) {
        for (var bid in self.transfer_json[round][name][target]) {
          var u = self.transfer_json[round][name][target][bid]

          if (self.filtered_nodes[parseInt(target)] == 1) {
            var snode_r;

/*
            self.node_json[round+1].forEach(function (s) {
              if (s.name == target) {
                if (s.name == self.n_nodes) snode_r = self.super_node_r;
                else snode_r = (s.npts - s.nfdpts - self.min_nufdpts) * (self.max_node2_r - self.min_node2_r) / (self.max_npts - self.min_nufdpts) + self.min_node2_r;
              }
            })
*/
            for (var jname in self.node_json[parseInt(round)+1]) {
              var s = self.node_json[parseInt(round)+1][jname]

              if (parseInt(jname) == parseInt(target)) {
                if (parseInt(jname) == self.n_nodes) snode_r = self.super_node_r;
                else snode_r = (s.npts - s.nfdpts - self.min_nufdpts) * (self.max_node2_r - self.min_node2_r) / (self.max_npts - self.min_nufdpts) + self.min_node2_r;
              }
            }

            var x1 = block_pos[parseInt(bid)][0],
                y1 = block_pos[parseInt(bid)][1],
                x2 = self.rankings[parseInt(target)] * self.graphWidth / self.n_display_nodes, 
                y2 = round * self.graphHeight / (self.max_round - 1) - snode_r; 

            if (flag >= 0 && (self.indistpath_nodes[round][parseInt(target)] == 1 && self.indistselected_nodes[round][parseInt(target)] != 1 && parseInt(target) != self.n_nodes)) // for connecting outdist blocks and indist blocks (along the block transfer path)
              y2 = y2 + snode_r - self.node_r * 1.1 - self.max_block_rect_h;
            
            var p1 = [x1, y1]
            var p2 = [(x2 + 3 * x1)/4, (y1 + y2)/2]
            var p3 = [(3 * x2 + x1)/4, (y1 + y2)/2]
            var p4 = [x2, y2]
            self.outdist_link.append('path')
              .datum([p1, p2, p3, p4])
              .attr("d", self.lineGenaretor)
              .attr("class", 'out_block_dist'+round+name) //"block-path"+round+progress_id+" block"+u)
              .attr("id", parseInt(bid)) // "line-block-"+lineIndex)
              .attr("isLocal", u.isLocal)
              .attr("fill", "none")
              .attr("stroke", function () {
                if (parseInt(bid) == self.selected_block) {
                  if (u.isLocal == 1) return 'red'
                  else return 'green'
                } else return 'black'
              })// TODO
              .attr("stroke-opacity", function () {
                if (parseInt(bid) == self.selected_block) return 1
                else return 0.3;
              })
              .attr("stroke-width", function () {
                if (parseInt(bid) == self.selected_block) return 1.5
                else return 1;
              })
            //lineIndex+=1
          }
        }
      }
    },

    removeOutBlockDist(round, name)
    {
      var self = this;
/*
      for(var index in self.transfer_json[round][name]){
        self.transfer_json[round][name][index].forEach(function (u){
          if (self.filtered_nodes[index] == 1)
            self.outdistnodes_target[round][index] = Math.max(self.outdistnodes_target[round][index]-1, 0);
        })
      }
*/
      for(var target in self.transfer_json[round][name]) {
        for (var bid in self.transfer_json[round][name][target]) {
          //if (self.filtered_nodes[parseInt(target)] == 1)
          self.outdistnodes_target[round][parseInt(target)] = Math.max(self.outdistnodes_target[round][parseInt(target)]-1, 0);
        }
      }

      // console.log("self.outdistnodes_target", self.outdistnodes_target)

      d3.selectAll('.out_block_dist'+round+name).remove();
      d3.selectAll('.out_block_dist_rect'+round+name).remove();
    },

    updateBlockTransferPath(blockid) 
    {
      var self = this;

      self.graphG.selectAll(".nodetexts").remove();
      if (blockid == self.selected_block) {
        for (var i = 1; i < self.max_round; i ++) {
/*
          for (var j = 0; j < self.n_nodes; j ++) {
            if (self.indistpath_nodes[i][j] == 1) {
              if (self.indistselected_nodes[i][j] == 1) 
                self.updateBlockTransferPathRelated(i+1, j, -1);
              else {
                self.removeInBlockDist(i+1, j, self.selected_block);

                if (self.outdistselected_nodes[i-1][j] == 1) { // for connecting outdist blocks and indist blocks (along the block transfer path)
                  self.removeOutBlockDist(i, j);
                  self.addOutBlockDist(i, j, -1)
                }
              }
            }
          }
*/
          for (var j = 0; j < self.display_nodes_array.length; j ++) {
            var dnode = self.display_nodes_array[j];

            if (self.indistpath_nodes[i][dnode] == 1) {
              if (self.indistselected_nodes[i][dnode] == 1) 
                self.updateBlockTransferPathRelated(i+1, dnode, -1);
              else {
                self.removeInBlockDist(i+1, dnode, self.selected_block);

                if (self.outdistselected_nodes[i-1][dnode] == 1) { // for connecting outdist blocks and indist blocks (along the block transfer path)
                  self.removeOutBlockDist(i, dnode);
                  self.addOutBlockDist(i, dnode, -1)
                }
              }
            }
          }
        }

        self.selected_block = -1;
        for (var i = 0; i < self.max_round; i ++) {
          self.nodes_transfer[i] = {}
          self.indistpath_nodes[i] = {};
        }
      }
      else {
        // remove previous one first
        for (var i = 1; i < self.max_round; i ++) {
/*
          for (var j = 0; j < self.n_nodes; j ++) {
            if (self.indistpath_nodes[i][j] == 1) {
              if (self.indistselected_nodes[i][j] == 1) 
                self.updateBlockTransferPathRelated(i+1, j, -1);
              else {
                self.removeInBlockDist(i+1, j, self.selected_block);

                if (self.outdistselected_nodes[i-1][j] == 1) { // for connecting outdist blocks and indist blocks (along the block transfer path)
                  self.removeOutBlockDist(i, j);
                  self.addOutBlockDist(i, j, -1)
                }
              }
            }
          }
*/
          for (var j = 0; j < self.display_nodes_array.length; j ++) {
            var dnode = self.display_nodes_array[j];

            if (self.indistpath_nodes[i][dnode] == 1) {
              if (self.indistselected_nodes[i][dnode] == 1) 
                self.updateBlockTransferPathRelated(i+1, dnode, -1);
              else {
                self.removeInBlockDist(i+1, dnode, self.selected_block);

                if (self.outdistselected_nodes[i-1][dnode] == 1) { // for connecting outdist blocks and indist blocks (along the block transfer path)
                  self.removeOutBlockDist(i, dnode);
                  self.addOutBlockDist(i, dnode, -1)
                }
              }
            }
          }
        }

        self.selected_block = blockid;
        self.computeBlockPathBlocks(self.selected_block);

        for (var i = 1; i < self.max_round; i ++) {
/*
          for (var j = 0; j < self.n_nodes; j ++) {
            if (self.indistpath_nodes[i][j] == 1) {
              if (self.indistselected_nodes[i][j] == 1) 
                self.updateBlockTransferPathRelated(i+1, j, self.selected_block);
              else {
                self.addInBlockDist(i+1, j, self.selected_block);
                if (self.outdistselected_nodes[i-1][j] == 1) { // for connecting outdist blocks and indist blocks (along the block transfer path)
                  self.removeOutBlockDist(i, j);
                  self.addOutBlockDist(i, j, 0)
                }
              }
            }
          }
*/
          for (var j = 0; j < self.display_nodes_array.length; j ++) {
            var dnode = self.display_nodes_array[j];

            if (self.indistpath_nodes[i][dnode] == 1) {
              if (self.indistselected_nodes[i][dnode] == 1) 
                self.updateBlockTransferPathRelated(i+1, dnode, self.selected_block);
              else {
                self.addInBlockDist(i+1, dnode, self.selected_block);
                if (self.outdistselected_nodes[i-1][dnode] == 1) { // for connecting outdist blocks and indist blocks (along the block transfer path)
                  self.removeOutBlockDist(i, dnode);
                  self.addOutBlockDist(i, dnode, 0)
                }
              }
            }
          }
        }
      }

      self.updateProcNodes();
    },

    updateBlockTransferPathRelated(round, name, blockid)
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
    },

    blockRectMouseOver(u) 
    {
      var self = this;

      for (var i = 0; i < self.max_round; i ++) { // TODO to be improved
/*
        for (var j = 0; j < self.n_nodes; j ++) {
          d3.selectAll(".out_block_dist"+(i+1)+j)
            .attr("stroke", function () {
              if (d3.select(this).attr('id') == self.selected_block) {
                if (d3.select(this).attr('isLocal') == 1) return "red";
                else return 'green'
              } else return "black"
            })
            .attr("stroke-width", function () {
              if (d3.select(this).attr('id') == u || d3.select(this).attr('id') == self.selected_block) return 1.5;
              else return 1;
            })
            .attr("stroke-opacity", function () {
              if (d3.select(this).attr('id') == u || d3.select(this).attr('id') == self.selected_block) return 1;
              else return 0.3;
            })

          d3.selectAll(".in_block_dist"+(i+1)+j)
            .attr("stroke", function () {
              if (d3.select(this).attr('id') == self.selected_block) {
                if (d3.select(this).attr('isLocal') == 1) return "red";
                else return 'green'
              } else return "black"
            })
            .attr("stroke-width", function () {
              if (d3.select(this).attr('id') == u || d3.select(this).attr('id') == self.selected_block) return 1.5;
              else return 1;
            })
            .attr("stroke-opacity", function () {
              if (d3.select(this).attr('id') == u || d3.select(this).attr('id') == self.selected_block) return 1;
              else return 0.3;
            })
        }
*/
        for (var j = 0; j < self.display_nodes_array.length; j ++) {
          var dnode = self.display_nodes_array[j];

          d3.selectAll(".out_block_dist"+(i+1)+dnode)
            .attr("stroke", function () {
              if (d3.select(this).attr('id') == self.selected_block) {
                if (d3.select(this).attr('isLocal') == 1) return "red";
                else return 'green'
              } else return "black"
            })
            .attr("stroke-width", function () {
              if (d3.select(this).attr('id') == u || d3.select(this).attr('id') == self.selected_block) return 1.5;
              else return 1;
            })
            .attr("stroke-opacity", function () {
              if (d3.select(this).attr('id') == u || d3.select(this).attr('id') == self.selected_block) return 1;
              else return 0.3;
            })

          d3.selectAll(".in_block_dist"+(i+1)+dnode)
            .attr("stroke", function () {
              if (d3.select(this).attr('id') == self.selected_block) {
                if (d3.select(this).attr('isLocal') == 1) return "red";
                else return 'green'
              } else return "black"
            })
            .attr("stroke-width", function () {
              if (d3.select(this).attr('id') == u || d3.select(this).attr('id') == self.selected_block) return 1.5;
              else return 1;
            })
            .attr("stroke-opacity", function () {
              if (d3.select(this).attr('id') == u || d3.select(this).attr('id') == self.selected_block) return 1;
              else return 0.3;
            })
        }
      }
    },

    blockRectMouseOut(u) 
    {
      var self = this;

      for (var i = 0; i < self.max_round; i ++) { // TODO to be improved
/*
        for (var j = 0; j < self.n_nodes; j ++) {
          d3.selectAll(".out_block_dist"+(i+1)+j)
            .attr("stroke", function () {
              if (d3.select(this).attr('id') == self.selected_block) {
                if (d3.select(this).attr('isLocal') == 1) return "red";
                else return 'green'
              } else return 'black'
            })
            .attr("stroke-width", function () {
              if (d3.select(this).attr('id') == self.selected_block) return 1.5
              else return 1;
            })
            .attr("stroke-opacity", function () {
              if (d3.select(this).attr('id') == self.selected_block) return 1
              else return 0.3;
            })

          d3.selectAll(".in_block_dist"+(i+1)+j)
            .attr("stroke", function () {
              if (d3.select(this).attr('id') == self.selected_block) {
                if (d3.select(this).attr('isLocal') == 1) return "red";
                else return 'green'
              } else return 'black'
            })
            .attr("stroke-width", function () {
              if (d3.select(this).attr('id') == self.selected_block) return 1.5
              else return 1;
            })
            .attr("stroke-opacity", function () {
              if (d3.select(this).attr('id') == self.selected_block) return 1
              else return 0.3;
            })
        }
*/
        for (var j = 0; j < self.display_nodes_array.length; j ++) {
          var dnode = self.display_nodes_array[j];

          d3.selectAll(".out_block_dist"+(i+1)+dnode)
            .attr("stroke", function () {
              if (d3.select(this).attr('id') == self.selected_block) {
                if (d3.select(this).attr('isLocal') == 1) return "red";
                else return 'green'
              } else return 'black'
            })
            .attr("stroke-width", function () {
              if (d3.select(this).attr('id') == self.selected_block) return 1.5
              else return 1;
            })
            .attr("stroke-opacity", function () {
              if (d3.select(this).attr('id') == self.selected_block) return 1
              else return 0.3;
            })

          d3.selectAll(".in_block_dist"+(i+1)+dnode)
            .attr("stroke", function () {
              if (d3.select(this).attr('id') == self.selected_block) {
                if (d3.select(this).attr('isLocal') == 1) return "red";
                else return 'green'
              } else return 'black'
            })
            .attr("stroke-width", function () {
              if (d3.select(this).attr('id') == self.selected_block) return 1.5
              else return 1;
            })
            .attr("stroke-opacity", function () {
              if (d3.select(this).attr('id') == self.selected_block) return 1
              else return 0.3;
            })
        }
      }
    },

    // functions for checking nodes
    isNoneNodesHighlighted()
    {
      var self = this;

      for (var i = 0; i < self.max_round; i ++) {
/*
        for (var j = 0; j < self.n_nodes; j ++) {
          if (self.highlighted_nodes[i][j] == 1) return false;
        }
*/
        for (var j = 0; j < self.display_nodes_array.length; j ++) {
          var dnode = self.display_nodes_array[j];
          if (self.highlighted_nodes[i][dnode] == 1) return false;
        }
      }

      return true;
    },

    recoveryProcNodesLinks()
    {
      var self = this;

      self.max_node.attr('stroke-opacity', function(d) {
        if (self.filtered_nodes[d.name] == 1) return 0.8
        else return 0
      });
      self.node.attr('opacity', 1)

      self.proc_link.selectAll('path')
        .attr("stroke-opacity", 0.1)
    },

    // functions for context menu (rignt click events)
    contextMenu() {
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
        var self = this;

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
              
              self.graphG.selectAll(".nodetexts").remove();

              if (self.indistselected_nodes[round-1][name] == 1) {
                self.indistselected_nodes[round-1][name] = 0;
                self.removeInBlockDist(round, name, -1);
                if (self.indistpath_nodes[round-1][name] == 1) 
                  self.addInBlockDist(round, name, self.selected_block);
              }
              else {
                self.indistselected_nodes[round-1][name] = 1;
                if (self.indistpath_nodes[round-1][name] == 1) 
                  self.removeInBlockDist(round, name, self.selected_block);
                self.addInBlockDist(round, name, -1);
              }
              
              self.updateProcLinks(-1, -1);
              self.updateProcNodes();
            } else if (index == 1) { // Outgoing Block Dist.
              self.graphG.selectAll(".nodetexts").remove();

              if (self.outdistselected_nodes[round-1][name] == 1) {
                self.outdistselected_nodes[round-1][name] = 0;
                self.removeOutBlockDist(round, name);
/*
                for(var target in self.transfer_json[round][name]) {
                  self.transfer_json[round][name][target].forEach(function (u) {
                    if (self.filtered_nodes[target] == 1)
                    {
                      if (self.indistpath_nodes[round][target] == 1 && self.indistselected_nodes[round][target] != 1) {
                        self.addInBlockDist(round+1, target, self.selected_block);
                      }
                    }
                  })
                }
*/
                for(var target in self.transfer_json[round][name]) {
                  for (var bid in self.transfer_json[round][name][target]) {
                    if (self.filtered_nodes[parseInt(target)] == 1) {
                      if (self.indistpath_nodes[round][parseInt(target)] == 1 && self.indistselected_nodes[round][parseInt(target)] != 1) {
                        self.addInBlockDist(round+1, parseInt(target), self.selected_block);
                      }
                    }
                  }
                }

              }
              else {
                self.outdistselected_nodes[round-1][name] = 1;
                self.addOutBlockDist(round, name, 0);
/*
                for(var target in self.transfer_json[round][name]) {
                  self.transfer_json[round][name][target].forEach(function (u) {
                    if (self.filtered_nodes[target] == 1)
                    {
                      if (self.indistpath_nodes[round][target] == 1 && self.indistselected_nodes[round][target] != 1) {
                        self.removeInBlockDist(round+1, target, self.selected_block);
                        self.addInBlockDist(round+1, target, self.selected_block);
                      }
                    }
                  })
                }
*/
                for(var target in self.transfer_json[round][name]) {
                  for (var bid in self.transfer_json[round][name][target]) {
                    if (self.filtered_nodes[parseInt(target)] == 1) {
                      if (self.indistpath_nodes[round][parseInt(target)] == 1 && self.indistselected_nodes[round][parseInt(target)] != 1) {
                        self.removeInBlockDist(round+1, parseInt(target), self.selected_block);
                        self.addInBlockDist(round+1, parseInt(target), self.selected_block);
                      }
                    }
                  }
                }
              }

              self.updateProcLinks(-1, -1);
              self.updateProcNodes();
            } else {
              self.graphG.selectAll(".noderects").remove();
              self.graphG.selectAll(".nodetexts").remove();

              for (var i = 0; i < self.max_round; i ++) {
                self.selected_nodes[i] = {};
                self.selected_nodes[i][name] = 1;
              }

              if (index == 2) { // Sources/Targets
                self.focused_round = self.focused_name = -1;
                self.updateProcLinks(-1, -1);
                self.updateProcNodes();
              } else { // 'Focused Sources/Targets'
                self.focused_round = round; self.focused_name = name;
                self.updateProcLinks(round, name);
                self.updateProcNodes(); 
              }

              for (var i = 0; i < self.max_round; i ++) {
                self.selected_nodes[i] = {};
              }
            }

            if (self.isNoneNodesHighlighted()) self.recoveryProcNodesLinks();
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
    },

    // functions for tooltips
    showTooltip(content, event) {
      var self = this

      $("#" + self.tooltipId).html(content);
      $("#" + self.tooltipId).show();
      self.updatePosition(event);
    },
    hideTooltip() {
      var self = this
      $("#" + self.tooltipId).hide();
    },
    showDetails(data) {
      var self = this

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
      self.showTooltip(content, d3.event);
    },
    hideDetails() {
      var self = this
      self.hideTooltip();
    },
    updatePosition(event) {
      var self = this

      var ttid = "#" + self.tooltipId;
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
    },

    bid2coords(bid)
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

</script>
<style lang="less">
@import "../style/style.css";
@import "../style/d3.slider.css";

</style>