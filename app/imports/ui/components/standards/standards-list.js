import { Template } from 'meteor/templating';

import { StandardsBookSections } from '/imports/api/standards-book-sections/standards-book-sections.js';
import { Standards } from '/imports/api/standards/standards.js'

Template.StandardsList.viewmodel({
  share: 'search',
  mixin: ['modal', 'search'],
  standardsBookSections() {
    const searchQuery = this.searchObject('searchText', 'title');

    const availableSections = StandardsBookSections.find({}).fetch();
    const sectionIds = _.pluck(availableSections, '_id');
    
    const standardsQuery = { 
      $and: [
        { sectionId: { $in: sectionIds } },
        searchQuery
      ]
    };
    const standards = Standards.find(standardsQuery).fetch();
    
    const filteredSectionIds = sectionIds.filter((id) => {
      return _.some(standards, (s) => s.sectionId === id);
    });
    const sectionsQuery = {
      $or: [
        { _id: { $in: filteredSectionIds } },
        searchQuery
      ]
    };
    
    const options = { sort: { title: 1 } };
    
    return StandardsBookSections.find(sectionsQuery, options);
  },
  openAddTypeModal(e) {
    this.modal().open({
      title: 'Add',
      variation: 'simple',
      template: 'AddStandardType'
    });
  }
});
