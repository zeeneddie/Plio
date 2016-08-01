import { Template } from 'meteor/templating';
import moment from 'moment-timezone';

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
  setVerificationDate
} from '/imports/api/actions/methods.js';
import { getTzTargetDate } from '/imports/api/helpers.js';

Template.Actions_Edit.viewmodel({
  mixin: ['organization', 'workInbox', 'modal', 'callWithFocusCheck', 'router', 'collapsing', 'utils'],
  isLinkedToEditable: true,
  action() {
    return this._getActionByQuery({ _id: this._id() });
  },
  isCompletionEditable(isVerified) {
    return !isVerified;
  },
  slingshotDirective: 'actionsFiles',
  uploaderMetaContext() {
    return {
      organizationId: this.organizationId(),
      action: this._id()
    };
  },
  callUpdate(method, args = {}, cb = () => {}) {
    const _id = this._id();
    this.modal().callMethod(method, { _id, ...args }, cb);
  },
  onUpdateNotifyUserCb() {
    return this.onUpdateNotifyUser.bind(this);
  },
  onUpdateNotifyUser({ query, options }, cb) {
    return this.update({ query, options }, cb);
  },
  onUpdateCb() {
    return this.update.bind(this);
  },
  update({ query = {}, options = {}, e = {}, withFocusCheck = false, ...args }, cb = () => {}) {

    const updateFn = () => this.callUpdate(update, { query, options, ...args }, cb);

    if (withFocusCheck) {
      this.callWithFocusCheck(e, updateFn);
    } else {
      updateFn();
    }
  },
  getCompleteFn() {
    return ({ ...args }, cb) => this.callUpdate(complete, { ...args }, cb);
  },
  getUndoCompletionFn() {
    return (e) => this.callUpdate(undoCompletion, {}, cb);
  },
  getVerifyFn() {
    return ({ ...args }, cb) => this.callUpdate(verify, { ...args }, cb);
  },
  getUndoVerificationFn() {
    return (e) => this.callUpdate(undoVerification);
  },
  getLinkStandardFn() {
    return ({ standardId }, cb) => {
      this.callUpdate(linkStandard, { standardId }, cb);
    };
  },
  getUnlinkStandardFn() {
    return ({ standardId }, cb) => {
      this.callUpdate(unlinkStandard, { standardId }, cb);
    };
  },
  getLinkDocumentFn() {
    return ({ documentId, documentType }, cb) => {
      this.callUpdate(linkDocument, { documentId, documentType }, cb);
    };
  },
  getUnlinkDocumentFn() {
    return ({ documentId, documentType }, cb) => {
      this.callUpdate(unlinkDocument, { documentId, documentType }, cb);
    };
  },
  getUpdateCompletionDateFn() {
    return ({ targetDate }, cb) => {
      const { timezone } = this.organization();
      const tzDate = getTzTargetDate(targetDate, timezone);

      this.callUpdate(setCompletionDate, { targetDate: tzDate }, cb);
    };
  },
  getUpdateVerificationDateFn() {
    return ({ targetDate }, cb) => {
      const { timezone } = this.organization();
      const tzDate = getTzTargetDate(targetDate, timezone);

      this.callUpdate(setVerificationDate, { targetDate: tzDate }, cb);
    };
  },
  remove() {
    const { title } = this.action();
    const _id = this._id();

    swal(
      {
        title: 'Are you sure?',
        text: `An action "${title}" will be removed.`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Remove',
        closeOnConfirm: false
      },
      () => {
        this.modal().callMethod(remove, { _id }, (err) => {
          if (err) return;

          swal('Removed!', `An action "${title}" was removed successfully.`, 'success');

          this.modal().close();
        });
      }
    );
  }
});
