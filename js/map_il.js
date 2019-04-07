const map_il = L.map('map_il').setView([41.9901, -87.7325],11);


L.tileLayer.colorFilter('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', {
    attribution: '<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a>',
    filter: defaultToDarkFilter
}).addTo(map_il);

	map_il._initPathRoot()

// D3 Map
	const svg_il = d3.select("#map_il")
                .select("svg");
	g_il = svg_il.append("g");

  d3.csv('../data/il.csv').then(data => {
    data.forEach(function(d) {
      const geo = d.Geolocation.split(",")
      d.LatLng = new L.LatLng(geo[0],geo[1])
    })


    const incident = g_il.selectAll("circle")
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

    map_il.on("viewreset", update);
    update();

    function update() {
      incident.attr("transform",
      function(d) {
        return "translate("+
          map_il.latLngToLayerPoint(d.LatLng).x +","+
          map_il.latLngToLayerPoint(d.LatLng).y +")";
        }
      )
    }

    // Add Info window
    const showDetails = (d) => {
        d3.select("#map_il .info")
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
