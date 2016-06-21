import { Template } from 'meteor/templating';

Template.NCSectionItem.viewmodel({
  share: 'search',
  mixin: ['organization', 'search', 'nonconformity'],
  _query: {},
  NCs() {
    return this._getNCsByQuery({
      ...this.searchObject('searchText', [{ name: 'title' }, { name: 'sequentialId' }]),
      ...this._query()
    });
  }
});
