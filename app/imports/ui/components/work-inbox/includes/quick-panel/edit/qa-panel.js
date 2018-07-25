import { Template } from 'meteor/templating';

import { chain } from '/imports/api/helpers';
import { ALERT_AUTOHIDE_TIME } from '/imports/api/constants';

Template.WorkInbox_QAPanel_Edit.viewmodel({
  mixin: ['modal', 'utils'],
  content: 'Actions_QAPanel_Edit_Complete',
  doc: '',
  operation: 'completed',
  typeText: 'Action',
  update(method, { ...args }, cb = () => {}) {
    const { linkedDoc: { _id, type } = {} } = this.doc() || {};

    const callback = (err) => {
      if (!err) {
        swal({
          title: this.capitalize(this.operation()),
          text: `${this.typeText()} was ${this.operation()} successfully.`,
          type: 'success',
          timer: ALERT_AUTOHIDE_TIME,
          showConfirmButton: false,
        });

        this.modal().close();
      }
    };

    this.modal().callMethod(method, { _id, ...args }, callback);
  },
});
