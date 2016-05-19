import { Template } from 'meteor/templating';

import { Standards } from '/imports/api/standards/standards.js';

Template.StandardsSectionItem.viewmodel({
  share: 'search',
  mixin: ['search', 'standard'],
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
  },
  isNestingLevel({ nestingLevel }, level) {
    return nestingLevel === level;
  }
});
