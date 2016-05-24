import InvitationService from '/imports/api/organizations/invitation-service';

SyncedCron.add({
  name: 'Remove expired email verification tokens',
  
  schedule: function (parser) {
    return parser.text('every 1 day');
  },
  
  job: function () {
    let emailVerificationTimeInHours = Meteor.settings.invitationVerificationTimeInHours || 72;
    let emailVerificationThresholdDate = moment().subtract(emailVerificationTimeInHours, 'hours').toDate();

    //get all users with expired email verification tokens
    Meteor.users.find({ 
      'services.email.verificationTokens.when': { 
        $lt: emailVerificationThresholdDate 
      },
      'emails.verified': false 
    }, { fields: { _id: 1 } }).forEach(userDoc => {
      Meteor.users.update({ _id: userDoc._id }, { $unset: { 'services.email': '' } });
    });

    console.log('Expired email verification tokens removed at ', new Date());
  }
});
