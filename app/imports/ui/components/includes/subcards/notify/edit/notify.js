import { Template } from 'meteor/templating';

import { addedToNotifyList } from '/imports/api/standards/methods.js';
import Utils from '/imports/core/utils.js';

Template.Subcards_Notify_Edit.viewmodel({
  mixin: ['search', 'user', 'members'],
  members() {
    return this._members({ _id: { $nin: this.currentNotifyUsersIds() } });
  },
  doc: '',
  documentType: '',
  currentNotifyUsersIds() {
    return this.currentNotifyUsers().fetch().map(({ _id }) => _id) || [];
  },
  currentNotifyUsers() {
    const usersIds = (this.doc() && this.doc().notify) || [];
    const query = { _id: { $in: usersIds } };
    const options = { sort: { 'profile.firstName': 1 } };
    return Meteor.users.find(query, options);
  },
  onUpdate() {},
  update(userId, option, cb) {
    const _id = this.doc() && this.doc()._id;
    const query = { _id };
    const options = {
      [`${option}`]: {
        notify: userId
      }
    };

    this.onUpdate({ query, options }, cb);
  },
  onSelectUserCb() {
    return this.onSelectUser.bind(this);
  },
  onSelectUser(viewmodel) {
    const { selected:userId } = viewmodel.getData();
    const currentNotifyUsersIds = this.currentNotifyUsersIds();

    if (_.contains(currentNotifyUsersIds, userId)) return;

    this.addToNotifyList(userId, viewmodel);
  },
  addToNotifyList(userId, viewmodel) {
    this.update(userId, '$addToSet', (err, res) => {
      if (err) {
        return;
      }

      viewmodel.value('');
      viewmodel.selected('');

      // TODO need one for non-conformities
      if (this.documentType() === 'standard') {
        addedToNotifyList.call({
          standardId: this.doc()._id,
          userId
        }, (err, res) => {
          if (err) {
            Utils.showError(
              'Failed to send email to the user that was added to standard\'s notify list'
            );
          }
        });
      }
    });
  },
  removeFromNotifyListFn() {
    return this.removeFromNotifyList.bind(this, Template.currentData());
  },
  removeFromNotifyList({ _id }) {
    this.update(_id, '$pull');
  }
});
