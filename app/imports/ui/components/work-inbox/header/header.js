import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { WorkInboxFilters } from '/imports/api/constants.js';

Template.WorkInbox_Header.viewmodel({
  share: ['window', 'search'],
  mixin: ['workInbox', 'mobile', 'filters', 'organization', 'collapsing'],
  filters() {
    return this.mapFilters(WorkInboxFilters);
  },
  currentFilterLabel() {
    return this.getWorkInboxFilterLabel(this.activeWorkInboxFilterId());
  },
  selectFilter(filter) {
    FlowRouter.setQueryParams({ filter });
    this.searchText('');
    this.expandCollapsed(this.workItemId());
  }
});
