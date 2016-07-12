import { Template } from 'meteor/templating';

import { StandardsBookSections } from '/imports/api/standards-book-sections/standards-book-sections.js';
import { StandardTypes } from '/imports/api/standards-types/standards-types.js';

Template.StandardsList.viewmodel({
  share: ['search', 'standard'],
  mixin: ['modal', 'search', 'organization', 'standard', 'collapsing', 'roles', 'router'],
  autorun() {
    if (!this.focused() && !this.animating() && !this.searchText()) {
      const query = this._getQueryForFilter();

      const contains = this._getStandardByQuery({ ...query,  _id: this.standardId() });
      if (!contains) {
        const standard = this._getStandardByQuery({ ...query, ...this._getFirstStandardQueryForFilter() });

        if (standard) {
          const { _id } = standard;
          Meteor.setTimeout(() => {
            this.goToStandard(_id);
            this.expandCollapsed(this.standardId());
          }, 0);
        } else {
          Meteor.setTimeout(() => {
            const params = { orgSerialNumber: this.organizationSerialNumber() };
            const queryParams = { by: FlowRouter.getQueryParam('by') };
            FlowRouter.go('standards', params, queryParams);
          }, 0);
        }
      }
    }
  },
  onCreated() {
    this.searchText('');
  },
  onRendered() {
    this.expandCollapsed(this.standardId());
  },
  _getQueryForFilter() {
    switch(this.activeStandardFilter()) {
      case 'section':
        return { sectionId: { $in: this.sections().map(({ _id }) => _id) } };
        break;
      case 'type':
        return { typeId: { $in: this.types().map(({ _id }) => _id) } };
        break;
      case 'deleted':
        return { _id: this.standardsDeleted().count() > 0 && this.standardsDeleted().fetch()[0]._id };
        break;
      default:
        return {};
        break;
    };
  },
  _getFirstStandardQueryForFilter() {
    switch(this.activeStandardFilter()) {
      case 'section':
        return { sectionId: this.sections().length > 0 && this.sections().map(({ _id }) => _id)[0] };
        break;
      case 'type':
        const typeId = this.types().length > 0 && this.types().map(({ _id }) => _id)[0];
        const sectionIds =
                this.sections()
                    .filter(({ _id:sectionId }) => this._getStandardsByQuery({ sectionId, typeId }).count() > 0)
                    .map(({ _id }) => _id);
        const sectionId = sectionIds.length > 0 && sectionIds[0];
        return { typeId, sectionId };
        break;
      default:
        return {};
        break;
    };
  },
  _getQuery({ _id:sectionId }) {
    return { sectionId };
  },
  _getSearchQuery() {
    return this.searchObject('searchText', [{ name: 'title' }, { name: 'description' }, { name: 'status' }]);
  },
  sections() {
    const sections = ((() => {
      const query = { organizationId: this.organizationId() };
      const options = { sort: { title: 1 } };
      return StandardsBookSections.find(query, options).fetch();
    })());

    return sections.filter(({ _id:sectionId }) => this._getStandardsByQuery({ sectionId, ...this._getSearchQuery() }).count() > 0);
  },
  types() {
    const types = ((() => {
      const query = { organizationId: this.organizationId() };
      const options = { sort: { name: 1 } };
      return StandardTypes.find(query, options).fetch();
    })());

    return types.filter(({ _id:typeId }) => {
      return this.sections().filter(({ _id:sectionId }) => {
        return this._getStandardsByQuery({ sectionId, typeId, ...this._getSearchQuery() }).count() > 0;
      }).length > 0;
    });
  },
  standardsDeleted() {
    const query = { ...this._getSearchQuery() };
    const options = { sort: { deletedAt: -1 } };
    return this._getStandardsByQuery(query, options);
  },
  focused: false,
  animating: false,
  sortVms(vms, isTypesFirst = false) {
    const types = vms.filter((vm) => vm.type && vm.type() === 'standardType');

    const sections = vms.filter((vm) => !vm.type || vm.type() !== 'standardType');

    return isTypesFirst ? types.concat(sections) : sections.concat(types);
  },
  expandAllFound() {
    const ids = _.flatten(
      ViewModel.find('StandardSectionItem')
                .map(vm => vm.standards && vm.standards().fetch().map(({ _id }) => _id))
    );

    const vms = ViewModel.find('ListItem', (viewmodel) => {
      return !!viewmodel.collapsed() && this.findRecursive(viewmodel, ids);
    });

    const vmsSorted = this.sortVms(vms, true); // to expand top level items first

    this.searchResultsNumber(ids.length);

    if (vmsSorted.length > 0) {
      this.animating(true);

      this.expandCollapseItems(vmsSorted, {
        expandNotExpandable: true,
        complete: () => this.onAfterExpand()
      });
    }
  },
  expandSelected() {
    const vms = ViewModel.find('ListItem', vm => !vm.collapsed() && !this.findRecursive(vm, this.standardId()));

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
    this.expandCollapsed(this.standardId(), () => {
      this.onAfterExpand();
    });
  },
  onAfterExpand() {
    this.animating(false);
    Meteor.setTimeout(() => this.focused(true), 500);
  },
  openAddTypeModal(e) {
    this.modal().open({
      _title: 'Compliance standard',
      template: 'CreateStandard',
      variation: 'save'
    });
  }
});
