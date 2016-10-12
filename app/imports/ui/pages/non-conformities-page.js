import { Template } from 'meteor/templating';

import { extractIds } from '/imports/api/helpers.js';
import { NonConformities } from '/imports/api/non-conformities/non-conformities.js';
import { DocumentsListSubs, OrgSettingsDocSubs } from '/imports/startup/client/subsmanagers.js';

Template.NC_Page.viewmodel({
  mixin: ['nonconformity', 'organization'],
  autorun() {
    const template = this.templateInstance;
    const NCIds = extractIds(this._getNCsByQuery());
    const organizationId = this.organizationId();
    
    template.subscribe('occurrencesByNCIds', NCIds);
    DocumentsListSubs.subscribe('workItemsList', organizationId);
    DocumentsListSubs.subscribe('standardsList', organizationId);
    DocumentsListSubs.subscribe('risksList', organizationId);
    OrgSettingsDocSubs.subscribe('departments', organizationId);
  },
  listArgs() {
    return {
      collection: NonConformities,
      template: 'NC_List'
    };
  }
});
