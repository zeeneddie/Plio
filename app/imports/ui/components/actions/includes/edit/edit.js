import { Template } from 'meteor/templating';

import { ActionPlanOptions } from '/imports/api/constants.js';
import {
  insert,
  update,
  remove,
  complete,
  verify,
  undoCompletion,
  undoVerification
} from '/imports/api/actions/methods.js';

Template.Actions_Edit.viewmodel({
  mixin: ['organization', 'modal', 'callWithFocusCheck', 'router', 'action', 'collapsing'],
  autorun() {
    const action = this.action && this.action();
    action && this.load(action);
  },
  _id: '',
  title: '',
  status: 0,
  ownerId: Meteor.userId(),
  planInPlace: ActionPlanOptions.NO,
  isCompleted: false,
  completionTargetDate: '',
  toBeCompletedBy: '',
  completedAt: '',
  completedBy: '',
  completionResult: '',
  isVerified: false,
  verificationTargetDate: '',
  toBeVerifiedBy: '',
  verifiedAt: '',
  verifiedBy: '',
  verificationResult: '',
  isLinkedToEditable: true,
  action() {
    return this._getActionByQuery({ _id: this._id() });
  },
  isCompletionEditable() {
    return !this.isVerified();
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
  callUpdate(method, { ...args }, cb) {
    const _id = this._id();
    this.modal().callMethod(method, { _id, ...args }, cb);
  },
  onComplete() {
    return this.complete.bind(this);
  },
  complete({ ...args }, cb) {
    const _id = this._id();

    const callback = (err) => {
      if (!err) {
        Meteor.setTimeout(() => {
          this.goToAction(_id);
          this.expandCollapsed(_id);
        }, 0);
      }
      _.isFunction(cb) && cb(err);
    };

    return () => {
      FlowRouter.setQueryParams({ by: 'My completed actions' });

      this.callUpdate(complete, { ...args }, callback);
    }
  },
  onUndoCompletion() {
    return this.undoCompletion.bind(this);
  },
  undoCompletion(...args) {
    return () => this.callUpdate(undoCompletion, ...args);
  },
  onVerify() {
    return this.verify.bind(this);
  },
  verify(...args) {
    return () => this.callUpdate(verify, ...args);
  },
  onUndoVerification() {
    return this.undoVerification.bind(this);
  },
  undoVerification(...args) {
    return () => this.callUpdate(undoVerification, ...args);
  },
  subcard() {
    return this.parent();
  },
  getData() {
    return { title: this.title() };
  }
});
