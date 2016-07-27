import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

import { AnalysisStatuses } from '/imports/api/constants.js';

Template.NC_RCA_Status_Edit.viewmodel({
  status: 0,
  executor: '',
  label: 'Status',
  isSelectedExecutor() {
    return this.executor() === Meteor.userId();
  },
  getStatusValue() {
    return this.status() || 0;
  },
  getStatus() {
    return AnalysisStatuses[this.getStatusValue().toString()];
  },
  getClassByStatus() {
    return this.getStatusValue() === 1 ? 'text-success' : 'text-warning';
  },
  statuses() {
    return _.keys(AnalysisStatuses).map(status => ({ value: parseInt(status, 10), text: AnalysisStatuses[status] }) );
  },
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(viewmodel) {
    const { value:statusValue } = viewmodel.getData();

    const status = parseInt(statusValue, 10);
    const savedStatus = this.templateInstance.data.status;

    if (status === savedStatus) {
      return;
    }

    this.status(status);

    const cb = err => err && this.status(savedStatus);

    if (status === 1) {
      this.onComplete(cb);
    } else if (status === 0) {
      this.onUndo(cb);
    }
  }
});
