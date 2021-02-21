function calculateCO2GramsPerMile(vehicle) {
    let ft1 = parseFloat(getVehicleAttribute(vehicle, "co2TailpipeGpm"));
    let ft2 = parseFloat(getVehicleAttribute(vehicle, "co2TailpipeAGpm"));

    return Math.max(ft1, ft2).toFixed(2);
}

function calculateGasConsumptionHW(vehicle, dist) {
    let hwMPGft1 = parseFloat(getVehicleAttribute(vehicle, "highway08U"));
    let hwMPGft2 = parseFloat(getVehicleAttribute(vehicle, "highwayA08U"));
    let hwMPG = Math.max(hwMPGft1, hwMPGft2);

    return dist / hwMPG;
}

function calculateGasConsumptionCity(vehicle, dist) {
    let cityMPGft1 = parseFloat(getVehicleAttribute(vehicle, "city08U"));
    let cityMPGft2 = parseFloat(getVehicleAttribute(vehicle, "cityA08U"));
    let cityMPG = Math.max(cityMPGft1, cityMPGft2);

    return dist / cityMPG;
}

function calculateGasConsumption(vehicle, dist) {
    let MPGft1 = parseFloat(getVehicleAttribute(vehicle, "comb08U"));
    let MPGft2 = parseFloat(getVehicleAttribute(vehicle, "combA08U"));
    let MPG = Math.max(MPGft1, MPGft2);

    console.log(dist);
    console.log(MPG);

    return (dist / MPG).toFixed(2);
}

function generateSummary(vehicle, dist, time) {

    let hours = parseFloat(parseTime(time)).toFixed(2);
    let miles = parseDistance(dist);
    let co2Emitted = (calculateCO2GramsPerMile(vehicle) * miles / 44).toFixed(2);
    let gasConsumption = (calculateGasConsumption(vehicle, miles)).toFixed(2);

    let summary = "Time Cost: " + hours + " hours"
              + "\nEnvironmental Cost: " + co2Emitted + " moles of CO2"
              + "\nGas Cost: " + gasConsumption + " gallons of gas";


    return summary;
}

/* TESTING */
// async function calc() {
//     let model = "Kia";
//     let make = "Soul";
//     let year = "2018";

//     let data = await fetchVehicleData(model, make, year);
//     let co2GramsPerMile = calculateCO2GramsPerMile(data);

//     console.log(generateSummary(data, "100 mi", "3 hours 10 mins"));
// }
    
// calc();
