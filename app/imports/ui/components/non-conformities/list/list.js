import { Template } from 'meteor/templating';
import { ViewModel } from 'meteor/manuel:viewmodel';
import { FlowRouter } from 'meteor/kadira:flow-router';
import get from 'lodash.get';

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
  _getQueryForFilter(withSearchQuery) {
    switch(this.activeNCFilterId()) {
      case 1:
        return { magnitude: { $in: this.magnitude(withSearchQuery).map(({ value }) => value) } };
        break;
      case 2:
        return { status: { $in: this.statuses(withSearchQuery) } };
        break;
      case 3:
        return { departmentsIds: { $in: this.departments(withSearchQuery).map(({ _id }) => _id) } };
        break;
      case 4:
        return { isDeleted: true };
        break;
      default:
        return {};
        break;
    };
  },
  _getFirstNCQueryForFilter() {
    switch(this.activeNCFilterId()) {
      case 1:
        return { magnitude: get(_.first(this.magnitude()), 'value') };
        break;
      case 2:
        return { status: _.first(this.statuses()) };
        break;
      case 3:
        return { departmentsIds: get(_.first(this.departments()), '_id') };
        break;
      case 4:
        return { _id: get(_.first(this.NCsDeleted()), '_id') };
        break;
      default:
        return {};
        break;
    };
  },
  _getSearchQuery(bool = true) {
     return bool ? this.searchObject('searchText', [{ name: 'title' }, { name: 'sequentialId' }]) : {};
   },
  _getMagnitudeQuery({ value:magnitude }) {
    return { magnitude };
  },
  magnitude(withSearchQuery) {
    return this._magnitude().filter(({ value:magnitude }) => {
      return this._getNCsByQuery({ magnitude, ...this._getSearchQuery(withSearchQuery) }).count() > 0;
    });
  },
  _getStatusQuery(status) {
    return { status };
  },
  statuses(withSearchQuery) {
    return _.keys(ProblemsStatuses)
            .map(status => parseInt(status, 10))
            .filter(status => this._getNCsByQuery({ status, ...this._getSearchQuery(withSearchQuery) }).count() > 0);
  },
  _getDepartmentQuery({ _id:departmentsIds }) {
    return { departmentsIds };
  },
  departments(withSearchQuery) {
    const query = { organizationId: this.organizationId() };
    const options = { sort: { name: 1 } };
    return Departments.find(query, options).fetch().filter(({ _id:departmentsIds }) => {
      return this._getNCsByQuery({ departmentsIds, ...this._getSearchQuery(withSearchQuery) }).count() > 0;
    });
  },
  NCsDeleted(withSearchQuery) {
    const query = { ...this._getSearchQuery(withSearchQuery), isDeleted: true };
    const options = { sort: { deletedAt: -1 } };
    return this._getNCsByQuery(query, options).fetch();
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
      if (this.isActiveNCFilter(4)) {
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
