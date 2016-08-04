import { Template } from 'meteor/templating';

Template.Risks_Page.viewmodel({
  share: 'window',
  mixin: ['mobile', 'risk'],
  autorun() {
    this.templateInstance.subscribe('riskImprovementPlan', this.riskId());
  }
});
