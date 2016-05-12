import { Meteor } from 'meteor/meteor';

Meteor.publish(null, function() {
  return Meteor.users.find({ _id: this.userId });
});

Meteor.publish('organizationUsers', function (orgId) {
  const organization = Organizations.findOne({ 
    _id: orgId, 
    users: { 
      $elemMatch: { 
        userId: this.userId, 
        isDeleted: { $ne: false } 
      } 
    } 
  });
  if (!organization) {
    throw new Meteor.Error('organization-not-found', 'Organization Not Found');
  }
  const { users } = organization;
  const existingUsersIds = _.filter(users, (usrDoc) => {
    const { isRemoved, removedBy, removedAt } = usrDoc;
    return !isRemoved && !removedBy && !removedAt;
  });
  return Meteor.users.find({ _id: { $in: _.pluck(existingUsersIds, 'userId') } });
});