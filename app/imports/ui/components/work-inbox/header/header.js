import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { WorkInboxFilters } from '/imports/api/constants.js';

Template.WorkInbox_Header.viewmodel({
  share: ['window', 'search'],
  mixin: ['workInbox', 'mobile', 'organization', 'collapsing'],
  filters() {
    return WorkInboxFilters;
  },
  selectFilter(filter) {
    FlowRouter.setQueryParams({ by: filter });
    this.searchText('');
    this.expandCollapsed(this.workItemId());
  }
});
