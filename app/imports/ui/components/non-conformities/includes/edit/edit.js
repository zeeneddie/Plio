import { Template } from 'meteor/templating';

import { Problems } from '/imports/api/problems/problems.js';
import { update } from '/imports/api/problems/methods.js';

Template.EditNC.viewmodel({
  mixin: ['organization', 'modal'],
  NC() {
    const organizationId = this.organizationId();
    const _id = this._id();
    const type = 'non-conformity';

    const query = { organizationId, _id, type };

    return Problems.findOne(query);
  },
  onUpdateNotifyUserCb() {
    return this.onUpdateNotifyUser.bind(this);
  },
  onUpdateNotifyUser({ query, options }, cb) {
    return this.update({ query, options }, cb);
  },
  update({ query = {}, options = {}, ...args }, cb = () => {}) {
    const _id = this._id();
    const organizationId = this.organizationId();
    const arguments = { ...args, _id, options, query, organizationId };

    this.modal().callMethod(update, arguments, cb);
  }
});
