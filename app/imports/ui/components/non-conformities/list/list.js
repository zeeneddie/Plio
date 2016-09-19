import { Template } from 'meteor/templating';
import { ViewModel } from 'meteor/manuel:viewmodel';
import { FlowRouter } from 'meteor/kadira:flow-router';
import get from 'lodash.get';
import property from 'lodash.property';
import curry from 'lodash.curry';

import { Occurrences } from '/imports/api/occurrences/occurrences.js';
import { Departments } from '/imports/api/departments/departments.js';
import { ProblemGuidelineTypes, ProblemsStatuses } from '/imports/api/constants.js';
import {
  extractIds, length, inspire,
  findById, flattenMap, lengthItems,
  flattenMapItems
} from '/imports/api/helpers.js';

Template.NC_List.viewmodel({
  share: 'search',
  mixin: [
    'search', 'collapsing', 'organization', 'modal', 'magnitude',
    'nonconformity', 'router', 'utils', 'currency', 'problemsStatus',
    'department'
  ],
  autorun() {
    if (!this.list.focused() && !this.list.animating() && !this.list.searchText()) {
      const { result:contains, first:defaultDoc } = this._findNCForFilter(this.NCId());

      if (!contains) {
        if (defaultDoc) {
          const { _id } = defaultDoc;

          Meteor.setTimeout(() => {
            this.goToNC(_id);
            this.expandCollapsed(_id);
          }, 0);
        } else {
          Meteor.setTimeout(() => {
            this.goToNCs();
          }, 0);
        }
      }
    }
  },
  _findNCForFilter(_id) {
    const { magnitude, statuses, departments, NCsDeleted } = inspire(
      ['magnitude', 'statuses', 'departments', 'NCsDeleted'],
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

    switch(this.activeNCFilterId()) {
      case 1:
        return resulstsFromItems(magnitude);
        break;
      case 2:
        return resulstsFromItems(statuses);
        break;
      case 3:
        return resulstsFromItems(departments);
        break;
      case 4:
        return results(_.identity, NCsDeleted);
        break;
      default:
        return {};
        break;
    }
  },
  _getSearchQuery() {
     return this.searchObject('searchText', [{ name: 'title' }, { name: 'sequentialId' }]);
   },
  magnitude() {
    const mapper = (m) => {
      const query = { magnitude:m.value, ...this._getSearchQuery() };
      const items = this._getNCsByQuery(query).fetch();

      return { ...m, items };
    };

    return this._magnitude().map(mapper).filter(lengthItems);
  },
  statuses() {
    const mapper = (status) => {
      const query = { status, ...this._getSearchQuery() };
      const items = this._getNCsByQuery(query).fetch();

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
      const items = this._getNCsByQuery(query).fetch();

      return { ...department, items };
    };

    const departments = ((() => {
      const query = { organizationId };
      const options = { sort: { name: 1 } };

      return Departments.find(query, options).fetch();
    })());

    const uncategorized = ((() => {
      const filterFn = nc => !departments.find(department =>
        nc.departmentsIds.includes(department._id));
      const items = this._getNCsByQuery(mainQuery).fetch().filter(filterFn);

      return {
        organizationId,
        items,
        _id: 'NonConformities.departments.uncategorized',
        name: 'Uncategorized'
      };
    })());

    return departments
      .map(mapper)
      .concat(uncategorized)
      .filter(lengthItems);
  },
  NCsDeleted() {
    const query = { ...this._getSearchQuery(), isDeleted: true };
    const options = { sort: { deletedAt: -1 } };
    return this._getNCsByQuery(query, options).fetch();
  },
  calculateTotalCost(items) {
    const total = items.reduce((prev, { _id:nonConformityId, cost } = {}) => {
      const occurrences = Occurrences.find({ nonConformityId }).fetch();
      const t = cost * occurrences.length || 0;
      return prev + t;
    }, 0);

    const { currency } = Object.assign({}, this.organization());

    return total ? this.getCurrencySymbol(currency) + this.round(total) : '';
  },
  onSearchInputValue() {
    return value => extractIds(this._findNCForFilter().array);
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
