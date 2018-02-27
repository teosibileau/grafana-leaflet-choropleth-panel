'use strict';

System.register(['lodash', './external/leaflet/dist/leaflet', './external/leaflet-map-zoomToGeometries/dist/leaflet.map.zoomToGeometries.min', './external/chroma-js/chroma.min.js'], function (_export, _context) {
  "use strict";

  var _, chroma, _createClass, ChoroplethMap;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_lodash) {
      _ = _lodash.default;
    }, function (_externalLeafletDistLeaflet) {}, function (_externalLeafletMapZoomToGeometriesDistLeafletMapZoomToGeometriesMin) {}, function (_externalChromaJsChromaMinJs) {
      chroma = _externalChromaJsChromaMinJs;
    }],
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
            this.map.zoomIn(this.ctrl.panel.mapping.initialZoom);
            this.map.scrollWheelZoom.disable();

            this.tiles = window.L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
              attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
              reuseTiles: true,
              detectRetina: true
            });
            this.tiles.addTo(this.map);
          }
        }, {
          key: 'resize',
          value: function resize() {
            this.map.invalidateSize();
          }
        }, {
          key: 'drawPolygons',
          value: function drawPolygons() {
            if (this.ctrl.panel.mapping.polygons) {
              var that = this;

              this.map.eachLayer(function (layer) {
                if (layer != that.tiles) {
                  that.map.removeLayer(layer);
                }
              });

              var opts = {
                scale: [this.ctrl.panel.polygons.coldColor, this.ctrl.panel.polygons.hotColor],
                steps: 10, // number of breaks or steps in range
                mode: 'q', // q for quantile, e for equidistant, k for k-means
                style: {
                  color: '#fff',
                  weight: 1,
                  fillOpacity: .8
                }
              };

              var geojson = _.clone(this.ctrl.panel.mapping.polygons);

              var features = [];
              $.each(geojson.features, function (i, v) {
                if (v.properties['choropleth'] > 0) {
                  features.push(v);
                }
              });
              geojson.features = features;

              var values = _.map(geojson.features, function (item) {
                return item.properties['choropleth'];
              });

              var limits = chroma.limits(values, opts.mode, opts.steps - 1);
              var colors = chroma.scale(opts.scale).colors(limits.length);

              if (geojson.features.length > 0) {
                this.geojson = window.L.geoJSON(geojson, {
                  limits: limits,
                  colors: colors,
                  style: function style(feature) {
                    var style = {};
                    var featureValue = feature.properties['choropleth'];
                    for (var i = 0; i < limits.length; i++) {
                      style.color = '#fff';
                      style.weight = 1;
                      style.fillOpacity = .5;
                      if (featureValue <= limits[i]) {
                        style.fillColor = colors[i];
                        break;
                      }
                    }
                    return style;
                  }
                });

                if (this.map) {
                  this.geojson.addTo(this.map);
                }
                this.map.zoomToGeometries(this.geojson);
              }
            }
          }
        }, {
          key: 'remove',
          value: function remove() {
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
