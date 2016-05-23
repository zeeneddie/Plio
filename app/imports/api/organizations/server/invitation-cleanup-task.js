import InvitationService from '../invitation-service';

SyncedCron.add({
  name: 'Remove expired invitations',
  
  schedule: function (parser) {
    return parser.text('every 1 minute');//parser.text('every 24 hours');
  },
  
  job: function () {
    let expirationTimeInHours = InvitationService.getInvitationExpirationTime();
    let thresholdDate = moment().subtract(expirationTimeInHours, 'hours').toDate();

    //get all users with expired invitations
    Meteor.users.find({invitedAt: {$lt: thresholdDate}}, {fields: {_id: 1}}).forEach(userDoc => {
      //Because of meteor's protection remove each user by ID
      Meteor.users.remove({_id: userDoc._id});
    });

    console.log('Expired invitations removed at ', new Date());
  }
});
