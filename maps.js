let map;
let curr_start = "";
let curr_dest = "";
let curr_transport_method;
let rough_paths_arr = [];
let all_transport_methods = [];
let transport_methods_data = {}; // global variable that stores all transport method data from A to B
// let car_data = {};

// TODO: - do not allow user to click on transportation buttons if they have not actually entered in any start and end yet


var script = document.createElement('script');
script.src = `https://maps.googleapis.com/maps/api/js?key=${api_key}&libraries=geometry,places&callback=initMap`;
script.async = true;

// Attach your callback function to the `window` object
// main function to handle setup and all incoming requests
window.initMap = function() {
    // set up map object and direction services on webpage render
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 39.05350379726264, lng: -96.2940606852379 }, 
        zoom: 4,
        mapTypeControl: false
    });

    directionsRenderer.setMap(map);

    // console.log(google.maps.TravelMode.DRIVING)
    curr_transport_method = google.maps.TravelMode.DRIVING;

    // handles showing panel and directions when entering in two points
    directionsRenderer.setPanel(document.getElementById("directions-panel"));
    const controller = document.querySelector("#place-search");
    // controller.style.display = "block";
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(controller);


    // work on plotting for method of transportation
    // have a vertical row of buttons in the upper left hand corner where users can choose their method of transport
    // handles changing mode of transportation after route already set in 
    function transportChanged(event) {
        event.preventDefault();
        const starting_point = document.getElementById("starting-point");
        const destination = document.getElementById("destination");

        // if one or both of the input fields is empty, do not let the user change the transportation method
        if (!start_point.value || !destination.value) {
            return;
        }

        if (this.value == "walk") {
            calculateAndDisplayRoute(directionsService, directionsRenderer, starting_point, destination, google.maps.TravelMode.WALKING);
        } else if (this.value == "cycle") {
            calculateAndDisplayRoute(directionsService, directionsRenderer, starting_point, destination, google.maps.TravelMode.BICYCLING);
        } else if (this.value == "transit") {
            calculateAndDisplayRoute(directionsService, directionsRenderer, starting_point, destination, google.maps.TravelMode.TRANSIT);
        } else {
            calculateAndDisplayRoute(directionsService, directionsRenderer, starting_point, destination, google.maps.TravelMode.DRIVING);
        }
    }

    // handles changes to start point and endpoint and calls the draw map
    // might want to change this to on submit (when the calculate route button is pressed)
    // add an event listener to said button that calls this function
    function onClick(event) {
        event.preventDefault();
        // grab text fields 
        const starting_point = document.getElementById("starting-point");
        const destination = document.getElementById("destination");
        // const carMake = document.getElementById("car-make");
        // const carModel = document.getElementById("car-model");
        // const carYear = document.getElementById("car-year");

        // car_data["make"] = carMake.value;
        // car_data["model"] = carModel.value;
        // car_data["year"] = carYear.value;

        let route_btn = document.getElementById("calc-route-btn");

        // check to make sure both text fields have content in them
        if (!starting_point.value || !destination.value) {
            // do window alert
            // window.alert("Start point and destination cannot be blank!");
            // add modal data attribute so it can show 
            // route_btn.setAttribute('data-toggle', 'modal')
            // route_btn.setAttribute('data-target', '#locations-modal')
            return;
        } 

        let requestObj = {
            origin: document.getElementById("starting-point").value,
            destination: document.getElementById("destination").value,
            travelMode: curr_transport_method,
            provideRouteAlternatives: true,
            transitOptions: {
                modes: ['BUS', 'RAIL', 'TRAIN'],
                routingPreference: 'FEWER_TRANSFERS'
            },
            drivingOptions: {
                departureTime: new Date(Date.now()),  // for the time N milliseconds from now.
                trafficModel: 'pessimistic'
            }
        };

        // plot/draw direction from point A selected to point B
        route_btn.removeAttribute('data-toggle');
        route_btn.removeAttribute('data-target');

        // If the start and end have not changed, then do not calculate data for all transport methods
        if (starting_point == curr_start && destination == curr_dest) {
            calculateAndDisplayRoute(directionsService, directionsRenderer, starting_point, destination, curr_transport_method);
        } else {
            calculateAllTransportationMethods(requestObj, directionsService, directionsRenderer, curr_transport_method);
            curr_start = starting_point.value;
            curr_dest = destination.value;
        }
    }

    // test options for Autocomplete
    const center = { lat: 50.064192, lng: -130.605469 };
    // Create a bounding box with sides ~10km away from the center point
    const defaultBounds = {
        north: center.lat + 0.1,
        south: center.lat - 0.1,
        east: center.lng + 0.1,
        west: center.lng - 0.1,
    };

    // test options for autocomplete
    const options = {
        bounds: defaultBounds,
        componentRestrictions: { country: "us" },
        fields: ["address_components", "geometry", "icon", "name"],
        origin: center,
        strictBounds: false,
        types: ["establishment"],
    }

    // setup button elements for choosing mode of transport
    const walk_btn = document.querySelector(".walk-btn");
    const cycle_btn = document.querySelector(".cycle-btn");
    const vehicle_btn = document.querySelector(".vehicle-btn");
    const transit_btn = document.querySelector(".transit-btn");
    // const flights_btn = document.querySelector(".flights-btn"); 

    // setup events for buttons
    walk_btn.addEventListener("click", transportChanged);
    cycle_btn.addEventListener("click", transportChanged);
    vehicle_btn.addEventListener("click", transportChanged);
    transit_btn.addEventListener("click", transportChanged);

    // set up text boxes for the autocomplete
    let start_point = document.getElementById("starting-point");
    let endpoint = document.getElementById("destination");

    // setting up the Autocomplete objects and event listeners
    //   const autocomplete_starting_point = new google.maps.places.Autocomplete(start_point, options);
    //   const autocomplete_destination = new google.maps.places.Autocomplete(endpoint, options);

    // elements that handle all events
    document.getElementById("calc-route-btn").addEventListener("click", onClick);

    //   autocomplete_starting_point.addListener("place_changed", onStartPointChanged);
    //   autocomplete_destination.addListener("place_changed", onDestinationChanged);
};

