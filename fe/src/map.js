import * as d3 from 'd3';
import API from './api.js'

export default class Map {
  constructor(height, width, element) {
    this.width = width
    this.height = height
    this.projection = d3.geoAlbersUsa()
    this.path = d3.geoPath().projection(this.projection) 
    this.svg = d3.select(element)
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
    this.map = this.svg.append('g').attr('class', 'boundary')
  }

  async mountData(geo, metric) {
    this.geoData = await API.fetchGeo(geo)
    this.metricData = await API.fetchMetric(metric)
    this.metricExtent()
    this.setBounds()
  }

  setBounds() {
    this.projection.scale(1).translate([0,0])
    // get bounds with geopath and geodata
    let b = this.path.bounds(this.geoData);
    // set scale from bounds
    let s = .95 / Math.max((b[1][0] - b[0][0]) / this.width,
      (b[1][1] - b[0][1]) / this.height);
    // set translation based on scale and bounds
    let t = [(this.width - s * (b[1][0] + b[0][0])) /2,
      (this.height - s * (b[1][1] + b[0][1])) /2]
    // set overall projection scale
    this.projection.scale(s).translate(t)

    this.drawMap()
  }

  metricExtent() {
    let metex = d3.extent(Object.values(this.metricData))
    this.colorScale = d3.scaleLog()
      .domain([1, metex[1]])
      .range(["lightgray", "#3b4252"])
  }

  drawMap() {
    this.map.selectAll('path')
      .data(this.geoData.features)
      .enter()
      .append('path')
      .attr('d', this.path)
      // .attr('stroke', "0px")
      .attr('fill',  d => {
        // if(this.colorScale(this.metricData[d.id]) == undefined) return d3.interpolateViridis(0)
        // return d3.interpolateViridis(this.logScale(this.metricData[d.id]))
        if(this.colorScale(this.metricData[d.id]) == undefined) return "lightgray"
        return this.colorScale(this.metricData[d.id])
      })
  }
}
