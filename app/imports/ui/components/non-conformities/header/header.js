import { Template } from 'meteor/templating';
import { NonConformityFilters } from '/imports/api/constants.js';

Template.NC_Header.viewmodel({
  share: ['window', 'search'],
  mixin: ['nonconformity', 'mobile', 'filters', 'organization', 'collapsing'],
  filters() {
    return this.mapFilters(NonConformityFilters);
  },
  currentFilterLabel() {
    return this.getNCFilterLabel(this.activeNCFilterId());
  },
  selectFilter(filter) {
    FlowRouter.setQueryParams({ filter });
    this.searchText('');
    this.expandCollapsed(this.NCId());
  }
});
