import { Template } from 'meteor/templating';

import { extractIds } from '/imports/api/helpers.js';
import { NonConformities } from '/imports/api/non-conformities/non-conformities.js';
import { DocumentsListSubs } from '/imports/startup/client/subsmanagers.js';

Template.NC_Page.viewmodel({
  mixin: ['nonconformity', 'organization'],
  autorun() {
    const template = this.templateInstance;
    const NCIds = extractIds(this._getNCsByQuery());
    template.subscribe('occurrencesByNCIds', NCIds);
    DocumentsListSubs.subscribe('workItemsList', this.organizationId());
  },
  listArgs() {
    return {
      collection: NonConformities,
      template: 'NC_List'
    };
  }
});
