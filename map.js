const map_ca = L.map('map_ca').setView([37.2941, -120.90],9);

let defaultToDarkFilter = [
    'grayscale:100%',
    'invert:100%',
    'brightness:95%',
    'contrast:130%',
    'grayscale:20%',
]

L.tileLayer.colorFilter('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', {
    attribution: '<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a>',
    filter: defaultToDarkFilter
}).addTo(map_ca);

	map_ca._initPathRoot()

// D3 Map
	const svg = d3.select("#map_ca")
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
      //.style("stroke", "#333")
      .style("opacity", .5)
      .attr('fill','transparent')
      .attr("r", (d) => {
        return Number(d.Injured) * 2 + Number(d.Killed) * 2 + 7
      })
      .attr("class","incident")


      incident.transition().delay( (d,i) => i/5).duration(200)
      .style("fill", (d) =>{
        if(d.Killed > 0){
          return "rgb(250, 36, 73)"
        }
        else if(d.Injured > 0){
          return "1a6ead"
        }
        else{
          return "rgb(67, 113, 94)"
        }
      })

      incident.on('mouseover', function(d){
        d3.select(this).style("opacity", 1)
        //clearDetails()
        showDetails(d)
      })
      incident.on('mouseout', function(d){
        d3.select(this).style("opacity", .4)
      })

    map_ca.on("viewreset", update);
    update();

    function update() {
      incident.attr("transform",
      function(d) {
        return "translate("+
          map_ca.latLngToLayerPoint(d.LatLng).x +","+
          map_ca.latLngToLayerPoint(d.LatLng).y +")";
        }
      )
    }

    // Add Info window
    const showDetails = (d) => {
        d3.select("#map_ca .info")
          .style("display","block")
          .html(() => (
            `<h2>Details</h2>
            <p>Date: ${d.Date}</p>
            <p>Location: ${d.Location}</p>
            <p>Killed: ${d.Killed}</p>
            <p>Injured: ${d.Injured}</p>`
            )
          )
    }
  })
