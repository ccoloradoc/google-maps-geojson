import axios from 'axios';
import InfoBoxFactory from './component/infobox';
import google from 'load-google-maps-api';
import tableTemplate from "html-loader!../template/table";

var map;

function renderFeature(feature) {
  let table = '';
  for (var f in feature.f) {
    if (feature.f.hasOwnProperty(f)) {
        table += '<tr><td>' + f + '</td><td>' + feature.f[f] + '</tr>';
    }
  }

  var content = '<table style="width:100%;">' + table + '</table>';

  return content;
}

google().then(function({ Map, LatLng, InfoWindow, OverlayView }) {
  const InfoBox = InfoBoxFactory(OverlayView);

  console.log(tableTemplate);

  // Initialize map
  map = new Map(document.getElementById('map'), {
    zoom: 8,
    center: new LatLng(22.1564699,-100.98554089999999),
    mapTypeId: 'terrain'
  });

  for(var i = 0; i < 7 ; i++) {
    axios.get(`./dist/districts/state/24/${i + 1}.json`).then((response) => {
      map.data.addGeoJson(response.data);
    });
  }

  // Define style for features
  map.data.setStyle(function(feature) {
    return ({
      fillColor: 'green',
      strokeColor: 'green',
      strokeWeight: 1
    });
  });

  // Create empty info window
  var infowindow = new InfoWindow({
    content: '',
    maxWidth: 350
  });

  // Add listener for click
  map.data.addListener('rightclick', function(event) {
    var infoBox = new InfoBox({
      latlng: event.latLng,
      map: map,
      title: 'District',
      content: renderFeature(event.feature)
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
});
