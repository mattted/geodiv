export default class Recents {
  constructor(obs, col, search) {
    this.obs = obs
    this.column = col
    this.search = search
    this.frag = document.createDocumentFragment()

    this.createTitle()
  }

  static sort(e) {
    let col = Array.from(document.querySelectorAll('th')).findIndex(el => el.textContent === e.target.textContent)
    let rows = Array.from(document.querySelectorAll('tr')).slice(1)
    let sortedRows = rows.sort((a,b) => {
      let nameA = a.childNodes[col].textContent
      let nameB = b.childNodes[col].textContent
      if (nameA < nameB) {
        return -1;
      } else if (nameA > nameB) {
        return 1;
      }
      return 0;
    })
    let tbody = document.querySelector('tbody')
    tbody.innerHTML = ''
    sortedRows.forEach(row => tbody.appendChild(row)) 
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
        <th>Phylum</th>
        <th>Class</th>
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
      row.innerHTML += `<td>${el.phylum}</td>`
      row.innerHTML += `<td>${el.klass}</td>`
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
