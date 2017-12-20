/**
 * Created by huangwei on 2017/6/26.
 */
import d3 from 'd3'
import $ from 'jquery'
import config from '../commons/config'
let {colorMap} = config
colorMap
export default class {
  constructor (el) {
    this.el = el
    this.init()
  }

  init () {
    this.svg = d3.select(this.el).append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
    return this
  }

  update (selectedChemicals) {
    this.svg.selectAll('.legend').remove()
    let cellSize = $(this.el).width()

    this.svg.attr('width', cellSize).attr('height', cellSize)
    let chLen = selectedChemicals.length
    let w = chLen < 4 ? cellSize / chLen : cellSize / 2
    let h = chLen > 3 ? cellSize / 2 : cellSize

    let legend = this.svg.selectAll('.legend')
      .data(selectedChemicals)
      .enter()
      .append('g')
      .attr('class', 'legend')
    legend.append('rect')
      .attr('width', w + 'px')
      .attr('height', h + 'px')
      .attr('x', (d, index) => index < 2 ? w * index : (chLen === 4 ? (index - 2) : 2) * w)
      .attr('y', (d, index) => chLen > 3 && index > 1 ? h : 0)
      // .attr('fill', d => colorMap[d][1])
      // .attr('fill-opacity', 0.6)
      .attr('fill', 'none')
      .attr('stroke', '#888')
    legend.append('text')
      .text(d => d.substr(0, 1) === 'A' ? d.substr(0, 2) : d.substr(0, 1))
      .attr('x', (d, index) => (index < 2 ? w * index : (chLen === 4 ? (index - 2) : 2) * w) + w * 0.5)
      .attr('y', (d, index) => (chLen > 3 && index > 1 ? h : 0) + h * 0.5)
      .attr({
        'text-anchor': 'middle',
        'dominant-baseline': 'middle',
        'fill': '#888'
      })
    return this
  }
}
