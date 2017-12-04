import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

import { WorkItemsStore } from '/imports/share/constants.js';
import { WorkInboxHelp } from '/imports/api/help-messages.js';

const { TYPES } = WorkItemsStore;

Template.WorkInbox_QAPanel_Read.viewmodel({
  mixin: [
    'user', 'date', 'utils', 'modal', 'workItemStatus', 'workInbox', 'router', 'organization',
  ],
  doc: '',
  isCurrentUserAssignee({ assigneeId }) {
    return Meteor.userId() === assigneeId;
  },
  getButtonText({ type }) {
    switch (type) {
      case TYPES.VERIFY_ACTION:
        return 'Verify';
      case TYPES.COMPLETE_UPDATE_OF_DOCUMENTS:
        return 'Update completed';
      default:
        return 'Complete';
    }
  },
  getDescription({
    type, linkedDoc, assigneeId, targetDate, isCompleted, completedAt, 
  }) {
    const chooseOne = this.chooseOne(isCompleted);
    const typeText = this.getLinkedDocTypeText({ type, linkedDoc });
    const operation = this.getOperationText({ type });
    const assignee = this.userNameOrEmail(assigneeId);

    let desc = `${typeText} ${chooseOne('', 'to be')} ${operation} by ${assignee}`;

    const date = chooseOne(completedAt, targetDate);
    if (date) {
      desc = `${desc} ${chooseOne('on', 'by')} ${this.renderDate(date)}`;
    }

    return desc;
  },
  getOperationText({ type }) {
    switch (type) {
      case TYPES.VERIFY_ACTION:
        return 'verified';
      case TYPES.COMPLETE_UPDATE_OF_DOCUMENTS:
        return 'completed';
      default:
        return `${this.lowercase(this.getButtonText({ type }))}d`;
    }
  },
  openQAModal({ type, linkedDoc, ...args }) {
    const _title = this.getTypeText({ type, linkedDoc });
    const helpText = (() => {
      switch (type) {
        case TYPES.COMPLETE_ACTION:
          return WorkInboxHelp.completeActionHelp;
        case TYPES.VERIFY_ACTION:
          return WorkInboxHelp.verifyActionHelp;
        case TYPES.COMPLETE_ANALYSIS:
          return WorkInboxHelp.completeAnalysisHelp;
        case TYPES.COMPLETE_UPDATE_OF_DOCUMENTS:
          return WorkInboxHelp.updateDocumentHelp;
        default:
          return '';
      }
    })();

    this.modal().open({
      _title,
      helpText,
      operation: this.getOperationText({ type }),
      typeText: this.getLinkedDocTypeText({ type, linkedDoc }),
      doc: { type, linkedDoc, ...args },
      closeCaption: 'Cancel',
      template: 'WorkInbox_QAPanel_Edit',
    });
  },
});
