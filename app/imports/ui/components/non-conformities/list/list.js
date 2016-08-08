import { Template } from 'meteor/templating';
import { ViewModel } from 'meteor/manuel:viewmodel';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Occurrences } from '/imports/api/occurrences/occurrences.js';
import { Departments } from '/imports/api/departments/departments.js';
import { ProblemGuidelineTypes, ProblemsStatuses } from '/imports/api/constants.js';

Template.NC_List.viewmodel({
  share: 'search',
  mixin: ['search', 'collapsing', 'organization', 'modal', 'magnitude', 'nonconformity', 'router', 'utils', 'currency', 'problemsStatus'],
  autorun() {
    if (!this.list.focused() && !this.list.animating() && !this.list.searchText()) {
      const query = this._getQueryForFilter();

      const contains = this._getNCByQuery({ ...query, _id: this.NCId() });
      if (!contains) {
        const nc = this._getNCByQuery({ ...query, ...this._getFirstNCQueryForFilter() });

        if (nc) {
          const { _id } = nc;
          Meteor.setTimeout(() => {
            this.goToNC(_id);
            this.expandCollapsed(this.NCId());
          }, 0);
        } else {
          Meteor.setTimeout(() => {
            this.goToNCs();
          }, 0)
        }
      }
    }
  },
  _getQueryForFilter() {
    switch(this.activeNCFilter()) {
      case 'magnitude':
        return { magnitude: { $in: this.magnitude().map(({ value }) => value) } };
        break;
      case 'status':
        return { status: { $in: this.statuses() } };
        break;
      case 'department/sector':
        return { departmentsIds: { $in: this.departments().map(({ _id }) => _id) } };
        break;
      case 'deleted':
        return { isDeleted: true };
        break;
      default:
        return {};
        break;
    };
  },
  _getFirstNCQueryForFilter() {
    switch(this.activeNCFilter()) {
      case 'magnitude':
        return { magnitude: this.magnitude().length > 0 && this.magnitude()[0].value };
        break;
      case 'status':
        return { status: this.statuses().length > 0 && this.statuses()[0] };
        break;
      case 'department/sector':
        return { departmentsIds: this.departments().length > 0 && this.departments().map(({ _id }) => _id)[0] };
        break;
      case 'deleted':
        return { _id: this.NCsDeleted().count() > 0 && this.NCsDeleted().fetch()[0]._id };
        break;
      default:
        return {};
        break;
    };
  },
  _getSearchQuery() {
     return this.searchObject('searchText', [{ name: 'title' }, { name: 'sequentialId' }]);
   },
  _getMagnitudeQuery({ value:magnitude }) {
    return { magnitude };
  },
  magnitude() {
    return this._magnitude().filter(({ value:magnitude }) => {
      return this._getNCsByQuery({ magnitude, ...this._getSearchQuery() }).count() > 0;
    });
  },
  _getStatusQuery(status) {
    return { status };
  },
  statuses() {
    return _.keys(ProblemsStatuses)
            .map(status => parseInt(status, 10))
            .filter(status => this._getNCsByQuery({ status, ...this._getSearchQuery() }).count() > 0);
  },
  _getDepartmentQuery({ _id:departmentsIds }) {
    return { departmentsIds };
  },
  departments() {
    const query = { organizationId: this.organizationId() };
    const options = { sort: { name: 1 } };
    return Departments.find(query, options).fetch().filter(({ _id:departmentsIds }) => {
      return this._getNCsByQuery({ departmentsIds, ...this._getSearchQuery() }).count() > 0;
    });
  },
  NCsDeleted() {
    const query = { ...this._getSearchQuery(), isDeleted: true };
    const options = { sort: { deletedAt: -1 } };
    return this._getNCsByQuery(query, options);
  },
  calculateTotalCost(value) {
    const ncs = this._getNCsByQuery({
      $or: [
        { magnitude: value },
        { status: value },
        { departmentsIds: value }
      ],
      cost: { $exists: true }
    }).fetch();

    const total = ncs.reduce((prev, { _id, cost }) => {
      const occurrences = ((() => {
        const query = { nonConformityId: _id };
        return Occurrences.find(query);
      })());
      const t = cost * occurrences.count();
      return prev + t;
    }, 0);

    const { currency } = this.organization() || {};

    return total ? this.getCurrencySymbol(currency) + this.round(total) : '';
  },
  onSearchInputValue() {
    return (value) => {
      if (this.isActiveNCFilter('deleted')) {
        return this.toArray(this.NCsDeleted());
      }

      const sections = ViewModel.find('NC_SectionItem');
      const ids = this.toArray(sections).map(vm => vm.NCs && this.toArray(vm.NCs()).map(({ _id }) => _id));
      return _.flatten(ids);
    };
  },
  onModalOpen() {
    return () =>
      this.modal().open({
        _title: 'Non-conformity',
        template: 'NC_Create',
        variation: 'save'
      });
  }
});
