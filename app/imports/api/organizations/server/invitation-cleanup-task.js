import InvitationService from '../invitation-service';

SyncedCron.add({
  name: 'Remove expired invitations and expired email verification tokens',
  
  schedule: function (parser) {
    return parser.text('every 1 minute');
  },
  
  job: function () {
    let emailVerificationExpirationTimeInHours = 0.03;
    let emailVerificationExpirationThresholdDate = moment().subtract(emailVerificationTimeInHours, 'hours').toDate();

    //get all users with expired invitations
    Meteor.users.find({ 
      invitationExpirationDate: { 
        $lt: new Date 
      } 
    }, { fields: { _id: 1 } }).forEach(userDoc => {
      
      //Because of meteor's protection remove each user by ID
      Meteor.users.remove({ _id: userDoc._id });
    });

    //get all users with expired email verification tokens
    Meteor.users.find({ 
      'services.email.verificationTokens.when': { 
        $lt: emailVerificationExpirationThresholdDate 
      },
      'emails.verified': false 
    }, { fields: { _id: 1 } }).forEach(userDoc => {
      Meteor.users.update({ _id: userDoc._id }, { $unset: { 'services.email': '' } });
    });

    console.log('Expired invitations and expired email verification tokens removed at ', new Date());
  }
});

SyncedCron.start();
