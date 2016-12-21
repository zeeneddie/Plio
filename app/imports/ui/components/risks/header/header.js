import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';

import { RiskFilters } from '/imports/api/constants.js';
import { isMobileRes } from '/imports/api/checkers.js';
import HeaderOptionsMenu from '/imports/ui/react/risks/components/HeaderOptionsMenu';

Template.Risks_Header.viewmodel({
  mixin: ['modal', 'risk', 'organization', 'router'],
  headerArgs() {
    const view = this;

    return {
      idToExpand: this.riskId(),
      filters: RiskFilters,
      isActiveFilter: this.isActiveRiskFilter.bind(this),
      onSelectFilter: this.onSelectFilter.bind(this),
      getOptionsMenu() {
        return {
          component: HeaderOptionsMenu,
          onHandleDataExport() {
            view.modal().open({
              template: 'DataExport',
              _title: 'Risks export',
              variation: 'close',
            });
          },
        };
      },
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
  onNavigate() {
    const mobileWidth = isMobileRes();
    const goToDashboard = () => this.goToDashboard(this.organizationSerialNumber());

    if (mobileWidth) {
      this.width(mobileWidth);
      return this.goToRisk(this.riskId());
    }

    return goToDashboard();
  },
});
