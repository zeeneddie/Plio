import { Template } from 'meteor/templating';

import { Risks } from '/imports/api/risks/risks.js';

Template.Risks_Page.viewmodel({
  mixin: ['risk', 'organization'],
  autorun() {
    this.templateInstance.subscribe('riskImprovementPlan', this.riskId());
    this.templateInstance.subscribe('workItems', this.organizationId());
  },
  listArgs() {
    return {
      collection: Risks,
      template: 'Risks_List'
    };
  }
});
