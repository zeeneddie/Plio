import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

import { Organizations } from '/imports/api/organizations/organizations.js';

Template.OrganizationsMenu.onCreated(function() {
  this.autorun(() => this.subscribe('organizationsByUserId'));
});

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
