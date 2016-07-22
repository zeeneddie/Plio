import { Template } from 'meteor/templating';

Template.RiskSectionItem.viewmodel({
  share: 'search',
  mixin: ['organization', 'risk', 'search'],
  _query: {},
  risks() {
    const query = {
      ...this._query(),
      ...this.searchObject('searchText', [{ name: 'title' }, { name: 'sequentialId' }])
    };
    const sort = this.searchText()
                  ? { sequentialId: 1, title: 1 } // prioritize id over title while searching
                  : undefined; // translates to default value in mixin
    const options = { sort };

    return this._getRisksByQuery(query, options);
  }
});
