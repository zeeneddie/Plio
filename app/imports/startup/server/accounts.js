import { Accounts } from 'meteor/accounts-base';
import Utils from '/imports/core/utils';

function onCreateUser(options, user) {
  if (options.profile) {
    user.profile = options.profile;
    user.profile.avatar = Utils.getRandomAvatarUrl();
    user.profile.initials = getUserInitials(user.profile);
  }

  return user;
}

function getUserInitials(userProfile) {
  const { firstName='', lastName='' } = userProfile;
  let initials = '';
  if (firstName) {
    initials += firstName.charAt(0);
  }

  if (lastName) {
    initials += lastName.charAt(0);
  }

  return initials.toUpperCase();
}

Accounts.onCreateUser(onCreateUser);

Accounts.urls.verifyEmail = function(token) {
  return Meteor.absoluteUrl(`verify-email/${token}`);
};