import { Template } from 'meteor/templating';

import { NonConformityFilters } from '/imports/api/constants.js';

Template.NC_Header.viewmodel({
  mixin: 'nonconformity',
  headerArgs() {
    return {
      idToExpand: this.NCId(),
      header: 'Non-conformities by -',
      prependWith: 'by',
      filters: NonConformityFilters,
      isActiveFilter: this.isActiveNCFilter.bind(this)
    };
  }
});
