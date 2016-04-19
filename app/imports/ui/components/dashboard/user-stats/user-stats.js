Template.UserStats.helpers({
  usersOnline() {
    return Meteor.users.find({status: 'online'}).fetch()
  }
});