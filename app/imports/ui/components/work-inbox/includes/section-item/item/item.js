import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { updateViewedBy } from '/imports/api/work-items/methods.js';
import { WorkItemsStore } from '/imports/api/constants.js';

const { LINKED_TYPES } = WorkItemsStore;

Template.WorkInbox_Item.viewmodel({
  share: 'window',
  mixin: ['date', 'workInbox', 'organization', 'user', 'utils', 'workItemStatus'],
  onCreated(template) {
    template.autorun((computation) => {
      const { _id } = this.data();
      if (_id === this.workItemId() && this.isNew()) {
        Tracker.nonreactive(() => this.updateViewedBy(() => computation.stop()));
      }
    });
  },
  _source: {},
  getTypeText({ type }) {
    return this.capitalize(type);
  },
  getDate({ isDeleted, deletedAt, targetDate }) {
    const date = isDeleted ? deletedAt : targetDate;
    return this.renderDate(date);
  },
  getUserText({ isDeleted, createdBy, deletedBy }) {
    return isDeleted
            ? `Deleted by: ${this.userFullNameOrEmail(deletedBy)}`
            : '';
  },
  isNew() {
    const { viewedBy = [] } = this.data();
    return !viewedBy.find(_id => _id === Meteor.userId());
  },
  updateViewedBy() {
    const { _id } = this.data();

    updateViewedBy.call({ _id });
  },
  navigate() {
    if ($(window).width() < 768) {
      this.width($(window).width());
    }

    const { _id:workItemId } = this.data();

    FlowRouter.setParams({ workItemId });
  }
});
