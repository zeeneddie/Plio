import { Template } from 'meteor/templating';

Template.NC_Page.viewmodel({
  mixin: ['nonconformity', 'organization'],
  autorun() {
    const template = this.templateInstance;
    const NCIds = Object.assign([], this._getNCsByQuery()).map(({ _id }) => _id);
    template.subscribe('occurrencesByNCIds', NCIds);
    template.subscribe('workItems', this.organizationId());
  }
});
