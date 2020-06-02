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
    this.setMetricName(metric)
    this.setBounds(this.geoData)
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

  setMetricName(metric){
    if(metric === 'obs_per_county') this.queryCol = 'Total observations'
    else if(metric === 'org_per_county') this.queryCol = 'Total unique organisms'
    else if(metric === 'none') return
    else {
      let url = metric.split(/[=?;]/)
      let search = url[2]
      let col = url[4]
      switch(col) {
        case 'klass':
          col = 'Class'
          break;
        case 'cname':
          col = 'Common Name'
          break;
        default:
          col = col.charAt(0).toUpperCase() + col.slice(1)
      }
      this.queryCol = col
      this.querySearch = search
    }
  }

  drawMap() {
    this.svg.selectAll('path')
      .data(this.graticule.lines())
      .enter().append('path')
      .attr('class', 'graticule')
      .attr('d', this.path)

    this.boundary = this.svg.selectAll('.counties')
      .data(this.geoData.features)


    this.boundary.enter().append('path')
      .attr('class', 'counties')
      .attr('d', this.path)
      .attr('fill', d => {
        if(this.colorScale(d.properties.metric) == undefined) return "#f0f0f0"
        return this.colorScale(d.properties.metric)
      })
      // .on('mouseover', d => console.log(d))
      .on('click', d => this.focus(d)) 

    this.boundary.exit().remove()
    
    this.boundary.transition().duration(1000)
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
      this.drawMap()
      this.zoomed = !this.zoomed
    } else {
      this.setBounds(feature)
      this.drawMap()
      this.zoomed = feature
    }
  }

}
