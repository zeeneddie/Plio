import { Template } from 'meteor/templating';
import get from 'lodash.get';

import { RiskTypes } from '/imports/api/risk-types/risk-types.js';
import { Departments } from '/imports/api/departments/departments.js';
import { ProblemsStatuses } from '/imports/api/constants.js';

Template.Risks_List.viewmodel({
  share: 'search',
  mixin: [
    'search', 'collapse', 'organization', 'modal', 'risk', 'problemsStatus',
    'collapsing', 'router', 'utils'
  ],
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
    switch(this.activeRiskFilterId()) {
      case 1:
        return { typeId: { $in: this.types(withSearchQuery).map(({ _id }) => _id) } };
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
  _getFirstRiskQueryForFilter() {
    switch(this.activeRiskFilterId()) {
      case 1:
        return { typeId: get(_.first(this.types()), '_id') };
        break;
      case 2:
        return { status: _.first(this.statuses()) };
        break;
      case 3:
        return { departmentsIds: get(_.first(this.departments()), '_id') };
        break;
      case 4:
        return { _id: get(_.first(this.risksDeleted()), '_id') };
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

  /**
   * === Risks, connected to non-existent types or without types ===
   * @param {Object} withSearchQuery - search query object
  */
  uncategorizedByTypes(withSearchQuery){
    const organizationId = this.organizationId();
    const query = { organizationId };
    const options = {
      fields: {
        _id: 1,
        typeId: 1,
      },
      sort: { title: 1 },
    };

    const risks = this._getRisksByQuery(query, options)
      .fetch()
      .filter((risk) => {
        if(!risk.typeId){
          return true;
        }

        const filter = { _id: risk.typeId };
        const options = {};
        const riskTypes = RiskTypes.find(filter, options);

        return !riskTypes.count();
      });

    return risks.length && {
      risks,
      title: 'Uncategorized',
    };
  },

  /**
   * === Options while finding uncategorized risks
  */
  _getUncategorizedRisksOptions(){
    return {
      sort: { title: 1 }
    };
  },

  /**
   * === Query to find risks not connected to any risk types ===
   * @param {Array} risks - documents of risks not connected to risk types;
  */
  _getUncategorizedRisksQuery(risks){
    const riskIds = risks.map( risk => risk._id );

    return { _id: { $in: riskIds } };
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

  /**
   * === Risks, connected to non-existent sectors/departments or without ===
   * @param {Object} withSearchQuery - search query object
  */
  uncategorizedByDepartments(withSearchQuery){
    const query = {
      organizationId: this.organizationId(),
      ...this._getSearchQuery(withSearchQuery),
    };
    const options = {
      fields: {
        departmentsIds: 1,
        title: 1,
      },
    };
    const risks = this._getRisksByQuery(query, options)
      .fetch()
      .filter(({ departmentsIds }) => {
        const query = { _id: { $in: departmentsIds } };
        const options = {
          fields: { _id: 1 }
        };

        return !departmentsIds.length || !Departments.find(query, options).count();
      });

    return {
      name: 'Uncategorized',
      risks,
    };
  },

  risksDeleted(withSearchQuery) {
    const query = { ...this._getSearchQuery(withSearchQuery), isDeleted: true };
    const options = { sort: { deletedAt: -1 } };
    return this._getRisksByQuery(query, options).fetch();
  },
  onSearchInputValue() {
    return (value) => {
      if (this.isActiveRiskFilter(4)) {
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
