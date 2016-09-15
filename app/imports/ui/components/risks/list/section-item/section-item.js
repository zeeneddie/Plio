/**
 * @param {Object} _options - to find risk documents;
 * @param {Object} _query - to find risk documents;
*/

import { Template } from 'meteor/templating';

Template.Risks_SectionItem.viewmodel({
  share: 'search',
  mixin: ['organization', 'risk', 'search'],
  _options: {},
  _query: {},
  risks() {
    const query = {
      ...this._query(),
      ...this.searchObject('searchText', [{ name: 'title' }, { name: 'sequentialId' }])
    };
    const options = this.searchText()
                  ? {
                      sort: { sequentialId: 1, title: 1 },
                      ...this._options(),
                    } // prioritize id over title while searching
                  : this._options(); // translates to default value in mixin

    return this._getRisksByQuery(query, options);
  }
});
