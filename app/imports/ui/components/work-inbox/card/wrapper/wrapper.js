import { Template } from 'meteor/templating';

import { WorkItemsStore } from '/imports/api/constants.js';

const { LINKED_TYPES } = WorkItemsStore;

Template.WorkInbox_Card_Read_Wrapper.viewmodel({
  mixin: ['workInbox', 'utils', 'nonconformity', 'risk', 'organization', 'standard'],
  _is_(...args) {
    const { linkedDoc: { type } = {} } = this.workItem() || {};
    return args.some(arg => arg === type);
  },
  LINKED_TYPES() {
    return LINKED_TYPES;
  },
  workItem() {
    return this._getWorkItemByQuery({ _id: this.workItemId() });
  },
  action() {
    return this._getActionByQuery({ _id: this._getLinkedDocId() });
  },
  NC() {
    return this._getNCByQuery({ _id: this._getLinkedDocId() });
  },
  risk() {
    return this._getRiskByQuery({ _id: this._getLinkedDocId() });
  },
  _getLinkedDocId() {
    const { linkedDoc: { _id } = {} } = this.workItem() || {};
    return _id;
  }
});
