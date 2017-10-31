import _ from 'lodash';
import infoBoxFactory from './infobox';

class GoogleMap {
  constructor(options) {
    this._template = _.template(options.contentTemplate);

    this.map = new google.maps.Map(document.getElementById(options.rootId), {
      zoom: 8,
      center: new google.maps.LatLng(22.1564699,-100.98554089999999)
    });

    // Define style for features
    this.map.data.setStyle(function(feature) {
      return ({
        fillColor: 'green',
        strokeColor: 'green',
        strokeWeight: 1
      });
    });

    let _self = this;

    // Add listener for click
    this.map.data.addListener('rightclick', function(event) {
      // Remove previous infoBox if any
      if(_self.infoBox) _self.infoBox.setMap(null);
      console.log(_self)
      // Create new InfoBox
      _self.infoBox = infoBoxFactory({
        latlng: event.latLng,
        map: _self.map,
        title: 'District',
        content: _self._template({ features: event.feature.f})
      });
    });
  }

  addLayer(layer) {
    this.map.data.addGeoJson(layer);
  }
}

export default GoogleMap;
