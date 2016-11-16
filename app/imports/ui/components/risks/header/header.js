import { Template } from 'meteor/templating';
import invoke from 'lodash.invoke';

import { RiskFilters } from '/imports/api/constants.js';
import { isMobileRes } from '/imports/api/checkers.js';

Template.Risks_Header.viewmodel({
  mixin: ['risk', 'organization', 'router'],
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
  risk() {
    return this._getRiskByQuery({
      _id: this.riskId(),
    });
  },
  onSelectFilter(value, onSelect) {
    onSelect();

    Tracker.afterFlush(() => this.handleRouteRisks());
  },
  onNavigate(e) {
    const mobileWidth = isMobileRes();
    const goToDashboard = () => this.goToDashboard(this.organizationSerialNumber());

    if (mobileWidth) {
      this.width(mobileWidth);
      return this.goToRisk(this.riskId());
    }

    return goToDashboard();
  },
});
