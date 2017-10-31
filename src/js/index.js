import axios from 'axios';
import googleApi from 'load-google-maps-api';
import GoogleMap from './component/google-map';
import tableHtml from "./template/table.html";

// Awaiting for google api to load
googleApi().then(function() {
  // Create Google Map Instance
  let googleMap = new GoogleMap({
    rootId: 'map',
    contentTemplate: tableHtml
  });

  for(var i = 0; i < 7 ; i++) {
    axios.get(`./dist/districts/state/24/${i + 1}.json`).then((response) => {
      googleMap.addLayer(response.data);
    });
  }

  let states = {};
  axios.get('./dist/districts/index.json').then((response) => {
    console.log(response.data);
    var select = document.getElementById('states');
    response.data.forEach((state) => {
      var stateOption = document.createElement('option');
      stateOption.innerHTML = state.name;
      state.value = state.id;
      select.appendChild(stateOption);
      states[state.id] = state;
    });

    states.onchange = function(event) {
      console.log('->', event.target.value);
    }

  });



});
