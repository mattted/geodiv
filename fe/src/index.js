require('./mystyles.scss')
import * as d3 from 'd3';
console.log("Test Start");

d3.select('#d3test')
  .append('h5')
  .append('text')
  .text(`D3 version: ${d3.version}`)
