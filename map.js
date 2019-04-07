const map = L.map('map').setView([37.2941, -120.32],6);

let defaultToDarkFilter = [
    'grayscale:100%',
    'invert:100%',
]

L.tileLayer.colorFilter('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', {
    attribution: '<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a>',
    filter: defaultToDarkFilter
}).addTo(map);

	map._initPathRoot()

// D3 Map
	const svg = d3.select("#map")
                .select("svg");
	g = svg.append("g");

  d3.csv('ca.csv').then(data => {
    data.forEach(function(d) {
      const geo = d.Geolocation.split(",")
      d.LatLng = new L.LatLng(geo[0],geo[1])
    })


    const incident = g.selectAll("circle")
      .data(data)
      .enter().append("circle")
      .style("stroke", "#333")
      .style("opacity", .5)
      .style("fill", "#1a6ead")
      .attr("r", 10)
      .attr("class","incident");

      incident.on('mouseover', (d)=>{
        console.log(d)
      })

    map.on("viewreset", update);
    update();

    function update() {
      incident.attr("transform",
      function(d) {
        return "translate("+
          map.latLngToLayerPoint(d.LatLng).x +","+
          map.latLngToLayerPoint(d.LatLng).y +")";
        }
      )
    }
  })
