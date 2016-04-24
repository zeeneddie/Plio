Template.UserStats.viewmodel({
  usersOnline() {
    return Meteor.users.find({status: 'online'});
  }
});
