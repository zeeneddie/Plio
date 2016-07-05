import { Template } from 'meteor/templating';
import pluralize from 'pluralize';

import { ActionTypes } from '/imports/api/constants.js';
import {
  insert,
  update,
  remove,
  linkProblem,
  complete,
  verify,
  undoCompletion,
  undoVerification,
  linkStandard,
  unlinkStandard
} from '/imports/api/actions/methods.js';


Template.Subcards_Actions_Edit.viewmodel({
  mixin: ['modal', 'addForm', 'organization', 'date', 'actionStatus', 'action'],
  type: '',
  title() {
    return pluralize(this._getNameByType(this.type()));
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
  newSubcardTitle() {
    let newSubcardTitle = '';
    switch (this.type()) {
      case ActionTypes.CORRECTIVE_ACTION:
        newSubcardTitle = 'New corrective action';
        break;
      case ActionTypes.PREVENTATIVE_ACTION:
        newSubcardTitle = 'New preventative action';
        break;
      case ActionTypes.RISK_CONTROL:
        newSubcardTitle = 'New risk control';
        break;
    }
    return newSubcardTitle;
  },
  actions() {
    return this._getActionsByQuery({
      type: this.type(),
      'linkedProblems.problemId': this.documentId(),
      'linkedProblems.problemType': this.documentType()
    }, {
      sort: { sequentialId: 1 }
    });
  },
  linkedDocs(action) {
    if (action) {
      return _.map(action.getLinkedDocuments(), (doc) => {
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
        content: 'Actions_AddSubcard',
        _lText: this.newSubcardTitle(),
        linkedStandardsIds: [this.standardId()],
        linkedDocs: this.linkedDocs(),
        type: this.type(),
        documentId: this.documentId(),
        documentType: this.documentType(),
        insertFn: this.insertFn(),
        removeFn: this.removeFn(),
        updateFn: this.updateFn()
      }
    );
  },
  insertFn() {
    return this.insert.bind(this);
  },
  insert({ _id, ...args }, cb) {
    if (_id) {
      this.modal().callMethod(linkProblem, {
        _id,
        problemId: this.documentId(),
        problemType: this.documentType()
      }, cb);
    } else {
      const organizationId = this.organizationId();

      this.modal().callMethod(insert, {
        organizationId,
        linkedProblems: [{
          problemId: this.documentId(),
          problemType: this.documentType()
        }],
        type: this.type(),
        ...args
      }, cb);
    }
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
  completeFn() {
    return this.complete.bind(this);
  },
  complete({ ...args }, cb) {
    this.modal().callMethod(complete, { ...args }, cb);
  },
  undoCompletionFn() {
    return this.undoCompletion.bind(this);
  },
  undoCompletion({ ...args }, cb) {
    this.modal().callMethod(undoCompletion, { ...args }, cb);
  },
  verifyFn() {
    return this.verify.bind(this);
  },
  verify({ ...args }, cb) {
    this.modal().callMethod(verify, { ...args }, cb);
  },
  undoVerificationFn() {
    return this.undoVerification.bind(this);
  },
  undoVerification({ ...args }, cb) {
    this.modal().callMethod(undoVerification, { ...args }, cb);
  },
  linkStandardFn() {
    return this.linkStandard.bind(this);
  },
  linkStandard({ ...args }, cb) {
    this.modal().callMethod(linkStandard, { ...args }, cb);
  },
  unlinkStandardFn() {
    return this.unlinkStandard.bind(this);
  },
  unlinkStandard({ ...args }, cb) {
    this.modal().callMethod(unlinkStandard, { ...args }, cb);
  }
});
