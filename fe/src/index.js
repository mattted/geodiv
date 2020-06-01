require('./mystyles.scss')
import "@babel/polyfill";
import Map from './map.js'
import API from './api.js'
import Factory from './factory.js'
import * as d3 from 'd3';

// load map
const map = new Map(600, 900, '#map')
map.mountData('counties')

// load map datalist filters
Factory.kindgomDatalist()
Factory.cnameDatalist()


document.querySelector('#by_org').addEventListener('click', () => map.mountData('counties', 'org_per_county'))
document.querySelector('#by_obs').addEventListener('click', () => map.mountData('counties', 'obs_per_county'))
