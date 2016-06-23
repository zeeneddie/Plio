import { Template } from 'meteor/templating';

Template.RiskSectionItem.viewmodel({
  mixin: ['organization', 'risk'],
  _query: {},
  risks() {
    return this._getRisksByQuery({ ...this._query() });
  }
});
