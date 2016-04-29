import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Organizations } from '/imports/api/organizations/organizations.js';

Template.UserDirectoryPage.viewmodel({
  activeUser: null,
  autorun() {
    const organizationsHandle = this.templateInstance.subscribe('currentUserOrganizations');
    
    if (organizationsHandle.ready()) {
      const userIds = getOrganizationUsers();
      if (userIds) {
        this.templateInstance.subscribe('organizationUsers', userIds);
      } else {
        FlowRouter.go('signIn');
      }
    }
  },
  user() {
    return Meteor.users.findOne({ _id: this.activeUser() })
  },
  organizationUsers() {
    const userIds = getOrganizationUsers();

    if (userIds) {
      this.activeUser(userIds[0]);

      return Meteor.users.find({ _id: { $in: userIds }}, { sort: { 'profile.firstName': 1 }});
    }
  }
});

function getOrganizationUsers() {
  const serialNumber = Number(FlowRouter.getParam('orgSerialNumber'));
  const organization  = Organizations.findOne({ serialNumber });
  if (organization) {
    const { users } = organization;
    return _.pluck(users, 'userId');
  }

  return null;
}