import _ from 'lodash';
import infoBoxFactory from './infobox';

class GoogleMap {
  constructor(options) {
    this.viewGenerator = options.viewGenerator;
    this._template = _.template(options.contentTemplate);
    this.layers = [];
    this.map = new google.maps.Map(document.getElementById(options.rootId), {
      zoom: 6,
      center: new google.maps.LatLng(23.6364699,-102.55284089999999)
    });

    let colors = [
      '#a50026', '#d73027', '#f46d43', '#fdae61', '#fee090', '#ffffbf', '#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695',
      '#a50026', '#d73027', '#f46d43', '#fdae61', '#fee090', '#ffffbf', '#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695',
      '#a50026', '#d73027', '#f46d43', '#fdae61', '#fee090', '#ffffbf', '#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695',
      '#a50026', '#d73027', '#f46d43', '#fdae61', '#fee090', '#ffffbf', '#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695',
      '#a50026', '#d73027', '#f46d43', '#fdae61', '#fee090', '#ffffbf', '#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695',
      '#a50026', '#d73027', '#f46d43', '#fdae61', '#fee090', '#ffffbf', '#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695'
    ];

    // Define style for features
    this.map.data.setStyle(function(feature) {
      return ({
        fillColor: colors[feature.f.district],
        strokeColor: 'red',
        strokeWeight: 1
      });
    });

    let _self = this;

    // Add listener for click
    this.map.data.addListener('click', function(event) {
      // Remove previous infoBox if any
      if(_self.infoBox) _self.infoBox.setMap(null);
      // Create new InfoBox
      _self.infoBox = infoBoxFactory({
        latlng: event.latLng,
        map: _self.map,
        title: `Distrito ${event.feature.f.district}`,
        content: _self._template(event.feature.f)
      });
    });
  }

  addLayer(layer) {
    var feature = this.map.data.addGeoJson(layer);
    this.layers.push(feature[0]);
  }
  
  removeLayers() {
    this.layers.forEach(layer => {
      this.map.data.remove(layer);
    });
    if(this.infoBox) this.infoBox.setMap(null);
  }
  
  move(location) {
    this.map.setCenter(location);
    this.map.setZoom(8);
  }
}

export default GoogleMap;
