require('./mystyles.scss')
import "@babel/polyfill";
import Map from './map.js'
import API from './api.js'
import DataMod from './datamod.js'
import * as d3 from 'd3';

let GEOTYPE = 'counties'

const map = new Map({
  domElement: '#map',
  projection: d3.geoAlbersUsa()
});

API.fetch('counties')
  .then(data => map.createMapBounds(data).renderBasicMap(data))

// map.mountData('counties')
//   .then(mapData => map.setBounds(mapData))
//   .then(mapData => map.drawMap(true))

// load map datalist filters
DataMod.populateDatalist('kingdom')

// document.querySelector('#by_org').addEventListener('click', () => {
//   map.mountData('none', 'org_per_county')
//   .then(mapData => map.drawMap())
// })
// document.querySelector('#by_obs').addEventListener('click', () => {
//   map.mountData('none', 'obs_per_county')
//     .then(mapData => map.drawMap())
// })
document.querySelectorAll('button.geo').forEach(button => button.addEventListener('click', e => {
  Array.from(e.target.parentElement.children).forEach(button => button.classList.add('is-outlined'))
  e.target.classList.remove('is-outlined')
  GEOTYPE = e.target.id 
  API.fetch(e.target.id)
    .then(data => map.renderBasicMap(data))
}))

document.querySelectorAll('button.filter').forEach(button => button.addEventListener('click', e => {
  Array.from(e.target.parentElement.children).forEach(button => button.classList.add('is-outlined'))
  document.querySelector('#mapfilter').value = ''
  e.target.classList.remove('is-outlined')
  DataMod.populateDatalist(e.target.id)
}))

document.querySelector('#mapfilter').addEventListener('select', e => {
  // document.querySelector('#mapfilter').value = ''
  let search = e.target.value
  let column = document.querySelector('div.buttons').getAttribute('selected')
  API.fetch(`${GEOTYPE}_obs_by_query?search=${search};column=${column}`)
    .then(metric => DataMod.zip(map.geo, metric))
    .then(geo => map.renderBasicMap(geo))
});
