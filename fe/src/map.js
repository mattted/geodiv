import * as d3 from 'd3';
import scaleCluster from 'd3-scale-cluster';
import API from './api.js'

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
    // this.colorRange = [opts.color.start, opts.color.end] || ["#d0d0d0", "#3b4252"]
  } 
  
  createMapBounds(geo) {
    this.projection = this.projection.fitWidth(this.boundedWidth, geo)
    this.pathGenerator = d3.geoPath(this.projection)
    this.boundedHeight = this.pathGenerator.bounds(geo)[1][1]
    this.height = this.boundedHeight + this.margin.top + this.margin.bottom
    
    this.wrapper = d3.select(this.domElement)
      .append('svg')
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

    if (geo.extent) {
      this.colorScale = scaleCluster()
        .domain(geo.extent)
        .range(d3.range(10).map(i => d3.interpolateGnBu(i/10)))
      console.log(this.colorScale(geo.extent[0]))
      console.log(this.colorScale(geo.extent[1]))
    }
    else
      this.colorScale = () => "#3b4252"

    this.bounds.selectAll('.boundaries')
      .data(this.geo.features)
      .join(
        enter => enter.append('path')
          .attr('class', 'boundaries')
          .attr('d', this.pathGenerator)
          .attr('fill', d => this.colorScale(d.properties.metric)),
        update => update
          .attr('d', this.pathGenerator)
          .transition().duration(1000)
          .attr('fill', d => this.colorScale(d.properties.metric)),
        exit => exit
          .remove()
      )
  }

  renderGraticule(mount) {
    const geoGrat = d3.geoGraticule()
      .extent([[-98 - 80, 38 - 45], [-98 + 35, 38 + 45]])
      .step([5, 5]);

    mount.append('path')
      .attr('class', 'graticule')
      .attr('d', this.pathGenerator(geoGrat))
  }

  createColorScale(extent) {
  }

}
