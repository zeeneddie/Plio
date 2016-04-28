import { Accounts } from 'meteor/accounts-base';
import Utils from '/imports/core/utils';

function onCreateUser(options, user) {
  if (options.profile) {
    user.profile = options.profile;

    user.profile.avatar = Utils.getRandomAvatarUrl();
  }

  return user;
}

Accounts.onCreateUser(onCreateUser);