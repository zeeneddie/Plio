import { Template } from 'meteor/templating';

import { ActionTypes } from '/imports/api/constants.js';
import {
  insert,
  update,
  remove,
  complete,
  verify,
  undoCompletion,
  undoVerification
} from '/imports/api/actions/methods.js';


Template.Subcards_Actions_Edit.viewmodel({
  mixin: ['modal', 'addForm', 'organization', 'date', 'actionStatus', 'action'],
  type: '',
  title() {
    return this._getNameByType(this.type());
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
  lText(action) {
    const { sequentialId, title } = action;
    return `<strong>${sequentialId}</strong> ${title}`;
  },
  rText(action) {
    const { isCompleted, completedAt, completionTargetDate, status } = action;

    let date = (isCompleted && completedAt) ? completedAt : completionTargetDate;
    date = this.renderDate(date);

    let indicatorClass = this.getClassByStatus(status);

    return `<span class="hidden-xs-down">${date}</span>
           <i class="fa fa-circle text-${indicatorClass} margin-left"></i>`;
  },
  actions() {
    return this._getActionsByQuery({
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
  // ignore linkedTo that comes from subcomponent
  insert({ linkedTo, ...args }, cb) {
    const organizationId = this.organizationId();

    this.modal().callMethod(insert, {
      organizationId,
      linkedTo: [{
        documentId: this.documentId(),
        documentType: this.documentType()
      }],
      type: this.type(),
      ...args
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
  onComplete() {
    return () => {
      this.child('SubCardEdit').callUpdate(this.completeFn, {
        _id: this._id()
      });
    };
  },
  completeFn() {
    return this.complete.bind(this);
  },
  complete({ ...args }, cb) {
    this.modal().callMethod(complete, { ...args }, cb);
  },
  onUndoCompletion() {
    return () => {
      this.child('SubCardEdit').callUpdate(this.undoCompletionFn, {
        _id: this._id()
      });
    };
  },
  undoCompletionFn() {
    return this.undoCompletion.bind(this);
  },
  undoCompletion({ ...args }, cb) {
    this.modal().callMethod(undoCompletion, { ...args }, cb);
  },
  onVerify() {
    return () => {
      this.child('SubCardEdit').callUpdate(this.verifyFn, {
        _id: this._id()
      });
    };
  },
  verifyFn() {
    return this.verify.bind(this);
  },
  verify({ ...args }, cb) {
    this.modal().callMethod(verify, { ...args }, cb);
  },
  onUndoVerification() {
    return () => {
      this.child('SubCardEdit').callUpdate(this.undoVerificationFn, {
        _id: this._id()
      });
    };
  },
  undoVerificationFn() {
    return this.undoVerification.bind(this);
  },
  undoVerification({ ...args }, cb) {
    this.modal().callMethod(undoVerification, { ...args }, cb);
  }
});
