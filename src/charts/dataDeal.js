

// import mapboxgl from 'mapbox-gl'
// import 'mapbox-gl/dist/mapbox-gl.css'
// import Trajlayer from './layers/trajLayer.js'
// import config from '../commons/config.js'
// let { curTime } = config


export default class {
  constructor(el) {
    this.el = el

    this.init()
  }

  init() {
  	var self = this
  	var containerWidth = +$('#load-balance-container').width()
  	var containerHeight = +$('#load-balance-container').height()

  	var sliderWidth = +$('#slider1').width()
  	var sliderHeight = +$('#slider1').height()

  	var margin = {top: 20, right: 15, bottom: 10, left: 10}
  	var globalDistributionObj = {}
  	var svg = d3.select("svg")
  	  .attr('width', containerWidth)
  	  .attr('height', containerHeight) // *3
  	var width = +containerWidth - margin.left - margin.right
  	var height = +containerHeight - margin.top - margin.bottom

  	var tg = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")").attr('id', 'container-g')

  	var tooltipId = "gates_tooltip", tool_width = 180;
  	$("body").append("<div class='tooltip' id='" + tooltipId + "'></div>");
  	$("#" + tooltipId).css("width", tool_width);
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

  	var compareG = tg.append("g")
  	  .attr('transform', "translate(0," + (graphHeight+compareMargin.top * 2) + ")")
  	  .attr('class', 'compare-g');

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

  	//var min_workload, max_worload;
  	var min_all_npts, max_all_npts;
  	var min_npts, max_npts;
  	var min_nfdpts, max_nfdpts;
  	var min_nufdpts, max_nufdpts;
  	var min_value, max_value;
  	var min_link_count, max_link_count;

  	// var selected_procs = [];

  	var color = d3.scale.category10();
  	var a = d3.rgb(0, 255, 0); //红色               设置渐变颜色的起始
  	var b = d3.rgb(255, 0, 0); //绿色

  	var linear, compute;

  	var n_compares = 0;

  	var lines = [], temp_nodes = [], nodes = [], links = [], histograms = [], transfers = [];
  	var transfer_json = {}, dist_json = {};
  	var node_indices = [];
  	var nodes_num = [];
  	var nodes_ids = [];
  	var max_wl = [], min_wl = [];
  	var max_est_wl = [], min_est_wl = [];
  	var max_wl_estWl_diff = [], min_wl_estWl_diff = [];

  	var selected_nodes = []
  	var nodes_source = [], nodes_target = [];
  	for (var i = 0; i < max_round; i ++) {
  	  nodes_source[i] = {};
  	  nodes_target[i] = {};
  	  selected_nodes[i] = {};
  	}

  	var outdistselected_nodes = [], indistselected_nodes = [];
  	var outdistnodes_target = [], indistnodes_source = [];
  	for (var i = 0; i < max_round; i ++) {
  	  outdistnodes_target[i] = {};
  	  outdistselected_nodes[i] = {};

  	  indistnodes_source[i] = {};
  	  indistselected_nodes[i] = {};
  	}

  	var nodes_transfer = [];
  	for (var i = 0; i < max_round; i ++) {
  	  nodes_transfer[i] = {};
  	}

  	var selected_block = -1;

  	var lineGenaretor = d3.svg.line()
  	  .interpolate("basis")
  	  .x(function (d) {
  	    return d[0]
  	  })
  	  .y(function (d) {
  	    return d[1]
  	  });

  	var x_line = d3.scale.linear().range([0, lineHeight]),
  	  y_line = d3.scale.linear().range([0, lineWidth]);

  	//var menu = contextMenu().items('Incoming Block Dist.', 'Outgoing Block Dist.', 'Sources/Targets', 'Focused Sources/Targets');


  	var node, node2, link, link2, compareHistograms;
  	var no = "";
  	var dir = "static/resource/data"+n_nodes+"_2/"

