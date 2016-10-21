import { Template } from 'meteor/templating';

import { Occurrences } from '/imports/share/collections/occurrences.js';
import { DocumentsListSubs, OrgSettingsDocSubs } from '/imports/startup/client/subsmanagers.js';


Template.ActionsPage.viewmodel({
  share: 'window',
  mixin: ['mobile', 'organization', 'nonconformity'],
  autorun() {
    const template = this.templateInstance;
    const _id = this.organizationId();

    OrgSettingsDocSubs.subscribe('departments', _id);
    OrgSettingsDocSubs.subscribe('riskTypes', _id);
    DocumentsListSubs.subscribe('standardsList', _id);
  }
});
