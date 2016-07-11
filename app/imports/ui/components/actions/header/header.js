import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { ActionFilters } from '/imports/api/constants.js';

Template.ActionsHeader.viewmodel({
  share: 'window',
  mixin: ['action', 'mobile', 'organization', 'collapsing'],
  filters() {
    return ActionFilters;
  },
  selectFilter(filter) {
    FlowRouter.setQueryParams({ by: filter });
    this.expandCollapsed(this.actionId());
  }
});
