import { Template } from 'meteor/templating';
import invoke from 'lodash.invoke';

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
      onSelectFilter: this.onSelectFilter.bind(this),
      isActiveFilter: this.isActiveNCFilter.bind(this)
    };
  },
  onSelectFilter(value, onSelect) {
    onSelect();

    const list = Object.assign({}, ViewModel.findOne('NC_List'));

    if (list) {
      invoke(list, 'handleRoute');
    }
  },
});
