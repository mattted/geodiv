import API from './api.js'
export default class Factory {

  static async kindgomDatalist() {
    let kingdoms = await API.fetchKingdoms()  
    let dataList = document.querySelector('#kingdomlist')
    let options;
    for (const kingdom of kingdoms) {
      options += `<option value="${kingdom}" />`
    }
    dataList.innerHTML = options;
  }

  static async cnameDatalist() {
    let names = await API.fetchCommonNames()
    let dataList = document.querySelector('#cnamelist')
    let options;
    for (const name of names) {
      options += `<option value="${name}" />`
    }
    dataList.innerHTML = options;
  }

}
