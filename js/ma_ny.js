const showNewYorkData = newyork_data => {
    const map_ny = L.map("map_ny").setView([42.9218, -77.5462], 9);
    //const newyork_data = [];

    L.tileLayer
        .colorFilter("https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png", {
            attribution:
                '<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a>',
            filter: defaultToDarkFilter
        })
        .addTo(map_ny);

    map_ny._initPathRoot();

    // D3 Map
    const svg_ny = d3.select("#map_ny").select("svg");
    g_ny = svg_ny.append("g");

    /*d3.csv("../data/gun_violence.csv").then(data => {
      data.forEach(function(d) {
          if (d.state === "New York" && d.lat.length > 0 && d.long.length > 0) {
              d.LatLng = new L.LatLng(d.lat, d.long);
              newyork_data.push(d);
          }
      });*/

    const incident = g_ny
        .selectAll("circle")
        .data(newyork_data)
        .enter()
        .append("circle")
        //.style("stroke", "#333")
        .style("opacity", 0.5)
        .attr("fill", "transparent")
        .attr("r", d => {
            return Number(d.injured) * 2 + Number(d.killed) * 2 + 7;
        })
        .attr("class", "incident");

    incident
        .transition()
        .delay((d, i) => i / 5)
        .duration(200)
        .style("fill", d => {
            if (d.killed > 0) {
                return "rgb(250, 36, 73)";
            } else if (d.injured > 0) {
                return "1a6ead";
            } else {
                return "rgb(67, 113, 94)";
            }
        });

    incident.on("mouseover", function(d) {
        d3.select(this).style("opacity", 1);
        //clearDetails()
        showDetails(d);
    });
    incident.on("mouseout", function(d) {
        d3.select(this).style("opacity", 0.4);
    });

    map_ny.on("viewreset", update);
    update();

    function update() {
        incident.attr("transform", function(d) {
            if (d.LatLng) {
                return (
                    "translate(" +
                    map_ny.latLngToLayerPoint(d.LatLng).x +
                    "," +
                    map_ny.latLngToLayerPoint(d.LatLng).y +
                    ")"
                );
            }
        });
    }

    // Add Info window
    const showDetails = d => {
        d3.select("#map_ny .info")
            .style("display", "block")
            .html(
                () =>
                    `<h2>Details</h2>
              <p>Date: ${d.date}</p>
              <p>Location: ${d.address}</p>
              <p>Killed: ${d.killed}</p>
              <p>Injured: ${d.injured}</p>`
            );
    };
    //});
};
