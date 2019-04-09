const newyork_data = [];
const illinois_data = [];
const california_data = [];
const texas_data = [];
/// Load data and filter on state
d3.csv("../data/gun_violence.csv").then(data => {
    data.forEach(function(d) {
        if (d.lat.length > 0 && d.long.length > 0) {
            d.LatLng = new L.LatLng(d.lat, d.long);

            if (d.state === "California") {
                california_data.push(d);
            } else if (d.state === "New York") {
                newyork_data.push(d);
            } else if (d.state === "Illinois") {
                illinois_data.push(d);
            } else if (d.state === "Texas") {
                texas_data.push(d);
            }
        }
    });
    showCaliforniaData(california_data);
    showNewYorkData(newyork_data);
    showTexasData(texas_data);
    showIllinoisData(illinois_data);
});