// Append the 'script' element to 'head'
document.head.appendChild(script);

// This function is responsible for drawing the route from A to B
// look into changing the color of the route drawn
// leave commented until I have figured out how to get the autocomplete place lookup to work 
function calculateAndDisplayRoute(directionsService, directionsRenderer, start, destination, method) {

    // TODO do not reload/call endpoints if the current transport method is already loaded and endpoints have not changed

    let requestObj = {
        origin: start.value,
        destination: destination.value,
        travelMode: method,
        provideRouteAlternatives: true,
        transitOptions: {
            modes: ['BUS', 'RAIL', 'TRAIN'],
            routingPreference: 'FEWER_TRANSFERS'
        },
        drivingOptions: {
            departureTime: new Date(Date.now()),  // for the time N milliseconds from now.
            trafficModel: 'pessimistic'
        }
    };
    console.log("in calc and display route");

    directionsService.route(requestObj,

        // callback to handle success or failure based on parameters above
        (response, status) => {
            if (status === "OK") {
                // console.log(response) // what is stored in response?
                // // TODO: add function to get data for valid response back
                // computeOptimalRoute(response.routes, directionsService);

                drawDetailedDirections(directionsRenderer, response);
            } else {
                window.alert("Directions request failed due to " + status);
            }
        }
    );
    // changeSelectedRoute();
    // console.log(document.querySelectorAll('[data-route-index]'));
    // let result = calculateAllTransportationMethods(requestObj, directionsService, directionsRenderer, method);
    // console.log(result);
}

// callback function for event listener for autocomplete - need to change so it works with both start and end
function onStartPointChanged(event) {
    event.preventDefault();
    const place = this.getPlace();

    if (!place.geometry) {
        document.getElementById("starting-point").placeholder = "Start";
    } else {
        document.getElementById("starting-point").innerHTML = place.name;
    }
}

