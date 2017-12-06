import { Template } from 'meteor/templating';


Template.Subcards_Risks_Read.viewmodel({
  mixin: ['organization', 'risk', 'problemsStatus'],
  _query: {},
  risks() {
    return this._getRisksByQuery({ ...this._query() }, { sort: { serialNumber: 1 } });
  },
});
