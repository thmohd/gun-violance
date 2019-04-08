const map_ny = L.map('map_ny').setView([42.9218, -77.5462],9);


L.tileLayer.colorFilter('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', {
    attribution: '<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a>',
    filter: defaultToDarkFilter
}).addTo(map_ny);

	map_ny._initPathRoot()

// D3 Map
	const svg_ny = d3.select("#map_ny")
                .select("svg");
	g_ny = svg_ny.append("g");

  d3.csv('../data/ny.csv').then(data => {
    data.forEach(function(d) {

      const geo = d.Geolocation.split(",")
      if(geo.length > 1){
        d.LatLng = new L.LatLng(Number(geo[0]),Number(geo[1]))
      }
    })


    const incident = g_ny.selectAll("circle")
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

    map_ny.on("viewreset", update);
    update();

    function update() {
      incident.attr("transform",
      function(d) {
        if(d.LatLng){
          return "translate("+
            map_ny.latLngToLayerPoint(d.LatLng).x +","+
            map_ny.latLngToLayerPoint(d.LatLng).y +")";
          }
        }
      )
    }

    // Add Info window
    const showDetails = (d) => {
        d3.select("#map_ny .info")
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
