import { Template } from 'meteor/templating';

Template.StandardsPage.viewmodel({
  share: 'window',
  mixin: ['mobile', 'organization', 'standard'],
  autorun() {
    this.templateInstance.subscribe('departments', this.organizationId());
    this.templateInstance.subscribe('standardImprovementPlan', this.standardId());
    this.templateInstance.subscribe('nonConformitiesByStandardId', this.standardId());
  }
});
