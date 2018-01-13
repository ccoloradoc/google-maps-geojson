import axios from 'axios';
import googleApi from 'load-google-maps-api';
import GoogleMap from './component/google-map';
import tableHtml from "./template/table.html";

var findLocation = function() {
  return new Promise((resolve, reject) => {
    axios.post('https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyDT1BiMuP2K1Z6l2ZTEwugOMlPAFX_aA_U', {})
     .then(response => {
       let payload = { location: response.data.location };
       axios.get('http://nominatim.openstreetmap.org/reverse?format=json&lat=' + response.data.location.lat + '&lon=' + response.data.location.lng + '&zoom=18&addressdetails=1', {})
       .then(response => {
          payload.address = response.data.address;
          resolve(payload);
       }, response => {
          reject('OpenStreetMap API: Failed to identify location');
       });
     }, response => {
       console.log('There has been an error on geolocation!');
       reject('Google API: Failed to identify location');
     });
  });
}

var normalize = function(r) {
  // var r = s.toLowerCase();
  r = r.replace(new RegExp(/[àáâãäå]/g),"a");
  r = r.replace(new RegExp(/[èéêë]/g),"e");
  r = r.replace(new RegExp(/[ìíîï]/g),"i");
  r = r.replace(new RegExp(/[òóôõö]/g),"o");
  r = r.replace(new RegExp(/[ùúûü]/g),"u");
  return r;
}

var createOption = function(attr) {
  var option = document.createElement('option');
  option.innerHTML = attr.name;
  option.value = attr.id;
  option.id = attr.id;
  return option;
}

class View {
  constructor() {
    this.states = {};
    
    // Create Google Map Instance
    this.googleMap = new GoogleMap({
      rootId: 'map',
      contentTemplate: tableHtml,
      viewGenerator: this.generateView.bind(this)
    });
    
    this.loadStates();
    
    findLocation().then(response => {
      document.getElementById('modal').className += " d-none";
      
      // Update map location
      this.googleMap.move(response.location);
      // Identify state
      let stateName = normalize(response.address.county).toUpperCase();
      let _self = this;
      for(var key in _self.states) {
        if(_self.states[key].name.trim() === stateName) {
            document.getElementById(_self.states[key].id + '').selected = true;
            this.selectState(_self.states[key].id);
        }
      }
    })
  }
  
  generateView(feature) {
    console.log(feature)
    // let state = this.states[parseInt(feature.ENTIDAD)].name;
    // let district = feature.DISTRITO;
    // let url = `estado/${state.trim().replace(/\s/g, "-").toLowerCase()}/distrito/${district}`;
    // return `<a href="${url}" class="btn btn-sm btn-success">${state} - ${district}</a>`;
    return "";
  }
  
  loadStates() {
    axios.get('./dist/districts/index.json').then((response) => {
      var select = document.getElementById('states');
      response.data.forEach((state) => {
        var stateOption = createOption(state);
        select.appendChild(stateOption);
        this.states[state.id] = state;
      });

      select.onchange = (event) => {
        this.selectState(event.target.value);
      }; 
      
      select.onchange.bind(this);
    });
  }
  
  selectState(stateId) {
    let state = this.states[stateId];
    let districts = parseInt(state.districts);
    this.googleMap.removeLayers();
    for(var i = 0; i < districts ; i++) {
      axios.get(`./dist/districts/state/${stateId}/${i + 1}.json`).then((response) => {
        this.googleMap.addLayer(response.data);
      });
    }
  }
}

// Awaiting for google api to load
googleApi().then(function() {
  let view = new View();
});
