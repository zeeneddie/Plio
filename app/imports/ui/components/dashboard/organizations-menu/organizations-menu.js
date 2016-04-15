import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

import { Organizations } from '/imports/api/organizations/organizations.js';

Template.OrganizationsMenu.helpers({
  organizations() {
    return Organizations.find({ 'users.userId': Meteor.userId() });
  },
  regex() {
    return `^\\/${this.serialNumber}`;
  }
});

Template.OrganizationsMenu.events({
  'click .js-create-organization'(e, tpl) {
    Blaze.renderWithData(
      Template.ModalWindow,
      {
        template: 'NewOrganizationForm',
        name: 'new-organization',
        title: 'Create organization'
      },
      document.body
    );
  }
});
