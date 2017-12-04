import moment from 'moment-timezone';
import { SyncedCron } from 'meteor/percolate:synced-cron';
import { Meteor } from 'meteor/meteor';

SyncedCron.add({
  name: 'Remove expired email verification tokens',

  schedule(parser) {
    return parser.text('every 1 day');
  },

  job() {
    const emailVerificationExpirationTimeInDays =
      Meteor.settings.public.emailVerificationExpirationTimeInDays || 3;
    const emailVerificationThresholdDate = moment()
      .subtract(emailVerificationExpirationTimeInDays, 'days')
      .toDate();

    // In case if we'll need to remove users with expired tokens
    // //get all users with expired invitations
    // Meteor.users.find({
    //   invitationExpirationDate: {
    //     $lt: new Date
    //   }
    // }, { fields: { _id: 1 } }).forEach(userDoc => {
    //
    //   //Because of meteor's protection remove each user by ID
    //   Meteor.users.remove({ _id: userDoc._id });
    // });

    // get all users with expired email verification tokens
    Meteor.users.find({
      'services.email.verificationTokens.when': {
        $lt: emailVerificationThresholdDate,
      },
      'emails.verified': false,
    }, { fields: { _id: 1 } }).forEach((userDoc) => {
      Meteor.users.update(
        { _id: userDoc._id },
        { multi: true },
        {
          $pull: {
            'services.email.verificationTokens': { when: { $lt: emailVerificationThresholdDate } },
          },
        },
      );
    });

    console.log('Expired email verification tokens removed at', new Date());
  },
});
