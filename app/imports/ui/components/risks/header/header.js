import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { RiskFilters } from '/imports/api/constants.js';

Template.Risks_Header.viewmodel({
  share: ['window', 'search'],
  mixin: ['risk', 'mobile', 'filters', 'organization', 'collapsing'],
  filters() {
    return this.mapFilters(RiskFilters);
  },
  currentFilterLabel() {
    return this.getRiskFilterLabel(this.activeRiskFilterId());
  },
  selectFilter(filter) {
    FlowRouter.setQueryParams({ filter });
    this.searchText('');
    this.expandCollapsed(this.riskId());
  }
});
