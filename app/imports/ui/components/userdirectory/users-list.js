import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Organizations } from '/imports/api/organizations/organizations.js';

Template.UsersList.viewmodel({
  isActiveUser(userId) {
    return this.parent().activeUser() === userId;
  }
});