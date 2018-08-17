import { Template } from 'meteor/templating';
import pluralize from 'pluralize';
import invoke from 'lodash.invoke';
import { _ } from 'meteor/underscore';
import { swal } from 'meteor/plio:bootstrap-sweetalert';

import { ProblemTypes } from '/imports/share/constants.js';
import { ALERT_AUTOHIDE_TIME } from '/imports/api/constants';
import { getTzTargetDate } from '/imports/share/helpers';
import { flattenObjects, inspire } from '/imports/api/helpers';
import { NonConformities } from '/imports/share/collections/non-conformities.js';
import { Risks } from '/imports/share/collections/risks.js';
import {
  insert,
  update,
  remove,
  complete,
  verify,
  undoCompletion,
  undoVerification,
  linkDocument,
  unlinkDocument,
  setCompletionDate,
  setCompletionExecutor,
  setVerificationDate,
  setVerificationExecutor,
} from '/imports/api/actions/methods';

const getLinks = instance => inspire(['documentId', 'documentType'], instance);

const getMethods = (instance) => {
  const methodsRefs = [
    'insertFn', 'updateFn', 'removeFn', 'completeFn', 'verifyFn', 'undoCompletionFn',
    'undoVerificationFn', 'linkDocumentFn', 'unlinkDocumentFn', 'updateCompletionDateFn',
    'updateCompletionExecutorFn', 'updateVerificationDateFn', 'updateVerificationExecutorFn',
  ];

  const methods = flattenObjects(methodsRefs.map(ref =>
    ({ [ref]: instance[ref.replace('Fn', '')].bind(instance) })));

  return methods;
};


