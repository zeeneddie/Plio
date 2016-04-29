import { Meteor } from 'meteor/meteor';
import { ViewModel } from 'meteor/manuel:viewmodel';

import { Organizations } from '/imports/api/organizations/organizations.js';

ViewModel.mixin({
  user: {
    userFullNameOrEmail(userOrUserId) {
      let user = userOrUserId;
      if (typeof userOrUserId === 'string') {
        user = Meteor.users.findOne(userOrUserId);
      }

      if (user) {
        const {firstName='', lastName=''} = user.profile;

        if (firstName && lastName) {
          return `${firstName} ${lastName}`;
        } else {
          return user.emails[0].address;
        }
      }
    },
    email(user) {
      return user.emails[0].address;
    },
    address(user) {
      const { address='' } = user.profile;
      return address;
    },
    avatar(user) {
      return user.profile.avatar;
    },
    description(user) {
      return user.profile.description;
    }
  },
  organization: {
    organization() {
      const serialNumber = Number(FlowRouter.getParam('orgSerialNumber'));
      return Organizations.findOne({ serialNumber });
    }
  }
});