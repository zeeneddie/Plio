import { Template } from 'meteor/templating';

Template.Standards_Subcards.viewmodel({
  mixin: ['organization', 'nonconformity', 'standard', 'risk', 'action', 'modal', 'callWithFocusCheck'],
  standard() {
    return this._getStandardByQuery({ _id: this.StandardId() });
  },
  _getNCsQuery() {
    return { standardsIds: this.StandardId() };
  }
});
