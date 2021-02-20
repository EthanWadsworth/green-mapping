function calculateCO2GramsPerMile(vehicle) {
    let ft1 = parseFloat(getVehicleAttribute(vehicle, "co2TailpipeGpm"));
    let ft2 = parseFloat(getVehicleAttribute(vehicle, "co2TailpipeAGpm"));

    return Math.max(ft1, ft2);
}

function calculateGasConsumptionHW(vehicle, dist) {
    let hwMPGft1 = parseFloat(getVehicleAttribute(vehicle, "highway08U"));
    let hwMPGft2 = parseFloat(getVehicleAttribute(vehicle, "highwayA08U"));
    let hwMPG = Math.max(hwMPGft1, hwMPGft2);

    return hwMPG / dist;
}

function calculateGasConsumptionCity(vehicle, dist) {
    let cityMPGft1 = parseFloat(getVehicleAttribute(vehicle, "city08U"));
    let cityMPGft2 = parseFloat(getVehicleAttribute(vehicle, "cityA08U"));
    let cityMPG = Math.max(cityMPGft1, cityMPGft2);

    return cityMPG / dist;
}

function calculateGasConsumption(vehicle, dist) {
    let MPGft1 = parseFloat(getVehicleAttribute(vehicle, "comb08U"));
    let MPGft2 = parseFloat(getVehicleAttribute(vehicle, "combA08U"));
    let MPG = Math.max(MPGft1, MPGft2);

    return MPG / dist;
}

/* TESTING */
// async function calc() {
//     let model = "Kia";
//     let make = "Soul";
//     let year = "2018";

//     let data = await fetchVehicleData(model, make, year);
//     console.log(data);
//     let co2GramsPerMile = calculateCO2GramsPerMile(data);
//     console.log(co2GramsPerMile);
// }
    
// calc();
