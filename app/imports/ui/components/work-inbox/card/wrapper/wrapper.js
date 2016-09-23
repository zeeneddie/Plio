import { Template } from 'meteor/templating';

import { WorkItemsStore } from '/imports/api/constants.js';
import { DocumentCardSubs } from '/imports/startup/client/subsmanagers.js';
import { restore, remove } from '/imports/api/work-items/methods.js';

const { LINKED_TYPES } = WorkItemsStore;

Template.WorkInbox_Card_Read_Wrapper.viewmodel({
  isRendered: false,
  mixin: ['workInbox', 'organization', 'utils'],

  onCreated(template) {
    template.autorun(() => {
      const _id = this._id();
      const organizationId = this.organizationId();
      if (_id && organizationId) {
        DocumentCardSubs.subscribe('workItemCard', { _id, organizationId });
      }
    });
  },
  onRendered() {
    this.isRendered(true);
  },
  isDocType(...args) {
    const { linkedDoc: { type } = {} } = this.workItem() || {};
    return args.some(arg => arg === type);
  },
  LINKED_TYPES() {
    return LINKED_TYPES;
  },
  workItem() {
    return this._getWorkItemByQuery({ _id: this._id() });
  },
  linkedDocId() {
    const { linkedDoc: { _id } = {} } = this.workItem() || {};
    return _id;
  }
});
