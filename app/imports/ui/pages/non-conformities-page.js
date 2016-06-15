import { Template } from 'meteor/templating';

Template.NCPage.viewmodel({
  share: 'window',
  mixin: ['mobile', 'nonconformity', 'organization'],
  autorun() {
    const NCIds = this._getNCsByQuery({}).fetch().map(({ _id }) => _id);
    this.templateInstance.subscribe('occurencesByNCIds', NCIds)
  }
});
