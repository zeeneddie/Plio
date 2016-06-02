import { Template } from 'meteor/templating';
import { ProblemFilters } from '/imports/api/constants.js';

Template.NCHeader.viewmodel({
  share: 'window',
  mixin: ['nonconformity', 'mobile', 'organization'],
  filters() {
    return ProblemFilters;
  },
  selectFilter(filter) {
    FlowRouter.setQueryParams({ by: filter });
  }
});
