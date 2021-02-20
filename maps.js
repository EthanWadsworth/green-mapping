let map;

var script = document.createElement('script');
script.src = `https://maps.googleapis.com/maps/api/js?key=${api_key}&callback=initMap`;
script.async = true;

// Attach your callback function to the `window` object
window.initMap = function() {
  // JS API is loaded and available
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
  });
};

// Append the 'script' element to 'head'
document.head.appendChild(script);

// function initMap() {
//     map = new google.maps.Map(document.getElementById("map"), {
//       center: { lat: -34.397, lng: 150.644 },
//       zoom: 8,
//     });
//   }