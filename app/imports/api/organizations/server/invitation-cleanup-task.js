import moment from 'moment-timezone';
import { SyncedCron } from 'meteor/percolate:synced-cron';
import { Meteor } from 'meteor/meteor';

SyncedCron.add({
  name: 'Remove expired invitations and expired email verification tokens',

  schedule(parser) {
    return parser.text('every 1 minute');
  },

  job() {
    const emailVerificationExpirationTimeInHours = 0.03;
    const emailVerificationExpirationThresholdDate = moment()
      .subtract(emailVerificationExpirationTimeInHours, 'hours')
      .toDate();

    // get all users with expired invitations
    Meteor.users.find({
      invitationExpirationDate: {
        $lt: new Date(),
      },
    }, { fields: { _id: 1 } }).forEach(userDoc => Meteor.users.remove({ _id: userDoc._id }));

    // get all users with expired email verification tokens
    Meteor.users.find({
      'services.email.verificationTokens.when': {
        $lt: emailVerificationExpirationThresholdDate,
      },
      'emails.verified': false,
    }, { fields: { _id: 1 } }).forEach((userDoc) => {
      Meteor.users.update({ _id: userDoc._id }, { $unset: { 'services.email': '' } });
    });

    console.log(
      'Expired invitations and expired email verification tokens removed at ',
      new Date(),
    );
  },
});

SyncedCron.start();
