import { Template } from 'meteor/templating';
import { AnalysisStatuses } from '/imports/api/constants.js';

Template.NCRCAStatus.viewmodel({
  status: 0,
  getStatus() {
    return this.status() || 0;
  },
  statuses() {
    return _.keys(AnalysisStatuses).map(status => ({ value: parseInt(status, 10), text: AnalysisStatuses[status] }) );
  },
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(viewmodel) {
    const { value:status } = viewmodel.getData();

    if (status === this.templateInstance.data.status) return;

    this.status(status);

    this.parent().update({ 'analysis.status': parseInt(status, 10) });
  }
});
