import { Template } from 'meteor/templating';

Template.NCPage.viewmodel({
  share: 'window',
  mixin: ['mobile', 'nonconformity', 'organization'],
  autorun() {
    const template = this.templateInstance;
    const NCIds = this._getNCsByQuery({}).fetch().map(({ _id }) => _id);
    template.subscribe('occurrencesByNCIds', NCIds)
    template.subscribe('NCImprovementPlan', this.NCId());
    template.subscribe('workItems', this.organizationId());    
  }
});
