const FUEL_ECONOMY_ID_API = "https://www.fueleconomy.gov/ws/rest/vehicle/menu/options?";
const FUEL_ECONOMY_VEHICLE_API = "https://www.fueleconomy.gov/ws/rest/vehicle/";

async function fetchVehicleData(make, model, year) {

    // Clean up input
    make = capitalize(make).trim();
    model = capitalize(model).trim();
    year = year.trim();

    // make and model args must be capitalized
    const URL = FUEL_ECONOMY_ID_API + "year=" + year + "&make=" + make + "&model=" + model;    
    
    // Get the URL for the vehicle data which includes emmissions data
    const vehicleURL = await fetch(URL)
        .then(response => response.text())
        .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
        .then(function(data) {
            
            let types = data.getElementsByTagName("menuItem");
            let vehicle = types[Math.floor(Math.random() * types.length)];
            let id = vehicle.childNodes[1].textContent;

            const vehicleURL = FUEL_ECONOMY_VEHICLE_API + id;

            return vehicleURL;
        });
    
    // Use URL to get vehicle data
    const vehicleData = await fetch(vehicleURL)
        .then(response => response.text())
        .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
        .then(data => data);
    
    return vehicleData;

}

function getVehicleAttribute(vehicleData, attr) {
    let path = attr.split("/");
    let elem = vehicleData.getElementsByTagName(path[0]);

    for (let i = 1; i < path.length; i++) {
        elem = vehicleData.getElementsByTagName(path[i]);
    }

    return elem[0].textContent;
}
