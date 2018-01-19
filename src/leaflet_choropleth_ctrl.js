import {PanelCtrl} from 'app/plugins/sdk';
import moment from 'moment';
import _ from 'lodash';
import $ from 'jquery';

const panelDefaults = {
  polygonsHotColor: "rgb(255, 0, 0)",
  polygonsColdColor: "rgb(0, 0, 255)",
  polygonsEndpoint:  null,
};

export class LeafletChoroplethCtrl extends PanelCtrl {
  constructor($scope, $injector) {
    super($scope, $injector);
    _.defaultsDeep(this.panel, panelDefaults);
    this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
    // this.events.on('data-received', this.onDataReceived.bind(this));
    // this.events.on('data-error', this.onDataError.bind(this));
    // this.events.on('data-snapshot-load', this.onDataReceived.bind(this));
    this.updateMap();
  }

  updateMap() {
    this.time = moment().format('hh:mm:ss');
    this.$timeout(() => { this.updateMap(); }, 1000);
  }

  onInitEditMode() {
    this.addEditorTab('Polygon Options', 'public/plugins/leaflet-choropleth-panel/editor.html', 2);
  }

  onDataReceived(dataList) {
  }

  onDataError(err) {
    this.onDataReceived([]);
  }
}

LeafletChoroplethCtrl.templateUrl = 'module.html';