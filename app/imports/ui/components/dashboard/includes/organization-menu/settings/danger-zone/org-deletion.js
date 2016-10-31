import { Template } from 'meteor/templating';

Template.OrgSettings_OrgDeletion.viewmodel({
  organizationId: '',
  onDeteteButtonClick(e) {
    this.deleteOrganization();
  }
});
