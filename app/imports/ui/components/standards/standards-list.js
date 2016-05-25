import { Template } from 'meteor/templating';

import { StandardsBookSections } from '/imports/api/standards-book-sections/standards-book-sections.js';
import { Standards } from '/imports/api/standards/standards.js';
import { StandardTypes } from '/imports/api/standards-types/standards-types.js';

Template.StandardsList.viewmodel({
  share: ['search', 'standard'],
  mixin: ['modal', 'search', 'organization', 'standard', 'collapsing', 'roles'],
  onCreated() {
    this.searchText('');
  },
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
  animating: false,
  sortVms(vms, isTypesFirst = false) {
    const types = vms.filter((vm) => vm.type && vm.type() === 'standardType');

    const sections = vms.filter((vm) => !vm.type || vm.type() !== 'standardType');

    return isTypesFirst ? types.concat(sections) : sections.concat(types);
  },
  onKeyUp: _.debounce(function(e) {
    const value = e.target.value;

    if (this.searchText() === value) return;

    this.searchText(value);

    if (!!value) {
      this.expandAllFound();
    } else {
      this.expandSelected();
    }
  }, 500),
  expandAllFound() {
    const ids = this.standards().fetch().map(standard => standard._id);

    const vms = ViewModel.find('ListItem', (viewmodel) => {
      return !!viewmodel.collapsed() && this.findRecursive(viewmodel, ids);
    });

    const vmsSorted = this.sortVms(vms, true); // to expand top level items first

    if (vmsSorted.length > 0) {
      this.animating(true);

      this.expandCollapseItems(vmsSorted, {
        expandNotExpandable: true,
        complete: () => this.onAfterExpand()
      });
    }
  },
  expandSelected() {
    const vms = ViewModel.find('ListItem', vm => !vm.collapsed());

    this.animating(true);

    if (vms.length > 0) {
      const vmsSorted = this.sortVms(vms);

      this.expandCollapseItems(vmsSorted, {
        expandNotExpandable: true,
        complete: () => this.expandSelectedStandard()
      });
    } else {
      this.expandSelectedStandard();
    }
  },
  expandSelectedStandard() {
    this.expandCollapsedStandard(this.selectedStandardId(), () => {
      this.onAfterExpand();
    });
  },
  onAfterExpand() {
    this.animating(false);
    Meteor.setTimeout(() => this.searchInput.focus(), 0);
  },
  openAddTypeModal(e) {
    this.modal().open({
      title: 'Compliance standard',
      template: 'CreateStandard',
      variation: 'save'
    });
  }
});
