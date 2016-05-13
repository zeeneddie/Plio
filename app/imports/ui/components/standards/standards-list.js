import { Template } from 'meteor/templating';

import { StandardsBookSections } from '/imports/api/standards-book-sections/standards-book-sections.js';
import { Standards } from '/imports/api/standards/standards.js';
import { StandardsTypes } from '/imports/api/standards-types/standards-types.js';

Template.StandardsList.viewmodel({
  share: 'search',
  mixin: ['modal', 'search', 'standard'],
  standardsBookSections(typeId) {
    const standardsSearchQuery = this.searchObject('searchText', [
      { name: 'title' },
      { name: 'description' },
      { name: 'status' }
    ]);

    const availableSections = StandardsBookSections.find({}).fetch();
    const sectionIds = _.pluck(availableSections, '_id');

    const standardsQuery = {
      $and: [
        { sectionId: { $in: sectionIds } },
        standardsSearchQuery
      ]
    };
    
    if (this.isActiveStandardFilter('type') && typeId) {
      standardsQuery.$and.push({
        typeId
      });
    }
    
    const standards = Standards.find(standardsQuery).fetch();

    const filteredSectionIds = sectionIds.filter((id) => {
      return _.some(standards, (s) => s.sectionId === id);
    });
    const sectionsQuery = {
      $or: [
        { _id: { $in: filteredSectionIds } }
      ]
    };

    const options = { sort: { title: 1 } };

    return StandardsBookSections.find(sectionsQuery, options);
  },
  standardsTypes() {
    const options = { sort: { name: 1 } };
    return StandardsTypes.find({}, options);
  },
  openAddTypeModal(e) {
    this.modal().open({
      title: 'Add',
      variation: 'simple',
      template: 'AddStandardType'
    });
  }
});
