<template>
  <div class="uk-width-1-1 container">
    <div class="uk-float-left uk-width-1-10 left">
      <div id = 'timelineControl'>
        <div id = 'controlBtn'>
          <Button size='small' id="button_play"><i class="fa fa-play fa-lg" value="filter" style="padding: 3px;"></i></Button>
          <Select v-model="playSpeedDefault" id="playSpeedDropdown" size="small">
            <Option v-for="item in playSpeedData" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <Select v-model="slidingWindowSizeDefault" id="slidingWindowSizeDropdown" size="small">
            <Option v-for="item in slidingWindowSizeData" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
        <div id = 'legend' style="z-index:-1">
        </div>
        <div id = 'fontBtn' style="z-index:-1">
          <Button size='small' id="button_week_backward">
          	<i class="fa fa-backward" value="filter" style="padding: 4px;"></i>
          </Button>
          
          <Button size='small' id="button_day_backward">
          	<i class="fa fa-step-backward" value="filter" style="padding: 4px;"></i>
          </Button>
          
          <Button size='small' id="button_day_forward">
          	<i class="fa fa-step-forward" value="filter" style="padding: 4px;"></i>
          </Button>

          <Button size='small' id="button_week_forward">
          	<i class="fa fa-forward" value="filter" style="padding: 4px;"></i>
          </Button>

        </div>
      </div>
    </div>
    <div class="uk-float-right uk-width-9-10 right">
      <div class="uk-width-1-1 timelineTop">
      </div>
      <div class="uk-width-1-1 timelineBottom">
      </div>
    </div>
  </div>
