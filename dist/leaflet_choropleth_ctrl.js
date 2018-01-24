'use strict';

System.register(['app/plugins/sdk', 'moment', 'lodash', 'jquery', './map_renderer'], function (_export, _context) {
  "use strict";

  var MetricsPanelCtrl, moment, _, $, mapRenderer, _createClass, panelDefaults, LeafletChoroplethCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  return {
    setters: [function (_appPluginsSdk) {
      MetricsPanelCtrl = _appPluginsSdk.MetricsPanelCtrl;
    }, function (_moment) {
      moment = _moment.default;
    }, function (_lodash) {
      _ = _lodash.default;
    }, function (_jquery) {
      $ = _jquery.default;
    }, function (_map_renderer) {
      mapRenderer = _map_renderer.default;
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

      panelDefaults = {
        polygons: {
          hotColor: "rgb(255, 0, 0)",
          coldColor: "rgb(0, 0, 255)",
          endpoint: null,
          GeoJSONKey: null,
          dataSourceTag: null
        },
        mapping: {
          height: 700,
          initialZoom: 1,
          polygons: null
        },
        datasource: null
      };

      _export('LeafletChoroplethCtrl', LeafletChoroplethCtrl = function (_MetricsPanelCtrl) {
        _inherits(LeafletChoroplethCtrl, _MetricsPanelCtrl);

        function LeafletChoroplethCtrl($scope, $injector) {
          _classCallCheck(this, LeafletChoroplethCtrl);

          var _this = _possibleConstructorReturn(this, (LeafletChoroplethCtrl.__proto__ || Object.getPrototypeOf(LeafletChoroplethCtrl)).call(this, $scope, $injector));

          _.defaults(_this.panel, panelDefaults);
          _this.panel.mapping.id = 'mapid_' + _this.panel.id;
          _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
          _this.events.on('data-received', _this.onDataReceived.bind(_this));
          _this.events.on('data-error', _this.onDataError.bind(_this));
          _this.events.on('data-snapshot-load', _this.onDataReceived.bind(_this));
          _this.events.on('panel-teardown', _this.onPanelTeardown.bind(_this));
          return _this;
        }

        _createClass(LeafletChoroplethCtrl, [{
          key: 'updatePolygons',
          value: function updatePolygons() {
            this.panel.mapping.polygons = null;
            this.fetchPolygons();
          }
        }, {
          key: 'fetchPolygons',
          value: function fetchPolygons() {
            if (this.panel.polygons.endpoint) {
              if (!this.panel.mapping.polygons) {
                var that = this;
                window.$.ajax({
                  url: that.panel.polygons.endpoint,
                  type: "GET",
                  dataType: "json",
                  contentType: "application/json",
                  crossDomain: true,
                  success: function success(response) {
                    that.panel.mapping.polygons = response;
                    $.each(that.panel.mapping.polygons.features, function (index, value) {
                      that.panel.mapping.polygons.features[index].properties.choropleth = 0;
                    });
                    if (that.map) {
                      that.map.drawPolygons();
                    }
                  },
                  error: function error(response) {
                    console.log(response);
                  }
                });
              } else {
                if (that.map) {
                  that.map.drawPolygons();
                }
              }
            } else {
              console.log('endpoint is not set');
            }
          }
        }, {
          key: 'onInitEditMode',
          value: function onInitEditMode() {
            this.addEditorTab('Polygons Options', 'public/plugins/grafana-leaflet-choropleth-panel/polygons_editor.html', 2);
          }
        }, {
          key: 'onDataReceived',
          value: function onDataReceived(dataList) {
            var _this2 = this;

            if (!dataList || !this.panel.mapping.polygons) return;

            var that = this;
            $.each(that.panel.mapping.polygons.features, function (index, value) {
              that.panel.mapping.polygons.features[index].properties.choropleth = 0;
            });

            if (this.panel.polygons.GeoJSONKey && this.panel.polygons.dataSourceTag) {
              dataList.forEach(function (row) {
                var target = row.target.substring(row.target.indexOf('{'));
                if (target.indexOf(_this2.panel.polygons.dataSourceTag) > -1) {
                  $.each(that.panel.mapping.polygons.features, function (index, value) {
                    var property = value.properties[that.panel.polygons.GeoJSONKey];
                    if (target.indexOf(property) > -1) {
                      that.panel.mapping.polygons.features[index].properties.choropleth = row.datapoints[0][0];
                      return false;
                    }
                  });
                }
              });
            }
            this.redraw();
          }
        }, {
          key: 'onDataError',
          value: function onDataError(err) {
            this.onDataReceived([]);
          }
        }, {
          key: 'onPanelTeardown',
          value: function onPanelTeardown() {
            if (this.map) this.map.remove();
          }
        }, {
          key: 'redraw',
          value: function redraw() {
            if (this.map) {
              this.map.drawPolygons();
            } else {
              this.render();
            }
          }
        }, {
          key: 'link',
          value: function link(scope, elem, attrs, ctrl) {
            mapRenderer(scope, elem, attrs, ctrl);
          }
        }]);

        return LeafletChoroplethCtrl;
      }(MetricsPanelCtrl));

      _export('LeafletChoroplethCtrl', LeafletChoroplethCtrl);

      LeafletChoroplethCtrl.templateUrl = 'module.html';
    }
  };
});
//# sourceMappingURL=leaflet_choropleth_ctrl.js.map
