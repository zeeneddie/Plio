import { Template } from 'meteor/templating';

import { RiskTypes } from '/imports/api/risk-types/risk-types.js';
import { Departments } from '/imports/api/departments/departments.js';
import { ProblemsStatuses } from '/imports/api/constants.js';

Template.Risks_List.viewmodel({
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
  _getQueryForFilter() {
    switch(this.activeRiskFilter()) {
      case 'type':
        return { typeId: { $in: this.types().map(({ _id }) => _id) } };
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
  _getFirstRiskQueryForFilter() {
    switch(this.activeRiskFilter()) {
      case 'type':
        return { typeId: this.types().length > 0 && this.types()[0]._id };
        break;
      case 'status':
        return { status: this.statuses().length > 0 && this.statuses()[0] };
        break;
      case 'department/sector':
        return { departmentsIds: this.departments().length > 0 && this.departments().map(({ _id }) => _id)[0] };
        break;
      case 'deleted':
        return { _id: this.risksDeleted().count() > 0 && this.risksDeleted().fetch()[0]._id };
        break;
      default:
        return {};
        break;
    };
  },
  _getSearchQuery() {
    return this.searchObject('searchText', [{ name: 'sequentialId' }, { name: 'title' }]);
  },
  _getTypeQuery({ _id:typeId }) {
    return { typeId };
  },
  types() {
    const organizationId = this.organizationId();
    const query = { organizationId };
    const options = { sort: { title: 1 } };
    return RiskTypes.find(query, options).fetch().filter(({ _id:typeId }) => {
      return this._getRisksByQuery({ typeId, ...this._getSearchQuery() }).count() > 0;
    });
  },
  _getStatusQuery(status) {
    return { status };
  },
  statuses() {
    return _.keys(ProblemsStatuses)
            .map(status => parseInt(status, 10))
            .filter(status => this._getRisksByQuery({ status, ...this._getSearchQuery() }).count() > 0);
  },
  _getDepartmentQuery({ _id:departmentsIds }) {
    return { departmentsIds };
  },
  departments() {
    const query = { organizationId: this.organizationId() };
    const options = { sort: { name: 1 } };
    return Departments.find(query, options).fetch().filter(({ _id:departmentsIds }) => {
      return this._getRisksByQuery({ departmentsIds, ...this._getSearchQuery() }).count() > 0;
    });
  },
  risksDeleted() {
    const query = { ...this._getSearchQuery(), isDeleted: true };
    const options = { sort: { deletedAt: -1 } };
    return this._getRisksByQuery(query, options);
  },
  onSearchInputValue() {
    return (value) => {
      if (this.isActiveRiskFilter('deleted')) {
        return this.toArray(this.risksDeleted());
      }

      const sections = ViewModel.find('Risks_SectionItem');
      const ids = this.toArray(sections).map(vm => vm.risks && vm.risks().map(({ _id }) => _id));
      return _.flatten(ids);
    };
  },
  onModalOpen() {
    return () =>
      this.modal().open({
        _title: 'Risk',
        template: 'Risks_Create',
        variation: 'save'
      });
  }
});
