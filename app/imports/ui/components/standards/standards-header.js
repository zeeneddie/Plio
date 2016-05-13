import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { StandardFilters } from '/imports/api/constants.js';

Template.StandardsHeader.viewmodel({
  mixin: ['organization', 'standard'],
  selectedFilter: '',
  autorun() {
    if (this.selectedFilter) {
      FlowRouter.setQueryParams({ by: this.selectedFilter() });
    }
  },
  standardFilters() {
    return StandardFilters;
  },
  isActiveFilter(filter) {
    return this.activeFilter() === filter;
  },
  standardsHeader(activeFilter) {
    return `Standards - by ${activeFilter}`;
  },
  filterText(filter) {
    return `By ${filter}`;
  }
});
