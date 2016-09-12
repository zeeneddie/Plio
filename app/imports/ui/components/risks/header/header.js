import { Template } from 'meteor/templating';

import { RiskFilters } from '/imports/api/constants.js';

Template.Risks_Header.viewmodel({
  mixin: 'risk',
  headerArgs() {
    return {
      idToExpand: this.riskId(),
      header: 'Risks by -',
      prependWith: 'by',
      filters: RiskFilters,
      isActiveFilter: this.isActiveRiskFilter.bind(this)
    };
  }
});
