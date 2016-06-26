import { Template } from 'meteor/templating';

import { ActionTypes } from '/imports/api/constants.js';
import { Actions } from '/imports/api/actions/actions.js';
import { insert, update, remove } from '/imports/api/actions/methods.js';


Template.Subcards_Actions_Edit.viewmodel({
  mixin: ['collapse', 'modal', 'addForm', 'organization'],
  type: '',
  title() {
    let title = '';
    switch (this.type()) {
      case ActionTypes.CORRECTIVE_ACTION:
        title = 'Corrective actions';
        break;
      case ActionTypes.PREVENTATIVE_ACTION:
        title = 'Preventative actions';
        break;
      case ActionTypes.RISK_CONTROL:
        title = 'Risk controls';
        break;
    }
    return title;
  },
  addButtonText() {
    let buttonText = '';
    switch (this.type()) {
      case ActionTypes.CORRECTIVE_ACTION:
        buttonText = 'Add corrective action';
        break;
      case ActionTypes.PREVENTATIVE_ACTION:
        buttonText = 'Add preventative action';
        break;
      case ActionTypes.RISK_CONTROL:
        buttonText = 'Add risk control';
        break;
    }
    return buttonText;
  },
  actionCardTitle() {
    const { sequentialId, title } = Template.currentData();
    return `<strong>${sequentialId}</strong> ${title}`;
  },
  actions() {
    return Actions.find({
      type: this.type(),
      'linkedTo.documentId': this.documentId(),
      'linkedTo.documentType': this.documentType()
    });
  },
  linkedDocs(action) {
    if (action) {
      return _.map(action.linkedDocuments(), (doc) => {
        const { sequentialId, title } = doc;
        return { sequentialId, title };
      });
    } else {
      return [{
        sequentialId: this.linkedToId(),
        title: this.linkedTo()
      }];
    }
  },
  addAction() {
    this.addForm(
      'SubCardEdit',
      {
        content: 'Actions_Create',
        linkedDocs: this.linkedDocs(),
        insertFn: this.insertFn(),
        removeFn: this.removeFn(),
        updateFn: this.updateFn()
      }
    );
  },
  insertFn() {
    return this.insert.bind(this);
  },
  insert({ ...args }, cb) {
    const organizationId = this.organizationId();

    this.modal().callMethod(insert, {
      organizationId, ...args
    }, cb);
  },
  updateFn() {
    return this.update.bind(this);
  },
  update({ ...args }, cb) {
    this.modal().callMethod(update, { ...args }, cb);
  },
  remove(viewmodel) {
    const _id = viewmodel._id && viewmodel._id();

    const { title } = viewmodel.getData();

    if (!_id) {
      return viewmodel.destroy();
    } else {
      swal({
        title: 'Are you sure?',
        text: `The action "${title}" will be removed.`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Remove',
        closeOnConfirm: false
      }, () => {
        const cb = (err, res) => {
          if (!err) {
            viewmodel.destroy();
            swal(
              'Removed!',
              `The action "${title}" was removed successfully.`,
              'success'
            );
          }
        };

        this.modal().callMethod(remove, { _id }, cb);
      });
    }
  },
  removeFn() {
    return this.remove.bind(this);
  },
});
