import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Organizations } from '/imports/api/organizations/organizations.js';

Template.OrganizationsMenu.viewmodel({
  mixin: ['modal', 'organization', 'roles'],
  autorun() {
    this.templateInstance.subscribe('currentUserOrganizations');
  },
  organizations() {
    return Organizations.find({ 'users.userId': Meteor.userId() });
  },
  openOrgSettings(e) {
    e.preventDefault();
    this.modal().open({
      template: 'OrganizationSettings',
      _title: 'Org Settings',
      organizationId: this.organization()._id
    });
  },
  openCreateNewOrgModal(e) {
    e.preventDefault();
    this.modal().open({
      template: 'OrganizationSettings_MainSettings',
      _title: 'New organization',
      variation: 'save',
      owner: Meteor.user().fullName(),
      currency: 'GBP'
    });
  }
});
