import { Template } from 'meteor/templating';
import get from 'lodash.get';
import curry from 'lodash.curry';

import { RiskTypes } from '/imports/api/risk-types/risk-types.js';
import { Departments } from '/imports/api/departments/departments.js';
import { ProblemsStatuses } from '/imports/api/constants.js';
import {
  extractIds, findById, lengthItems,
  flattenMapItems, inspire
} from '/imports/api/helpers.js';

Template.Risks_List.viewmodel({
  share: 'search',
  mixin: [
    'search', 'collapse', 'organization', 'modal', 'risk', 'problemsStatus',
    'collapsing', 'router', 'utils'
  ],
  autorun() {
    if (!this.list.focused() && !this.list.animating() && !this.list.searchText()) {
      const riskId = this.riskId();
      const { result:contains, first:defaultDoc } = this._findRiskForFilter(riskId);

      if (!contains) {
        if (defaultDoc) {
          const { _id } = defaultDoc;
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
  _findRiskForFilter(_id) {
    const { types, statuses, departments, risksDeleted } = inspire(
      ['types', 'statuses', 'departments', 'risksDeleted'],
      this
    );
    const finder = findById(_id);
    const results = curry((transformer, array) => {
      const items = transformer(array);
      return {
        result: finder(items),
        first: _.first(items),
        array: items
      };
    });
    const resulstsFromItems = results(flattenMapItems);

    switch(this.activeRiskFilterId()) {
      case 1:
        return resulstsFromItems(types);
        break;
      case 2:
        return resulstsFromItems(statuses);
        break;
      case 3:
        return resulstsFromItems(departments);
        break;
      case 4:
        return results(_.identity, risksDeleted);
        break;
      default:
        return {};
        break;
    };
  },
  _getSearchQuery() {
    return this.searchObject('searchText', [{ name: 'sequentialId' }, { name: 'title' }]);
  },
  _getSearchOptions(defaults = { sort: { createdAt: -1 } }) {
    return this.searchText()
      ? { sort: { sequentialId: 1, title: 1 } }
      : defaults;
  },
  types() {
    const organizationId = this.organizationId();
    const mainQuery = {
      organizationId,
      ...this._getSearchQuery()
    };

    const mapper = (type) => {
      const query = { ...mainQuery, typeId: type._id };
      const items = this._getRisksByQuery(query, this._getSearchOptions()).fetch();

      return {
        ...type,
        items
      };
    };

    const types = ((() => {
      const query = { organizationId };
      const options = { sort: { title: 1 } };

      return RiskTypes.find(query, options).fetch();
    })());

    const uncategorized = ((() => {
      const filterFn = risk => !types.find(type => Object.is(type._id, risk.typeId));
      const items = this._getRisksByQuery(mainQuery, this._getSearchOptions()).fetch().filter(filterFn);

      return {
        organizationId,
        items,
        _id: 'Risks.types.uncategorized',
        title: 'Uncategorized'
      };
    })());

    return types
      .map(mapper)
      .concat(uncategorized)
      .filter(lengthItems);
  },
  statuses() {
    const mapper = (status) => {
      const query = { status, ...this._getSearchQuery() };
      const items = this._getRisksByQuery(query, this._getSearchOptions()).fetch();

      return { status, items };
    };
    const keys = Object.keys(ProblemsStatuses).map(s => parseInt(s, 10));

    return keys.map(mapper).filter(lengthItems);
  },
  departments() {
    const organizationId = this.organizationId();
    const mainQuery = {
      organizationId,
      ...this._getSearchQuery()
    };

    const mapper = (department) => {
      const query = {
        ...mainQuery,
        departmentsIds: department._id
      };
      const items = this._getRisksByQuery(query, this._getSearchOptions()).fetch();

      return { ...department, items };
    };

    const departments = ((() => {
      const query = { organizationId };
      const options = { sort: { name: 1 } };

      return Departments.find(query, options).fetch();
    })());

    const uncategorized = ((() => {
      const filterFn = risk => !departments.find(department =>
        risk.departmentsIds.includes(department._id));
      const items = this._getRisksByQuery(mainQuery, this._getSearchOptions()).fetch().filter(filterFn);

      return {
        organizationId,
        items,
        _id: 'Risks.departments.uncategorized',
        name: 'Uncategorized'
      };
    })());

    return departments
      .map(mapper)
      .concat(uncategorized)
      .filter(lengthItems);
  },
  risksDeleted() {
    const query = { ...this._getSearchQuery(), isDeleted: true };
    const options = this._getSearchOptions({ sort: { deletedAt: -1 } });
    return this._getRisksByQuery(query, options).fetch();
  },
  onSearchInputValue() {
    return value => extractIds(this._findRiskForFilter().array);
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
