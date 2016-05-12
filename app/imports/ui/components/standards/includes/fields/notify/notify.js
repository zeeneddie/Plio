import { Template } from 'meteor/templating';

Template.ESNotify.viewmodel({
  mixin: ['collapse', 'search', 'user'],
  notifyUser: '',
  members() {
    let query = this.searchObject('notifyUser', ['profile.firstName', 'profile.lastName']);
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
  update(doc, option) {
    const { _id } = doc;
    const query = { _id: this.standard()._id };
    const options = {};

    options[option] = {
      notify: _id
    };

    this.parent().update(query, options);
  }
});
