import { Template } from 'meteor/templating';

Template.Subcards_NonConformities_Read.viewmodel({
  mixin: ['organization', 'nonconformity', 'problemsStatus'],
  _query: {},
  NCs() {
    return this._getNCsByQuery({ ...this._query() }, { sort: { serialNumber: 1 } });
  },
});
