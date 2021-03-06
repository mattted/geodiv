import * as d3 from 'd3';
import API from './api.js'
import DataMod from './datamod.js'
import MapLegend from './legend.js'
import Recents from './recents.js'

export default class Map {
  constructor(opts) {
    this.domElement = opts.domElement
    this.width = opts.width || window.innerWidth * 0.9,
    this.margin = opts.margin || {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10
    };

    this.boundedWidth = this.width - this.margin.left - this.margin.right
    this.projection = opts.projection || d3.geoMercator()
  } 
  
  createMapBounds(geo) {
    this.projection = this.projection.fitWidth(this.boundedWidth, geo)
    this.pathGenerator = d3.geoPath(this.projection)
    this.boundedHeight = this.pathGenerator.bounds(geo)[1][1]
    this.height = this.boundedHeight + this.margin.top + this.margin.bottom
    
    this.wrapper = d3.select(this.domElement)
      .append('svg')
      .attr('class', 'level')
      .attr('width', this.width)
      .attr('height', this.height)

    this.bounds = this.wrapper.append('g')
      .style('transform', `translate(${this.margin.left}px, ${this.margin.top}px)`)

    this.graticule = this.renderGraticule(this.bounds)

    return this
  }

  renderBasicMap(geo) {
    this.geo = geo
    this.features = geo.type === 'FeatureCollection' ? geo.features : [geo]

    this.projection = this.projection.fitSize([this.boundedWidth, this.boundedHeight], this.geo)
    this.pathGenerator = d3.geoPath(this.projection)

    if (geo.domain) {
      this.colorScale = d3.scaleLog()
        .domain([1,geo.extent[1]])
        .interpolate(d3.interpolateHclLong)
        .range(["#ECEFF4", "#4C566A"])
      this.legend = new MapLegend(this) 
      this.legend.drawLegend()
    }

    this.bounds.selectAll('.boundaries')
      .data(this.features)
      .join(
        enter => enter.append('path')
          .attr('class', 'boundaries')
          .attr('d', this.pathGenerator)
          .attr('fill', d => {
            if(d.properties.metric) return this.colorScale(d.properties.metric)
            else return "#ECEFF4"
          })
          .on('click', this.changeTable)
          .on('mouseover', this.renderTooltip)
          .on('mouseout', this.removeTooltip),

        update => update
          .attr('d', this.pathGenerator)
          .on('mouseover', this.renderTooltip)
          .on('mouseout', this.removeTooltip)
          .transition().duration(1000)
          .attr('fill', d => {
            if(d.properties.metric) return this.colorScale(d.properties.metric)
            else return "#ECEFF4"
          }),

        exit => exit
          .remove()
      )
  }

  renderGraticule(mount) {
    const geoGrat = d3.geoGraticule()
      .extent([[-98 - 80, 38 - 45], [-98 + 35, 38 + 45]])
      .step([5, 5]);

    mount.selectAll('.graticule')
      .data(geoGrat.lines())
      .join(
        enter => enter.append('path')
          .attr('class', 'graticule')
          .attr('d', this.pathGenerator),
        update => update
          .transition().duration(1000)
          .attr('d', this.pathGenerator),
        exit => exit
          .remove()
      )
  }

  renderTooltip(d) {
    d3.select(this)
      .style("stroke", "#4C566A")
      .style("stroke-width", "2px")
    let maptip = document.querySelector('#maptip')
    maptip.style.left = (d3.event.pageX + 30) + 'px'
    maptip.style.top = (d3.event.pageY - 30) + 'px'
    let {type, name, metric} = DataMod.getFeatureInfo(d)
    maptip.innerHTML = `
      <p>${name}</p>
      <p>${metric}</p>
      `
    maptip.style.opacity = 100;
  }

  removeTooltip() {
    d3.select(this)
      .attr("stroke", "#4C566A")
      .style("stroke-width", "0.1px")
    let maptip = document.querySelector('#maptip')
    maptip.style.opacity = 0;
  }

  changeTable(e) {
    let col = document.querySelector('button.filter:not(.is-outlined)').id
    let search;
    let geotype = Object.keys(e.properties).includes('usps') ? "state" : "county"
    let geoid = e.id
    let displayName;
    switch(col) {
      case 'kingdom':
        search = document.querySelectorAll('td')[3].textContent
        displayName = 'Kingdom'
        break;
      case 'phylum':
        search = document.querySelectorAll('td')[4].textContent
        displayName = 'Phylum'
        break;
      case 'klass':
        search = document.querySelectorAll('td')[5].textContent
        displayName = 'Class'
        break;
      case 'order':
        search = document.querySelectorAll('td')[6].textContent
        displayName = 'Order'
        break;
      case 'family':
        search = document.querySelectorAll('td')[7].textContent
        displayName = 'Family'
        break;
      case 'genus':
        search = document.querySelectorAll('td')[8].textContent
        displayName = 'Genus'
        break;
      case 'species':
        search = document.querySelectorAll('td')[9].textContent
        displayName = 'Species'
        break;
      case 'cname':
        search = document.querySelectorAll('td')[10].textContent
        displayName = 'Common Name'
        break;
      default:
        search = 'none'
    }
    if (e.properties.metric !== undefined) {
      let url = `obs_for_inforec?search=${search};column=${col};geotype=${geotype};geoid=${geoid}` 
      API.fetch(url)
        .then(data => new Recents(data, displayName, search))
        .then(node => {
          let recentInfo = document.querySelector("#inforec")
          recentInfo.innerHTML = ''
          recentInfo.appendChild(node.frag)
          document.querySelectorAll('th').forEach( th => th.addEventListener('click', Recents.sort))
        })
        .then(() => document.querySelector(".info-title").textContent += ` in ${e.properties.name} ${geotype.charAt(0).toUpperCase() + geotype.slice(1)}`)
        // .then(document.querySelector(".info-title").textContent += ` in ${e.properties.name}`)
      }
  }
}
