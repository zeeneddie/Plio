import moment from 'moment-timezone';
import { check } from 'meteor/check';

import { AvatarPlaceholders } from '/imports/api/constants.js';

export default Utils = {
  getRandomAvatarUrl() {
    const randomAvatarIndex = Math.floor(Math.random() * 16);
    return AvatarPlaceholders[randomAvatarIndex];
  },

  showError(errorMsg) {
    toastr.error(errorMsg);
  },

  isProduction() {
    return process.env.NODE_ENV !== 'development';
  },

  generateUserInitials(userProfile) {
    const { firstName, lastName} = userProfile;
    let initials = '';
    if (firstName) {
      initials += firstName.charAt(0);
    }

    if (lastName) {
      initials += lastName.charAt(0);
    }

    return initials.toUpperCase();
  },

  generateSerialNumber(collection, query = {}, defaultNumber = 1) {
    check(defaultNumber, Number);

    const last = collection.findOne({
      ...query,
      serialNumber: {
        $type: 16 // 32-bit integer
      }
    }, {
      sort: {
        serialNumber: -1
      }
    });

    return last ? last.serialNumber + 1 : defaultNumber;
  },

  getUserFullNameOrEmail(userOrId) {
    let user = userOrId;
    if (typeof userOrId === 'string') {
      user = Meteor.users.findOne(userOrId);
    }

    return (user && user.fullNameOrEmail()) || 'Ghost';
  },

  getPrettyUTCDate(date) {
    return `${moment(date).tz('UTC').format('DD MMM YYYY hh:mm:ss')} (UTC)`;
  }
}
