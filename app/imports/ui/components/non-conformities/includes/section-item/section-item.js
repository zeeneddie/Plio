import { Template } from 'meteor/templating';

Template.NCSectionItem.viewmodel({
  share: 'search',
  mixin: ['organization', 'search', 'nonconformity'],
  _query: {},
  NCs() {
    const query = {
      ...this.searchObject('searchText', [{ name: 'title' }, { name: 'sequentialId' }]),
      ...this._query()
    };
    const options = this.searchText()
                  ? { sort: { sequentialId: 1, title: 1 } } // prioritize id over title while searching
                  : undefined; // translates to default value in mixin
    return this._getNCsByQuery(query, options);
  }
});
