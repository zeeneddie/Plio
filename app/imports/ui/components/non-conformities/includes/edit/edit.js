import { Template } from 'meteor/templating';

import { update } from '/imports/api/non-conformities/methods.js';

Template.EditNC.viewmodel({
  mixin: ['organization', 'modal', 'nonconformity'],
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
  update({ query = {}, options = {}, ...args }, cb = () => {}) {
    const _id = this._id();
    const organizationId = this.organizationId();
    const arguments = { ...args, _id, options, query, organizationId };

    console.log(arguments);

    this.modal().callMethod(update, arguments, cb);
  }
});
