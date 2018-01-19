import _ from 'lodash';
import * as L from './external/leaflet/dist/leaflet';
import './external/leaflet-map-zoomToGeometries/dist/leaflet.map.zoomToGeometries.min';
// import './external/leaflet-choropleth/dist/choropleth';


export default class ChoroplethMap {
  constructor(ctrl, mapContainer) {
    this.ctrl = ctrl;
    this.mapContainer = mapContainer;
    this.circles = [];

    return this.createMap();
  }

  createMap() {
    console.log('initializing map');
    this.map = new window.L.GeoJSONBoundedMap(this.mapContainer);
    // this.map.fitWorld();
    this.map.zoomIn(this.ctrl.panel.mapping.initialZoom);
    this.map.scrollWheelZoom.disable();

    window.L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
      // maxZoom: 18,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
      // reuseTiles: true,
      // detectRetina: true
    }).addTo(this.map);
  }

  resize() {
    this.map.invalidateSize();
  }

  panToMapCenter() {
    // this.map.panTo([parseFloat(this.ctrl.panel.mapCenterLatitude), parseFloat(this.ctrl.panel.mapCenterLongitude)]);
    // this.ctrl.mapCenterMoved = false;
  }

  setZoom(zoomFactor) {
    // this.map.setZoom(parseInt(zoomFactor, 10));
  }

  drawPolygons() {
    if (this.ctrl.panel.mapping.polygons) {
      this.geojson = window.L.geoJSON(this.ctrl.panel.mapping.polygons);
      this.geojson.addTo(this.map);
      if (typeof this.map.zoomToGeometries === "function") {
        this.map.zoomToGeometries(this.geojson);
      }
    }
  }

  remove() {
    // this.circles = [];
    // if (this.circlesLayer) this.removeCircles();
    // if (this.legend) this.removeLegend();
    this.map.remove();
  }
}
