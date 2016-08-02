import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { RiskFilters } from '/imports/api/constants.js';

Template.RisksHeader.viewmodel({
  share: ['window', 'search'],
  mixin: ['risk', 'mobile', 'organization', 'collapsing'],
  riskFilters() {
    return RiskFilters;
  },
  selectFilter(filter) {
    FlowRouter.setQueryParams({ by: filter });
    this.searchText('');
    this.expandCollapsed(this.riskId());
  }
});
