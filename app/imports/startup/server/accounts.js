import { Accounts } from 'meteor/accounts-base';
import { getRandomAvatarUrl, generateUserInitials } from '/imports/api/helpers.js';
import UserNotificationsSender from '/imports/api/users/user-notifications-sender.js';


function onCreateUser(options, user) {
  if (options.profile) {
    user.profile = options.profile;
    user.profile.avatar = getRandomAvatarUrl();
    user.profile.initials = generateUserInitials(options.profile);
  }

  return user;
}

Accounts.onCreateUser(onCreateUser);

Accounts.urls.verifyEmail = (token) => {
  return Meteor.absoluteUrl(`verify-email/${token}`);
};

Accounts.urls.resetPassword = (token) => {
  return Meteor.absoluteUrl(`reset-password/${token}`);
};

// send notification if user reset password
const resetPassword = Meteor.server.method_handlers['resetPassword'];

Meteor.server.method_handlers['resetPassword'] = function(...args) {
  const res = resetPassword.call(this, ...args);

  Meteor.defer(() => new UserNotificationsSender(res.id).passwordReset());

  return res;
};
