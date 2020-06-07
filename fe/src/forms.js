import DataMod from './datamod.js'
import API from './api.js'

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
    this.form.appendChild(this.createInput({ type: 'number', step: 0.0000001, placeholder: '41.8781', id: 'obs_form_lat' }))
    this.form.appendChild(this.createLabel('Longitude'))
    this.form.appendChild(this.createInput({ type: 'number', step: 0.000001, placeholder: '-87.6298', id: 'obs_form_lon' }))
    this.form.appendChild(this.createLabel('Identifier'))
    this.form.appendChild(this.createSelect({ 
      options: [['Species', 'species'], ['Common Name', 'cname']], 
      datalist: '#formdatalist',
    }))
    this.form.appendChild(this.createLabel('Organism'))
    this.form.appendChild(this.createInput({ type: 'text', placeholder: 'Search for organism...', list: 'formdatalist', id: 'obs_form_name' }))
    this.form.appendChild(this.createInput({type: 'submit', id: 'submit-form'}))
    this.form.addEventListener('submit', (e) => this.submitObs(e), false)
    this.node.innerHTML = ''
    this.node.appendChild(this.form)
  }

  createLabel(text) {
    let label = document.createElement('label')
    label.setAttribute('class', 'label')
    label.textContent = text
    return label
  }

  createInput({type, placeholder, list, step, id}) {
    let input = document.createElement('input')
    input.setAttribute('class', 'input')
    input.setAttribute('id', id)
    input.classList.add('is-small')
    input.setAttribute('type', type)
    step ? input.setAttribute('step', step) : ''
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

  async submitObs(e) {
    e.preventDefault()
    let obj = {
      date: e.target.querySelector('#obs_form_date').value,
      lat: e.target.querySelector('#obs_form_lat').value,
      lon: e.target.querySelector('#obs_form_lon').value,
      col: e.target.querySelector('select').value,
      name: e.target.querySelector('#obs_form_name').value,
    }
    let resp = await API.post('observations', obj)
      .then(resp => resp)
    if(Object.keys(resp).includes('errors')) this.renderErrors(resp)
    else this.renderSuccess(resp)
  }

  renderErrors(resp) {
    if (this.node.querySelector('.message')) this.node.querySelector('.message').remove()
    let errors = this.createMessageBox()
    errors.classList.add('is-danger')
    errors.querySelector('.message-header').textContent = 'Submission Error(s)'
    errors.querySelector('.message-body').textContent = resp.errors
    this.node.insertBefore(errors, this.node.firstChild); 
  }

  renderSuccess(resp) {
    if (this.node.querySelector('.message')) this.node.querySelector('.message').remove()
    let success = this.createMessageBox()
    success.classList.add('is-success')
    success.querySelector('.message-header').textContent = 'Submission Succeeded'
    success.querySelector('.message-body').textContent =  'Observation added to database'
    this.node.insertBefore(success, this.node.firstChild); 
    setTimeout(() => {
      document.querySelector(".modal").classList.remove("is-active")
      this.node.innerHTML = ''
    }, 2000)
  }

  createMessageBox() {
    let box = document.createElement('article')
    box.setAttribute('class', 'message')
    let header = document.createElement('div')
    header.setAttribute('class', 'message-header')
    let message = document.createElement('div')
    message.setAttribute('class', 'message-body')
    box.appendChild(header)
    box.appendChild(message)
    return box
  }
  
}
