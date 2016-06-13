import pluralize from 'pluralize';

Template.UserStats.viewmodel({
  mixin: ['user'],
  usersOnline() {
    return Meteor.users.find({status: 'online'});
  },
  title() {
    return pluralize('user', this.usersOnline().count(), true) + ' online';
  }
});
