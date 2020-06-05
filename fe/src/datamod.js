import API from './api.js'
import * as d3 from 'd3';

export default class DataMod {

  static zip(geo, metric) {
    geo.extent = d3.extent(Object.values(metric))
    geo.domain = Object.values(metric)
    geo.features.forEach(el => el.properties.metric = metric[el.id])
    return geo
  }

  static async populateDatalist(type) {
    let listItems = await API.fetch(type)  
    let dataList = document.querySelector(`#mapdatalist`)
    let options;
    for (const item of listItems) {
      options += `<option value="${item}" />`
    }
    dataList.innerHTML = options;
    document.querySelector('div.buttons').setAttribute('selected', type)
  }

  static setMetricName(metric, map){
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
    console.log(url)
    map.queryCol = col
    map.querySearch = search
  }

  static getFeatureInfo(d) {
    let type = d.properties.countyfp ? 'County' : 'State'
    let name = d.properties.name
    let metric = d.properties.metric ? d.properties.metric : 'None'
    return {type, name, metric}
  }
}