</template>
<script>
  import $ from 'jquery'
  // var d3=window.d3d4 
  import barchart from '../charts/BarChart'
  import { mapActions, mapGetters } from 'vuex'
  // import '../../plugins/bootstrap/css/bootstrap.css'
  export default {
  	data() {
  	  return {
  	  	playSpeedDefault: '100',
  	    playSpeedData: [{
  	        value: '1',
  	        label: 'x1'
  	      },
  	      {
  	        value: '5',
  	        label: 'x5'
  	      },
  	      {
  	        value: '20',
  	        label: 'x20'
  	      },
  	      {
  	        value: '100',
  	        label: 'x100'
  	      },
  	      {
  	        value: '500',
  	        label: 'x500'
  	      },
  	    ],
  	    slidingWindowSizeDefault: '30',
  	    slidingWindowSizeData: [{
  	        value: '0.0001',
  	        label: '0Min'
  	      },
  	      {
  	        value: '10',
  	        label: '10Min'
  	      },
  	      {
  	        value: '20',
  	        label: '20Min'
  	      },
  	      {
  	        value: '30',
  	        label: '30Min'
  	      },
  	    ],


  	  }
  	},
    created () {
    },
    watch: {
    	myDaySta: function(){
    		let data = this.changeDataFormat(this.myDaySta)	
    		this.initParamBottom('timelineBottom', this.myTimelineTopRange, data)
    	},
    	myMinuteSta: function(){
    		let data = this.dataFilter(this.myMinuteSta, this.myTimelineTopRange)
    		data = this.changeDataFormat(data)
    		this.initParamTop('timelineTop', [this.myTimelineTopRange[0] - this.mySlidingWindowSize, this.myTimelineTopRange[0]], data)
    	},
    	myTimelineTopRange: function(){
    		// 更新上面的时间轴
    		let data = this.dataFilter(this.myMinuteSta, this.myTimelineTopRange)
    		data = this.changeDataFormat(data)
    		this.initParamTop('timelineTop', [this.myTimelineTopRange[0] - this.mySlidingWindowSize, this.myTimelineTopRange[0]], data)

    		// 更新下面的时间轴
    		if(this.barChartBottom) {
    			this.barChartBottom.set_brush_range(this.myTimelineTopRange)
    		}
    	}
    },
    computed: {
        ...mapGetters({
          myDaySta: 'getDaySta',
          myMinuteSta: 'getMinuteSta',
          myCurtime: 'getCurtime',
          mySlidingWindowSize: 'getSlidingWindowSize',
          myTimelineTopRange: 'getTimelineTopRange'
        }),
        
    },
    methods: {
      ...mapActions(['setCurtime', 'setTimelineTopRange', 'setSlidingwindowsize']),
      dataFilter (data, timelineTopRange) {
        let sTime = timelineTopRange[0]
        let eTime = timelineTopRange[1]
        let filterData = []
        for (var i = 0; i < data.length; i++) {
          if (data[i].time >= sTime && data[i].time < eTime) {
            filterData.push(data[i])
          }
        }
        return filterData
      },
      changeDataFormat (data) {
        return data.map(function (d) {
          return {
            x: d.time,
            y1: d.arrNum,
            y2: d.arrTrajNum,
            y3: d.arrCDMNum,
            y4: d.depNum,
            y5: d.depTrajNum,
            y6: d.depCDMNum
          }
        })
      },
      initParamTop (content, timelineTopRange, data) {
        let self = this
        content = '.' + content
        $(content).empty()
        let height = $(content).outerHeight()
        let width = $(content).outerWidth()

        let barchart1 = barchart()
          .width(width) // svg width
          .height(height) // svg height
          .start_brush_range(timelineTopRange) // the initial sliding window range
          .yTickNum(3) // x-tick interval number
          .xTickNum(10) // x-tick interval number
          // .xLabel('#time') // x-axis title
          .bar_color(['#d14745', '#fb6a4a', '#fcae91', '#29aae3', '#9ecae1', '#c6dbef'])
          // .yLabel('#flight') // y=axis tiltle
          // .bar_interval(0.5) // the interval pixel number between bars
          .enable_brush(true) // whether add brushing bar function
          .brush_trigger(function(brush_range) {
            console.log('brush_range', brush_range)
            self.setCurtime(brush_range[1])
            self.setSlidingwindowsize(brush_range[1] - brush_range[0])

          })
        let svg = d3.select(content)
          .append('svg')
          .attr('width', width)
          .attr('height', height)
        svg.append('g')
          .data([data])
          .call(barchart1)
      },
      initParamBottom (content, timelineTopRange, data) {
        let self = this
        content = '.' + content
        let height = $(content).outerHeight()
        let width = $(content).outerWidth()
        self.barChartBottom = barchart()
            .width(width) // svg width
            .height(height) // svg height
            .start_brush_range(timelineTopRange) // the initial sliding window range
            .yTickNum(3) // x-tick interval number
            .xTickNum(10) // x-tick interval number
            .bar_color(['#d14745', '#fb6a4a', '#fcae91', '#29aae3', '#9ecae1', '#c6dbef'])
            .enable_brush(true) // whether add brushing bar function
            .brush_trigger(function(brush_range) {
                self.setTimelineTopRange(brush_range)
            })
                  
        let svg = d3.select(content)
          .append('svg')
          .attr('width', width)
          .attr('height', height)
        svg.append('g')
          .data([data])
          .call(self.barChartBottom)
      },
      updateTimeRange (interval) {
        var sTime = this.myTimelineTopRange[0]
        var eTime = this.myTimelineTopRange[1]
        // console.log([sTime + interval, eTime + interval])
        this.setTimelineTopRange([sTime + interval, eTime + interval])

//        //console.log(new Date(Config.get('timelineTopRange')[0]), new Date(Config.get('timelineTopRange')[1]))
//        Config.set('brushFinish1',true)
      }
    },
    // mounted() {
    //   this.init()
    //   //console.log('this', this.myDaySta)
    //  // console.log('this.getDaySta(): ', this.getDaySta())
    // }
    mounted () {
      // this.init()
      let self = this
      // $("#playSpeedDropdown ul li").click(function(evt){
      //   var speed = evt.target.getAttribute("value")
      //   $("#playSpeedDropdown button").html('x ' + speed + ' <span class=\"caret\"></span>');
      // })

      $("#button_day_forward").click(function(evt){
        self.updateTimeRange(24*60*60*1000)
      })

      $("#button_week_forward").click(function(evt){
        self.updateTimeRange(7*24*60*60*1000)
      })

      $("#button_day_backward").click(function(evt){
        self.updateTimeRange(-24*60*60*1000)
      })

      $("#button_week_backward").click(function(evt){
        self.updateTimeRange(-7*24*60*60*1000)
      })


      // self.play =setInterval("clock()", 20)
      // function clock()
      // {
      //   var t=new Date()

      // }

     // window.clearInterval(int)

      self.height=$("#legend").outerHeight()
      self.width=$("#legend").outerWidth()

      console.log('self.height', self.height)
      console.log('self.width', self.width)

      let emPixel = $('#app').css('font-size');
      emPixel = parseInt(emPixel.split('p')[0]) 

      console.log('emPixel',  emPixel)

      self.margin = {top: emPixel, right: emPixel, bottom: 1.5*emPixel, left: 0},
      self.width = self.width - self.margin.left - self.margin.right,
      self.height = self.height - self.margin.top - self.margin.bottom;

      var lenHeight = 0;

      var legendSvg = d3.select("#legend")
        .append("svg")
        .attr("class","legendSvg")
        .attr("width", self.width + self.margin.left + self.margin.right)
        .attr("height", self.height + self.margin.top + self.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + 0 + "," + self.margin.top + ")")

      var arrData = [{'color':'rgb(209, 71, 69)', "text":"Matching Arr"},
        {'color':'#fb6a4a', "text":"Traj Arr Only"},
        {'color':'#fcae91', "text":"CDM Arr Only"}]
      var depData = [{'color':'rgb(41, 170, 227)', "text":"Matching Dep"},
        {'color':'#9ecae1', "text":"Traj Dep Only"},
        {'color':'#c6dbef', "text":"CDM Dep Only"}]

      var barWidth = 2
      legendSvg.selectAll(".legendArrBar")
        .data(arrData)
        .enter().append("rect")
        .attr("class", "legendBar")
        .attr("x",function(d,i){
          console.log(111, emPixel + i*barWidth*emPixel)
          console.log(111, i*barWidth*emPixel)
          console.log('*****')
          return emPixel + i*barWidth*emPixel
        })
        .attr("y", lenHeight)
        .attr("width", String(barWidth)+'em')
        .attr("height", String(barWidth)+'em')
        .style("fill",function(d){
          return d.color
        })

      legendSvg.selectAll(".legendDepBar")
        .data(depData)
        .enter().append("rect")
        .attr("class", "legendBar")
        .attr("x", function(d,i){
          return emPixel + i*barWidth*emPixel
        })
        .attr("y", lenHeight+barWidth*emPixel)
        .attr("width", String(barWidth)+'em')
        .attr("height", String(barWidth)+'em')
        .style("fill",function(d){
          return d.color
        })

      var dirText = ['Arr']
      var matText = ['CDM', 'Traj', 'Both']
      matText.reverse()

      legendSvg.selectAll(".dirText")
        .data(matText)
        .enter().append("text")
        .attr("class", "legendText")
        .attr("x", function(d,i){
          return emPixel + i*barWidth*emPixel
        })
        .attr("y", -1.3*emPixel)
        .attr("dy", '1.25em')
        .text(function(d) { return d });

      legendSvg.selectAll(".matText")
        .data(dirText)
        .enter().append("text")
        .style('fill','rgb(209, 71, 69)')
        .attr('font-family', 'FontAwesome')
        .attr("class", "legendText")
        .attr("x", 0)
        .attr("y", 1.5*emPixel)
        .attr("dx", '.15em')
        .text(function(d) { return '\uf072' });

      legendSvg.selectAll(".mat1Text")
        .data(dirText)
        .enter().append("text")
        .style('fill','rgb(41, 170, 227)')
        .attr('font-family', 'FontAwesome')
        .attr("class", "legendText")
        .attr("x", 0)
        .attr("y", 1.5*emPixel+barWidth*emPixel)
        .attr("dx", '.15em')
        .text(function(d) { return '\uf072' });
      d3.selectAll('#legend text').attr('fill', '#999')
    }
  }
