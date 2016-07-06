import { Template } from 'meteor/templating';

Template.Actions_QAPanel_Read.viewmodel({
  mixin: ['action', 'user', 'date', 'utils', 'modal'],
  document: '',
  getActionButtonText({ isCompleted }) {
    return this.chooseOne(isCompleted)('Verify', 'Complete');
  },
  getActionDescription({ type, isCompleted, toBeCompletedBy, toBeVerifiedBy, completionTargetDate, verificationTargetDate }) {
    const chooseOne = this.chooseOne;
    const completedOrVerified = chooseOne(isCompleted)('verified', 'completed');
    const assignee = chooseOne(isCompleted)(toBeVerifiedBy, toBeCompletedBy);
    const targetDate = chooseOne(isCompleted)(verificationTargetDate, completionTargetDate);
    return `
      ${this._getNameByType(type)} to be ${completedOrVerified} by ${this.userFullNameOrEmail(assignee)} by ${this.renderDate(targetDate)}
    `;
  },
  openQAModal({ isCompleted }) {
    this.modal().open({
      _title: this.getActionButtonText({ isCompleted }),
      _id: this.document() && this.document()._id,
      closeCaption: 'Cancel',
      guideHtml: 'Enter any verification comments below, then click either "Verified as effective" or "Assessed as ineffective"',
      template: 'Actions_QAPanel_Edit'
    });
  }
});
