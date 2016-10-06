import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { WorkInboxFilters } from '/imports/api/constants.js';

Template.WorkInbox_Header.viewmodel({
  mixin: 'workInbox',
  headerArgs() {
    return {
      idToExpand: this.workItemId(),
      header: 'Work inbox',
      filters: WorkInboxFilters,
      isActiveFilter: this.isActiveWorkInboxFilter.bind(this)
    };
  }
});
