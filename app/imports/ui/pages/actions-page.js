import { Template } from 'meteor/templating';

Template.ActionsPage.viewmodel({
  share: 'window',
  mixin: ['mobile', 'organization'],
  autorun() {
    this.templateInstance.subscribe('nonConformities', this.organizationId());
    this.templateInstance.subscribe('risks', this.organizationId());
  }
});
