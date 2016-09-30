import { Template } from 'meteor/templating';

import { Risks } from '/imports/api/risks/risks.js';
import { DocumentsListSubs } from '/imports/startup/client/subsmanagers.js';

Template.Risks_Page.viewmodel({
  mixin: ['risk', 'organization'],
  autorun() {
    this.templateInstance.subscribe('riskImprovementPlan', this.riskId());
    DocumentsListSubs.subscribe('workItemsList', this.organizationId());
  },
  listArgs() {
    return {
      collection: Risks,
      template: 'Risks_List'
    };
  }
});
