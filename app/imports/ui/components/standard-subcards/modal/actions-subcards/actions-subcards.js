import { Template } from 'meteor/templating';

import { update } from '/imports/api/actions/methods.js';

Template.Actions_Subcards.viewmodel({
  mixin: ['organization', 'nonconformity', 'standard', 'risk', 'action', 'modal', 'callWithFocusCheck'],
  action() {
    return this._getActionByQuery({ _id: "hR3QzcjMKfZv9RQLe" });
  },
  callUpdate(method, args = {}, cb = () => {}) {
    console.log(this)
    const _id = this.ActionId();
    this.modal().callMethod(method, { _id, ...args }, cb);
  },
  update({ query = {}, options = {}, e = {}, withFocusCheck = false, ...args }, cb = () => {}) {

    const updateFn = () => this.callUpdate(update, { query, options, ...args }, cb);

    if (withFocusCheck) {
      this.callWithFocusCheck(e, updateFn);
    } else {
      updateFn();
    }
  },
});
