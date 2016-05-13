import { Template } from 'meteor/templating';

import { StandardsBookSections } from '/imports/api/standards-book-sections/standards-book-sections.js';
import { Standards } from '/imports/api/standards/standards.js'

Template.StandardsList.viewmodel({
  share: ['search', 'standard'],
  mixin: ['modal', 'search', 'organization', 'standard', 'collapsing'],
  onRendered() {
    // show stored standard section
    if (this.standards().count() > 0 && this.currentStandard()) {
      this.selectedStandardId(this.currentStandard()._id);

      this.toggleSection(this.currentStandard()._id);
    }

    // show first standard section
    if (this.standards().count() > 0 && !this.currentStandard()) {
      const standard = Standards.findOne({}, { sort: { createdAt: 1 } });

      if (!!standard) {
        const { _id } = standard;

        this.selectedStandardId(_id);

        FlowRouter.go('standard', { orgSerialNumber: this.organization().serialNumber, standardId: _id });

        this.toggleSection(_id);
      }
    }
  },
  standards() {
    return Standards.find({}, { sort: { title: 1 } });
  },
  standardsBookSections() {
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
  toggleSection(_id) {
    this.toggleVMCollapse('ListItem', (viewmodel) => {
      return viewmodel.collapsed() && viewmodel.child(vm => vm._id && vm._id() === _id);
    });
  },
  openAddTypeModal(e) {
    this.modal().open({
      title: 'Add',
      variation: 'simple',
      template: 'AddStandardType'
    });
  }
});
