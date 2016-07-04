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
  mixin: ['organization', 'action', 'modal', 'callWithFocusCheck'],
  isLinkedToEditable: true,
  action() {
    return this._getActionByQuery({ _id: this._id() });
  },
  isCompletionEditable(isVerified) {
    return !isVerified;
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
    const _id = this._id();
    const allArgs = { ...args, _id, options, query };

    const updateFn = () => this.modal().callMethod(update, allArgs, cb);

    if (withFocusCheck) {
      this.callWithFocusCheck(e, updateFn);
    } else {
      updateFn();
    }
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
  }
});
