import { Template } from 'meteor/templating';
import { addedToNotifyList } from '/imports/api/standards/methods.js';
import Utils from '/imports/core/utils.js';


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
    const query = { _id: { $in: usersIds } };
    return Meteor.users.find(query);
  },
  update(userId, option, cb) {
    const query = { _id: this.standard()._id };
    const options = {
      [`${option}`]: {
        notify: userId
      }
    };

    this.parent().update(query, options, cb);
  },
  addToNotifyList(userId) {
    this.update(userId, '$addToSet', (err, res) => {
      if (err) {
        return;
      }

      this.notifyUser('');

      addedToNotifyList.call({
        standardId: this.standard()._id,
        userId
      }, (err, res) => {
        if (err) {
          Utils.showError(
            'Failed to send email to the user that was added to standard\'s notify list'
          );
        }
      });
    });
  },
  removeFromNotifyListFn() {
    return this.removeFromNotifyList.bind(this, Template.currentData());
  },
  removeFromNotifyList({ _id }) {
    this.update(_id, '$pull');
  }
});
