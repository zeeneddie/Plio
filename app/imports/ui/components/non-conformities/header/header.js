import { Template } from 'meteor/templating';
import { NonConformityFilters } from '/imports/api/constants.js';

Template.NC_Header.viewmodel({
  share: ['window', 'search'],
  mixin: ['nonconformity', 'mobile', 'organization', 'collapsing'],
  filters() {
    return NonConformityFilters;
  },
  selectFilter(filter) {
    FlowRouter.setQueryParams({ by: filter });
    this.searchText('');
    this.expandCollapsed(this.NCId());
  }
});
