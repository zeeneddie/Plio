import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Organizations } from '/imports/api/organizations/organizations.js';

Template.UserDirectoryPage.viewmodel({
  share: 'search',
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
  currentUser() {
    return this.activeUser() && Meteor.users.findOne({ _id: this.activeUser() });
  },

  organizationUsers() {
    const userIds = this.getCurrentOrganizationUsers();
    const findQuery = {};
    
    findQuery['$and'] = [
      { _id: { $in: userIds }},
      { ...this.searchUser() }
    ];
      
    const cursor = Meteor.users.find(findQuery, { sort: { 'profile.firstName': 1 }});
      
    const result = _.pluck(cursor.fetch(), '_id');
    
    if (result.length) {
      this.activeUser(result[0]);

      return cursor;
    } else {
      this.activeUser(null);
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
