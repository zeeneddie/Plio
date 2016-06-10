import { Template } from 'meteor/templating';

import { Problems } from '/imports/api/problems/problems.js';

Template.NCSectionItem.viewmodel({
  share: 'search',
  mixin: ['organization', 'search', 'nonconformity'],
  key: '',
  value: '',
  NCs() {
    return this._getNCsByQuery({
      ...this.searchObject('searchText', [{ name: 'title' }, { name: 'sequentialId' }]),
      [this.key()]: this.value()
    });
  }
});
