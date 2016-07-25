import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { ActionFilters } from '/imports/api/constants.js';

Template.ActionsHeader.viewmodel({
  share: ['window', 'search'],
  mixin: ['workInbox', 'mobile', 'organization', 'collapsing'],
  filters() {
    return ActionFilters;
  },
  selectFilter(filter) {
    this.searchText('');
    FlowRouter.setQueryParams({ by: filter });
    this.expandCollapsed(this.workItemId());
  }
});
