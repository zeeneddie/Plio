import { Template } from 'meteor/templating';

Template.Subcards_NonConformities_Read.viewmodel({
  mixin: ['organization', 'nonconformity', 'NCStatus'],
  _query: {},
  NCs() {
    return this._getNCsByQuery({ ...this._query() });
  }
});
