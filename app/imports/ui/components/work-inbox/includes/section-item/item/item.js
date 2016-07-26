import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { updateViewedBy } from '/imports/api/work-items/methods.js';
import { WorkItemsStore } from '/imports/api/constants.js';

const { LINKED_TYPES } = WorkItemsStore;

Template.WorkInbox_Item.viewmodel({
  share: 'window',
  mixin: ['date', 'workInbox', 'organization', 'user'],
  autorun() {
    if (this._id() === this.workItemId() && this.isNew()) {
      Tracker.nonreactive(() => this.updateViewedBy());
    }
  },
  onCreated() {
    const { _source: { linkedDoc: { type } = {} } = {} } = this.data();
    this.loadStatusMixinByDocType(type);
  },
  _source: {},
  getDate({ isDeleted, deletedAt, _source: { targetDate } = {} }) {
    const date = isDeleted ? deletedAt : targetDate;
    return this.renderDate(date);
  },
  getUserText({ isDeleted, createdBy, deletedBy }) {
    return isDeleted
            ? `Deleted by: ${this.userFullNameOrEmail(deletedBy)}`
            : '';
  },
  loadStatusMixinByDocType(docType) {
    switch(docType) {
      case LINKED_TYPES.CORRECTIVE_ACTION:
      case LINKED_TYPES.PREVENTATIVE_ACTION:
      case LINKED_TYPES.RISK_CONTROL:
        this.load({ mixin: 'actionStatus' });
        break;
      case LINKED_TYPES.NC:
      case LINKED_TYPES.RISK:
        this.load({ mixin: 'problemsStatus' });
        break;
      default:
        return;
        break;
    }
  },
  isNew() {
    const { _source: { viewedBy = [] } = {} } = this.data();
    return !viewedBy.find(_id => _id === Meteor.userId());
  },
  updateViewedBy() {
    const { _source: { _id } = {} } = this.data();

    updateViewedBy.call({ _id });
  },
  navigate() {
    if ($(window).width() < 768) {
      this.width($(window).width());
    }

    FlowRouter.setParams({ workItemId: this._id() });
  }
});
