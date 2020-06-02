require('./mystyles.scss')
import "@babel/polyfill";
import Map from './map.js'
// import API from './api.js'
import Filter from './filter.js'
// import * as d3 from 'd3';

// load map
const map = new Map(400, 700, '#map')
map.mountData('counties')
  .then(mapData => map.drawMap())

// load map datalist filters
Filter.populateDatalist('kingdom')

// document.querySelector('#by_org').addEventListener('click', () => {
//   map.mountData('none', 'org_per_county')
//   .then(mapData => map.drawMap())
// })
// document.querySelector('#by_obs').addEventListener('click', () => {
//   map.mountData('none', 'obs_per_county')
//     .then(mapData => map.drawMap())
// })

document.querySelectorAll('button.filter').forEach(button => button.addEventListener('click', e => {
  Array.from(e.target.parentElement.children).forEach(button => button.classList.add('is-outlined'))
  document.querySelector('#mapfilter').value = ''
  e.target.classList.remove('is-outlined')
  Filter.populateDatalist(e.target.id)
}))

document.querySelector('#mapfilter').addEventListener('select', e => {
  let search = e.target.value
  let column = document.querySelector('div.buttons').getAttribute('selected')
  map.mountData('none', `obs_by_query?search=${search};column=${column}`)
    .then(mapData => map.drawMap())
});
