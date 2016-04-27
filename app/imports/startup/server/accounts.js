import { Accounts } from 'meteor/accounts-base'

function onCreateUser(options, user) {
  if (options.profile) {
    user.profile = options.profile;

    user.profile.avatar = getUserAvatar();
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

function getUserAvatar() {
  const randomAvatar = Math.floor(Math.random() * 16) + 1;
  return `/avatars/avatar-placeholder-${randomAvatar}.png`;
}

Accounts.onCreateUser(onCreateUser);