import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { WorkInboxFilters } from '/imports/api/constants.js';

Template.WorkInbox_Header.viewmodel({
  share: ['window', 'search'],
  mixin: ['workInbox', 'mobile', 'organization', 'collapsing'],
  filters() {
    return _.map(WorkInboxFilters, (label, id) => {
      return {
        label: label,
        id: id
      }
    });
  },
  currentFilterLabel() {
    return this.getWorkInboxFilterLabel(this.activeWorkInboxFilterId());
  },
  selectFilter(filter) {
    FlowRouter.setQueryParams({ by: filter });
    this.searchText('');
    this.expandCollapsed(this.workItemId());
  }
});
