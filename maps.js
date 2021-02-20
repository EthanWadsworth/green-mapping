let map;

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
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
  });

  directionsRenderer.setMap(map);

  // handles changes to start point and endpoint and calls the draw map
  // might want to change this to on submit (when the calculate route button is pressed)
  // add an event listener to said button that calls this function
  const onClick = () => {

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
    calculateAndDisplayRoute(directionsService, directionsRenderer);
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

  let start_point = document.getElementById("starting-point");
  let endpoint = document.getElementById("destination");

  // setting up the Autocomplete objects and event listeners
  const autocomplete_starting_point = new google.maps.places.Autocomplete(start_point, options);
  const autocomplete_destination = new google.maps.places.Autocomplete(endpoint, options);

  // elements that handle all events
  document.getElementById("calc-route-btn").addEventListener("click", onClick);

  autocomplete_starting_point.addListener("place_changed", onStartPointChanged);
  autocomplete_destination.addListener("place_changed", onDestinationChanged);
};

// Append the 'script' element to 'head'
document.head.appendChild(script);

// This function is responsible for drawing the route from A to B
// look into changing the color of the route drawn
// leave commented until I have figured out how to get the autocomplete place lookup to work 
function calculateAndDisplayRoute(directionsService, directionsRenderer) {
    // directionsService.route(
    //     {
    //         origin: {
    //             //query: 
    //         },
    //         destination: {
    //             //query: 
    //         },
    //         provideRouteAlternatives: true, // gives back multiple routes if there are multiple
    //         // might have to decide how th manage this based on user input on their desired travel method
    //         travelMode: google.maps.TravelMode.DRIVING, // change according to transportation mode given
    //     },

    //     // callback to handle success or failure based on parameters above
    //     (response, status) => {
    //         if (status === "OK") {
    //             directionsRenderer.setDirections(response);
    //         } else {
    //             window.alert("Directions request failed due to " + status);
    //         }
    //     }
    // );
    console.log("ping ping pong :)"); // eventually remove
}

// callback function for event listener for autocomplete - need to change so it works with both start and end
function onStartPointChanged() {
    const place = this.getPlace();

    if (!place.geometry) {
        document.getElementById("starting-point").placeholder = "Start";
    } else {
        document.getElementById("starting-point").innerHTML = place.name;
    }
}

function onDestinationChanged() {
    const place = this.getPlace();

    if (!place.geometry) {
        document.getElementById("destination").placeholder = "End";
    } else {
        document.getElementById("destination").innerHTML = place.name;
    }
}