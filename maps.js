let map;
let curr_start = "";
let curr_dest = "";
let curr_transport_method;

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
    });

    directionsRenderer.setMap(map);

    console.log(google.maps.TravelMode.DRIVING)
    curr_transport_method = google.maps.TravelMode.DRIVING;

    // handles showing panel and directions when entering in two points
    directionsRenderer.setPanel(document.getElementById("directions-panel"));
    const controller = document.querySelector(".searchbar-form");
    controller.style.display = "block";
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(controller);


    // work on plotting for method of transportation
    // have a vertical row of buttons in the upper left hand corner where users can choose their method of transport
    // handles changing mode of transportation after route already set in 
    function transportChanged(event) {
        event.preventDefault();
        const starting_point = document.getElementById("starting-point");
        const destination = document.getElementById("destination");

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

        // check to make sure both text fields have content in them
        if (!starting_point.value || !destination.value) {
            // do window alert
            window.alert("Start point and destination cannot be blank!");
            return;
        }

        // plot/draw direction from point A selected to point B
        calculateAndDisplayRoute(directionsService, directionsRenderer, starting_point, destination, curr_transport_method);
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
        origin: document.getElementById("starting-point").value,
        destination: document.getElementById("destination").value,
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

    // {
    //     origin: {
    //         query: document.getElementById("starting-point").value,
    //     },
    //     destination: {
    //         query: document.getElementById("destination").value,
    //     },
    //     provideRouteAlternatives: true, // gives back multiple routes if there are multiple
    //     // might have to decide how th manage this based on user input on their desired travel method
    //     travelMode: google.maps.TravelMode.DRIVING, // change according to transportation mode given
    // },

    directionsService.route(requestObj,

        // callback to handle success or failure based on parameters above
        (response, status) => {
            if (status === "OK") {

                // test changing render color to green
                // this works, but will only need to color the optimal route in the end
                directionsRenderer.setMap(null);

                directionsRenderer.setOptions({
                    polylineOptions: {
                        strokeColor: 'green'
                    }
                });

                directionsRenderer.setMap(map);

                directionsRenderer.setDirections(response);

                // try and draw lines for each route manually
                // drawPolylines(response.routes);

                console.log(response) // what is stored in response?
                // TODO: add function to get data for valid response back
                computeOptimalRoute(response.routes, directionsService);
            } else {
                window.alert("Directions request failed due to " + status);
            }
        }
    );
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

// function drawPolylines(routes) {
//     let polyLinesArr = [];
//     for (let route in routes) {
//         let polyline = [];
//         for (let step in route.steps) {
//             let point = step.start_location.Scopes[0]
//             console.log(point)
//             polyline.push({ lat: point.d, lng: point.e });
//         }
//         polyLinesArr.push(polyline);
//     }

//     console.log(routes);
//     console.log(routes[0].legs[0].steps);
//     console.log(routes[0].legs[0].steps.start_point.lat.Scopes);
//     console.log(polyLinesArr);
//     for (let i = 0; i < polyLinesArr.length; i++) {

//         if (polyLinesArr[i].length > 0) {
//             const paths = new google.maps.Polyline({
//                 path: polyLinesArr[i],
//                 geodesic: true,
//                 strokeColor: "#FF0000",
//                 strokeOpacity: 1.0,
//                 strokeWeight: 2,
//             });
    
//             paths.setMap(map);
//         }
//     }
// }