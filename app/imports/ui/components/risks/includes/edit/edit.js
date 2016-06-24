import { Template } from 'meteor/templating';

Template.EditRisk.viewmodel({
  mixin: ['risk', 'organization'],
  risk() {
    return this._getRiskByQuery({ _id: this._id() });
  },
  onUpdateNotifyUserCb() {
    return this.onUpdateNotifyUser.bind(this);
  },
  onUpdateNotifyUser({ query, options }, cb) {
    return this.update({ query, options }, cb);
  },
  update(...args) {
    return this.parent().update(...args);
  }
});
