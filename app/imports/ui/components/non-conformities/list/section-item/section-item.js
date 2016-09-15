/**
 * === Non-conformity item ===
 * @param {Object} _options - for querying non-conformity docs from the DB;
 * @param {Object} _query - query to find non-conformity docs from the DB;
*/

import { Template } from 'meteor/templating';

Template.NC_SectionItem.viewmodel({
  share: 'search',
  mixin: ['organization', 'search', 'nonconformity'],
  _options: {},
  _query: {},
  
  NCs() {
    const query = {
      ...this.searchObject('searchText', [{ name: 'title' }, { name: 'sequentialId' }]),
      ...this._query()
    };
    const _options = this._options();
    const options = this.searchText()
                  ? { sort: { sequentialId: 1, title: 1 }, ..._options } // prioritize id over title while searching
                  : _options; // translates to default value in mixin
    const ncs = this._getNCsByQuery(query, options);

    return ncs;
  }
});
