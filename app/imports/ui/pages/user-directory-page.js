import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Organizations } from '/imports/api/organizations/organizations.js';

Template.UserDirectoryPage.viewmodel({
  share: 'search',
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
  currentUser() {
    return this.activeUser() && Meteor.users.findOne({ _id: this.activeUser() });
  },
  organizationUsers() {
    const userIds = getOrganizationUsers();
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
  }
});

function getOrganizationUsers() {
  const serialNumber = Number(FlowRouter.getParam('orgSerialNumber'));
  const organization  = Organizations.findOne({ serialNumber });
  if (organization) {
    const { users } = organization;
    return _.pluck(users, 'userId');
  }

  return [];
}