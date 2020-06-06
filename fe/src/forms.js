import DataMod from './datamod.js'

export default class Form {
  constructor(type, target) {
    this.type = type 
    this.node = document.querySelector(target)    
    type === 'org' ? this.organismForm() : this.observationForm()
  }

  organismForm() {
  }

  observationForm() {
    DataMod.populateDatalist('species', '#formdatalist')
    this.form = document.createElement('form')
    this.form.setAttribute('class', 'field')
    this.form.appendChild(this.createLabel('Date'))
    this.form.appendChild(this.createInput({ type: 'date', id: 'obs_form_date'}))
    this.form.appendChild(this.createLabel('Latitude'))
    this.form.appendChild(this.createInput({ type: 'number', placeholder: '41.8781', id: 'obs_form_lat' }))
    this.form.appendChild(this.createLabel('Longitude'))
    this.form.appendChild(this.createInput({ type: 'number', step: 0.0001, placeholder: '-87.6298', id: 'obs_form_lon' }))
    this.form.appendChild(this.createLabel('Identifier'))
    this.form.appendChild(this.createSelect({ 
      options: [['Species', 'species'], ['Common Name', 'cname']], 
      datalist: '#formdatalist',
    }))
    this.form.appendChild(this.createLabel('Organism'))
    this.form.appendChild(this.createInput({ type: 'text', placeholder: 'Select name...', list: 'formdatalist', id: 'obs_form_name' }))
    this.form.appendChild(this.createInput({type: 'submit'}))
    this.form.addEventListener('submit', this.submitObs)
    this.node.innerHTML = ''
    this.node.appendChild(this.form)
  }

  createLabel(title) {
    let label = document.createElement('label')
    label.setAttribute('class', 'label')
    label.textContent = title
    return label
  }

  createInput({type, placeholder, list, step, id}) {
    let input = document.createElement('input')
    input.setAttribute('class', 'input')
    input.setAttribute('id', id)
    input.classList.add('is-small')
    input.setAttribute('type', type)
    placeholder ? input.setAttribute('placeholder', placeholder) : ''
    list ? input.setAttribute('list', list) : ''
    return input
  }

  createSelect({options, datalist}) {
    let menu = document.createElement('div') 
    menu.setAttribute('class', 'select')
    menu.classList.add('is-small')
    let select = document.createElement('select')
    menu.appendChild(select)
    options.forEach(opt => select.innerHTML += `<option value=${opt[1]}>${opt[0]}</option>`)

    if(datalist) {
      menu.addEventListener('change', e => {
        DataMod.populateDatalist(e.target.value, "#formdatalist") 
      })
    }
    return menu
  }

  submitObs(e) {
    e.preventDefault()
    let obj = {
      date: e.target.querySelector('#obs_form_date').value,
      lat: e.target.querySelector('#obs_form_lat').value,
      lon: e.target.querySelector('#obs_form_lon').value,
      col: e.target.querySelector('select').value,
      name: e.target.querySelector('#obs_form_name').value,
    }
    debugger 
  }
  
}
