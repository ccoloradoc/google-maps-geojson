var map;

function ajax(url, callback) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        callback(JSON.parse(this.responseText));
      }
  };
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}

function renderFeature(feature) {
  let table = '';
  for(f in feature.f)
    table += '<tr><td>' + f + '</td><td>' + feature.f[f] + '</tr>';

  var content = '<div id="iw-container">' +
                      '<div class="iw-title"></div>' +
                      '<div class="iw-content"> <table>' +
                        table +
                      '</table></div>' +
                      '<div class="iw-bottom-gradient"></div>' +
                    '</div>';

  return content;
}

function initMap() {
  // Initialize map
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 8,
    center: new google.maps.LatLng(22.1564699,-100.98554089999999),
    mapTypeId: 'terrain'
  });

  ajax("./dist/districts/state/24/1.json", function(feature) {
    map.data.addGeoJson(feature);
  });
  ajax("./dist/districts/state/24/2.json", function(feature) {
    map.data.addGeoJson(feature);
  });
  ajax("./dist/districts/state/24/3.json", function(feature) {
    map.data.addGeoJson(feature);
  });
  ajax("./dist/districts/state/24/4.json", function(feature) {
    map.data.addGeoJson(feature);
  });
  ajax("./dist/districts/state/24/5.json", function(feature) {
    map.data.addGeoJson(feature);
  });
  ajax("./dist/districts/state/24/6.json", function(feature) {
    map.data.addGeoJson(feature);
  });
  ajax("./dist/districts/state/24/7.json", function(feature) {
    map.data.addGeoJson(feature);
  });

  // Define style for features
  map.data.setStyle(function(feature) {
    return ({
      fillColor: 'green',
      strokeColor: 'green',
      strokeWeight: 1
    });
  });

  // Create empty info window
  var infowindow = new google.maps.InfoWindow({
    content: '',
    maxWidth: 350
  });

  // Add listener for click
  map.data.addListener('rightclick', function(event) {
    // Create infowindow
    infowindow.setContent(renderFeature(event.feature));
    infowindow.open(map);
    infowindow.setPosition({
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    });
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      map.setCenter(pos);
    }, function() {
      console.log('error');
    });
  }
}
