import { Template } from 'meteor/templating';

import { update, remove } from '/imports/api/actions/methods.js';

Template.Actions_Subcards.viewmodel({
  mixin: ['organization', 'nonconformity', 'standard', 'risk', 'action', 'modal', 'callWithFocusCheck'],
  action() {
    return this._getActionByQuery({ _id: "hR3QzcjMKfZv9RQLe" });
  },
});
