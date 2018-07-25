import InvitationService from '/imports/api/organizations/invitation-service';

SyncedCron.add({
  name: 'Remove expired invitations',

  schedule(parser) {
    return parser.text('every 1 day');
  },

  job() {
    // get all users with expired invitations
    Meteor.users.find({
      invitationExpirationDate: {
        $lt: new Date(),
      },
    }, { fields: { _id: 1 } }).forEach((userDoc) => {
      // Because of meteor's protection remove each user by ID
      Meteor.users.remove({ _id: userDoc._id });
    });

    console.log('Expired invitations removed at', new Date());
  },
});
