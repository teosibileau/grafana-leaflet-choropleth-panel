import {PanelCtrl} from 'app/plugins/sdk';
import moment from 'moment';
import _ from 'lodash';
import $ from 'jquery';

export class LeafletChoroplethCtrl extends PanelCtrl {
  constructor($scope, $injector) {
    super($scope, $injector);
    this.events.on('data-received', this.onDataReceived.bind(this));
    this.events.on('data-error', this.onDataError.bind(this));
    this.events.on('data-snapshot-load', this.onDataReceived.bind(this));
    this.updateClock();
  }

  updateClock() {
    this.time = moment().format('hh:mm:ss');
    this.$timeout(() => { this.updateClock(); }, 1000);
  }

  onDataReceived(dataList) {

  }

  onDataError(err) {
    this.onDataReceived([]);
  }
}

LeafletChoroplethCtrl.templateUrl = 'module.html';