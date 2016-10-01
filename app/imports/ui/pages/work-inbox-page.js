import { Template } from 'meteor/templating';

import { Occurrences } from '/imports/api/occurrences/occurrences.js';
import { DocumentsListSubs, OrgSettingsDocSubs } from '/imports/startup/client/subsmanagers.js';

Template.WorkInbox_Page.viewmodel({
  mixin: ['organization', 'nonconformity', 'workInbox'],
  autorun() {
    const template = this.templateInstance;
    const _id = this.organizationId();
    const NCIds = this._getNCsByQuery({}).map(({ _id }) => _id);
    const { linkedDoc: { _id:linkedDocId } = {} } =
      Object.assign({}, this._getWorkItemByQuery({ _id: this.workItemId() }));

    OrgSettingsDocSubs.subscribe('departments', _id);
    OrgSettingsDocSubs.subscribe('riskTypes', _id);
    DocumentsListSubs.subscribe('standardsList', _id);
  }
});
