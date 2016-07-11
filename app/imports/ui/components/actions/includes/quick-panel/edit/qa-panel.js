import { Template } from 'meteor/templating';

import { update } from '/imports/api/actions/methods.js';

Template.Actions_QAPanel_Edit.viewmodel({
  mixin: ['modal', 'organization', 'action', 'utils'],
  content: 'Actions_QAPanel_Edit_Complete',
  _id: '',
  action() {
    return this._getActionByQuery({ _id: this._id() });
  },
  getOperation() {
    const operationType = _.last(this.content().split('_'));
    return this.chooseOne(operationType === 'Complete')('Completed', 'Verified');
  },
  update(method, { ...args }, cb = () => {}) {
    const _id = this._id();
    const callback = (err) => {
      if (!err) {
        const { sequentialId, title } = this.action() || {};
        const operation = this.getOperation();
        if (!err) {
          swal(
            operation,
            `Action "${sequentialId} ${title}" was ${this.lowercase(operation)} successfully.`,
            'success'
          );

          this.modal().close();
        }

        cb(err);
      }
    };

    this.modal().callMethod(method, { _id, ...args }, callback);
  }
});