</script>
<style lang="less" scoped>
  .container {
    height: 100%;
    width: 100%;
    border: 1px solid #9e9c9c;
    .left {
      width:9em;
      height: 100%;
    }
    .right {
      width: calc(~"100% - 9em");
      height: 100%;
    }
    .element {
      position: relative;
      color: white !important;
    }

    .timelineTop {
      height: 50%;
      color:red;
      border: 1px solid #9e9c9c;
    }
    .timelineBottom {
      height: 50%;
      border: 1px solid #9e9c9c;
    }
    #timelineControl{
      position:absolute;
      /*top:calc(~"50% - 5.5em");*/
      left:0.5em;
      height:100%;
      width:9em;
      float:left;
      #controlBtn{
        position:absolute;
        top:0em;
        left:0.7em;
        height:4em;
        width:100%;
        #timeplay{
          position: absolute;
          top:0px;
          left:0em;
        }
        #playSpeedDropdown{
          position: absolute;
          top:0px;
          left:2.1em;
        }
        #slidingWindowSizeDropdown{
          position: absolute;
          top:2em;
          left:1em;
        }
      }
      #legend{
        position:absolute;
        top:4em;
        height:5em;
        width:100%;
        text{
          font-size:0.8em
        }

      }
      #fontBtn{
        position:absolute;
        top:9.2em;
        left:0em;
        height:2em;
        width:100%;

        #button_week_backward{
          position: absolute;
          top:0px;
          left:0;
        }
        #button_day_backward{
          position: absolute;
          top:0px;
          left:2.2em;
        }
        #button_day_forward{
          position: absolute;
          top:0px;
          left:4.2em;
        }
        #button_week_forward{
          position: absolute;
          top:0px;
          left:6em;
        }

      }
    }
    /*path.area {*/
      /*fill: #e7e7e7;*/
    /*}*/
    /*.axis {*/
      /*shape-rendering: crispEdges;*/
    /*}*/
    /*.x.axis .minor {*/
      /*stroke-opacity: 0.5;*/
    /*}*/
    /*.x.axis path {*/
      /*display: none;*/
    /*}*/
    /*.y.axis line,*/
    /*.y.axis path {*/
      /*fill: none;*/
      /*stroke: #000;*/
    /*}*/
  }
</style>
