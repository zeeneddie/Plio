import { Template } from 'meteor/templating';
import { RiskTypes } from '/imports/api/risk-types/risk-types.js';

Template.RisksList.viewmodel({
  share: 'search',
  mixin: ['search', 'collapse', 'organization', 'modal'],
  risksSections() {
    const organizationId = this.organizationId();
    const query = { organizationId };
    const options = { sort: { title: 1 } };
    return RiskTypes.find(query, options);
  },
  openAddRiskModal() {
    this.modal().open({
      title: 'Risk register',
      template: 'CreateRisk',
      variation: 'save'
    });
  }
});
