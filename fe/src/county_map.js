import * as d3 from 'd3';

export default class CountyMap {
  constructor(opts){
    this.geo = opts.geo
    this.metric = opts.metric
    this.element = opts.element
    this.dimensions = {
      width: window.innerWidth * 0.9,
      margin: {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10,
      },
    };
    this.dimensions.boundedWidth = this.dimensions.width
      - this.dimensions.margin.left
      - this.dimensions.margin.right
    this.fetchGeo();
    this.fetchMetric();
  }

  drawSvg(data) {
    this.wrapper = d3.select(this.element)
      .append("svg")
      .attr("width", this.dimensions.width)
      .attr("height", this.dimensions.height)

    this.mapBounds = this.wrapper.append("g")
      .style("transform", `translate(${
        this.dimensions.margin.left}px, ${
          this.dimensions.margin.top}px)`
      )
    drawGeo(data)
  }

  setProjection(data) {
    this.projection = d3.geoAlbersUsa()
      .fitWidth(this.dimensions.boundedWidth, data)
    this.pathgen = d3.geoPath(this.projection)
    this.dimensions.boundedHeight = this.pathgen.bounds(data)[1][1] 
    this.dimensions.height = this.dimensions.boundedHeight
      + this.dimensions.margin.top
      + this.dimensions.margin.bottom
    drawSvg(data)
  }

  drawGeo(data) {
    this.counties = this.mapBounds.selectAll(".county")
      .data(data.features)
      .enter().append("path")
      .attr("class", "county")
      .attr("d", this.pathgen)
  };

  async fetchGeo() {
    try {
      let response = await fetch(this.geo)
      let data = await response.json()
      this.setProjection(data)
    } catch(err) {
      console.log(err)
    }
  }

  async fetchMetric() {
    try {
      let response = await fetch(this.metric)
      let data = await response.json()
      console.log(data)
    } catch(err) {
      console.log(err)
    }
  }
}
