import API from './api.js'
import * as d3 from 'd3';

export default class DataMod {

  static zip(geo, metric) {
    geo.extent = d3.extent(Object.values(metric))
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
}
