import {PanelCtrl} from 'app/plugins/sdk';
import moment from 'moment';
import _ from 'lodash';
import $ from 'jquery';

import mapRenderer from './map_renderer';

const panelDefaults = {
  polygons: {
    hotColor: "rgb(255, 0, 0)",
    coldColor: "rgb(0, 0, 255)",
    endpoint:  null
  },
  mapping: {
    height: 700,
    initialZoom:1
  }
};

export class LeafletChoroplethCtrl extends PanelCtrl {
  constructor($scope, $injector) {
    super($scope, $injector);
    _.defaultsDeep(this.panel, panelDefaults);
    this.panel.mapping.id = 'mapid_' + this.panel.id;
    this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
    // this.events.on('data-received', this.onDataReceived.bind(this));
    // this.events.on('data-error', this.onDataError.bind(this));
    // this.events.on('data-snapshot-load', this.onDataReceived.bind(this));
    // this.events.on('render', this.onRender.bind(this));
    this.events.on('panel-teardown', this.onPanelTeardown.bind(this));
    this.fetchPolygons()
  }

  fetchPolygons() {
    if (this.panel.polygons.endpoint) {
      var that = this;
      window.$.ajax({
        url: that.panel.polygons.endpoint,
        type: "GET",
        dataType: "json",
        contentType: "application/json",
        crossDomain: true,
        success: function(response) {
          that.panel.mapping.polygons = response;
          if (that.map) {
            that.map.drawPolygons();
          }
        },
        error: function(response) {
          console.log(response)
        },
      });
    }
    else {
      console.log('endpoint is not set');
    }
  }

  redrawPolygons() {
    if (this.polygons) {
      this.map
      console.log(this.polygons);
    }
  }

  onInitEditMode() {
    this.addEditorTab('Polygons Options', 'public/plugins/leaflet-choropleth-panel/polygons_editor.html', 2);
  }

  onDataReceived(dataList) {
  }

  onDataError(err) {
    this.onDataReceived([]);
  }

  onPanelTeardown() {
    if (this.map) this.map.remove();
  }

  link(scope, elem, attrs, ctrl) {
    mapRenderer(scope, elem, attrs, ctrl);
  }
}

LeafletChoroplethCtrl.templateUrl = 'module.html';