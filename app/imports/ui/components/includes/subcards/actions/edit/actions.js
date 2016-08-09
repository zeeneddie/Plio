import { Template } from 'meteor/templating';
import pluralize from 'pluralize';
import moment from 'moment-timezone';

import { ActionTypes, ProblemTypes } from '/imports/api/constants.js';
import { getTzTargetDate } from '/imports/api/helpers.js';
import { NonConformities } from '/imports/api/non-conformities/non-conformities.js';
import { Risks } from '/imports/api/risks/risks.js';
import {
  insert,
  update,
  remove,
  complete,
  verify,
  undoCompletion,
  undoVerification,
  linkStandard,
  unlinkStandard,
  linkDocument,
  unlinkDocument,
  setCompletionDate,
  setCompletionExecutor,
  setVerificationDate,
  setVerificationExecutor
} from '/imports/api/actions/methods.js';


Template.Subcards_Actions_Edit.viewmodel({
  mixin: ['modal', 'addForm', 'organization', 'date', 'actionStatus', 'workInbox', 'utils'],
  type: '',
  title() {
    return pluralize(this._getNameByType(this.type()));
  },
  addButtonText() {
    const name = this.lowercase(this._getNameByType(this.type()));
    return `Add ${name}`;
  },
  actionsIndicators() {
    const actions = this.actions().fetch();
    const amber = actions.filter(({ status }) => [2, 5].includes(status));
    const red = actions.filter(({ status }) => [3, 6, 7].includes(status));
    const count = array => array.length > 0 ? array.length : '';
    const generateHtml = (array, color) => count(array) ? `<span class="hidden-xs-down">${count(array)}</span>
                                                           <i class="fa fa-circle text-${color} margin-left"></i> `
                                                        :  '';

    return generateHtml(amber, 'warning') + generateHtml(red, 'danger');
  },
  lText({ sequentialId, title }) {
    return `<strong>${sequentialId}</strong> ${title}`;
  },
  rText({ isCompleted, completedAt, completionTargetDate, status }) {
    let date = (isCompleted && completedAt) ? completedAt : completionTargetDate;
    date = this.renderDate(date);

    let indicatorClass = this.getClassByStatus(status);

    return `<span class="hidden-xs-down">${date}</span>
           <i class="fa fa-circle text-${indicatorClass} margin-left"></i>`;
  },
  newSubcardTitle() {
    const name = this.lowercase(this._getNameByType(this.type()));
    return `New ${name}`;
  },
  actions() {
    const actionType = this.type();
    const query = {
      type: actionType
    };

    const documentId = this.documentId && this.documentId();
    const documentType = this.documentType && this.documentType();
    const standardId = this.standardId && this.standardId();

    if (documentId && documentType) {
      _.extend(query, {
        'linkedTo.documentId': documentId,
        'linkedTo.documentType': documentType
      });
    } else if (standardId) {
      const NCsIds = _.pluck(
        NonConformities.find({ standardsIds: standardId }).fetch(),
        '_id'
      );

      const risksIds = _.pluck(
        Risks.find({ standardsIds: standardId }).fetch(),
        '_id'
      );

      _.extend(query, {
        $or: [{
          'linkedTo.documentId': { $in: NCsIds },
          'linkedTo.documentType': ProblemTypes.NC
        }, {
          'linkedTo.documentId': { $in: risksIds },
          'linkedTo.documentType': ProblemTypes.RISK
        }]
      });
    }

    return this._getActionsByQuery(query, { sort: { sequentialId: 1 } });
  },
  addAction() {
    const newSubcardData = {
      content: 'Actions_AddSubcard',
      _lText: this.newSubcardTitle(),
      type: this.type(),
      insertFn: this.insertFn(),
      removeFn: this.removeFn(),
      updateFn: this.updateFn()
    };

    const documentId = this.documentId && this.documentId();
    const documentType = this.documentType && this.documentType();
    if (documentId && documentType) {
      _.extend(newSubcardData, {
        documentId,
        documentType,
        linkedTo: [{
          documentId: documentId,
          documentType: documentType
        }]
      });
    }

    const standardId = this.standardId && this.standardId();
    if (standardId) {
      _.extend(newSubcardData, { standardId });
    }

    this.addForm('Subcard', newSubcardData);
  },
  insertFn() {
    return this.insert.bind(this);
  },
  insert({ _id, linkTo, completionTargetDate, ...args }, cb) {
    if (_id) {
      let documentId, documentType;

      if (_.isObject(linkTo)) {
        documentId = linkTo.documentId;
        documentType = linkTo.documentType;
      } else {
        documentId = this.documentId && this.documentId();
        documentType = this.documentType && this.documentType();
      }

      this.modal().callMethod(linkDocument, {
        _id, documentId, documentType
      }, cb);
    } else {
      const organizationId = this.organizationId();

      const { timezone } = this.organization();
      const tzDate = getTzTargetDate(completionTargetDate, timezone);

      this.modal().callMethod(insert, {
        organizationId,
        type: this.type(),
        completionTargetDate: tzDate,
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
  linkDocumentFn() {
    return this.linkDocument.bind(this);
  },
  linkDocument({ ...args }, cb) {
    this.modal().callMethod(linkDocument, { ...args }, cb);
  },
  unlinkDocumentFn() {
    return this.unlinkDocument.bind(this);
  },
  unlinkDocument({ ...args }, cb) {
    this.modal().callMethod(unlinkDocument, { ...args }, cb);
  },
  updateCompletionDateFn() {
    return this.updateCompletionDate.bind(this);
  },
  updateCompletionDate({ targetDate, ...args }, cb) {
    const { timezone } = this.organization();
    const tzDate = getTzTargetDate(targetDate, timezone);

    this.modal().callMethod(setCompletionDate, {
      targetDate: tzDate,
      ...args
    }, cb);
  },
  updateCompletionExecutorFn() {
    return this.updateCompletionExecutor.bind(this);
  },
  updateCompletionExecutor({ ...args }, cb) {
    this.modal().callMethod(setCompletionExecutor, { ...args }, cb);
  },
  updateVerificationDateFn() {
    return this.updateVerificationDate.bind(this);
  },
  updateVerificationDate({ targetDate, ...args }, cb) {
    const { timezone } = this.organization();
    const tzDate = getTzTargetDate(targetDate, timezone);

    this.modal().callMethod(setVerificationDate, {
      targetDate: tzDate,
      ...args
    }, cb);
  },
  updateVerificationExecutorFn() {
    return this.updateVerificationExecutor.bind(this);
  },
  updateVerificationExecutor({ ...args }, cb) {
    this.modal().callMethod(setVerificationExecutor, { ...args }, cb);
  },
});
