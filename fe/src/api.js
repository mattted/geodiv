export default class API {
  static url = 'http://localhost:3000/api/'  

  static async fetchGeo(end) {
    try { 
      let response = await fetch(this.url+end)
      let data = await response.json()
      return data
    } catch(err) {
      // TODO: Handle Error
      console.log(err)
    }
  }

  static async fetchMetric(end) {
    try {
      let response = await fetch(this.url+end)
      let data = await response.json()
      return data
    } catch(err) {
      // TODO: Handle Error
      console.log(err)
    }
  }

  static async fetchKingdoms() {
    try {
      let response = await fetch(this.url+'kingdoms')
      let data = await response.json()
      return data
    } catch(err) {
      // TODO: Handle Error
      console.log(err)
    }
  }

  static async fetchCommonNames() {
    try {
      let response = await fetch(this.url+'cnames')
      let data = await response.json()
      return data
    } catch(err) {
      // TODO: Handle Error
      console.log(err)
    }
  }

}

