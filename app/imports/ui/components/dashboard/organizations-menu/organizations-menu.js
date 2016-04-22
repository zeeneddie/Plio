import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Organizations } from '/imports/api/organizations/organizations.js';


Template.OrganizationsMenu.viewmodel({
  share: 'organization',
  autorun() {
    this.templateInstance.subscribe('organizationsByUserId');
  },
  organization() {
    return Organizations.findOne({ serialNumber: this.orgSerialNumber() });
  },
  organizations() {
    return Organizations.find({ 'users.userId': Meteor.userId() });
  }
});
