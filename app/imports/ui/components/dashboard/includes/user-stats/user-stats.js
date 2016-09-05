import pluralize from 'pluralize';

import { Organizations } from '/imports/api/organizations/organizations.js';


Template.Dashboard_UserStats.viewmodel({
  mixin: ['organization', 'user'],

  usersOnline() {
    const orgUserIds = this.organization()
      .users
      .map(user => user.userId);

    return Meteor.users.find(
      { _id: { $in: orgUserIds }, status: 'online'},
      { sort: { 'profile.firstName': 1 } }
    );
  },

  title() {
    return pluralize('user', this.usersOnline().count(), true) + ' online';
  }
});
