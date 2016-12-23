import moment from 'moment-timezone';

import InvitationService from '/imports/api/organizations/invitation-service';

SyncedCron.add({
  name: 'Remove expired email verification tokens',

  schedule: function (parser) {
    return parser.text('every 1 day');
  },

  job: function () {
    let emailVerificationExpirationTimeInDays = Meteor.settings.public.emailVerificationExpirationTimeInDays || 3;
    let emailVerificationThresholdDate = moment().subtract(emailVerificationExpirationTimeInDays, 'days').toDate();

    //get all users with expired email verification tokens
    Meteor.users.find({
      'services.email.verificationTokens.when': {
        $lt: emailVerificationThresholdDate
      },
      'emails.verified': false
    }, { fields: { _id: 1 } }).forEach(userDoc => {
      Meteor.users.update(
        { _id: userDoc._id },
        { $pull: { 'services.email.verificationTokens': { when: { $lt: emailVerificationThresholdDate  } } } },
        { multi: true }
      )
    });

    console.log('Expired email verification tokens removed at', new Date());
  }
});
