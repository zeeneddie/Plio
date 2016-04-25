import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Organizations } from '/imports/api/organizations/organizations.js';

Template.OrganizationsMenu.viewmodel({
  share: 'organization',
  autorun() {
    this.templateInstance.subscribe('currentUserOrganizations');
  },
  organization() {
    return Organizations.findOne({ serialNumber: this.orgSerialNumber() });
  },
  organizations() {
    return Organizations.find({ 'users.userId': Meteor.userId() });
  }
});
