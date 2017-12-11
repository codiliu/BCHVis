define([
    'require',
    "d3",
    'marionette',
    'underscore',
    'jquery',
    'backbone',
    'config',
    "variables",
    "datacenter",
    "d3tip"
], function(require, d3, Mn, _, $, Backbone, Config, Variables, Datacenter, d3tip) {
    'use strict';
    var TrajLayer = function(map, id) {
        //this.model=model
        this.map = map;
        this.id = id;
        this.geometry = {}
        this.depShow = true;
        this.arrShow = true;
        this.oriPoints = false;
        this.filterTrajShow = false;
        this.flightsShowTip = [];
        // this.flightNow = null;
        this.beginTime = new Date(2016, 11, 15, 0).getTime();
        this.lineMaterial = {
            linewidth: Datacenter.get('width-slider-current-value'),
            opacity: 1,
            visible: true
        };
        //this.init(data);
    };

    TrajLayer.prototype = {
        init: function(_data) {
            this.overlay = L.canvasOverlay()
                // .params({data:_data})
                // .drawing(this.drawingOnCanvas)
                .containParent(this)
                .addTo(this.map);

            this.TrajSvgOverlay = L.d3SvgOverlay(function(sel, proj) {
                sel.selectAll(".TrajCircle_arr_circle").attr("r", 4 / proj.scale);
                sel.selectAll(".TrajCircle_dep_circle").attr("r", 4 / proj.scale);

                sel.selectAll(".flight_tip").style("font-size", 1 / proj.scale + 'em');
            });

            this.TrajSvgOverlay.addTo(this.map);
            this.updateData(_data);
        },
        drawingOnCanvas: function(canvasOverlay, params) {
            var ctx = params.canvas.getContext('2d');
            var canvas = params.canvas;
            var self = params.containParent;

            var data = params.options.data;
            var filterCircleDataArray = Datacenter.get("filterCircleDataArray");
            var fixpot_filterDataArray = Datacenter.get("fixpot_filterDataArray");
            var flight_select = Datacenter.get("flight_timeline");
            var curTime = Config.get('curtime'); //右边界
            var curTimePath = Config.get('curtimePath');

            var arrTrajsArr = data['arrTrajs'];
            var depTrajsArr = data['depTrajs'];

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (self.arrShow) {
                arrTrajsArr.map(function(d, i) {

                    var dest = d.data.length - 1;
                    var dot1 = canvasOverlay._map.latLngToContainerPoint(d.data[0].latlon);
                    var dot2 = canvasOverlay._map.latLngToContainerPoint(d.data[dest].latlon);

                    ctx.lineWidth = Datacenter.get('width-slider-current-value');
                    var prePos = d.data[0].latlon;

                    if (self.filterTrajShow && $.inArray(d.trajID, filterCircleDataArray) == -1)
                        ctx.strokeStyle = "rgba(209, 71, 69, 0.1)";
                    else if (fixpot_filterDataArray.length > 0 && $.inArray(d.trajID, fixpot_filterDataArray) == -1) {
                        ctx.strokeStyle = "rgba(209, 71, 69, 0.1)";
                    } else if (flight_select != null && d.trajID != flight_select && curTimePath < curTime) {
                        ctx.strokeStyle = "rgba(209, 71, 69, 0.1)";
                    } else {
                        var grad = ctx.createLinearGradient(dot1.x, dot1.y, dot2.x, dot2.y);
                        grad.addColorStop(0, "rgba(209, 71, 69, 0.5)");
                        grad.addColorStop(1, "rgb(209, 71, 69)");
                        ctx.strokeStyle = grad;
                    }

                    ctx.beginPath();
                    ctx.moveTo(dot1.x, dot1.y);
                    for (var i = 1; i < d.data.length; i++) {
                        var dot = canvasOverlay._map.latLngToContainerPoint(d.data[i].latlon);
                        var pos = d.data[i].latlon;
                        if (Math.abs(pos[1] - prePos[1]) > 180) {
                            ctx.stroke();
                            ctx.closePath();
                            ctx.beginPath();
                            ctx.moveTo(dot.x, dot.y);
                        } else {
                            ctx.lineTo(dot.x, dot.y);
                        }
                        prePos = pos;
                    }
                    ctx.stroke();
                    ctx.closePath();
                });
            }

            if (self.depShow) {
                depTrajsArr.map(function(d, i) {

                    var dest = d.data.length - 1;
                    var dot1 = canvasOverlay._map.latLngToContainerPoint(d.data[0].latlon);
                    var dot2 = canvasOverlay._map.latLngToContainerPoint(d.data[dest].latlon);

                    ctx.lineWidth = Datacenter.get('width-slider-current-value');
                    var prePos = d.data[0].latlon;

                    if (self.filterTrajShow && $.inArray(d.trajID, filterCircleDataArray) == -1)
                        ctx.strokeStyle = "rgba(41, 170, 227, 0.1)";
                    else if (fixpot_filterDataArray.length > 0 && $.inArray(d.trajID, fixpot_filterDataArray) == -1) {
                        ctx.strokeStyle = "rgba(41, 170, 227, 0.1)";
                    } else if (flight_select != null && d.trajID != flight_select && curTimePath < curTime) {
                        ctx.strokeStyle = "rgba(41, 170, 227, 0.1)";
                    } else {
                        // linear gradient from start to end of line
                        var grad = ctx.createLinearGradient(dot1.x, dot1.y, dot2.x, dot2.y);
                        grad.addColorStop(0, "rgba(41, 170, 227, 0.5)");
                        grad.addColorStop(1, "rgb(41, 170, 227)");
                        ctx.strokeStyle = grad;
                    }

                    ctx.beginPath();
                    ctx.moveTo(dot1.x, dot1.y);

                    for (var i = 1; i < d.data.length; i++) {
                        var dot = canvasOverlay._map.latLngToContainerPoint(d.data[i].latlon);
                        var pos = d.data[i].latlon;
                        if (Math.abs(pos[1] - prePos[1]) > 180) {
                            ctx.stroke();
                            ctx.closePath();
                            ctx.beginPath();
                            ctx.moveTo(dot.x, dot.y);
                        } else {
                            ctx.lineTo(dot.x, dot.y);
                        }
                        prePos = pos;
                    }
                    ctx.stroke();
                    ctx.closePath();
                });

            }
            self.render(data);
        },
        render: function(data) {
            var self = this;
            var sel = this.TrajSvgOverlay.selection;
            var proj = this.TrajSvgOverlay.projection;
            var filterCircleDataArray = Datacenter.get("filterCircleDataArray");
            var fixpot_filterDataArray = Datacenter.get("fixpot_filterDataArray");
            var curTime = Config.get('curtime'); //右边界
            var curTimePath = Config.get('curtimePath');

            var flightNow = Datacenter.get("flightNow");
            var flight_select = Datacenter.get("flight_timeline");

            $('.TrajCircle_arr').remove();
            $('.TrajCircle_dep').remove();

            $("#currentArrNum").html(data['arrTrajs'].length);
            $("#currentDepNum").html(data['depTrajs'].length);

            var r = Datacenter.get('size-slider-current-value');

            var d3line = d3.svg.line()
                .x(function(d) { return d.x; })
                .y(function(d) { return d.y; })
                .interpolate("linear");

            if (this.arrShow) {
                var arrTrajs_g = sel.selectAll(".TrajCircle_arr")
                    .data(data["arrTrajs"])
                    .enter()
                    .append("g")
                    .attr("class", "TrajCircle_arr");

                arrTrajs_g.append('circle')
                    .attr({
                        "class": "TrajCircle_arr_circle",
                        "id": function(d) { return "Trajs_g_" + d.trajID; },
                        "fill": "rgb(209, 71, 69)",
                        "r": r / proj.scale,
                        "cx": function(d) { return proj.latLngToLayerPoint(d.data[d.data.length - 1].latlon).x; },
                        "cy": function(d) { return proj.latLngToLayerPoint(d.data[d.data.length - 1].latlon).y; },
                        "fill-opacity": function(d) {
                            if (self.filterTrajShow && $.inArray(d.trajID, filterCircleDataArray) == -1)
                                return 0.1;
                            else if (fixpot_filterDataArray.length > 0 && $.inArray(d.trajID, fixpot_filterDataArray) == -1)
                                return 0.1;
                            else if (flight_select != null && d.trajID != flight_select && curTimePath < curTime)
                                return 0.1;
                            else return 1;
                        },
                    })
                    .style("cursor", "pointer")
                    .on("click", function(d) {
                        Datacenter.set('flightToSearch', d.callsign);
                        var index = $.inArray(d.trajID, self.flightsShowTip);
                        if (index == -1) {
                            self.flightsShowTip.push(d.trajID);
                            d3.select('#flight_tip_text_' + d.trajID).classed("hidden", false);
                            d3.select('#flight_tip_border_' + d.trajID).classed("hidden", false);
                        } else {
                            self.flightsShowTip.splice(index, 1);
                            d3.select('#flight_tip_text_' + d.trajID).classed("hidden", true);
                            d3.select('#flight_tip_border_' + d.trajID).classed("hidden", true);
                        }

                        if (flightNow != d.trajID) {
                            if (d3.select('#flight_tip_text_' + d.trajID).classed("hidden") == false)
                                flightNow = d.trajID;
                        } else {
                            flightNow = null;
                        }

                        d3.selectAll('.flight_tip_border').style("stroke-width", function(d) {
                            if (flightNow == null)
                                return 0.5 / proj.scale;
                            if (d.trajID == flightNow) return 2 / proj.scale;
                            else return 0.5 / proj.scale;
                        });

                        Datacenter.set("flightNow", flightNow);
                        Datacenter.set("flight_timeline", flightNow);
                    });

                var arr_text = arrTrajs_g.append("text")
                    .attr("class", "flight_tip")
                    .attr("id", function(d) { return "flight_tip_text_" + d.trajID; })
                    .attr("x", function(d) { return proj.latLngToLayerPoint(d.data[d.data.length - 1].latlon).x; })
                    .attr("y", function(d) { return proj.latLngToLayerPoint(d.data[d.data.length - 1].latlon).y; })
                    .attr("dy", "-.71em")
                    .style("font-size", function() { return 1 / proj.scale + 'em'; })
                    .style('fill', 'rgb(209, 71, 69)')
                    .attr("text-anchor", "middle")
                    .html(function(d) { return d.callsign; });

                arrTrajs_g.append("path")
                    .attr("class", "flight_tip_border")
                    .attr("id", function(d) { return "flight_tip_border_" + d.trajID; })
                    .attr("d", function(d) { return d3line(Flight_text_BBox(d.trajID)); })
                    .style("stroke-width", 1 / proj.scale)
                    .style("stroke", "rgb(209, 71, 69)")
                    .style("fill", "none");

            }

            if (this.depShow) {
                var depTrajs_g = sel.selectAll(".TrajCircle_dep")
                    .data(data["depTrajs"])
                    .enter()
                    .append("g")
                    .attr("class", "TrajCircle_dep");

                depTrajs_g.append('circle')
                    .attr({
                        "class": "TrajCircle_dep_circle",
                        "id": function(d) {
                            return "Trajs_g_" + d.trajID;
                        },
                        "fill": "rgb(41, 170, 227)",
                        "r": r / proj.scale,
                        "cx": function(d) { return proj.latLngToLayerPoint(d.data[d.data.length - 1].latlon).x; },
                        "cy": function(d) { return proj.latLngToLayerPoint(d.data[d.data.length - 1].latlon).y; },
                        "fill-opacity": function(d) {
                            if (self.filterTrajShow && $.inArray(d.trajID, filterCircleDataArray) == -1)
                                return 0.1;
                            else if (fixpot_filterDataArray.length > 0 && $.inArray(d.trajID, fixpot_filterDataArray) == -1)
                                return 0.1;
                            else if (flight_select != null && d.trajID != flight_select && curTimePath < curTime)
                                return 0.1;
                            else
                                return 1;
                        },
                    })
                    .style("cursor", "pointer")
                    .on("click", function(d) {
                        Datacenter.set('flightToSearch', d.callsign);
                        var index = $.inArray(d.trajID, self.flightsShowTip);
                        if (index == -1) {
                            self.flightsShowTip.push(d.trajID);
                            d3.select('#flight_tip_text_' + d.trajID).classed("hidden", false);
                            d3.select('#flight_tip_border_' + d.trajID).classed("hidden", false);
                        } else {
                            self.flightsShowTip.splice(index, 1);
                            d3.select('#flight_tip_text_' + d.trajID).classed("hidden", true);
                            d3.select('#flight_tip_border_' + d.trajID).classed("hidden", true);
                        }

                        if (flightNow != d.trajID) {
                            if (d3.select('#flight_tip_text_' + d.trajID).classed("hidden") == false)
                                flightNow = d.trajID;
                        } else {
                            flightNow = null;
                        }

                        d3.selectAll('.flight_tip_border').style("stroke-width", function(d) {
                            if (flightNow == null)
                                return 0.5 / proj.scale;
                            if (d.trajID == flightNow) return 2 / proj.scale;
                            else return 0.5 / proj.scale;
                        });

                        Datacenter.set("flightNow", flightNow);
                        Datacenter.set("flight_timeline", flightNow);
                    });

                depTrajs_g.append("text")
                    .attr("class", "flight_tip")
                    .attr("id", function(d) { return "flight_tip_text_" + d.trajID; })
                    .attr("x", function(d) { return proj.latLngToLayerPoint(d.data[d.data.length - 1].latlon).x; })
                    .attr("y", function(d) { return proj.latLngToLayerPoint(d.data[d.data.length - 1].latlon).y; })
                    .attr("dy", "-.71em")
                    .style("font-size", function() { return 1 / proj.scale + 'em'; })
                    .style('fill', 'rgb(41, 170, 227)')
                    .attr("text-anchor", "middle")
                    .html(function(d) {
                        return d.callsign;
                    });

                depTrajs_g.append("path")
                    .attr("class", "flight_tip_border")
                    .attr("id", function(d) { return "flight_tip_border_" + d.trajID; })
                    .attr("d", function(d) { return d3line(Flight_text_BBox(d.trajID)); })
                    .style("stroke-width", 1 / proj.scale)
                    .style("stroke", "rgb(41, 170, 227)")
                    .style("fill", "none");
            }

            function Flight_text_BBox(trajID) {
                if (d3.select("#flight_tip_text_" + trajID).node() == null)
                    return;
                var rect = d3.select("#flight_tip_text_" + trajID).node().getBBox();
                var offset = 4 / proj.scale;
                var pathinfo = [
                    { x: rect.x - offset, y: rect.y },
                    { x: rect.x + offset + rect.width, y: rect.y },
                    { x: rect.x + offset + rect.width, y: rect.y + rect.height },
                    { x: rect.x - offset, y: rect.y + rect.height },
                    { x: rect.x - offset, y: rect.y },
                ];
                return pathinfo;
            }

            d3.selectAll('.flight_tip').classed("hidden", function(d) {
                var index = $.inArray(d.trajID, self.flightsShowTip);
                if (index == -1) return true;
                else return false;
            });

            d3.selectAll('.flight_tip_border').classed("hidden", function(d) {
                var index = $.inArray(d.trajID, self.flightsShowTip);
                if (index == -1) return true;
                else return false;
            });

            d3.selectAll('.flight_tip_border').style("stroke-width", function(d) {
                if (flightNow == null)
                    return 0.5 / proj.scale;
                if (d.trajID == flightNow) return 2 / proj.scale;
                else return 0.5 / proj.scale;
            });

        },
        updateData: function(data) {
            console.warn(data);
            if (data == null)
                return;

            var curTime = Config.get('curtime'); //右边界
            var curTimePath = Config.get('curtimePath');
            var slidingwindowsize = Config.get('slidingwindowsize');
            var flight_timeline = Datacenter.get("flight_timeline");
            var startTime = curTime - slidingwindowsize;

            // console.warn(new Date(curTimePath), new Date(curTime));

            if (startTime < this.beginTime)
                startTime = this.beginTime;

            var arrDep = ['arrTrajs', 'depTrajs'];

            var filterArr = {};
            filterArr['arrTrajs'] = [];
            filterArr['depTrajs'] = [];

            var historyTraj = {};
            historyTraj['arrTrajs'] = [];
            historyTraj['depTrajs'] = [];

            var finalHistoryTraj = {};
            finalHistoryTraj['arrTrajs'] = [];
            finalHistoryTraj['depTrajs'] = [];
            //test
            arrDep.forEach(function(n) {
                data[n].forEach(function(d) {
                    var dataToPush = [];
                    var st;
                    //sort
                    d.data.sort(function(a, b) {
                        return a.Timestamp - b.Timestamp;
                    });
                    for (var j = 0; j < d.data.length; j++) {
                        if (d.data[j].Timestamp >= startTime) {
                            if (j > 0) st = j - 1;
                            else st = j;
                            break;
                        }
                    }

                    //select a specific flight and make an animation
                    if (d.trajID == flight_timeline) {
                        // console.warn('find it~~~~~~~');
                        for (var j = st; j < d.data.length; j++) {
                            dataToPush.push(d.data[j]);
                            if (d.data[j].Timestamp >= curTimePath)
                                break;
                        }
                    } else {
                        for (var j = st; j < d.data.length; j++) {
                            dataToPush.push(d.data[j]);
                            if (d.data[j].Timestamp >= curTime)
                                break;
                        }
                    }

                    filterArr[n].push({ trajID: d.trajID, callsign: d.callsign, data: $.extend(true, [], dataToPush) });
                    historyTraj[n].push({ trajID: d.trajID, callsign: d.callsign, data: $.extend(true, [], d.data.slice(0, st + 1)) });
                });
            });

            //interpolate
            arrDep.forEach(function(n) {
                filterArr[n].forEach(function(d, i) {
                    if (d.data.length >= 2) {
                        //需要判断么，直接做插值，2，历史轨迹 3，高度的插值
                        if (startTime >= d.data[0].Timestamp && startTime <= d.data[1].Timestamp) {
                            var posT0 = interpolate(d.data[0], d.data[1], startTime);
                            d.data[0] = posT0;
                        }

                        if (d.trajID == flight_timeline) {
                            if (curTimePath >= d.data[d.data.length - 2].Timestamp && curTimePath <= d.data[d.data.length - 1].Timestamp) {
                                var posT1 = interpolate(d.data[d.data.length - 2], d.data[d.data.length - 1], curTimePath);
                                d.data[d.data.length - 1] = posT1;
                            }
                        } else {
                            if (curTime >= d.data[d.data.length - 2].Timestamp && curTime <= d.data[d.data.length - 1].Timestamp) {
                                var posT1 = interpolate(d.data[d.data.length - 2], d.data[d.data.length - 1], curTime);
                                d.data[d.data.length - 1] = posT1;
                            }
                        }
                    }
                });
            });
            //interpolate for history traj
            arrDep.forEach(function(n) {
                historyTraj[n].forEach(function(d, i) {
                    d.data[d.data.length - 1] = filterArr[n][i].data[0];
                    //+-180
                    // var isCross = false;
                    // for (var j = 1; j < d.data.length; j++) {
                    //   if (Math.abs(d.data[ j ].latlon[ 1 ] - d.data[ j - 1 ].latlon[ 1 ] >= 180)) {
                    //     isCross = true;
                    //     break;
                    //   }
                    // }
                    // if(!isCross)
                    //   finalHistoryTraj[ n ].push({ trajID: d.trajID, data: $.extend(true, [], d.data) });
                });
            });

            function interpolate(dataT0, dataT1, time) {
                var latScale = d3.scale.linear()
                    .range([dataT0.latlon[0], dataT1.latlon[0]])
                    .domain([dataT0.Timestamp, dataT1.Timestamp]);

                var lngScale = d3.scale.linear()
                    .range([dataT0.latlon[1], dataT1.latlon[1]])
                    .domain([dataT0.Timestamp, dataT1.Timestamp]);

                var altScale = d3.scale.linear()
                    .range([dataT0.Altitude, dataT1.Altitude])
                    .domain([dataT0.Timestamp, dataT1.Timestamp]);

                var obj = new Object();
                obj.latlon = [latScale(time), lngScale(time)];
                obj.Timestamp = time;
                obj.Altitude = altScale(time);
                return obj;
            }

            // this.renderTrail(finalTrailArr);
            Datacenter.set("updateFilterArr", filterArr);
            this.overlay.params({ data: filterArr });
            this.overlay.drawing(this.drawingOnCanvas);
            this.overlay.redraw();

            // this.render(finalTrailArr);
        },
        updateMovementData: function(data) {
            this.updateData(data);
        },
        updateSpatialTemporalFilteredData: function(data) {
            this.updateData(data);
        },
        updateArrShow: function(arrShow) {
            this.arrShow = arrShow;

            if (this.arrShow) {
                d3.selectAll('.TrajCircle_arr').style('display', 'block');
                this.overlay.redraw();
            } else {
                d3.selectAll('.TrajCircle_arr').style('display', 'none');
                this.overlay.redraw();
            }
        },
        updateDepShow: function(depShow) {
            this.depShow = depShow;

            if (this.depShow) {
                d3.selectAll('.TrajCircle_dep').style('display', 'block');
                this.overlay.redraw();
            } else {
                d3.selectAll('.TrajCircle_dep').style('display', 'none');
                this.overlay.redraw();
            }
        },
        updateFilterShow: function(filterTrajShow) {
            this.filterTrajShow = filterTrajShow;
            this.overlay.redraw();
        },
        updateFilterTraj: function() {
            d3.selectAll('.loadingBtn').classed("hidden", true);
            this.overlay.redraw();
        },
        updateSizeWidth: function() {
            d3.selectAll('.TrajCircle_arr_circle').attr('r', Datacenter.get('size-slider-current-value'));
            d3.selectAll('.TrajCircle_dep_circle').attr('r', Datacenter.get('size-slider-current-value'));

            this.overlay.redraw();
        },
        updateFixpotFilter: function() {
            var self = this;
            var fixpot_select = $.extend(true, [], Datacenter.get("fixpot_filter"));
            var beijingfixpotsShowTip = $.extend(true, [], Datacenter.get("beijingfixpotsShowTip"));
            // console.warn("fixpot_filter", fixpot_select);

            var fixpot_filterDataArray = [];

            beijingfixpotsShowTip.forEach(function(t) {
                var fixpot = fixpot_select['arr'][t];
                if (fixpot == undefined) fixpot = fixpot_select['dep'][t];
                fixpot.forEach(function(dd) {
                    fixpot_filterDataArray.push(dd['select_traj']['trajID']);
                })
            });

            Datacenter.set("fixpot_filterDataArray", fixpot_filterDataArray);
            this.overlay.redraw();
        },
        updateCurrentSelection: function() {
            var self = this;
            console.warn('updateCurrentSelection');
            this.overlay.redraw();
        },

        renderTrailUseCircle: function(data) {
            var sel = this.TrajSvgOverlay.selection;
            var proj = this.TrajSvgOverlay.projection;

            $('.arrival').remove();
            $('.departure').remove();

            if (this.arrShow) {
                var arrTrajs_g = sel.selectAll(".arrival")
                    .data(data["arrTrajs"]);

                var newArr_g = arrTrajs_g.enter()
                    .append('g')
                    .attr('class', 'arrival');

                newArr_g.selectAll('#arrTrajTrail_g')
                    .data(function(d) {
                        return d.data;
                    })
                    .enter()
                    .append('circle')
                    .attr({
                        "class": "TrajCircleNew",
                        "id": "arrTrajTrail_g",
                        "fill": "rgb(209, 71, 69)",
                        "r": 1 / proj.scale,
                        "cx": function(d) { return proj.latLngToLayerPoint(d.latlon).x; },
                        "cy": function(d) { return proj.latLngToLayerPoint(d.latlon).y; }
                    });
            }

            if (this.depShow) {
                var depTrajs_g = sel.selectAll(".departure")
                    .data(data["depTrajs"]);

                var newDep_g = depTrajs_g.enter()
                    .append('g')
                    .attr('class', 'departure');

                newDep_g.selectAll('#depTrajTrail_g')
                    .data(function(d) {
                        return d.data;
                    })
                    .enter()
                    .append('circle')
                    .attr({
                        "class": "TrajCircleNew",
                        "id": "depTrajTrail_g",
                        "fill": "rgb(41, 170, 227)",
                        "r": 1 / proj.scale,
                        "cx": function(d) { return proj.latLngToLayerPoint(d.latlon).x; },
                        "cy": function(d) { return proj.latLngToLayerPoint(d.latlon).y; }
                    });
            }
            // Config.set("finishRender", true);
        },
        renderTrail: function(data) {
            var sel = this.TrajSvgOverlay.selection;
            var proj = this.TrajSvgOverlay.projection;

            if (this.arrShow) {
                var arrTrajs_g = sel.selectAll("#arrTrajTrail_g")
                    .data(data["arrTrajs"]);

                arrTrajs_g.enter().append("path")
                    .attr({
                        "class": "TrajPath",
                        "id": "arrTrajTrail_g",
                        "fill": "none",
                        "stroke-width": 2 / proj.scale,
                        "shape-rendering": "crispEdges",
                        "stroke": "rgb(209, 71, 69)",
                        "opacity": .7
                    });

                sel.selectAll("#arrTrajTrail_g").attr('d', function(d) {
                    var str = '';
                    d.data.forEach(function(d_point, i_point) {
                        str = str + 'L ' + proj.latLngToLayerPoint(d_point.latlon).x + ' ' + proj.latLngToLayerPoint(d_point.latlon).y;
                    });
                    var newStr = str.replace(/L/, 'M'); //把str字符串里面的第一个L替换为M,会从字符串中寻找第一个L替换
                    return newStr;
                });

                arrTrajs_g.exit().remove();
            }

            if (this.depShow) {
                var depTrajs_g = sel.selectAll("#depTrajTrail_g")
                    .data(data["depTrajs"]);

                depTrajs_g.enter().append("path")
                    .attr({
                        "class": "TrajPath",
                        "id": "depTrajTrail_g",
                        "fill": "none",
                        "stroke-width": 2 / proj.scale,
                        "shape-rendering": "crispEdges",
                        "stroke": "rgb(41, 170, 227)",
                        "opacity": .7
                    });

                sel.selectAll("#depTrajTrail_g").attr('d', function(d) {
                    var str = '';
                    // console.log(d.data.length);
                    d.data.forEach(function(d_point, i_point) {
                        str = str + 'L ' + proj.latLngToLayerPoint(d_point.latlon).x + ' ' + proj.latLngToLayerPoint(d_point.latlon).y;
                    });
                    var newStr = str.replace(/L/, 'M'); //把str字符串里面的第一个L替换为M,会从字符串中寻找第一个L替换
                    // console.log(newStr);
                    return newStr;
                });

                depTrajs_g.exit().remove();
            }
            Config.set("finishRender", true);
        },
        renderTrailNew: function(data) {
            var sel = this.TrajSvgOverlay.selection;
            var proj = this.TrajSvgOverlay.projection;



            d3.selectAll('#PathNew').remove();

            if (this.arrShow) {
                data["arrTrajs"].forEach(function(d) {
                    var num = Math.ceil(d.data.length / 50);
                    for (var ii = 0; ii < num; ii++) {
                        sel.append("path")
                            .attr({
                                "class": "TrajPath",
                                "id": "PathNew",
                                "fill": "none",
                                "stroke-width": 2 / proj.scale,
                                "shape-rendering": "crispEdges",
                                "stroke": "rgb(209, 71, 69)",
                            })
                            .attr('d', function() {
                                var str = '';
                                for (var jj = 0; jj < 50; jj++) {
                                    if (d.data[ii * 50 + jj] == undefined)
                                        break;
                                    str = str + 'L ' + proj.latLngToLayerPoint(d.data[ii * 50 + jj].latlon).x + ' ' + proj.latLngToLayerPoint(d.data[ii * 50 + jj].latlon).y;
                                }
                                var newStr = str.replace(/L/, 'M'); //把str字符串里面的第一个L替换为M,会从字符串中寻找第一个L替换
                                return newStr;
                            });
                    }
                });
            }

            if (this.depShow) {
                data["depTrajs"].forEach(function(d) {
                    for (var ii = 1; ii < d.data.length; ii++) {
                        sel.append("path")
                            .attr({
                                "class": "TrajPath",
                                "id": "PathNew",
                                "fill": "none",
                                "stroke-width": 2 / proj.scale,
                                "shape-rendering": "crispEdges",
                                "stroke": "rgb(41, 170, 227)",
                            })
                            .attr('d', function() {
                                var str = '';
                                for (var jj = 0; jj < 10; jj++) {
                                    if (d.data[ii * 10 + jj] == undefined)
                                        break;
                                    str = str + 'L ' + proj.latLngToLayerPoint(d.data[ii * 10 + jj].latlon).x + ' ' + proj.latLngToLayerPoint(d.data[ii * 10 + jj].latlon).y;
                                }
                                var newStr = str.replace(/L/, 'M'); //把str字符串里面的第一个L替换为M,会从字符串中寻找第一个L替换
                                return newStr;
                            });
                    }
                });
            }
        },
    };
    return TrajLayer;
});