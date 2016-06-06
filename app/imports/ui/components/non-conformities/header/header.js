import { Template } from 'meteor/templating';
import { NonConformityFilters } from '/imports/api/constants.js';

Template.NCHeader.viewmodel({
  share: 'window',
  mixin: ['nonconformity', 'mobile', 'organization', 'collapsing'],
  filters() {
    return NonConformityFilters;
  },
  selectFilter(filter) {
    FlowRouter.setQueryParams({ by: filter });
    this.expandCollapsed(this.NCId());
  }
});
