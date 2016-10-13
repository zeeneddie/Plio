import { Template } from 'meteor/templating';

import { NonConformityFilters } from '/imports/api/constants.js';

Template.NC_Header.viewmodel({
  mixin: 'nonconformity',
  headerArgs() {
    return {
      idToExpand: this.NCId(),
      header: 'NCs',
      prependWith: 'by',
      prependIndexes: [0, 1, 2],
      filters: NonConformityFilters,
      isActiveFilter: this.isActiveNCFilter.bind(this)
    };
  }
});
