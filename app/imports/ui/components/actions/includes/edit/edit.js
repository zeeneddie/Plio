import { Template } from 'meteor/templating';

import { ActionPlanOptions } from '/imports/api/constants.js';


Template.Actions_Edit.viewmodel({
  mixin: ['collapse', 'modal', 'addForm', 'organization'],
  _id: '',
  title: '',
  status: 0,
  ownerId: Meteor.userId(),
  planInPlace: ActionPlanOptions.NO,
  isCompleted: false,
  completionTargerDate: '',
  toBeCompletedBy: '',
  completedAt: '',
  completedBy: '',
  completionResult: '',
  isVerified: false,
  verificationTargerDate: '',
  toBeVerifiedBy: '',
  verifiedAt: '',
  verifiedBy: '',
  verificationResult: '',
  onCreated() {
    const action = this.action && this.action();
    action && this.load(action);
  },
  isActionCompleted() {
    return this.isCompleted() && this.completedAt() && this.completedBy();
  },
  isActionVerified() {
    return this.isVerified() && this.verifiedAt() && this.verifiedBy();
  },
  isCompletionEditable() {
    return !this.isVerified();
  },
  update({ ...args }) {
    this.updateFn({
      _id: this._id(),
      ...args
    });
  },
  onComplete() {
    return this.completeFn;
  },
  onVerify() {
    return this.verifyFn;
  },
  getData() {
    return { title: this.title() };
  }
});
