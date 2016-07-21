// import { Template } from 'meteor/templating';

// import { update, remove } from '/imports/api/non-conformities/methods.js';

// import { update, remove } from '/imports/api/risks/methods.js';

// import { update, remove } from '/imports/api/actions/methods.js';

// Template.SS_Card_Modal.viewmodel({
  // mixin: ['organization', 'nonconformity', 'standard', 'risk', 'action', 'modal', 'callWithFocusCheck'],
  // For NC
  // NC() {
  //   return this._getNCByQuery({ _id: this.NCId() });
  // },
  // slingshotDirective: 'nonConformitiesFiles',
  // uploaderMetaContext() {
  //   return {
  //     organizationId: this.organizationId(),
  //     nonConformityId: this.NCId()
  //   };
  // },
  // onUpdateNotifyUserCb() {
  //   return this.onUpdateNotifyUser.bind(this);
  // },
  // onUpdateNotifyUser({ query, options }, cb) {
  //   return this.update({ query, options }, cb);
  // },
  // update({ query = {}, options = {}, e = {}, withFocusCheck = false, ...args }, cb = () => {}) {
  //   const _id = this.NCId();
  //   const allArgs = { ...args, _id, options, query };
  //
  //   const updateFn = () => this.modal().callMethod(update, allArgs, cb);
  //
  //   if (withFocusCheck) {
  //     this.callWithFocusCheck(e, updateFn);
  //   } else {
  //     updateFn();
  //   }
  // },
  // For Standard
  // standard() {
  //   return this._getStandardByQuery({ _id: this.StandardId() });
  // },
  // _getNCsQuery() {
  //   return { standardsIds: this.StandardId() };
  // },
  // For Risk
  // risk() {
  //   return this._getRiskByQuery({ _id: this.RiskId() });
  // },
  // For Action
  // action() {
  //   return this._getActionByQuery({ _id: "hR3QzcjMKfZv9RQLe" });
  // },
// });
