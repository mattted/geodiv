// css
require('./mystyles.scss')
import "@babel/polyfill";
// node_modules
import * as d3 from 'd3';
// js files
import CountyMap from './county_map.js'
let map = new CountyMap({
  geo: 'http://localhost:3000/api/counties',
  metric: 'http://localhost:3000/api/counties_obs',
  element: "#map"
})

console.log("Webpack Entry Point Loaded");
