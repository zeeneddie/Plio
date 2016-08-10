import { Template } from 'meteor/templating';

Template.StandardsPage.viewmodel({
  share: 'window',
  mixin: ['mobile', 'organization', 'standard'],
  autorun() {
    const template = this.templateInstance;
    template.subscribe('departments', this.organizationId());
    template.subscribe('standardImprovementPlan', this.standardId());
    template.subscribe('nonConformitiesByStandardId', this.standardId());
    template.subscribe('workItems', this.organizationId());
  }
});
