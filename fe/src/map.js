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
    this.boundary = this.svg.append('g').attr('class', 'boundary')
    this.graticule = d3.geoGraticule()
      .extent([[-98 - 80, 38 - 45], [-98 + 35, 38 + 45]])
      .step([5, 5]);
    this.metricData = {}
  }

  // takes api endpoints geo and metric
  async mountData(geo = 'none', metric = 'none') {
    if(geo !== 'none') this.geoData = await API.fetchGeo(geo)
    if(metric !== 'none') this.metricData = await API.fetchMetric(metric)
    if(this.metricData !== {}) this.bindMetric()
    this.setBounds(this.geoData)
  }

  setBounds(focusGeo) {
    this.projection.scale(1).translate([0,0])
    // get bounds with geopath and geodata
    let b = this.path.bounds(focusGeo);
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

  bindMetric() {
    this.geoData.features.forEach(el => {
      el.properties.metric = this.metricData[el.id]
    })
    let metex = d3.extent(Object.values(this.metricData))
    this.colorScale = d3.scaleLog()
      .domain([1, metex[1]])
      .range(["#d0d0d0", "#3b4252"])
  }

  drawMap() {
    // draw graticules
    this.svg.selectAll('path')
      .data(this.graticule.lines())
      .enter().append('path')
      .attr('class', 'graticule')
      .attr('d', this.path)

    this.boundary = this.svg.selectAll('.boundary')
      .data(this.geoData.features)

    this.boundary.enter().append('path')
      .attr('class', 'counties')
      .attr('d', this.path)
      .attr('fill', d => {
        if(this.colorScale(d.properties.metric) == undefined) return "#f0f0f0"
        return this.colorScale(d.properties.metric)
      })

    this.boundary.transition().duration(500)
      .attr('d', this.path)
      .attr('fill', d => {
        if(this.colorScale(d.properties.metric) == undefined) return "#f0f0f0"
        return this.colorScale(d.properties.metric)
      })

    this.boundary.exit().remove();
  }
}
