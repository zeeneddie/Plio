import { Template } from 'meteor/templating';
import { get, head } from 'lodash';

import { RiskTypes } from '/imports/api/risk-types/risk-types.js';
import { Departments } from '/imports/api/departments/departments.js';
import { ProblemsStatuses } from '/imports/api/constants.js';

Template.RisksList.viewmodel({
  share: 'search',
  mixin: ['search', 'collapse', 'organization', 'modal', 'risk', 'problemsStatus', 'collapsing', 'router', 'utils'],
  autorun() {
    if (!this.list.focused() && !this.list.animating() && !this.list.searchText()) {
      const query = this._getQueryForFilter();

      const contains = this._getRiskByQuery({ ...query, _id: this.riskId() });

      if (!contains) {
        const risk = this._getRiskByQuery({ ...query, ...this._getFirstRiskQueryForFilter() });

        if (risk) {
          const { _id } = risk;
          Meteor.setTimeout(() => {
            this.goToRisk(_id);
            this.expandCollapsed(_id);
          }, 0);
        } else {
          Meteor.setTimeout(() => {
            this.goToRisks();
          }, 0);
        }
      }
    }
  },
  _getQueryForFilter(withSearchQuery) {
    switch(this.activeRiskFilter()) {
      case 'type':
        return { typeId: { $in: this.types(withSearchQuery).map(({ _id }) => _id) } };
        break;
      case 'status':
        return { status: { $in: this.statuses(withSearchQuery) } };
        break;
      case 'department/sector':
        return { departmentsIds: { $in: this.departments(withSearchQuery).map(({ _id }) => _id) } };
        break;
      case 'deleted':
        return { isDeleted: true };
        break;
      default:
        return {};
        break;
    };
  },
  _getFirstRiskQueryForFilter() {
    switch(this.activeRiskFilter()) {
      case 'type':
        return { typeId: get(head(this.types()), '_id') };
        break;
      case 'status':
        return { status: head(this.statuses()) };
        break;
      case 'department/sector':
        return { departmentsIds: get(head(this.departments()), '_id') };
        break;
      case 'deleted':
        return { _id: get(head(this.risksDeleted()), '_id') };
        break;
      default:
        return {};
        break;
    };
  },
  _getSearchQuery(bool = true) {
    return bool ? this.searchObject('searchText', [{ name: 'sequentialId' }, { name: 'title' }]) : {};
  },
  _getTypeQuery({ _id:typeId }) {
    return { typeId };
  },
  types(withSearchQuery) {
    const organizationId = this.organizationId();
    const query = { organizationId };
    const options = { sort: { title: 1 } };
    return RiskTypes.find(query, options).fetch().filter(({ _id:typeId }) => {
      return this._getRisksByQuery({ typeId, ...this._getSearchQuery(withSearchQuery) }).count() > 0;
    });
  },
  _getStatusQuery(status) {
    return { status };
  },
  statuses(withSearchQuery) {
    return _.keys(ProblemsStatuses)
            .map(status => parseInt(status, 10))
            .filter(status => this._getRisksByQuery({ status, ...this._getSearchQuery(withSearchQuery) }).count() > 0);
  },
  _getDepartmentQuery({ _id:departmentsIds }) {
    return { departmentsIds };
  },
  departments(withSearchQuery) {
    const query = { organizationId: this.organizationId() };
    const options = { sort: { name: 1 } };
    return Departments.find(query, options).fetch().filter(({ _id:departmentsIds }) => {
      return this._getRisksByQuery({ departmentsIds, ...this._getSearchQuery(withSearchQuery) }).count() > 0;
    });
  },
  risksDeleted(withSearchQuery) {
    const query = { ...this._getSearchQuery(withSearchQuery), isDeleted: true };
    const options = { sort: { deletedAt: -1 } };
    return this._getRisksByQuery(query, options).fetch();
  },
  onSearchInputValue() {
    return (value) => {
      if (this.isActiveRiskFilter('deleted')) {
        return this.toArray(this.risksDeleted());
      }

      const sections = ViewModel.find('RiskSectionItem');
      const ids = this.toArray(sections).map(vm => vm.risks && vm.risks().map(({ _id }) => _id));
      return _.flatten(ids);
    };
  },
  onModalOpen() {
    return () =>
      this.modal().open({
        _title: 'Risk',
        template: 'CreateRisk',
        variation: 'save'
      });
  }
});
