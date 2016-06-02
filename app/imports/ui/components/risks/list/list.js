import { Template } from 'meteor/templating';
import { RisksSections } from '/imports/api/risks-sections/risks-sections.js';

Template.RisksList.viewmodel({
  share: 'search',
  mixin: ['search', 'collapse', 'organization', 'modal'],
  risksSections() {
    const organizationId = this.organizationId();
    const query = { organizationId };
    const options = { sort: { title: 1 } };
    return RisksSections.find(query, options);
  },
  openAddRiskModal() {
    this.modal().open({
      title: 'Risk register',
      template: 'CreateRisk',
      variation: 'save'
    });
  }
});
