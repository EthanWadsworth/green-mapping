function populateTable(response) {

    document.getElementById("route-info-table-container").innerHTML = "<table id=\"route-info-table\" class=\"table-responsive\"><tr><th style=\"width:50%\">Method of Transport</th><th>Distance (mi)</th><th>Expected Duration (hrs)</th><th>Expected Duration in Traffic (hrs)</th><th>Carbon Footprint (Moles of CO2)</th><th>Gas Used (gallons)</th></tr><tr><td><b>Car</b></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td><b>Transit</b></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td><b>Walking</b></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td><b>Cycling</b></td><td></td><td></td><td></td><td></td><td></td></tr></table>";

    let vehicle = response[response.length - 1];
    let table = document.getElementById("route-info-table");

    // let distance = parseDistance(route.distance);
    // let duration = parseTime(route.duration);

    let cols = [].slice.call(table.getElementsByTagName("tr"));
    for (let i = 1; i < cols.length; i++) {
        let route = response[i - 1].routes[0].legs[0];
        let rows = [].slice.call(cols[i].getElementsByTagName("td"));
        for (let j = 1; j < rows.length; j++) {
            let td = rows[j];

            if (j == 1) {
                td.innerHTML = parseDistance(route.distance.text);
            } else if (j == 2) {
                td.innerHTML = route.duration.text; 
            } else if (j == 3) {
                if (Object.keys(route).includes("duration_in_traffic")) {
                    td.innerHTML = route.duration_in_traffic.text;
                } else {
                    td.innerHTML = route.duration.text;
                }
            } else if (j == 4) {
                if (i > 1) {
                    td.innerHTML = 0 + ""; 
                } else {
                    td.innerHTML = calculateCO2GramsPerMile(vehicle) + "";
                }
            } else if (j == 5) {
                if (i > 1) {
                    td.innerHTML = 0 + ""; 
                } else {
                    td.innerHTML = calculateGasConsumption(vehicle, parseDistance(route.distance.text)) + ""; 
                }
            }   
        }
    }
}