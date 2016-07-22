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
    const sort = this.searchText()
                  ? { sequentialId: 1, title: 1 } // prioritize id over title while searching
                  : undefined; // translates to default value in mixin
    const options = { sort };
    return this._getNCsByQuery(query, options);
  }
});
