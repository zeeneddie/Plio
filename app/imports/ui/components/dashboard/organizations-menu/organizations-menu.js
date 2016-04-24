import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Organizations } from '/imports/api/organizations/organizations.js';

Template.OrganizationsMenu.viewmodel({
  autorun() {
    this.templateInstance.subscribe('currentUserOrganizations');
  },
  organization() {
    const serialNumber = Number(FlowRouter.getParam('orgSerialNumber'));
    return Organizations.findOne({ serialNumber });
  },
  organizations() {
    return Organizations.find({ 'users.userId': Meteor.userId() });
  }
});
