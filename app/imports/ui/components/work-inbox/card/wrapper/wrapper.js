import { Template } from 'meteor/templating';

import { WorkItemsStore } from '/imports/api/constants.js';
import { restore, remove } from '/imports/api/work-items/methods.js';

const { LINKED_TYPES } = WorkItemsStore;

Template.WorkInbox_Card_Read_Wrapper.viewmodel({
  mixin: ['workInbox', 'organization', 'utils', 'nonconformity', 'risk', 'action', 'router', 'collapsing'],
  _is_(...args) {
    const { linkedDoc: { type } = {} } = this.workItem() || {};
    return args.some(arg => arg === type);
  },
  LINKED_TYPES() {
    return LINKED_TYPES;
  },
  workItem() {
    return this._getWorkItemByQuery({ _id: this._id() });
  },
  NC() {
    return this._getNCByQuery({ _id: this.linkedDocId() });
  },
  risk() {
    return this._getRiskByQuery({ _id: this.linkedDocId() });
  },
  action() {
    return this._getActionByQuery({ _id: this.linkedDocId() });
  },
  linkedDocId() {
    const { linkedDoc: { _id } = {} } = this.workItem() || {};
    return _id;
  }
});
