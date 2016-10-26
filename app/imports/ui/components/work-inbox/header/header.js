import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import invoke from 'lodash.invoke';

import { WorkInboxFilters } from '/imports/api/constants.js';

Template.WorkInbox_Header.viewmodel({
  mixin: ['workInbox', 'router'],
  headerArgs() {
    return {
      idToExpand: this.workItemId(),
      header: 'Work',
      filters: WorkInboxFilters,
      isActiveFilter: this.isActiveWorkInboxFilter.bind(this)
    };
  }
});
