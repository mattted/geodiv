d3.json('http://localhost:3000/api/counties')
  .then(d => drawMap(d))

function drawMap(counties) {
  const height = 600;
  const width = 900;
  const projection = d3.geoAlbersUsa();

  const path = d3.geoPath().projection(projection);

  const svg = d3.select("#map")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  projection.scale(1).translate([0, 0]);
  const b = path.bounds(counties)
  const s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height);
  const t = [(width - s * (b[1][0] + b[0][0]))/2, (height - s * (b[1][1] + b[0][1]))/2];

  projection.scale(s).translate(t);
  const map = svg.append('g').attr('class', 'boundary');
  let cnty = map.selectAll('path').data(counties.features);

  cnty.enter()
    .append('path')
    .attr('d', path);
}
