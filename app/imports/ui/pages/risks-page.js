import { Template } from 'meteor/templating';

Template.RisksPage.viewmodel({
  share: 'window',
  mixin: ['mobile', 'risk', 'organization'],
  autorun() {
    this.templateInstance.subscribe('riskImprovementPlan', this.riskId());
    this.templateInstance.subscribe('workItems', this.organizationId());
  }
});
