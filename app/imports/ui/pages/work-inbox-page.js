import { Template } from 'meteor/templating';

import { Occurrences } from '/imports/api/occurrences/occurrences.js';
import { DocumentsListSubs } from '/imports/startup/client/subsmanagers.js';

Template.WorkInbox_Page.viewmodel({
  mixin: ['organization', 'nonconformity', 'workInbox'],
  autorun() {
    const template = this.templateInstance;
    const _id = this.organizationId();
    const NCIds = this._getNCsByQuery({}).map(({ _id }) => _id);
    const { linkedDoc: { _id:linkedDocId } = {} } =
      Object.assign({}, this._getWorkItemByQuery({ _id: this.workItemId() }));

    template.subscribe('lessons', _id);
    template.subscribe('departments', _id);
    template.subscribe('riskTypes', _id);
    DocumentsListSubs.subscribe('standardsList', _id);
    template.subscribe('occurrencesByNCIds', NCIds);
  }
});
