import { Template } from 'meteor/templating';

Template.RisksPage.viewmodel({
  share: 'window',
  mixin: ['mobile', 'risk'],
  autorun() {
    this.templateInstance.subscribe('riskImprovementPlan', this.riskId());
  }
});
