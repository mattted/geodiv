import API from './api.js'
export default class Filters {

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

  static setFilterListeners() {
    // document.querySelector('#kingdom').addEventListener('select', e => console.log(e.target.value))
    // document.querySelector('#phylum').addEventListener('select', e => console.log(e.target.value))
    // document.querySelector('#klass').addEventListener('select', e => console.log(e.target.value))
    // document.querySelector('#order').addEventListener('select', e => console.log(e.target.value))
    // document.querySelector('#family').addEventListener('select', e => console.log(e.target.value))
    // document.querySelector('#genus').addEventListener('select', e => console.log(e.target.value))
    // document.querySelector('#species').addEventListener('select', e => console.log(e.target.value))
    // document.querySelector('#cname').addEventListener('select', e => console.log(e.target.value))
  }

  static dataFilter(k, p, c, o, f, g, s) {
      
  }

}
