import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

import { AnalysisStatuses } from '/imports/api/constants.js';
import { ActionDocumentTypes } from '/imports/api/constants.js';

Template.Actions_QAPanel_Read.viewmodel({
  mixin: ['workInbox', 'user', 'date', 'utils', 'modal'],
  doc: '',
  _docType: '',
  isAction() {
    return this._docType() === ActionDocumentTypes.ACTION;
  },
  showQAPanel({ isDeleted, isVerified, isCompleted, toBeCompletedBy, toBeVerifiedBy, analysis: { executor, status } = {} } ) {
    const aCondition = !isVerified && this.chooseOne(isCompleted)(toBeVerifiedBy, toBeCompletedBy) === Meteor.userId();
    const pCondition = status === 0 && executor === Meteor.userId();
    return !isDeleted && ((this.isAction() && aCondition) || pCondition);
  },
  getActionButtonText({ isCompleted, analysis: { status } = {} }) {
    const aText = isCompleted ? 'Verify' : 'Complete';
    const pText = status === 0 ? 'Complete' : '';
    return this.isAction() ? aText : pText;
  },
  getActionDescription({ type, isCompleted, toBeCompletedBy, toBeVerifiedBy, completionTargetDate, verificationTargetDate }) {
    const chooseOne = this.chooseOne(isCompleted);
    const completedOrVerified = chooseOne('verified', 'completed');
    const assignee = chooseOne(toBeVerifiedBy, toBeCompletedBy);
    const targetDate = chooseOne(verificationTargetDate, completionTargetDate);
    return `
      ${this._getNameByType(type)} to be ${completedOrVerified} by ${this.userFullNameOrEmail(assignee)} by ${this.renderDate(targetDate)}
    `;
  },
  openQAModal({ _id, isCompleted, analysis, ...args }) {
    const _title = this.getActionButtonText({ isCompleted, analysis });
    const content = `${this.templateName().replace('Read', 'Edit')}_${_title}`; // Example: Actions_QAPanel_Edit_Verify
    this.modal().open({
      _title,
      content,
      doc: { _id, isCompleted, analysis, ...args },
      isAction: this.isAction(),
      closeCaption: 'Cancel',
      template: 'Actions_QAPanel_Edit'
    });
  }
});
