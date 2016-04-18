import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

import { Organizations } from '/imports/api/organizations/organizations.js';

Template.OrganizationsMenu.helpers({
  organization() {
    const serialNumber = Number(FlowRouter.getParam('orgSerialNumber'));
    return Organizations.findOne({ serialNumber });
  },
  organizations() {
    return Organizations.find({ 'users.userId': Meteor.userId() });
  },
  regex() {
    return `^\\/${this.serialNumber}`;
  }
});

Template.OrganizationsMenu.events({
  'click .org-settings-modal-link'(e, tpl) {
    ModalManager.open('Organizations_Settings');
  }
});
