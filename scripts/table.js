function populateTable(response) {

    document.getElementById("route-info-table-container").innerHTML = "<table id=\"route-info-table\" class=\"table-responsive\"><tr><th style=\"width:50%\">Method of Transport</th><th>Distance (mi)</th><th>Expected Duration (hrs)</th><th>Expected Duration in Traffic (hrs)</th><th>Carbon Footprint (Moles of CO2)</th><th>Gas Used (gallons)</th></tr><tr><td><b>Car</b></td><td></td><td></td><td></td><td>?</td><td>?</td></tr><tr><td><b>Transit</b></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td><b>Walking</b></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td><b>Cycling</b></td><td></td><td></td><td></td><td></td><td></td></tr></table>";
    let proposal = document.getElementById("route-proposal-container");
    let table = document.getElementById("route-info-table");

    let dist = "";
    let duration = "";
    let gasConsumption = "";
    let co2 = "";

    let cols = [].slice.call(table.getElementsByTagName("tr"));
    for (let i = 1; i < cols.length; i++) {
        let route = response[i - 1].routes[0].legs[0];
        let rows = [].slice.call(cols[i].getElementsByTagName("td"));
        for (let j = 1; j < rows.length; j++) {
            let td = rows[j];

            if (j == 1) {
                dist = parseDistance(route.distance.text)
                td.innerHTML = dist;
            } else if (j == 2) {
                duration = route.duration.text;
                td.innerHTML = duration;
            } else if (j == 3) {
                if (Object.keys(route).includes("duration_in_traffic")) {
                    td.innerHTML = route.duration_in_traffic.text;
                } else {
                    duration = route.duration.text;
                    td.innerHTML = duration;
                }
            } else if (j == 4) {
                if (i == 2) {
                    td.innerHTML = (143.79 * parseDistance(route.distance.text) / 44).toFixed(2);
                } else if (i > 1) {
                    td.innerHTML = 0 + ""; 
                } else {
                    co2 = (404 * dist / 44).toFixed(2);
                    td.innerHTML = co2;
                }
            } else if (j == 5) {
                if (i > 1) {
                    td.innerHTML = 0 + ""; 
                } else {
                    gasConsumption = (dist / 25).toFixed(2);
                    td.innerHTML = gasConsumption;
                }
            }   
        }
    }

    let msg = "";
    let savings = gasConsumption + " gallons of gas and prevent "
                  + Math.round(co2) + " moles of co2 being released from your car!";

    if (dist <= 2) {
        msg = "If you're not in a rush, consider walking! You'll save " + savings + " Here's the route!";
        document.querySelector(".walk-btn").click();
    } else if (dist <= 10) {
        msg = "If you own a bike, think about riding it to where you need to go! It's great excersize and you'll save " + savings
              + " Here's the route!";
        document.querySelector(".cycle-btn").click();
    } else {
        msg = "You have quite a way to go. Try using public transport. You'll still be in a vehicle but you will personally save " + savings
              + " Here are some options!";
        document.querySelector(".transit-btn").click();
    }

    
    document.querySelector(".modal-body").innerHTML = msg;
    $('#suggestionModal').modal('show'); 
    // proposal.innerHTML = "<h1>" + msg + "</h1>";

}