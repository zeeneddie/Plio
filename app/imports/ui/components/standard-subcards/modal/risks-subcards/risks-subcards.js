import { Template } from 'meteor/templating';

import { update, remove, insertScore, removeScore } from '/imports/api/risks/methods.js';

Template.Risks_Subcards.viewmodel({
  mixin: ['organization', 'nonconformity', 'standard', 'risk', 'action', 'modal', 'callWithFocusCheck'],
  risk() {
    return this._getRiskByQuery({ _id: this.RiskId() });
  },
  onInsertScoreCb() {
    return this.insertScore.bind(this);
  },
  insertScore({ ...args }, cb) {
    const _id = this.RiskId();

    this.modal().callMethod(insertScore, { _id, ...args }, cb);
  },
  onRemoveScoreCb() {
    return this.removeScore.bind(this);
  },
  removeScore({ ...args }, cb) {
    const _id = this.RiskId();

    this.modal().callMethod(removeScore, { _id, ...args }, cb);
  }
});
