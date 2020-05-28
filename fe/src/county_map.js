import * as d3 from 'd3';
export default class CountyMap {
  constructor(opts){
    this.geo = opts.geo
    this.metric = opts.metric
    this.element = opts.element
    this.fetchGeo();
    this.fetchMetric();
  }

  async fetchGeo() {
    try {
      let response = await fetch(this.geo)
      let data = await response.json()
      console.log(data)
    } catch(err) {
      alert(err)
    }
  }
}
