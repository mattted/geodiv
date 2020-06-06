export default class Recents {
  constructor(obs, col, search) {
    this.obs = obs 
    this.column = col
    this.search = search
    this.frag = document.createDocumentFragment()

    this.createTitle()
  }

  createTitle() {
    this.title = document.createElement('p')
    this.title.setAttribute('class', 'info-title')
    this.title.textContent = `Recent Observations of ${this.column} ${this.search}`
    this.frag.appendChild(this.title)
    this.createTable()
  }

  createTable() {
    this.table = document.createElement('table')  
    this.table.setAttribute('class', 'table')
    this.frag.appendChild(this.table)
    
    this.createHead()
  }

  createHead() {
    this.thead = document.createElement('thead')  
    this.thead.innerHTML = `
      <tr>
        <th>Date</th>
        <th>County</th>
        <th>State</th>
        <th>Kingdom</th>
        <th>Class</th>
        <th>Phylum</th>
        <th>Order</th>
        <th>Family</th>
        <th>Genus</th>
        <th>Species</th>
        <th>Common Name</th>
      </tr>
    `
    this.table.appendChild(this.thead)
    this.createBody()
  }

  createBody() {
    this.tbody = document.createElement("tbody")
    this.obs.forEach(el => {
      let row = document.createElement("tr")
      row.innerHTML += `<td><a href='${el.inat}'>${Recents.dateParse(el.date)}</a></td>`
      row.innerHTML += `<td>${el.name}</td>`
      row.innerHTML += `<td>${el.state}</td>`
      row.innerHTML += `<td>${el.kingdom}</td>`
      row.innerHTML += `<td>${el.klass}</td>`
      row.innerHTML += `<td>${el.phylum}</td>`
      row.innerHTML += `<td>${el.order}</td>`
      row.innerHTML += `<td>${el.family}</td>`
      row.innerHTML += `<td>${el.genus}</td>`
      row.innerHTML += `<td>${el.species || '-'}</td>`
      row.innerHTML += `<td>${el.cname || '-'}</td>`
      this.tbody.appendChild(row)
    })
    this.table.appendChild(this.tbody)
    this.frag.appendChild(this.table)
  }

  static dateParse(date) {
    let newDate = new Date(date)
    return `${newDate.getMonth() + 1}/${newDate.getDate()}/${newDate.getFullYear()}`
  }
}
