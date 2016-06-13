import { Template } from 'meteor/templating';
import { RiskFilters } from '/imports/api/constants.js';

Template.RisksHeader.viewmodel({
  share: 'window',
  mixin: ['risk', 'mobile', 'organization'],
  riskFilters() {
    return RiskFilters;
  },
  selectFilter(filter) {
    FlowRouter.setQueryParams({ by: filter });
  }
});
