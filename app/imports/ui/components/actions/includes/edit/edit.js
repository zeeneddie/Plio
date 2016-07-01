import { Template } from 'meteor/templating';

import { ActionPlanOptions } from '/imports/api/constants.js';


Template.Actions_Edit.viewmodel({
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
  isCompletionEditable() {
    return !this.isVerified();
  },
  update({ ...args }, cb) {
    this.parent().update({ ...args }, cb);
  },
  onComplete() {
    return () => {
      this.parent().callUpdate(this.completeFn, {
        _id: this._id()
      });
    };
  },
  onUndoCompletion() {
    return () => {
      this.parent().callUpdate(this.undoCompletionFn, {
        _id: this._id()
      });
    };
  },
  onVerify() {
    return () => {
      this.parent().callUpdate(this.verifyFn, {
        _id: this._id()
      });
    };
  },
  onUndoVerification() {
    return () => {
      this.parent().callUpdate(this.undoVerificationFn, {
        _id: this._id()
      });
    };
  },
  subcard() {
    return this.parent();
  },
  getData() {
    return { title: this.title() };
  }
});
