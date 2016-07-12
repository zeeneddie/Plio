import { Template } from 'meteor/templating';

import { ActionPlanOptions } from '/imports/api/constants.js';


Template.Actions_EditMain.viewmodel({
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
  completionComments: '',
  isVerified: false,
  verificationTargetDate: '',
  toBeVerifiedBy: '',
  verifiedAt: '',
  verifiedBy: '',
  verificationComments: '',
  linkedStandardsIds: [],
  linkedTo: [],
  autorun() {
    const action = this.action && this.action();
    action && this.load(action);
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
  onUndoCompletion() {
    return this.undoCompletionFn;
  },
  onUndoVerification() {
    return this.undoVerificationFn;
  },
  onLinkStandard() {
    return this.linkStandardFn;
  },
  onUnlinkStandard() {
    return this.unlinkStandardFn;
  },
  onLinkDocument() {
    return this.linkDocumentFn;
  },
  onUnlinkDocument() {
    return this.unlinkDocumentFn;
  },
  getData() {
    return this.children(vm => vm.getData)
                .reduce((prev, cur) => {
                  return { ...prev, ...cur.getData() };
                }, {});
  }
});
