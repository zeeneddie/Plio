import { Template } from 'meteor/templating';
import invoke from 'lodash.invoke';

import { RiskFilters } from '/imports/api/constants.js';

Template.Risks_Header.viewmodel({
  mixin: 'risk',
  headerArgs() {
    return {
      idToExpand: this.riskId(),
      header: 'Risks',
      prependWith: 'by',
      filters: RiskFilters,
      isActiveFilter: this.isActiveRiskFilter.bind(this),
      onSelectFilter: this.onSelectFilter.bind(this)
    };
  },
  onSelectFilter(value, onSelect) {
    onSelect();

    Tracker.afterFlush(() => {
      Meteor.defer(() => {
        const list = Object.assign({}, ViewModel.findOne('Risks_List'));

        !!list && invoke(list, 'handleRoute');
      });
    });
  }
});
