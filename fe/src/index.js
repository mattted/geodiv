// css
require('./mystyles.scss')
import "@babel/polyfill";
// node_modules
// import * as d3 from 'd3';
// js files
import Map from './map.js'
// let map = new Map({
//   geo: 'http://localhost:3000/api/counties',
//   metric: 'http://localhost:3000/api/counties_obs',
//   element: "#map"
// })
console.log("Webpack Entry Point Loaded");


let map = new Map(600, 900, '#map')
map.mountData('counties', 'obs_per_county')

document.querySelector('#mapchange').addEventListener('click', (e) => {
  map.mountData('counties', 'org_per_county')
})