  	d3.csv(dir + "block_dist" + no + ".csv", function (error, data_d1) {
  	  if (error) throw error;

  	  var temp = 1
  	  histograms[0] = []
  	  data_d1.forEach(function (d, i) {
  	    if (+d.round <= max_round) {
  	      if (temp != parseInt(d.round)) {
  	        temp = parseInt(d.round);
  	        histograms[parseInt(d.round) - 1] = [];
  	      }

  	      histograms[parseInt(d.round) - 1].push({
  	        "name": +d.name,
  	        "blockid": +d.blockid,
  	        "isLocal": +d.isLocal,
  	        "workload": +d.wl,
  	        "estWorkload": +d.estWl,
  	        "round": +d.round
  	      });

  	      d = {
  	        "name": +d.name,
  	        "blockid": +d.blockid,
  	        "isLocal": +d.isLocal,
  	        "workload": +d.wl,
  	        "estWorkload": +d.estWl,
  	        "round": +d.round
  	      }

  	      if(!dist_json[d.round]) dist_json[d.round] = {}
  	      if(!dist_json[d.round][d.name]) dist_json[d.round][d.name] = []

  	      dist_json[d.round][d.name].push({
  	        "blockid": d.blockid,
  	        "workload": d.workload,
  	        "estWorkload": d.estWorkload
  	      })
  	    }
  	  });


  	  
  	  d3.csv(dir + "block_transfer" + no + ".csv", function (error, data_t1) {
  	    if (error) throw error;

  	    var temp = 1
  	    transfers[0] = []
  	    data_t1.forEach(function (d, i) {
  	      if (+d.round < max_round) {
  	        if (temp != parseInt(d.round)) {
  	          temp = parseInt(d.round);
  	          transfers[parseInt(d.round) - 1] = [];
  	        }

  	        transfers[parseInt(d.round) - 1].push({
  	          "source": +d.source,
  	          "target": +d.target,
  	          "blockid": +d.blockid,
  	          "isLocal": +d.isLocal,
  	          "count": +d.count,
  	          "round": +d.round
  	        });

  	        // store by json structure
  	        d = {
  	          "source": +d.source,
  	          "target": +d.target,
  	          "blockid": +d.blockid,
  	          "isLocal": +d.isLocal,
  	          "count": +d.count,
  	          "round": +d.round
  	        }
  	      
  	        if(!transfer_json[d.round]) transfer_json[d.round] = {}
  	        if(!transfer_json[d.round][d.source]) transfer_json[d.round][d.source] = {}

  	        if(!transfer_json[d.round][d.source][d.target]) transfer_json[d.round][d.source][d.target] = []

  	        //transfer_json[d.round][d.source][d.target].push(d.blockid)
  	        transfer_json[d.round][d.source][d.target].push({"blockid": d.blockid, "isLocal": d.isLocal})
  	      }
  	    });

  	    // console.log(transfer_json)

  	    d3.csv(dir + "balance" + no + ".csv", function (error, data1) {
  	      if (error) throw error;

  	      data1.forEach(function (d, i) {
  	        if (i < max_round) {
  	          lines.push({"x": +d.time, "y": +d.balance});
  	        }
  	      })

  	      var mx_line = d3.max(lines, function (d) { return d.x });
  	      var my_line = d3.max(lines, function (d) { return d.y });

  	      console.log(mx_line, my_line);
  	      x_line.domain([0, nodes_num.length])  // Math.ceil(mx_line)
  	      y_line.domain([1, my_line]) // Math.ceil(my_line)

  	      //console.log(lines);

  	      d3.csv(dir + "nodes" + no + ".csv", function (error, data2) {
  	        if (error) throw error;

  	        temp_nodes[0] = [];

  	        var temp = 1, temp_i = 0, count_i = 0, count = 0;
  	        data2.forEach(function (d, i) {
  	          if (+d.round <= max_round) {
  	            count++;
  	            /*
  	             nodes.push({ "name": d.name,
  	             "workload": +d.workload,
  	             "npts": +d.npts,
  	             "nfdpts": +d.nfdpts,
  	             "round": +d.round });
  	             */
  	            if (temp != parseInt(d.round)) {
  	              temp_i = i;
  	              temp = parseInt(d.round);
  	              nodes_num.push(count_i);
  	              count_i = 0;

  	              temp_nodes[parseInt(d.round) - 1] = [];
  	            }
  	            count_i += 1;

  	            temp_nodes[parseInt(d.round) - 1].push({
  	              "name": d.name,
  	              "count": +d.count,
  	              "localCount": +d.localCount,
  	              "workload": +d.workload,
  	              "estWorkload": +d.estWorkload,
  	              "npts": +d.npts,
  	              "nfdpts": +d.nfdpts,
  	              "round": +d.round
  	            });
  	          }
  	        });
  	        nodes_num.push(count - temp_i);
  	        //console.log(nodes_num);

  	        for (var i = 0; i < temp_nodes.length; i++) {
  	          temp_nodes[i].sort(function (a, b) {
  	            return a["workload"] - b["workload"];
  	          });

  	          // 为了将node的x坐标按照负载从小到大的顺序排序
  	          node_indices[i] = [];
  	          for (var j = 0; j < temp_nodes[i].length; j++) {
  	            // nodes.push(temp_nodes[i][j]);
  	            nodes.push({
  	              "rank": j,
  	              "name": temp_nodes[i][j].name,
  	              "count": temp_nodes[i][j].count,
  	              "localCount": temp_nodes[i][j].localCount,
  	              "workload": temp_nodes[i][j].workload,
  	              "estWorkload": temp_nodes[i][j].estWorkload,
  	              "npts": temp_nodes[i][j].npts,
  	              "nfdpts": temp_nodes[i][j].nfdpts,
  	              "round": temp_nodes[i][j].round
  	            });

  	            var name = parseInt(temp_nodes[i][j].name);
  	            node_indices[i][name] = j;
  	          }
  	        }

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
  	        compute = d3.interpolate(a, b);

  	        d3.csv(dir + "links" + no + ".csv", function (error, data3) {
  	          if (error) throw error;

  	          data3.forEach(function (d) {
  	            if (+d.round < max_round) {
  	              links.push({
  	                "source": d.source,
  	                "target": d.target,
  	                "value": parseInt(d.value),
  	                "count": parseInt(d.count),
  	                "round": parseInt(d.round)
  	              });
  	            }
  	          });

  	          min_value = d3.min(links, function (d) {
  	            return d.value;
  	          });
  	          max_value = d3.max(links, function (d) {
  	            return d.value;
  	          });

  	          min_link_count = d3.min(links, function (d) {
  	            return d.count;
  	          });
  	          max_link_count = d3.max(links, function (d) {
  	            return d.count;
  	          });

  	          console.log(min_value, max_value, min_link_count, max_link_count);
  	          var histogramHeight = height * 0.15 * 0.8
  	          var histogramWidth = width / 4 * 1.0
  	          var margin = {top: histogramHeight * 0.2, right: histogramWidth * 0.05, bottom: histogramHeight * 0.05, left: 0}
  	         

  	          console.log("nodes: ", nodes)
  	          console.log("links: ", links)

  	          self.setGraphData({'nodes': nodes, 'links': links})
  	          //self.$store.dispatch('setGraphData',{'nodes': nodes, 'links': links})
  	          //drawGraph(nodes, links)
  	          //drawLineChart(lines)

  	          // d3.select('#slider1').call(d3.slider().min(min_link_count).max(max_link_count).on("slide", function(evt, value) {
  	          //   d3.select('#slider1text').text(value);
  	          //   filterPath(value)
  	          // }));

  	        });
  	      });
  	    });
  	  });
  	});


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

  	function showTooltip(content, event) {
  	  $("#" + tooltipId).html(content);
  	  $("#" + tooltipId).show();
  	  updatePosition(event);
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

  	function hideTooltip() {
  	  $("#" + tooltipId).hide();
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
