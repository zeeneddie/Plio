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
        const ids = this.queryStandards().map(standard => standard._id);

        this.expandCollapsedStandard(ids, { expandAll: true });
      }
    }
  ],
  onCreated() {
    this.searchText('');
  },
  queryStandards: [],
  standards(typeId) {
    const standardsSearchQuery = this.searchObject('searchText', [
      { name: 'title' },
      { name: 'description' },
      { name: 'status' }
    ]);

    const sectionIds = this.sectionIds();

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

    return Standards.find(standardsQuery);
  },
  sectionIds() {
    const availableSections = StandardsBookSections.find({ organizationId: this.organization() && this.organization()._id }).fetch();
    return _.pluck(availableSections, '_id');
  },
  standardsBookSections(typeId) {
    const standards = this.standards(typeId).fetch();
    const sectionIds = this.sectionIds();

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
    const types =  StandardTypes.find({ organizationId: this.organizationId() }).fetch();
    const typeIds = _.pluck(types, '_id');
    const filteredTypeIds = typeIds.filter((id) => {
      const typeSections = this.standardsBookSections(id).fetch();
      return typeSections.length > 0;
    });
    const query = { organizationId: this.organizationId(), _id: { $in: filteredTypeIds } };
    const options = { sort: { name: 1 } };

    return StandardTypes.find(query, options);
  },
  openAddTypeModal(e) {
    this.modal().open({
      title: 'Compliance standard',
      template: 'CreateStandard',
      variation: 'save'
    });
  }
});
