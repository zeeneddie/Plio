import { Template } from 'meteor/templating';

Template.EditNC.viewmodel({
  mixin: ['organization', 'nonconformity'],
  NC() {
    return this._getNCByQuery({ _id: this._id() });
  },
  onUpdateNotifyUserCb() {
    return this.onUpdateNotifyUser.bind(this);
  },
  onUpdateNotifyUser({ query, options }, cb) {
    return this.update({ query, options }, cb);
  },
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(...args) {
    this.parent().update(...args);
  }
});
