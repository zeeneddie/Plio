import { Template } from 'meteor/templating';

import { Standards } from '/imports/api/standards/standards.js';

Template.ListItem.viewmodel({
  share: 'search',
  mixin: ['collapse', 'search'],
  closeAllOnCollapse: true,
  standards() {
    const searchQuery = this.searchObject('searchText', 'title');

    const query = {
      $and: [
        { sectionId: this._id() },
        searchQuery
      ]
    };

    const options = { sort: { title: 1 } };
    return Standards.find(query, options);
  }
});
