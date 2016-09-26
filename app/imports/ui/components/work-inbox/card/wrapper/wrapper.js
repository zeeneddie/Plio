import { Template } from 'meteor/templating';

import { WorkItemsStore } from '/imports/share/constants.js';
import { restore, remove } from '/imports/api/work-items/methods.js';

const { LINKED_TYPES } = WorkItemsStore;

Template.WorkInbox_Card_Read_Wrapper.viewmodel({
  isRendered: false,
  mixin: ['workInbox', 'organization', 'utils'],
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
