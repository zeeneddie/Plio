import { Template } from 'meteor/templating';

import { update, remove } from '/imports/api/risks/methods.js';

Template.Risks_Subcards.viewmodel({
  mixin: ['organization', 'nonconformity', 'standard', 'risk', 'action', 'modal', 'callWithFocusCheck'],
  risk() {
    return this._getRiskByQuery({ _id: this.RiskId() });
  },
});
