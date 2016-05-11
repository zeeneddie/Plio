import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Organizations } from '/imports/api/organizations/organizations.js';

Template.OrganizationsMenu.viewmodel({
  mixin: ['modal', 'organization'],
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
      title: 'Org Settings',
      organizationId: this.organization()._id
    });
    // ModalManager.open('OrganizationSettings');
  }
});
