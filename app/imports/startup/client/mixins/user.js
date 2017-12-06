import { Meteor } from 'meteor/meteor';

export default {
  userNameOrEmail(userOrUserId, { disableLastName = false } = {}) {
    let user = userOrUserId;
    if (typeof userOrUserId === 'string') {
      user = Meteor.users.findOne(userOrUserId);
    }

    if (user) {
      const { firstName = '', lastName = '' } = user.profile;

      if (firstName && lastName) {
        // Last name is required, so it's OK to check both firstName and lastName vars here
        return disableLastName ? firstName : `${firstName} ${lastName}`;
      }
      return user.emails[0].address;
    }
    return 'Ghost';
  },

  hasUser() {
    return !!Meteor.userId() || Meteor.loggingIn();
  },
};
