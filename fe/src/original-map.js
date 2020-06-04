import * as d3 from 'd3';
import API from './api.js'
import MapLegend from './legend.js'

export default class Map {
  constructor(height, width, element) {
    this.width = width
    this.height = height
    this.zoomed = false
    this.projection = d3.geoAlbersUsa()
    this.path = d3.geoPath().projection(this.projection) 
    this.svg = d3.select(element)
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
    this.mapGroup = this.svg.append('g').attr('class', 'map-group')
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
    this.setMetricName(metric)
    return this.geoData
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
    return this.geoData
  }

  bindMetric() {
    this.geoData.features.forEach(el => {
      el.properties.metric = this.metricData[el.id]
    })
    this.metex = d3.extent(Object.values(this.metricData))
    this.colorScale = d3.scaleLog()
      .domain([1, this.metex[1]])
      .range(["#d0d0d0", "#3b4252"])
  }


  drawGraticule() {
    this.graticuleLines = this.svg.selectAll('.graticule')
      .data(this.graticule.lines())

    this.graticuleLines
      .enter().append('path')
      .attr('class', 'graticule')
      .attr('d', this.path)

    this.graticuleLines.transition().duration(1000)
      .attr('d', this.path)
      .style('opacity', 100)
  }

  drawMap(graticule=false) {
    if(graticule === true) {
      this.drawGraticule()
    } else {
      d3.selectAll('.graticule').style("opacity", 0)
    }

    this.mapGroup = this.svg.selectAll('.boundaries')
      .data(this.geoData.features)

    this.mapGroup.enter().append('path')
      .attr('class', 'boundaries')
      .attr('d', this.path)
      .attr('fill', d => {
        if(this.colorScale(d.properties.metric) == undefined) return "#f0f0f0"
        return this.colorScale(d.properties.metric)
      })
      // .on('mouseover', d => console.log(d))
      .on('click', d => this.focus(d)) 

    this.mapGroup.exit().remove()
    
    this.mapGroup.transition().duration(1000)
      .attr('d', this.path)
      .attr('fill', d => {
        if(this.colorScale(d.properties.metric) == undefined) return "#f0f0f0"
        return this.colorScale(d.properties.metric)
      })

    if(Object.entries(this.metricData).length !== 0) {
      this.legend = new MapLegend(this)
      this.legend.drawLegend()
    }
  }

  focus(feature) {
    if(this.zoomed === feature) {
      this.setBounds(this.geoData)
      this.drawMap(true, true)
      this.zoomed = !this.zoomed
    } else {
      this.setBounds(feature)
      this.drawMap()
      this.zoomed = feature
    }
  }

}
