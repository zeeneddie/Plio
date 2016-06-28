import { Template } from 'meteor/templating';

import { ActionPlanOptions } from '/imports/api/constants.js';


Template.Actions_Edit.viewmodel({
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
  autorun() {
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
    this.parent().update({ ...args });
  },
  onComplete() {
    return this.completeFn;
  },
  onVerify() {
    return this.verifyFn;
  },
  subcard() {
    return this.parent();
  },
  getData() {
    return { title: this.title() };
  }
});
