import * as d3 from 'd3';
import * as d3legend from 'd3-svg-legend'

export default class MapLegend { 
  constructor(map) {
    this.map = map
    this.legendScale = d3.scaleLog()
      .domain([1, map.geo.extent[1]])
    // this.cellBins = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] 
    this.cellBins = [0, 0.2, 0.4, 0.6, 0.8, 1] 
    this.scaledCells = this.cellBins.map(cell => Math.round(this.legendScale.invert(cell)))
  }

  drawLegend() {
    // TODO: make custom legend
    d3.select(".legendSvg").remove()
    this.legendSvg = d3.select(this.map.domElement).append("svg")
      .attr("class", "legendSvg")
      .attr('width', this.map.width)
      .attr('height', '60px')

    this.legendGroup = this.legendSvg.append('g')
      .attr("class", "legendGroup")
      .attr("transform", `translate(${this.map.width/2}, 30)`)

    this.legendGroupCells = this.legendGroup.append('g')
      .attr('class', 'legendCells')
      .attr('transform', 'translate(-95, 0)') 

    console.log(this.legendGroup)

    this.logLegend = d3legend.legendColor()
      .orient('horizontal')
      .shapeWidth(30)
      .shapeHeight(7)
      .labelOffset(2)
      .labelFormat(d3.format("0"))
      .cells(this.scaledCells)
      .scale(this.map.colorScale)

    this.legendGroupCells.call(this.logLegend)

    this.legendTitle = this.legendGroup.append('text')
      .attr('y', -20)
      .attr('class', 'legend-title')
      .attr('text-anchor', 'middle')
      .text('Total Observations')

    this.legendByline = this.legendGroup.append('text')
      .attr('y', -6)
      .attr('class', 'legend-byline')
      .attr('text-anchor', 'middle')
      .text(`${this.map.queryCol} ${this.map.querySearch}`)
  }

}
