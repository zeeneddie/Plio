import { Template } from 'meteor/templating';

Template.Risks_Page.viewmodel({
  mixin: ['risk', 'organization'],
  autorun() {
    this.templateInstance.subscribe('riskImprovementPlan', this.riskId());
    this.templateInstance.subscribe('workItems', this.organizationId());
  }
});
