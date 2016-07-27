import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

import { WorkItemsStore } from '/imports/api/constants.js';

const { TYPES } = WorkItemsStore;

Template.WorkInbox_QAPanel_Read.viewmodel({
  mixin: ['user', 'date', 'utils', 'modal', 'workItemStatus'],
  doc: '',
  showQAPanel({ status, assigneeId } ) {
    return Meteor.userId() === assigneeId && this.IN_PROGRESS().includes(status);
  },
  getButtonText({ type }) {
    if (type === TYPES.VERIFY_ACTION) {
      return 'Verify';
    } else {
      return 'Complete';
    }
  },
  getDescription({ type, assigneeId, targetDate }) {
    const typeText = this.getTypeText({ type });
    const operation = this.getOperationText({ type });
    const assignee = this.userFullNameOrEmail(assigneeId);
    const date = this.renderDate(targetDate);

    return `${typeText} to be ${operation} by ${assignee} by ${date}`;
  },
  getTypeText({ type }) {
    return this.capitalize(type.substr(type.indexOf(' ') + 1));
  },
  getOperationText({ type }) {
    return `${this.lowercase(this.getButtonText({ type }))}d`;
  },
  openQAModal({ type, ...args }) {
    const _title = this.getButtonText({ type });
    this.modal().open({
      _title,
      operation: this.getOperationText({ type }),
      typeText: this.getTypeText({ type }),
      doc: { type, ...args },
      closeCaption: 'Cancel',
      template: 'WorkInbox_QAPanel_Edit'
    });
  }
});
