import { Template } from 'meteor/templating';

import { update, remove } from '/imports/api/non-conformities/methods.js';

import { Occurrences } from '/imports/api/occurrences/occurrences.js';

Template.NC_Subcards.viewmodel({
  mixin: ['organization', 'nonconformity', 'standard', 'risk', 'action', 'modal', 'callWithFocusCheck'],
  NC() {
    return this._getNCByQuery({ _id: this.NCId() });
  },
  slingshotDirective: 'nonConformityFiles',
  uploaderMetaContext() {
    return {
      organizationId: this.organizationId(),
      nonConformityId: this.NCId()
    };
  },
  onUpdateNotifyUserCb() {
    return this.onUpdateNotifyUser.bind(this);
  },
  onUpdateNotifyUser({ query, options }, cb) {
    return this.update({ query, options }, cb);
  },
  update({ query = {}, options = {}, e = {}, withFocusCheck = false, ...args }, cb = () => {}) {
    const _id = this.NCId();
    const allArgs = { ...args, _id, options, query };

    const updateFn = () => this.modal().callMethod(update, allArgs, cb);

    if (withFocusCheck) {
      this.callWithFocusCheck(e, updateFn);
    } else {
      updateFn();
    }
  },
});
