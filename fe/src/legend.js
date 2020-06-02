import * as d3 from 'd3';
import * as d3legend from 'd3-svg-legend'

export default class MapLegend { 
  constructor(map) {
    console.log('do we ever get here')
    this.map = map
    this.legendScale = d3.scaleLog()
      .domain([1, map.metex[1]])
    this.cellBins = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] 
    this.scaledCells = this.cellBins.map(cell => Math.round(this.legendScale.invert(cell)))
  }

  drawLegend() {
    // TODO: make custom legend
    d3.select(".legendGroup").remove()

    this.legendGroup = this.map.svg.append("g")
      .attr("class", "legendGroup")
      .attr("transform", `translate(20,${40})`)

    this.logLegend = d3legend.legendColor()
      // .orient('horizontal')
      .cells(this.scaledCells)
      .scale(this.map.colorScale)

    this.legendGroup.call(this.logLegend)

    this.legendTitle = this.legendGroup.append('text')
      .attr('y', -20)
      .attr('class', 'legend-title')
      .text('Total Observations')

    this.legendByline = this.legendGroup.append('text')
      .attr('y', -6)
      .attr('class', 'legend-byline')
      .text(`${this.map.queryCol} ${this.map.querySearch}`)
  }

}
