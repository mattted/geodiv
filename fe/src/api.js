export default class API {
  static url = 'http://localhost:3000/api/'  

  static async fetch(end) {
    try { 
      let response = await fetch(this.url+end)
      let data = await response.json()
      return data
    } catch(err) {
      // TODO: Handle Error
      alert(err)
    }
  }
}

