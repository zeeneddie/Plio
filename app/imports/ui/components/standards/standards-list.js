import { Template } from 'meteor/templating';

import { StandardsBookSections } from '/imports/api/standards-book-sections/standards-book-sections.js';
import { Standards } from '/imports/api/standards/standards.js';
import { StandardTypes } from '/imports/api/standards-types/standards-types.js';

Template.StandardsList.viewmodel({
  share: ['search', 'standard'],
  mixin: ['modal', 'search', 'organization', 'standard', 'collapsing', 'roles'],
  autorun() {
    if (!!this.searchText() && this.queryStandards().length > 0) {
      _.each(this.queryStandards(), standard => this.expandCollapsedStandard(standard._id));
    }

    if (!this.searchText() && !!this.currentStandard()) {
      console.log('called');
      this.selectedStandardId(this.currentStandard()._id);
      this.expandCollapsedStandard(this.currentStandard()._id);
    }

    if (this.standards().count() > 0 && !this.currentStandard()) {
      const standard = Standards.findOne({}, { sort: { createdAt: 1 } });

      if (!!standard) {
        const { _id } = standard;

        this.selectedStandardId(_id);

        FlowRouter.go('standard', { orgSerialNumber: this.organization().serialNumber, standardId: _id });
      }
    }
  },
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

    const availableSections = StandardsBookSections.find({ organizationId: this.organization()._id }).fetch();
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
      title: 'Standard',
      template: 'CreateStandard',
      variation: 'save'
    });
  }
});
