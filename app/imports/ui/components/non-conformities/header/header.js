import { Template } from 'meteor/templating';
import { NonConformityFilters } from '/imports/api/constants.js';

Template.NC_Header.viewmodel({
  share: ['window', 'search'],
  mixin: ['nonconformity', 'mobile', 'filters', 'organization', 'collapsing'],
  headerArgs() {
    return {
      idToExpand: this.NCId(),
      header: 'Non-conformities by -',
      filters: NonConformityFilters,
      isActiveFilter: this.isActiveNCFilter.bind(this)
    };
  }
});
