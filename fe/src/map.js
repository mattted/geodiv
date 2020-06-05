import * as d3 from 'd3';
import API from './api.js'
import DataMod from './datamod.js'
import MapLegend from './legend.js'

export default class Map {
  constructor(opts) {
    this.domElement = opts.domElement
    this.width = opts.width || window.innerWidth * 0.9,
    this.margin = opts.margin || {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10
    };

    this.boundedWidth = this.width - this.margin.left - this.margin.right
    this.projection = opts.projection || d3.geoMercator()
  } 
  
  createMapBounds(geo) {
    this.projection = this.projection.fitWidth(this.boundedWidth, geo)
    this.pathGenerator = d3.geoPath(this.projection)
    this.boundedHeight = this.pathGenerator.bounds(geo)[1][1]
    this.height = this.boundedHeight + this.margin.top + this.margin.bottom
    
    this.wrapper = d3.select(this.domElement)
      .append('svg')
      .attr('class', 'level')
      .attr('width', this.width)
      .attr('height', this.height)

    this.bounds = this.wrapper.append('g')
      .style('transform', `translate(${this.margin.left}px, ${this.margin.top}px)`)

    this.graticule = this.renderGraticule(this.bounds)

    return this
  }

  renderBasicMap(geo) {
    this.geo = geo
    this.projection = this.projection.fitWidth(this.boundedWidth, this.geo)

    if (geo.domain) {
      this.colorScale = d3.scaleLog()
        .domain([1,geo.extent[1]])
        .interpolate(d3.interpolateHcl)
        .range(["#ECEFF4", "#4C566A"])
      this.legend = new MapLegend(this) 
      this.legend.drawLegend()
    }

    this.bounds.selectAll('.boundaries')
      .data(this.geo.features)
      .join(
        enter => enter.append('path')
          .attr('class', 'boundaries')
          .attr('d', this.pathGenerator)
          .attr('fill', d => {
            if(d.properties.metric) return this.colorScale(d.properties.metric)
            else return "#ECEFF4"
          })
          .on('mouseover', this.renderTooltip)
          .on('mouseout', this.removeTooltip),

        update => update
          .attr('d', this.pathGenerator)
          .on('mouseover', this.renderTooltip)
          .on('mouseout', this.removeTooltip)
          .transition().duration(1000)
          .attr('fill', d => {
            if(d.properties.metric) return this.colorScale(d.properties.metric)
            else return "#ECEFF4"
          }),

        exit => exit
          .remove()
      )
  }

  renderGraticule(mount) {
    const geoGrat = d3.geoGraticule()
      .extent([[-98 - 80, 38 - 45], [-98 + 35, 38 + 45]])
      .step([5, 5]);

    this.bounds.selectAll('.graticule')
      .data(geoGrat.lines())
      .join(
        enter => enter.append('path')
          .attr('class', 'graticule')
          .attr('d', this.pathGenerator),
        update => update
          .transition().duration(1000)
          .attr('d', this.pathGenerator),
        exit => exit
          .remove()
      )

  }

  renderTooltip(d) {
    d3.select(this)
      .style("stroke", "#4C566A")
      .style("stroke-width", "2px")
    let maptip = document.querySelector('#maptip')
    maptip.style.left = (d3.event.pageX + 30) + 'px'
    maptip.style.top = (d3.event.pageY - 30) + 'px'
    let {type, name, metric} = DataMod.getFeatureInfo(d)
    maptip.innerHTML = `
      <p>${name}</p>
      <p>${metric}</p>
      `
    maptip.style.opacity = 100;
  }

  removeTooltip() {
    d3.select(this)
      .attr("stroke", "#4C566A")
      .style("stroke-width", "0.1px")
    let maptip = document.querySelector('#maptip')
    maptip.style.opacity = 0;
  }

}
