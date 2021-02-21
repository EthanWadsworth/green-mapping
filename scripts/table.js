function populateTable(response) {

    let table = document.getElementById("route-info-table");

    // let distance = parseDistance(route.distance);
    // let duration = parseTime(route.duration);

    let cols = [].slice.call(table.getElementsByTagName("tr"));
    for (let i = 1; i < cols.length; i++) {
        // console.log(response[transportMethods[i - 1]]);
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
                if (i > 2) {
                    td.innerHTML = 0 + ""; 
                }
            } else if (j == 5) {
                if (i > 1) {
                    td.innerHTML = 0 + ""; 
                }
            }   
        }
    }
}