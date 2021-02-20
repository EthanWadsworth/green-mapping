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

  // on click 
  document.getElementById("calc-route-btn").addEventListener("click", onClick);
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
    console.log("ping ping pong :)");
}