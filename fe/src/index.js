require('./mystyles.scss')
import "@babel/polyfill";
import Map from './map.js'
import API from './api.js'
import Filter from './filter.js'
import * as d3 from 'd3';

// load map
const map = new Map(600, 900, '#map')
map.mountData('counties')

// load map datalist filters
Filter.setFilterListeners()
Filter.kindgomDatalist()
Filter.cnameDatalist()

document.querySelector('#by_org').addEventListener('click', () => map.mountData('counties', 'org_per_county'))
document.querySelector('#by_obs').addEventListener('click', () => map.mountData('counties', 'obs_per_county'))
document.querySelector('.control').addEventListener('select', e => console.log(e.target.parentNode.children))

function test(x) {
  console.log(x) 
}
