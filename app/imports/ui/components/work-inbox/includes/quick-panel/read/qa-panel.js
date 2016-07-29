import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

import { WorkItemsStore } from '/imports/api/constants.js';
import { remove } from '/imports/api/work-items/methods.js';

const { TYPES } = WorkItemsStore;

Template.WorkInbox_QAPanel_Read.viewmodel({
  mixin: ['user', 'date', 'utils', 'modal', 'workItemStatus', 'router'],
  doc: '',
  showQAPanel({ status, assigneeId, isDeleted }) {
    return !isDeleted && Meteor.userId() === assigneeId && this.IN_PROGRESS().includes(status);
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
    const _title = this.capitalize(type);
    this.modal().open({
      _title,
      operation: this.getOperationText({ type }),
      typeText: this.getTypeText({ type }),
      doc: { type, ...args },
      closeCaption: 'Cancel',
      template: 'WorkInbox_QAPanel_Edit'
    });
  },
  delete({ _id, isDeleted, type }) {
    if (isDeleted) return;

    swal(
      {
        title: 'Are you sure?',
        text: `The work item "${this.capitalize(type)}" will be deleted!`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        closeOnConfirm: false,
      },
      () => {
        const callback = (err) => {
          if (err) {
            swal('Oops... Something went wrong!', err.reason, 'error');
          } else {
            swal('Deleted', `The work item "${this.capitalize(type)}" was deleted successfully.`, 'success');
          }
        };

        remove.call({ _id }, callback);
      }
    );
  }
});
