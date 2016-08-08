import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

import { AnalysisStatuses } from '/imports/api/constants.js';

Template.RCA_Status_Edit.viewmodel({
  status: 0,
  executor: '',
  completionComments: '',
  label: 'Status',
  placeholder: 'Comments',
  isCompleteButtonShown: false,
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
  onComplete() {},
  complete() {
    const { completionComments, status } = this.data();
    const savedStatus = this.templateInstance.data.status;

    if (status === savedStatus) return;

    const cb = err => err && this.status(savedStatus);

    this.onComplete({ completionComments }, cb);
  },
  onUndo() {},
  onSelectCb() {
    return this.select.bind(this);
  },
  select(viewmodel) {
    const { value:statusValue } = viewmodel.getData();
    const savedStatus = this.templateInstance.data.status;
    const status = parseInt(statusValue, 10);

    this.status(status);

    if (status === 0 && status !== savedStatus) {
      const cb = err => err && this.status(savedStatus);
      return this.onUndo(cb);
    }
  },
  onCommentsUpdate() {},
  updateComments() {
    const { completionComments } = this.data();

    if (this.isCompleteButtonShown() || completionComments === this.templateInstance.data.completionComments) return;

    this.onCommentsUpdate({ completionComments });
  }
});