function onDestinationChanged(event) {
    event.preventDefault();
    const place = this.getPlace();

    if (!place.geometry) {
        document.getElementById("destination").placeholder = "End";
    } else {
        document.getElementById("destination").innerHTML = place.name;
    }
}

// function to compute the optimal route based on time and mileage
// cannot access traffic data - but we do have estimated time, I think, or it might just be time w/ no traffic
function computeOptimalRoute(routes, directionsService) {
    // console.log("In function computeOptimalRoute");
    // // run another direction
    // let curr = 0;
    // let renderArr = [];
    // let requestArr = [];

    // for (let i = 0; i < routes.length; i++) {
    //     requestArr.push('a');
    // }

    // for(let i; i < routes.length; i++) {
    //     renderArr.push(new google.maps.DirectionsRenderer());
    //     renderArr[curr].setMap(map);
    //     renderArr[curr].setDirections(routes[curr]);
    //     curr++;
    // }
}

// draws polylines for the other routes
// lines drawn are extremely rough and simplified compared to the actual route provided by maps
function drawPolylines(routes) {

    // check to see if there are paths being maintained internally and remove them
    let polyLinesArr = [];
    if (rough_paths_arr.length > 0) {
        rough_paths_arr.forEach(path => {
            path.setMap(null);
        })
    }

    // loop through the steps in each path and append them to a list
    routes.forEach(route => {
        let polyline = [];
        route.legs[0].steps.forEach(step => {
            let poly_startpoint = step.start_location
            let poly_endpoint = step.end_location
            polyline.push(poly_startpoint);
            polyline.push(poly_endpoint);
        })

        polyLinesArr.push(polyline);
    })

    // create the Polyline objects and add each to the map 
    for (let i = 0; i < polyLinesArr.length; i++) {

        if (polyLinesArr[i].length > 0) {
            const paths = new google.maps.Polyline({
                path: polyLinesArr[i],
                geodesic: true,
                strokeColor: "#FF0000",
                strokeOpacity: 1.0,
                strokeWeight: 2,
            });
    
            paths.setMap(map);
            rough_paths_arr.push(paths);
        }
    }
}

// gets all data for all transportation methods
function calculateAllTransportationMethods(requestObj, directionsService, directionsRenderer, desired_method) {

    // all transport methods supported by Google maps API
    let transport_methods = [
        google.maps.TravelMode.WALKING, 
        google.maps.TravelMode.BICYCLING, 
        google.maps.TravelMode.TRANSIT, 
        google.maps.TravelMode.DRIVING
    ];

    // go through every single one and compute 
    Promise.all([
        directionRoute(directionsRenderer, directionsService, requestObj, transport_methods[0], desired_method),
        directionRoute(directionsRenderer, directionsService, requestObj, transport_methods[1], desired_method),
        directionRoute(directionsRenderer, directionsService, requestObj, transport_methods[2], desired_method),
        directionRoute(directionsRenderer, directionsService, requestObj, transport_methods[3], desired_method),
        // fetchVehicleData(car_data.make, car_data.model, car_data.year)
    ])
    .then(results => {
        transport_methods_data = results;
        console.log("after promise resolution");
        console.log(transport_methods_data);
        populateTable(transport_methods_data);
    })

    return transport_methods_data;
}

// promise wrapper for calculateAllTransportationMethods
const directionRoute = (directionsRenderer, directionsService, requestObj, method, desired_method) => {
    return new Promise((resolve, reject) => {
        directionsService.route(requestObj, (response, status) => {
            if (status === "OK") {
                // transport_methods_data[method] = response;
                if (method == desired_method) {
                    drawDetailedDirections(directionsRenderer, response);
                    resolve(response);
                }
                resolve(response);
            } else {
                reject(status);
                console.log("Could not log data into transport_methods_data");
            }
        })
    })
}

async function drawDetailedDirections(directionsRenderer, response) {
    await directionsRenderer.setMap(null);

    await directionsRenderer.setOptions({
        polylineOptions: {
            strokeColor: 'green'
        }
    });

    await directionsRenderer.setMap(map);

    await directionsRenderer.setDirections(response);

    // try and draw lines for each route manually
    drawPolylines(response.routes);
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
}