const showCaliforniaData = california_data => {
    const map_ca = L.map("map_ca").setView([37.2941, -120.9], 9);
    //const california_data = [];
    L.tileLayer
        .colorFilter("https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png", {
            attribution:
                '<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a>',
            filter: defaultToDarkFilter
        })
        .addTo(map_ca);

    map_ca._initPathRoot();

    // D3 Map
    const svg_ca = d3.select("#map_ca").select("svg");
    g_ca = svg_ca.append("g");

    /*d3.csv("../data/gun_violence.csv").then(data => {
        data.forEach(function(d) {
            if (d.state === "California" && d.lat.length > 0 && d.long.length > 0) {
                d.LatLng = new L.LatLng(d.lat, d.long);
                california_data.push(d);
            }
        });*/

    const incident = g_ca
        .selectAll("circle")
        .data(california_data)
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

    map_ca.on("viewreset", update);
    update();

    function update() {
        incident.attr("transform", function(d) {
            return (
                "translate(" +
                map_ca.latLngToLayerPoint(d.LatLng).x +
                "," +
                map_ca.latLngToLayerPoint(d.LatLng).y +
                ")"
            );
        });
    }

    // Add Info window
    const showDetails = d => {
        d3.select("#map_ca .info")
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
