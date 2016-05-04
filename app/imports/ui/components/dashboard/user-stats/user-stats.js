Template.UserStats.viewmodel({
  mixin: ['user'],
  usersOnline() {
    return Meteor.users.find({status: 'online'});
  }
});
