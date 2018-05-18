import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { updateViewedBy } from '/imports/api/work-items/methods';

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
  linkArgs() {
    return {
      isActive: Object.is(this.workItemId(), this._id()),
      onClick: handler => handler({ workItemId: this._id() }),
      href: (() => {
        const params = {
          workItemId: this._id(),
          orgSerialNumber: this.organizationSerialNumber(),
        };
        const queryParams = { filter: this.activeWorkInboxFilterId() };
        return FlowRouter.path('workInboxItem', params, queryParams);
      })(),
    };
  },
  getTitle({ title, linkedDocument = {} }) {
    return linkedDocument.title || title || '';
  },
  getDescription({ isDeleted, linkedDocument, ...rest }) {
    if (!linkedDocument) {
      return '';
    }

    return isDeleted
      ? linkedDocument.sequentialId
      : `${linkedDocument.sequentialId} - ${this.getTypeText(rest)}`;
  },
  getDate({ isDeleted, deletedAt, targetDate }) {
    const date = isDeleted ? deletedAt : targetDate;
    return date ? this.renderDate(date) : '';
  },
  getUserText({ isDeleted, linkedDocument }) {
    if (isDeleted && linkedDocument) {
      return `Deleted by: ${this.userNameOrEmail(linkedDocument.deletedBy)}`;
    }

    return '';
  },
  getHref() {
    const params = { orgSerialNumber: this.organizationSerialNumber(), workItemId: this._id() };
    const queryParams = { filter: this.activeWorkInboxFilterId() };
    return FlowRouter.path('workInboxItem', params, queryParams);
  },
  isNew() {
    const filter = { _id: this._id() };
    const options = { fields: { createdAt: 1, viewedBy: 1 } };
    const doc = this._getWorkItemByQuery(filter, options);
    const userId = Meteor.userId();

    return doc && this.isNewDoc({ doc, userId });
  },
  updateViewedBy() {
    const { _id } = this.data();

    Meteor.defer(() => updateViewedBy.call({ _id }));
  },
});
