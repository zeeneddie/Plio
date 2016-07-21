import { Template } from 'meteor/templating';

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

Template.Actions_Edit.viewmodel({
  mixin: ['organization', 'action', 'modal', 'callWithFocusCheck', 'router', 'collapsing', 'utils'],
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
    return ({ ...args }, cb) => this.callUpdate(complete, { ...args }, this.generateCallback('My completed actions', cb));
  },
  getUndoCompletionFn() {
    return (e) => this.callUpdate(undoCompletion, {}, this.generateCallback('My current actions'));
  },
  getVerifyFn() {
    return ({ ...args }, cb) => this.callUpdate(verify, { ...args }, this.generateCallback('My completed actions', cb));
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
      this.callUpdate(setCompletionDate, { targetDate }, cb);
    };
  },
  getUpdateVerificationDateFn() {
    return ({ targetDate }, cb) => {
      this.callUpdate(setVerificationDate, { targetDate }, cb);
    };
  },
  generateCallback(queryParam, cb = () => {}) {
    const _id = this._id();

    return (err) => {
      if (!err && FlowRouter.getQueryParam('by') !== queryParam) {
        FlowRouter.setQueryParams({ by: queryParam });
        Meteor.setTimeout(() => {
          this.goToAction(_id);
          this.expandCollapsed(_id);
          cb(undefined);
        }, 100);
      } else {
        return cb(err);
      }
    }
  }
});
