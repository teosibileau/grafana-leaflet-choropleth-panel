'use strict';

System.register(['app/plugins/sdk', 'moment', 'lodash', 'jquery', './map_renderer'], function (_export, _context) {
  "use strict";

  var PanelCtrl, moment, _, $, mapRenderer, _createClass, panelDefaults, LeafletChoroplethCtrl;

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
      PanelCtrl = _appPluginsSdk.PanelCtrl;
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
          endpoint: null
        },
        mapping: {
          height: 700,
          initialZoom: 1
        }
      };

      _export('LeafletChoroplethCtrl', LeafletChoroplethCtrl = function (_PanelCtrl) {
        _inherits(LeafletChoroplethCtrl, _PanelCtrl);

        function LeafletChoroplethCtrl($scope, $injector) {
          _classCallCheck(this, LeafletChoroplethCtrl);

          var _this = _possibleConstructorReturn(this, (LeafletChoroplethCtrl.__proto__ || Object.getPrototypeOf(LeafletChoroplethCtrl)).call(this, $scope, $injector));

          _.defaultsDeep(_this.panel, panelDefaults);
          _this.panel.mapping.id = 'mapid_' + _this.panel.id;
          _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
          // this.events.on('data-received', this.onDataReceived.bind(this));
          // this.events.on('data-error', this.onDataError.bind(this));
          // this.events.on('data-snapshot-load', this.onDataReceived.bind(this));
          // this.events.on('render', this.onRender.bind(this));
          _this.events.on('panel-teardown', _this.onPanelTeardown.bind(_this));
          _this.fetchPolygons();
          return _this;
        }

        _createClass(LeafletChoroplethCtrl, [{
          key: 'fetchPolygons',
          value: function fetchPolygons() {
            if (this.panel.polygons.endpoint) {
              var that = this;
              window.$.ajax({
                url: that.panel.polygons.endpoint,
                type: "GET",
                dataType: "json",
                contentType: "application/json",
                crossDomain: true,
                success: function success(response) {
                  that.panel.mapping.polygons = response;
                  if (that.map) {
                    that.map.drawPolygons();
                  }
                },
                error: function error(response) {
                  console.log(response);
                }
              });
            } else {
              console.log('endpoint is not set');
            }
          }
        }, {
          key: 'redrawPolygons',
          value: function redrawPolygons() {
            if (this.polygons) {
              this.map;
              console.log(this.polygons);
            }
          }
        }, {
          key: 'onInitEditMode',
          value: function onInitEditMode() {
            this.addEditorTab('Polygons Options', 'public/plugins/leaflet-choropleth-panel/polygons_editor.html', 2);
          }
        }, {
          key: 'onDataReceived',
          value: function onDataReceived(dataList) {}
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
          key: 'link',
          value: function link(scope, elem, attrs, ctrl) {
            mapRenderer(scope, elem, attrs, ctrl);
          }
        }]);

        return LeafletChoroplethCtrl;
      }(PanelCtrl));

      _export('LeafletChoroplethCtrl', LeafletChoroplethCtrl);

      LeafletChoroplethCtrl.templateUrl = 'module.html';
    }
  };
});
//# sourceMappingURL=leaflet_choropleth_ctrl.js.map
