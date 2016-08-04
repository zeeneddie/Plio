import { Template } from 'meteor/templating';

Template.NC_Page.viewmodel({
  share: 'window',
  mixin: ['mobile', 'nonconformity', 'organization'],
  autorun() {
    const NCIds = this._getNCsByQuery({}).fetch().map(({ _id }) => _id);
    this.templateInstance.subscribe('occurrencesByNCIds', NCIds)
  }
});
