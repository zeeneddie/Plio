import { Accounts } from 'meteor/accounts-base';
import Utils from '/imports/core/utils';

function onCreateUser(options, user) {
  if (options.profile) {
    user.profile = options.profile;
    user.profile.avatar = Utils.getRandomAvatarUrl();
    user.profile.initials = Utils.generateUserInitials(options.profile);
  }
  user.isNotificationsEnabled = true;

  return user;
}

Accounts.onCreateUser(onCreateUser);

Accounts.urls.verifyEmail = (token) => {
  return Meteor.absoluteUrl(`verify-email/${token}`);
};

Accounts.urls.resetPassword = (token) => {
  return Meteor.absoluteUrl(`reset-password/${token}`);
};
