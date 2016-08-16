import { Template } from 'meteor/templating';

import { StandardsBookSections } from '/imports/api/standards-book-sections/standards-book-sections.js';
import { StandardTypes } from '/imports/api/standards-types/standards-types.js';

Template.StandardsList.viewmodel({
  share: 'search',
  mixin: ['modal', 'search', 'organization', 'standard', 'collapsing', 'roles', 'router', 'utils'],
  autorun() {
    if (!this.list.focused() && !this.list.animating() && !this.list.searchText()) {
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
            const queryParams = { filter: FlowRouter.getQueryParam('filter') };
            FlowRouter.go('standards', params, queryParams);
          }, 0);
        }
      }
    }
  },
  _getQueryForFilter() {
    switch(this.activeStandardFilterId()) {
      case 1:
        return { sectionId: { $in: this.sections().map(({ _id }) => _id) } };
        break;
      case 2:
        return { typeId: { $in: this.types().map(({ _id }) => _id) } };
        break;
      case 3:
        return { _id: this.standardsDeleted().count() > 0 && this.standardsDeleted().fetch()[0]._id };
        break;
      default:
        return {};
        break;
    };
  },
  _getFirstStandardQueryForFilter() {
    switch(this.activeStandardFilterId()) {
      case 1:
        return { sectionId: this.sections().length > 0 && this.sections().map(({ _id }) => _id)[0] };
        break;
      case 2:
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
    const query = { ...this._getSearchQuery(), isDeleted: true };
    const options = { sort: { deletedAt: -1 } };
    return this._getStandardsByQuery(query, options);
  },
  sortVms(vms, isTypesFirst = false) {
    const types = vms.filter((vm) => vm.type && vm.type() === 'standardType');

    const sections = vms.filter((vm) => !vm.type || vm.type() !== 'standardType');

    return isTypesFirst ? types.concat(sections) : sections.concat(types);
  },
  _transform() {
    return () => ({
      onValue: vms => this.sortVms(vms, true),
      onEmpty: vms => this.sortVms(vms, false)
    });
  },
  onSearchInputValue() {
    return (value) => {
      if (this.isActiveStandardFilter(3)) {
        return this.toArray(this.standardsDeleted());
      }

      const sections = ViewModel.find('StandardSectionItem');
      const ids = this.toArray(sections).map(vm => vm.standards && vm.standards().map(({ _id }) => _id));
      return _.flatten(ids);
    };
  },
  onModalOpen() {
    return () =>
      this.modal().open({
        _title: 'Compliance standard',
        template: 'CreateStandard',
        variation: 'save'
      });
  }
});
