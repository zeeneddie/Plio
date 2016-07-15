import { Template } from 'meteor/templating';

import { addedToNotifyList } from '/imports/api/standards/methods.js';
import Utils from '/imports/core/utils.js';

Template.Subcards_Notify_Edit.viewmodel({
  mixin: ['search', 'user', 'members'],
  document: '',
  documentType: '',
  placeholder: 'User to notify',
  currentNotifyUsersIds() {
    return Array.from(this.currentNotifyUsers() || []).map(({ _id }) => _id);
  },
  currentNotifyUsers() {
    const usersIds = (this.document() && this.document().notify) || [];
    const query = { _id: { $in: usersIds } };
    const options = { sort: { 'profile.firstName': 1 } };
    return this._mapMembers(Meteor.users.find(query, options));
  },
  onUpdate() {},
  update(userId, option, cb) {
    const _id = this.document() && this.document()._id;
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
    const { selectedItemId:userId } = viewmodel.getData();
    const currentNotifyUsersIds = Array.from(this.currentNotifyUsersIds() || []);

    if (currentNotifyUsersIds.find(_id => _id === userId)) return;

    this.addToNotifyList(userId, viewmodel);
  },
  addToNotifyList(userId, viewmodel) {
    const callback = (err, res) => {
      if (err) return;

      // TODO need one for Non-conformities, risks, actions
      if (this.documentType() === 'standard') {
        addedToNotifyList.call({
          standardId: this.document()._id,
          userId
        }, (err, res) => {
          if (err) {
            Utils.showError(
              'Failed to send email to the user that was added to standard\'s notify list'
            );
          }
        });
      }
    };

    this.update(userId, '$addToSet', callback);
  },
  onRemoveFromNotifyListCb() {
    return this.removeFromNotifyList.bind(this);
  },
  removeFromNotifyList(viewmodel) {
    const { selectedItemId:userId } = viewmodel.getData();
    const currentNotifyUsersIds = Array.from(this.currentNotifyUsersIds() || []);

    if (!currentNotifyUsersIds.find(_id => _id === userId)) return;

    this.update(userId, '$pull');
  }
});
