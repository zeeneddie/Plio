import pluralize from 'pluralize';

import { Organizations } from '/imports/api/organizations/organizations.js';


Template.Dashboard_UserStats.viewmodel({
  mixin: ['organization', 'user'],

  usersOnline() {
    const org = this.organization();

    if(!org || !(org.users instanceof Array)){
      return;
    }

    const orgUserIds = org.users.map(user => user.userId);

    return Meteor.users.find(
      { _id: { $in: orgUserIds }, status: { $in: ['online', 'away'] } },
      { sort: { 'profile.firstName': 1 } }
    );
  },

  title() {
    const usersOnline = this.usersOnline();

    return usersOnline
      ? pluralize('user', usersOnline.count(), true) + ' online'
      : '';
  }
});
