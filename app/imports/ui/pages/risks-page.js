import { Template } from 'meteor/templating';

import { Risks } from '/imports/share/collections/risks.js';
import { DocumentsListSubs, OrgSettingsDocSubs } from '/imports/startup/client/subsmanagers.js';


Template.Risks_Page.viewmodel({
  mixin: ['risk', 'organization'],
  autorun() {
    const organizationId = this.organizationId();

    this.templateInstance.subscribe('riskImprovementPlan', this.riskId());
    DocumentsListSubs.subscribe('workItemsList', organizationId);
    DocumentsListSubs.subscribe('standardsList', organizationId);
    DocumentsListSubs.subscribe('nonConformitiesList', organizationId);
    OrgSettingsDocSubs.subscribe('departments', organizationId);
  },
  listArgs() {
    return {
      collection: Risks,
      template: 'Risks_List'
    };
  }
});
