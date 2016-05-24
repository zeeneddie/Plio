import { Template } from 'meteor/templating';

Template.ESNotify.viewmodel({
  mixin: ['collapse', 'search', 'user'],
  notifyUser: '',
  members() {
    let query = this.searchObject('notifyUser', [{ name: 'profile.firstName' }, { name: 'profile.lastName' }, { name: 'emails.0.address' }])
    const options = { sort: { 'profile.firstName': 1 } };
    const currentNotifyUsersIds = this.currentNotifyUsers().fetch().map(doc => doc._id);
    const excludedDocs = { _id: { $nin: currentNotifyUsersIds } };

    query = _.extend(query, excludedDocs);

    return Meteor.users.find(query, options);
  },
  notifyUsersList() {
    return this.standard() && this.standard().notify || [];
  },
  currentNotifyUsers() {
    const usersIds = this.notifyUsersList();
    return Meteor.users.find({ _id: { $in: usersIds } });
  },
  addToNotifyList(userId) {
    this.parent().addToNotifyList(userId);
  },
  removeFromNotifyList(userId) {
    this.parent().removeFromNotifyList(userId);
  }
});
