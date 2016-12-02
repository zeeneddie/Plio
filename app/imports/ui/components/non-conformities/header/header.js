import { Template } from 'meteor/templating';
import invoke from 'lodash.invoke';

import { NonConformityFilters } from '/imports/api/constants.js';
import { isMobileRes } from '/imports/api/checkers.js';

Template.NC_Header.viewmodel({
  mixin: ['nonconformity', 'organization', 'router'],
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
  NC() {
    return this._getNCByQuery({ _id: this.NCId() });
  },
  onSelectFilter(value, onSelect) {
    onSelect();

    Tracker.afterFlush(() => {
      Meteor.defer(() => {
        const list = Object.assign({}, ViewModel.findOne('NC_List'));

        !!list && invoke(list, 'handleRoute');
      });
    });
  },
  onNavigate(e) {
    const mobileWidth = isMobileRes();
    const goToDashboard = () => this.goToDashboard(this.organizationSerialNumber());

    if (mobileWidth) {
      this.width(mobileWidth);
      return this.goToNC(this.NCId());
    }

    return goToDashboard();
  },
});
