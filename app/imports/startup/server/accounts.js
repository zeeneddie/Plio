import {Accounts} from 'meteor/accounts-base'

function onCreateUser(options, user) {
  if (options.profile) {
    user.profile = options.profile;

    const randomAvatar = Math.floor(Math.random() * 16) + 1;
    user.profile.avatar = `/avatars/avatar-placeholder-${randomAvatar}.png`;
  }

  return user;
}

Accounts.onCreateUser(onCreateUser);