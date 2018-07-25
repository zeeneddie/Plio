import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

import { WorkItemsStore, ActionTypes, ProblemTypes } from '../../../../../../share/constants';
import { WorkInboxHelp } from '../../../../../../api/help-messages';
import { canCompleteActions } from '../../../../../../share/checkers';

const { TYPES } = WorkItemsStore;

Template.WorkInbox_QAPanel_Read.viewmodel({
  mixin: [
    'user', 'date', 'utils', 'modal', 'workItemStatus', 'workInbox', 'router', 'organization',
  ],
  doc: '',
  showCompleteButton({
    assigneeId,
    organizationId,
    type,
    linkedDoc = {},
  }) {
    if (type === WorkItemsStore.TYPES.COMPLETE_ANALYSIS) return false;

    const userId = Meteor.userId();
    let valid = userId === assigneeId;

    if (Object.values(ActionTypes).includes(linkedDoc.type)) {
      valid = valid || canCompleteActions(organizationId, userId);
    }

    return !!valid;
  },
  getButtonText({ type }) {
    switch (type) {
      case TYPES.VERIFY_ACTION:
        return 'Verify';
      case TYPES.COMPLETE_UPDATE_OF_DOCUMENTS:
        return 'Approve';
      default:
        return 'Complete';
    }
  },
  getDescription({
    type,
    linkedDoc = {},
    assigneeId,
    targetDate,
    isCompleted,
    completedAt,
  }) {
    if (!isCompleted && type === WorkItemsStore.TYPES.COMPLETE_ANALYSIS) {
      switch (linkedDoc.type) {
        case ProblemTypes.NON_CONFORMITY:
          return 'Complete the root cause analysis by updating the nonconformity record ' +
            'displayed below, entering the relevant details in the root cause analysis section';
        case ProblemTypes.POTENTIAL_GAIN:
          return 'Complete the potential gain analysis by updating the potential gain record ' +
            'displayed below, entering the relevant details in the potential gain analysis section';
        case ProblemTypes.RISK:
          return 'Complete the risk analysis by updating ' +
            'the relevant sections in the risk record displayed below';
        default:
          break;
      }
    }

    const typeText = this.getLinkedDocTypeText({ type, linkedDoc });
    const operation = this.getOperationText({ type });
    const assignee = this.userNameOrEmail(assigneeId);
    let desc = `${typeText} ${isCompleted ? '' : 'to be'} ${operation} by ${assignee}`;
    const date = isCompleted ? completedAt : targetDate;
    if (date) {
      desc = `${desc} ${isCompleted ? 'on' : 'by'} ${this.renderDate(date)}`;
    }

    return desc;
  },
  getOperationText({ type }) {
    switch (type) {
      case TYPES.VERIFY_ACTION:
        return 'verified';
      case TYPES.COMPLETE_UPDATE_OF_DOCUMENTS:
        return 'approved';
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
