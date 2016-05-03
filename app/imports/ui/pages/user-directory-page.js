import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Organizations } from '/imports/api/organizations/organizations.js';

Template.UserDirectoryPage.viewmodel({
  activeUser() {
    return FlowRouter.getParam('userId') || null;
  },

  getCurrentOrganizationSerialNumber() {
    return parseInt(FlowRouter.getParam('orgSerialNumber'));
  }, 

  autorun() {
    const organizationsHandle = this.templateInstance.subscribe('currentUserOrganizations');
    
    if (organizationsHandle.ready()) {
      const userIds = this.getCurrentOrganizationUsers();
      if (userIds && userIds.length) {
        const organizationUsersHandle = this.templateInstance.subscribe('organizationUsers', userIds);
        if (!this.activeUser() && organizationUsersHandle.ready()) {
          FlowRouter.go('userDirectoryUserPage', { 
            orgSerialNumber: this.getCurrentOrganizationSerialNumber(), 
            userId: this.organizationUsers().fetch()[0]._id
          });
        }
      }
    }
  },

  user() {
    return Meteor.users.findOne({ _id: this.activeUser() })
  },

  organizationUsers() {
    const userIds = this.getCurrentOrganizationUsers();

    if (userIds) {
      this.activeUser(userIds[0]);

      return Meteor.users.find({ _id: { $in: userIds }}, { sort: { 'profile.firstName': 1, 'emails.0.address': 1 }});
    }
  },

  getCurrentOrganizationUsers() {
    const organization = Organizations.findOne({ serialNumber: this.getCurrentOrganizationSerialNumber() });
    if (organization) {
      const { users } = organization;
      return _.pluck(users, 'userId');
    }
  }
});
