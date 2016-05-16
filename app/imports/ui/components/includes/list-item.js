import { Template } from 'meteor/templating';

import { Standards } from '/imports/api/standards/standards.js';

Template.ListItem.viewmodel({
  share: 'search',
  mixin: ['collapse', 'search', 'standard'],
  closeAllOnCollapse: true,
  standards() {
    const searchQuery = this.searchObject('searchText', [
      { name: 'title' },
      { name: 'description' },
      { name: 'status' }
    ]);

    const query = {
      $and: [
        { sectionId: this._id() },
        searchQuery
      ]
    };

    if (this.isActiveStandardFilter('type')) {
      query.$and.push({
        typeId: this.parent()._id()
      });
    }

    const options = { sort: { title: 1 } };
    return Standards.find(query, options);
  }
});