Template.Subcards_Actions_Edit.viewmodel({
  mixin: ['modal', 'addForm', 'organization', 'date', 'actionStatus', 'workInbox', 'utils'],
  type: '',
  isEditOnly: false,
  label() {
    return this._getNameByType(this.type());
  },
  wrapperArgs() {
    const items = Object.assign([], invoke(this.actions(), 'fetch'));
    const docType = this.lowercase(this.label());

    return {
      items,
      renderContentOnInitial: !(items.length > 5),
      onAdd: this.onAdd.bind(this),
      getSubcardArgs: this.getSubcardArgs.bind(this),
      textToReplaceAddButton: `To add a ${docType}, go to either the Non-conformities or Risks` +
        'screen and add it to a Nonconformity or Risk record first',
      ...inspire(['addText', '_lText', '_rText', 'isEditOnly'], this),
    };
  },
  getSubcardArgs(doc) {
    return {
      doc,
      _id: doc._id,
      action: doc,
      isLinkedToEditable: true,
      _lText: this.lText(doc),
      _rText: this.rText(doc),
      content: 'Actions_EditSubcard',
      ...getMethods(this),
      ...inspire(['type', 'standardId'], this),
    };
  },
  addText() {
    const name = this.lowercase(this.label());
    return `Add ${name}`;
  },
  _lText() {
    return pluralize(this.label());
  },
  _rText() {
    const actions = this.actions().fetch();
    const amber = actions.filter(({ status }) => [2, 5].includes(status));
    const red = actions.filter(({ status }) => [3, 6, 7].includes(status));
    const count = array => array.length || '';
    const generateHtml = (array, color) => (count(array)
      ? `<i class="fa fa-circle text-${color} margin-left"></i>`
      : '');

    return `${generateHtml(amber, 'warning')}
            ${generateHtml(red, 'danger')}
            <span class="hidden-xs-down">${count(actions)}</span>`;
  },
  lText({ sequentialId, title }) {
    return `<strong>${sequentialId}</strong> ${title}`;
  },
  rText({
    isCompleted, completedAt, completionTargetDate, status,
  }) {
    let date = (isCompleted && completedAt) ? completedAt : completionTargetDate;
    date = this.renderDate(date);

    const indicatorClass = this.getClassByStatus(status);

    return `<span class="hidden-xs-down">${date}</span>
      <i class="fa fa-circle text-${indicatorClass} margin-left"></i>`;
  },
  newSubcardTitle() {
    const name = this.lowercase(this.label());
    return `New ${name}`;
  },
  actions() {
    const actionType = this.type();
    const query = {
      type: actionType,
    };

    const { documentId, documentType } = getLinks(this);
    const standardId = this.standardId && this.standardId();

    if (documentId && documentType) {
      _.extend(query, {
        'linkedTo.documentId': documentId,
        'linkedTo.documentType': documentType,
      });
    } else if (standardId) {
      const NCsIds = _.pluck(
        NonConformities.find({ standardsIds: standardId }).fetch(),
        '_id',
      );

      const risksIds = _.pluck(
        Risks.find({ standardsIds: standardId }).fetch(),
        '_id',
      );

      _.extend(query, {
        $or: [{
          'linkedTo.documentId': { $in: NCsIds },
          'linkedTo.documentType': ProblemTypes.NON_CONFORMITY,
        }, {
          'linkedTo.documentId': { $in: risksIds },
          'linkedTo.documentType': ProblemTypes.RISK,
        }],
      });
    }

    return this._getActionsByQuery(query, { sort: { sequentialId: 1 } });
  },
  onAdd(add) {
    return add(
      'Subcard',
      {
        content: 'Actions_AddSubcard',
        _lText: `New ${this.lowercase(this.label())}`,
        isNew: false,
        ..._.pick(getMethods(this), 'insertFn', 'updateFn', 'removeFn'),
        ...inspire(['type'], this),
        ...(() => {
          let data = {};
          const links = getLinks(this);
          const standardId = invoke(this, 'standardId');

          if (standardId) {
            data = { ...data, standardId };
          }

          if (_.values(links).every(_.identity)) {
            data = {
              ...data,
              ...links,
              linkedTo: [links],
            };
          }

          return data;
        })(),
      },
    );
  },
  insert({
    _id, linkTo, completionTargetDate, ...args
  }, cb) {
    if (_id) {
      let documentId;
      let documentType;

      if (_.isObject(linkTo)) {
        ({ documentId, documentType } = linkTo);
      } else {
        documentId = this.documentId && this.documentId();
        documentType = this.documentType && this.documentType();
      }

      this.modal().callMethod(linkDocument, {
        _id, documentId, documentType,
      }, cb);
    } else {
      const organizationId = this.organizationId();

      const { timezone } = this.organization();
      const tzDate = getTzTargetDate(completionTargetDate, timezone);

      this.modal().callMethod(insert, {
        organizationId,
        type: this.type(),
        completionTargetDate: tzDate,
        ...args,
      }, cb);
    }
  },
  update({ ...args }, cb) {
    this.modal().callMethod(update, { ...args }, cb);
  },
  remove(viewmodel) {
    const _id = viewmodel._id && viewmodel._id();

    const { title } = viewmodel.getData();

    if (!_id) {
      return viewmodel.destroy();
    }

    return swal({
      title: 'Are you sure?',
      text: `The action "${title}" will be removed.`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Remove',
      closeOnConfirm: false,
    }, () => {
      const cb = (err) => {
        if (!err) {
          viewmodel.destroy();
          swal({
            title: 'Removed!',
            text: `The action "${title}" was removed successfully.`,
            type: 'success',
            timer: ALERT_AUTOHIDE_TIME,
            showConfirmButton: false,
          });
        }
      };

      this.modal().callMethod(remove, { _id }, cb);
    });
  },
  complete({ ...args }, cb) {
    this.modal().callMethod(complete, { ...args }, cb);
  },
  undoCompletion({ ...args }, cb) {
    this.modal().callMethod(undoCompletion, { ...args }, cb);
  },
  verify({ ...args }, cb) {
    this.modal().callMethod(verify, { ...args }, cb);
  },
  undoVerification({ ...args }, cb) {
    this.modal().callMethod(undoVerification, { ...args }, cb);
  },
  linkDocument({ ...args }, cb) {
    this.modal().callMethod(linkDocument, { ...args }, cb);
  },
  unlinkDocument({ ...args }, cb) {
    this.modal().callMethod(unlinkDocument, { ...args }, cb);
  },
  updateCompletionDate({ targetDate, ...args }, cb) {
    const { timezone } = this.organization();
    const tzDate = getTzTargetDate(targetDate, timezone);

    this.modal().callMethod(setCompletionDate, {
      targetDate: tzDate,
      ...args,
    }, cb);
  },
  updateCompletionExecutor({ ...args }, cb) {
    this.modal().callMethod(setCompletionExecutor, { ...args }, cb);
  },
  updateVerificationDate({ targetDate, ...args }, cb) {
    const { timezone } = this.organization();
    const tzDate = getTzTargetDate(targetDate, timezone);

    this.modal().callMethod(setVerificationDate, {
      targetDate: tzDate,
      ...args,
    }, cb);
  },
  updateVerificationExecutor({ ...args }, cb) {
    this.modal().callMethod(setVerificationExecutor, { ...args }, cb);
  },
});
