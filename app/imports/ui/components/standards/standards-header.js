import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { StandardFilters } from '/imports/api/constants.js';

Template.StandardsHeader.viewmodel({
  mixin: ['organization', 'standard', 'collapsing'],
  selectedFilter: '',
  autorun: [
   function () {
    this.selectedFilter();
    this.expandCollapsedStandard(this.standardId());
  },
  function () {
    if (this.selectedFilter()) {
      FlowRouter.setQueryParams({ by: this.selectedFilter() });
    }
  }],
  standardFilters() {
    return StandardFilters;
  }
});
