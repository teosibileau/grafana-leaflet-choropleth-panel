import {MetricsPanelCtrl} from 'app/plugins/sdk';
import moment from 'moment';
import _ from 'lodash';
import $ from 'jquery';
import mapRenderer from './map_renderer';

const panelDefaults = {
  polygons: {
    hotColor: "rgb(255, 0, 0)",
    coldColor: "rgb(0, 0, 255)",
    endpoint:  null,
    GeoJSONKey: null,
    dataSourceTag: null,
  },
  mapping: {
    height: 700,
    initialZoom:1,
    polygons: null,
  },
  datasource: null
};

export class LeafletChoroplethCtrl extends MetricsPanelCtrl {
  constructor($scope, $injector) {
    super($scope, $injector);
    _.defaults(this.panel, panelDefaults);
    this.panel.mapping.id = 'mapid_' + this.panel.id;
    this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
    this.events.on('data-received', this.onDataReceived.bind(this));
    this.events.on('data-error', this.onDataError.bind(this));
    this.events.on('data-snapshot-load', this.onDataReceived.bind(this));
    this.events.on('panel-teardown', this.onPanelTeardown.bind(this));
  }

  updatePolygons() {
    this.panel.mapping.polygons = null;
    this.fetchPolygons();
  }

  fetchPolygons() {
    if (this.panel.polygons.endpoint) {
      if (!this.panel.mapping.polygons) {
        var that = this;
        window.$.ajax({
          url: that.panel.polygons.endpoint,
          type: "GET",
          dataType: "json",
          contentType: "application/json",
          crossDomain: true,
          success: function(response) {
            that.panel.mapping.polygons = response;
            $.each(that.panel.mapping.polygons.features, function(index, value) {
              that.panel.mapping.polygons.features[index].properties.choropleth = 0;
            });
            if (that.map) {
              that.map.drawPolygons();
            }
          },
          error: function(response) {
            console.log(response);
          },
        });
      }
      else {
        if (that.map) {
          that.map.drawPolygons();
        }
      }
    }
    else {
      console.log('endpoint is not set');
    }
  }

  onInitEditMode() {
    this.addEditorTab('Polygons Options', 'public/plugins/grafana-leaflet-choropleth-panel/polygons_editor.html', 2);
  }

  onDataReceived(dataList) {
    if (!dataList || !this.panel.mapping.polygons) return;

    var that = this;
    $.each(that.panel.mapping.polygons.features, function( index, value ) {
      that.panel.mapping.polygons.features[index].properties.choropleth = 0;
    });

    if (this.panel.polygons.GeoJSONKey && this.panel.polygons.dataSourceTag) {
      dataList.forEach((row) => {
        var target = row.target.substring(row.target.indexOf('{'));
        if (target.indexOf(this.panel.polygons.dataSourceTag) > -1) {
          $.each(that.panel.mapping.polygons.features, function( index, value ) {
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

  onDataError(err) {
    this.onDataReceived([]);
  }

  onPanelTeardown() {
    if (this.map) this.map.remove();
  }

  redraw() {
    if (this.map) {
      this.map.drawPolygons();
    }
    else {
      this.render();
    }
  }
  link(scope, elem, attrs, ctrl) {
    mapRenderer(scope, elem, attrs, ctrl);
  }
}

LeafletChoroplethCtrl.templateUrl = 'module.html';