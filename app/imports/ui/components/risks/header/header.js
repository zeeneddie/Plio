import { Template } from 'meteor/templating';
import { RiskFilters } from '/imports/api/constants.js';

Template.RisksHeader.viewmodel({
  share: 'window',
  mixin: ['risk', 'mobile', 'organization', 'collapsing'],
  riskFilters() {
    return RiskFilters;
  },
  selectFilter(filter) {
    FlowRouter.setQueryParams({ by: filter });
    this.expandCollapsed(this.riskId());
  }
});
