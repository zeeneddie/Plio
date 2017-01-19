import { Template } from 'meteor/templating';
import get from 'lodash.get';

import { WorkItemsStore } from '/imports/share/constants.js';

const { LINKED_TYPES } = WorkItemsStore;

Template.WorkInbox_Card_Read_Wrapper.viewmodel({
  share: 'search',
  isRendered: false,
  mixin: ['workInbox', 'organization', 'utils'],
  onRendered() {
    this.isRendered(true);
  },
  cardArgs() {
    const workItem = Object.assign({}, this.workItem());
    const isReady = this.isReady();
    const { linkedDoc: { _id } = {} } = workItem;

    return {
      _id,
      isReady,
      isReadOnly: false,
      showCard: true,
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
  },
  noSearchResults() {
    return this.searchText() && !this.searchResult().array().length;
  },
});
