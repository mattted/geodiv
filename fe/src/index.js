// css
require('./mystyles.scss')
import "@babel/polyfill";
// node_modules
// import * as d3 from 'd3';
// js files
import Map from './map.js'
import API from './api.js'
import * as d3 from 'd3';
// let map = new Map({
//   geo: 'http://localhost:3000/api/counties',
//   metric: 'http://localhost:3000/api/counties_obs',
//   element: "#map"
// })
console.log("Webpack Entry Point Loaded");


const map = new Map(600, 900, '#map')
map.mountData('counties')

async function populateDatalist() {
  let test = await API.fetchKingdom()  
  // console.log(test)
  let nestTest = d3.nest()
    .key(d => d.kingdom)
    .entries(test)
    .map(el => el.key)
    .filter(el => el !== 'null')
  console.log(nestTest)
}

populateDatalist()

document.querySelector('#by_org').addEventListener('click', (e) => {
  map.mountData('counties', 'org_per_county')
})
document.querySelector('#by_obs').addEventListener('click', (e) => {
  map.mountData('counties', 'obs_per_county')
})
