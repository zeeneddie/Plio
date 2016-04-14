import { Organizations } from '/imports/api/organizations/organizations.js';

Template.OrganizationsMenu.helpers({
  organizations() {
    return Organizations.find({ 'users.userId': Meteor.userId() });
  },
  regex() {
    return `^\\/organizations/${this._id}`;
  }
});

Template.OrganizationsMenu.events({
  'click .org-settings-modal-link'(e, tpl) {
    ModalManager.open('Organizations_Settings');
  }
});
