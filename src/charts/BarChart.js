/**
 * Created by huangwei on 2017/6/26.
 */
 
import d3 from 'd3'
import $ from 'jquery'
import config from '../commons/config.js'
import {skyeyeTooltip, formatFunc} from '../commons/utils'
let {dangerColor, safeColor, currentTime} = config

export default class {
  constructor (el) {
    this.el = el
    this.chemical = null
    this.updateThreshold = null
    this.updateSelectedTime = null
    this.updateSelectedChemical = null
    this.init()
  }

  init () {
    d3.select(this.el).selectAll('svg')
      .remove()
    this.svg = d3.select(this.el).append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
    return this
  }

  draw (data, threshold, month, chemical = null) {
    this.chemical = chemical
    let self = this
    self.svg.selectAll('.barchart').remove()
    let container = self.svg.append('g').attr('class', 'barchart')

    let width = $(self.el).width()
    let height = $(self.el).height()
    this.height = height
    let widthBar = month === 4 ? width / 720 : width / 744
    self.svg
      .attr('height', height)
      .attr('width', width)

    let x = d3.time.scale()
      .rangeRound([0, width])
    x.domain([new Date((month) + '/1/2016 00:00:00'), month === 12 ? new Date('1/1/2017 00:00:00') : new Date((month + 1) + '/1/2016 00:00:00')])

    let y = d3.scale.linear().range([height, 0])
    y.domain([0, d3.max(data, d => d.value)])
    let rect = container.selectAll('.bar')
      .data(data)
      .enter().append('g')
      .attr('class', 'bar')
      .attr('transform', (d, index) => 'translate(' + x(d.time) + ',' + y(d.value) + ')')
    this.x = x
    rect.append('rect')
      .style('fill', d => d.value > threshold ? dangerColor : safeColor)
      .attr('width', widthBar)
      .attr('height', (d) => height - y(d.value))
      .on('mouseover', (d, index) => {
        let display = {
          time: formatFunc(d.time),
          value: d.value
        }
        skyeyeTooltip.show(display, d3.event)
      })
      .on('mouseout', d => {
        skyeyeTooltip.hide()
      })
      .on('click', d => {
        let clickHour = formatFunc(d.time)
        this.updateSelectedTime(clickHour)
        console.log('Bar Chart draw chemical', this.chemical)
        if (this.chemical) this.updateSelectedChemical(this.chemical)
      })
    return this
  }

  update (threshold) {
    // console.log('bar chart hello', threshold)
    this.svg.select('.barchart')
      .selectAll('.bar')
      .selectAll('rect')
      .style('fill', d => {
        // console.log('bar chart hello update', d, threshold)
        return d.value > threshold ? dangerColor : safeColor
      })
  }

  clearHighlight () {
    this.svg.selectAll('.highlight').remove()
    return this
  }

  highlightCurrent (time) {
    this.clearHighlight()
    let x = this.x(new Date(time))
    this.svg.append('line')
      .attr('x1', x)
      .attr('x2', x)
      .attr('y1', 0)
      .attr('y2', this.height)
      .attr('class', 'highlight')
      .attr('stroke', currentTime.color)
      .attr('stroke-width', currentTime.width)
      .attr('pointer-events', 'none')
    return this
  }

  on (eventsMap) {
    if (eventsMap.hasOwnProperty('updateThreshold')) this.updateThreshold = eventsMap.updateThreshold
    if (eventsMap.hasOwnProperty('updateSelectedTime')) this.updateSelectedTime = eventsMap.updateSelectedTime
    if (eventsMap.hasOwnProperty('updateSelectedChemical')) this.updateSelectedChemical = eventsMap.updateSelectedChemical
    return this
  }
}
