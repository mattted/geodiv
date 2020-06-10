require('./mystyles.scss')
import "@babel/polyfill";
import Map from './map.js'
import Form from './forms.js'
import Recents from './recents.js'
import API from './api.js'
import DataMod from './datamod.js'
import * as d3 from 'd3';

let GEOTYPE = 'counties'
let TABLE
const map = new Map({
  domElement: '#map',
  projection: d3.geoAlbersUsa()
});

API.fetch('counties')
  .then(data => map.createMapBounds(data).renderBasicMap(data))

// load map datalist filters
DataMod.populateDatalist('kingdom', '#mapdatalist')

document.querySelector("#add-obs").addEventListener('click', e => {
  let form = new Form('obs', '.modal-content')
  document.querySelector(".modal").classList.add("is-active")
})

document.querySelector(".modal-close").addEventListener('click', e => document.querySelector(".modal").classList.remove("is-active"))

document.querySelectorAll('button.geo').forEach(button => button.addEventListener('click', e => {
  Array.from(e.target.parentElement.children).forEach(button => button.classList.add('is-outlined'))
  e.target.classList.remove('is-outlined')
  GEOTYPE = e.target.id 
  d3.select(".legendSvg").remove()
  // TODO: make geo switch take the current map state into account
  API.fetch(e.target.id)
    .then(data => map.renderBasicMap(data))
}))

document.querySelectorAll('button.filter').forEach(button => button.addEventListener('click', e => {
  Array.from(e.target.parentElement.children).forEach(button => button.classList.add('is-outlined'))
  document.querySelector('#mapfilter').value = ''
  e.target.classList.remove('is-outlined')
  console.log(e.target.id)
  DataMod.populateDatalist(e.target.id, '#mapdatalist')
}))

document.querySelector('#mapfilter').addEventListener('select', e => {
  let search = e.target.value
  let column = document.querySelector('div.buttons').getAttribute('selected')
  let geourl = `${GEOTYPE}_obs_by_query?search=${search};column=${column}`
  let inforec = `obs_for_inforec?search=${search};column=${column}`
  DataMod.setMetricName(geourl, map)
  API.fetch(geourl)
    .then(metric => DataMod.zip(map.geo, metric))
    .then(geo => map.renderBasicMap(geo))
  API.fetch(inforec)
    .then(data => {
      TABLE = new Recents(data, map.queryCol, map.querySearch)
      return TABLE
    })
    .then(node => {
      let recentInfo = document.querySelector("#inforec")
      recentInfo.innerHTML = ''
      recentInfo.appendChild(node.frag)
      document.querySelectorAll('th').forEach( th => th.addEventListener('click', Recents.sort))
    })
  document.querySelector('#mapfilter').value = ''
});
