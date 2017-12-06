import { Template } from 'meteor/templating';
import { ViewModel } from 'meteor/manuel:viewmodel';

import { StandardStatuses } from '/imports/share/constants.js';

Template.StandardStatus_Edit.viewmodel({
  status: 'issued',
  statuses() {
    return _.keys(StandardStatuses).map(status => ({ value: status, text: StandardStatuses[status] }));
  },
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(viewmodel) {
    const { value: status } = viewmodel.getData();

    if (status === this.templateInstance.data.status) return;

    this.status(status);

    if (!this._id) return;

    if (!status) {
      ViewModel.findOne('ModalWindow').setError('Status is required!');
      return;
    }

    this.parent().update({ status });
  },
  getData() {
    const { status } = this.data();
    return { status };
  },
});
