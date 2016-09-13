import { Template } from 'meteor/templating';

import { extractIds } from '/imports/api/helpers.js';

Template.NC_Page.viewmodel({
  mixin: ['nonconformity', 'organization'],
  autorun() {
    const template = this.templateInstance;
    const NCIds = extractIds(this._getNCsByQuery());
    template.subscribe('occurrencesByNCIds', NCIds);
    template.subscribe('workItems', this.organizationId());
  }
});
