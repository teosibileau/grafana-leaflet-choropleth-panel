'use strict';

System.register(['./external/leaflet/dist/leaflet.css!', './map'], function (_export, _context) {
  "use strict";

  var ChoroplethMap;
  function link(scope, elem, attrs, ctrl) {
    ctrl.events.on('render', function () {
      render();
      ctrl.renderingCompleted();
    });

    function render() {
      var mapContainer = elem.find('.mapcontainer');

      if (mapContainer[0].id.indexOf('{{') > -1) {
        return;
      }

      if (!ctrl.map) {
        ctrl.map = new ChoroplethMap(ctrl, mapContainer[0]);
      }
      ctrl.map.resize();
      ctrl.map.drawPolygons();
    }
  }

  _export('default', link);

  return {
    setters: [function (_externalLeafletDistLeafletCss) {}, function (_map) {
      ChoroplethMap = _map.default;
    }],
    execute: function () {}
  };
});
//# sourceMappingURL=map_renderer.js.map
