import { Template } from 'meteor/templating';

Template.RiskSectionItem.viewmodel({
  share: 'search',
  mixin: ['organization', 'risk', 'search'],
  _query: {},
  risks() {
    return this._getRisksByQuery({
      ...this._query(),
      ...this.searchObject('searchText', [{ name: 'title' }, { name: 'sequentialId' }])
    });
  }
});
