import API from './api.js'
export default class Filters {

  static async populateDatalist(type) {
    let listItems = await API.fetchDatalist(type)  
    let dataList = document.querySelector(`#mapdatalist`)
    let options;
    for (const item of listItems) {
      options += `<option value="${item}" />`
    }
    dataList.innerHTML = options;
    document.querySelector('div.buttons').setAttribute('selected', type)
  }

}
