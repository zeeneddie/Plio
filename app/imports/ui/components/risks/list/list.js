import { Template } from 'meteor/templating';

import { RiskTypes } from '/imports/api/risk-types/risk-types.js';
import { Departments } from '/imports/api/departments/departments.js';
import { ProblemsStatuses } from '/imports/api/constants.js';

Template.RisksList.viewmodel({
  share: 'search',
  mixin: ['search', 'collapse', 'organization', 'modal', 'risk', 'NCStatus'],
  _getSearchQuery() {
    return this.searchObject('searchText', [{ name: 'title' }, { name: 'sequentialId' }]);
  },
  _getTypeQuery({ _id:typeId }) {
    return { typeId, ...this._getSearchQuery() };
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
    return { status, ...this._getSearchQuery() };
  },
  statuses() {
    return _.keys(ProblemsStatuses)
            .map(status => parseInt(status, 10))
            .filter(status => this._getRisksByQuery({ status, ...this._getSearchQuery() }).count() > 0);
  },
  _getDepartmentQuery({ _id:departments }) {
    return { departments };
  },
  departments() {
    const query = { organizationId: this.organizationId() };
    const options = { sort: { name: 1 } };
    return Departments.find(query, options).fetch().filter(({ _id:departments }) => {
      return this._getRisksByQuery({ departments, ...this._getSearchQuery() }).count() > 0;
    });
  },
  openAddRiskModal() {
    this.modal().open({
      title: 'Risk register',
      template: 'CreateRisk',
      variation: 'save'
    });
  }
});
