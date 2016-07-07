import { Template } from 'meteor/templating';

import {
  insert,
  update,
  remove,
  linkToDocument,
  complete,
  verify,
  undoCompletion,
  undoVerification
} from '/imports/api/actions/methods.js';

Template.Actions_Edit.viewmodel({
  mixin: ['organization', 'action', 'modal', 'callWithFocusCheck', 'router', 'collapsing'],
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
  completeFn() {
    return this.complete.bind(this);
  },
  complete(e) {
    this.callUpdate(complete, {}, this.generateCallback('My completed actions'));
  },
  undoCompletionFn() {
    return this.undoCompletion.bind(this);
  },
  undoCompletion(e) {
    this.callUpdate(undoCompletion, {}, this.generateCallback('My current actions'));
  },
  verifyFn() {
    return this.verify.bind(this);
  },
  verify(e) {
    this.callUpdate(verify, {}, this.generateCallback('My completed actions'));
  },
  undoVerificationFn() {
    return this.undoVerification.bind(this);
  },
  undoVerification(e) {
    this.callUpdate(undoVerification);
  },
  generateCallback(queryParam) {
    const _id = this._id();

    return (err) => {
      if (!err && FlowRouter.getQueryParam('by') !== queryParam) {
        FlowRouter.setQueryParams({ by: queryParam });
        Meteor.setTimeout(() => {
          this.goToAction(_id);
          this.expandCollapsed(_id);
        }, 100);
      }
    }
  }
});
