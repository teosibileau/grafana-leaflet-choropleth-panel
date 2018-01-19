'use strict';

System.register(['lodash', './external/leaflet/dist/leaflet', './external/leaflet-map-zoomToGeometries/dist/leaflet.map.zoomToGeometries.min'], function (_export, _context) {
  "use strict";

  var _, L, _createClass, ChoroplethMap;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_lodash) {
      _ = _lodash.default;
    }, function (_externalLeafletDistLeaflet) {
      L = _externalLeafletDistLeaflet;
    }, function (_externalLeafletMapZoomToGeometriesDistLeafletMapZoomToGeometriesMin) {}],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      ChoroplethMap = function () {
        function ChoroplethMap(ctrl, mapContainer) {
          _classCallCheck(this, ChoroplethMap);

          this.ctrl = ctrl;
          this.mapContainer = mapContainer;
          this.circles = [];

          return this.createMap();
        }

        _createClass(ChoroplethMap, [{
          key: 'createMap',
          value: function createMap() {
            console.log('initializing map');
            this.map = new window.L.GeoJSONBoundedMap(this.mapContainer);
            // this.map.fitWorld();
            this.map.zoomIn(this.ctrl.panel.mapping.initialZoom);
            this.map.scrollWheelZoom.disable();

            window.L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
              // maxZoom: 18,
              attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
              // reuseTiles: true,
              // detectRetina: true
            }).addTo(this.map);
          }
        }, {
          key: 'resize',
          value: function resize() {
            this.map.invalidateSize();
          }
        }, {
          key: 'panToMapCenter',
          value: function panToMapCenter() {
            // this.map.panTo([parseFloat(this.ctrl.panel.mapCenterLatitude), parseFloat(this.ctrl.panel.mapCenterLongitude)]);
            // this.ctrl.mapCenterMoved = false;
          }
        }, {
          key: 'setZoom',
          value: function setZoom(zoomFactor) {
            // this.map.setZoom(parseInt(zoomFactor, 10));
          }
        }, {
          key: 'drawPolygons',
          value: function drawPolygons() {
            if (this.ctrl.panel.mapping.polygons) {
              this.geojson = window.L.geoJSON(this.ctrl.panel.mapping.polygons);
              this.geojson.addTo(this.map);
              if (typeof this.map.zoomToGeometries === "function") {
                this.map.zoomToGeometries(this.geojson);
              }
            }
          }
        }, {
          key: 'remove',
          value: function remove() {
            // this.circles = [];
            // if (this.circlesLayer) this.removeCircles();
            // if (this.legend) this.removeLegend();
            this.map.remove();
          }
        }]);

        return ChoroplethMap;
      }();

      _export('default', ChoroplethMap);
    }
  };
});
//# sourceMappingURL=map.js.map
