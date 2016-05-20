import { Template } from 'meteor/templating';

import { StandardsBookSections } from '/imports/api/standards-book-sections/standards-book-sections.js';
import { Standards } from '/imports/api/standards/standards.js';
import { StandardTypes } from '/imports/api/standards-types/standards-types.js';

Template.StandardsList.viewmodel({
  share: ['search', 'standard'],
  mixin: ['modal', 'search', 'organization', 'standard', 'collapsing', 'roles'],
  autorun: [
    function() {
      if (!!this.searchText() && this.queryStandards().length > 0) {
        _.each(this.queryStandards(), standard => this.expandCollapsedStandard(standard._id));
      }
    },
    function() {
      if (!this.searchText() && !!this.selectedStandardId()) {
        this.expandCollapsedStandard(this.selectedStandardId());
      }
    }
  ],
  onCreated() {
    this.searchText('');
  },
  queryStandards: [],
  standards() {
    return Standards.find({}, { sort: { title: 1 } });
  },
  standardsBookSections(typeId) {
    const standardsSearchQuery = this.searchObject('searchText', [
      { name: 'title' },
      { name: 'description' },
      { name: 'status' }
    ]);

    const availableSections = StandardsBookSections.find({ organizationId: this.organization() && this.organization()._id }).fetch();
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
    this.queryStandards(standards);
    this.searchResultsNumber(standards.length);

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
    return StandardTypes.find({ organizationId: this.organization()._id }, options);
  },
  openAddTypeModal(e) {
    this.modal().open({
      title: 'Compliance standard',
      template: 'CreateStandard',
      variation: 'save'
    });
  }
});
