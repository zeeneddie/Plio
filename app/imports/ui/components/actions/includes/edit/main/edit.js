import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { WorkflowTypes, ActionTypes, StringLimits } from '../../../../../../share/constants';
import { updateViewedBy } from '../../../../../../api/actions/methods';
import { isViewed } from '../../../../../../api/checkers';

Template.Actions_Card_Edit_Main.viewmodel({
  mixin: ['utils', 'getChildrenData', 'workInbox'],
  ActionTypes,
  onRendered(templateInstance) {
    const { action } = templateInstance.data;
    const userId = Meteor.userId();

    if (action && !isViewed(action, userId)) {
      Meteor.defer(() => updateViewedBy.call({ _id: action._id }));
    }
  },
  autorun() {
    const action = this.action && this.action();
    if (action) {
      this.load(action);
    }
  },
  titleArgs({ _id, title, sequentialId }) {
    return {
      _id,
      title,
      sequentialId,
      maxLength: StringLimits.longTitle.max,
      label: 'Title',
      onUpdate: this.updateTitleFn,
    };
  },
  isCompletionEditable({ isVerified }) {
    return !isVerified;
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
  onUpdateCompletionDate() {
    return this.updateCompletionDateFn;
  },
  onUpdateCompletionExecutor() {
    return this.updateCompletionExecutorFn;
  },
  onUpdateVerificationDate() {
    return this.updateVerificationDateFn;
  },
  onUpdateVerificationExecutor() {
    return this.updateVerificationExecutorFn;
  },
  showVerification() {
    const action = this.action && this.action();
    return action && action.getWorkflowType() === WorkflowTypes.SIX_STEP;
  },
  getData() {
    return this.getChildrenData();
  },
});
