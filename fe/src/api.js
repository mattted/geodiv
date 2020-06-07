export default class API {
  static url = 'http://localhost:3000/api/'  

  static async fetch(end) {
    try { 
      let response = await fetch(this.url+end)
      let data = await response.json()
      return data
    } catch(err) {
      console.log(err);
      alert(err)
      return err;
    }
  }

  static async post(end, obj) {
    let conf = {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(obj),
    }
    try {
      const response = await fetch(this.url+end, conf);
      const data = await response.json();
      return data;
    } catch (err) {
      console.log(err);
      return err;
    }
  }    
}
