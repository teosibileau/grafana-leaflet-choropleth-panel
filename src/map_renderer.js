import './external/leaflet/dist/leaflet.css!';
import ChoroplethMap from './map';

export default function link(scope, elem, attrs, ctrl) {
  ctrl.events.on('render', () => {
    render();
    ctrl.renderingCompleted();
  });

  function render() {
    const mapContainer = elem.find('.mapcontainer');

    if (mapContainer[0].id.indexOf('{{') > -1) {
      return;
    }

    if (!ctrl.map) {
      ctrl.map = new ChoroplethMap(ctrl, mapContainer[0]);
    }
    ctrl.map.resize();
    ctrl.map.drawPolygons();
    // if (ctrl.mapCenterMoved) ctrl.map.panToMapCenter();

    // if (!ctrl.map.legend && ctrl.panel.showLegend) ctrl.map.createLegend();

    // ctrl.map.drawCircles();
  }
}
