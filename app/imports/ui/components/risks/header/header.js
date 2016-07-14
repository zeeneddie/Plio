import { Template } from 'meteor/templating';
import { RiskFilters } from '/imports/api/constants.js';

Template.RisksHeader.viewmodel({
  share: ['window', 'search'],
  mixin: ['risk', 'mobile', 'organization', 'collapsing'],
  riskFilters() {
    return RiskFilters;
  },
  selectFilter(filter) {
    this.searchText('');
    FlowRouter.setQueryParams({ by: filter });
    this.expandCollapsed(this.riskId());
  }
});
