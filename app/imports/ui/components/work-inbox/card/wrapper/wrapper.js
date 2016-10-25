import { Template } from 'meteor/templating';
import get from 'lodash.get';

import { WorkItemsStore } from '/imports/share/constants.js';
import { DocumentCardSubs } from '/imports/startup/client/subsmanagers.js';
import { restore, remove } from '/imports/api/work-items/methods.js';

const { LINKED_TYPES } = WorkItemsStore;

Template.WorkInbox_Card_Read_Wrapper.viewmodel({
  isRendered: false,
  mixin: ['workInbox', 'organization', 'utils'],
  onRendered() {
    this.isRendered(true);
  },
  cardArgs() {
    const workItem = Object.assign({}, this.workItem());
    const isReady = this.isReady();
    const isReadOnly = workItem.isDeleted;
    const { linkedDoc: { _id } = {} } = workItem;
    return {
      _id,
      isReady,
      isReadOnly,
      showCard: true
    };
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
    return get('linkedDoc._id', this.workItem());
  }
});
