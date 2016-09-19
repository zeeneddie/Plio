import { Template } from 'meteor/templating';
import { ViewModel } from 'meteor/manuel:viewmodel';
import { FlowRouter } from 'meteor/kadira:flow-router';
import get from 'lodash.get';
import property from 'lodash.property';
import curry from 'lodash.curry';

import { Occurrences } from '/imports/api/occurrences/occurrences.js';
import { Departments } from '/imports/api/departments/departments.js';
import { ProblemGuidelineTypes, ProblemsStatuses } from '/imports/api/constants.js';
import { extractIds, length, inspire, findById, flattenMap } from '/imports/api/helpers.js';

const propItems = property('items');
const lengthOfItems = _.compose(length, propItems);
const flattenMapItems = flattenMap(propItems);

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
  _findNCForFilter(_id, withSearchQuery) {
    const { magnitude, statuses, departments, NCsDeleted } = inspire(
      ['magnitude', 'statuses', 'departments', 'NCsDeleted'],
      this,
      ..._.times(4,  i => Array.of(withSearchQuery))
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
  _getSearchQuery(bool = true) {
     return bool ? this.searchObject('searchText', [{ name: 'title' }, { name: 'sequentialId' }]) : {};
   },
  magnitude(withSearchQuery) {
    const mapper = (m) => {
      const query = { magnitude:m.value, ...this._getSearchQuery(withSearchQuery) };
      const items = this._getNCsByQuery(query).fetch();

      return { ...m, items };
    };

    return this._magnitude().map(mapper).filter(lengthOfItems);
  },
  statuses(withSearchQuery) {
    const mapper = (status) => {
      const query = { status, ...this._getSearchQuery(withSearchQuery) };
      const items = this._getNCsByQuery(query).fetch();

      return { status, items };
    };
    const keys = Object.keys(ProblemsStatuses).map(s => parseInt(s, 10));

    return keys.map(mapper).filter(lengthOfItems);
  },
  departments(withSearchQuery) {
    const organizationId = this.organizationId();
    const mainQuery = {
      organizationId,
      ...this._getSearchQuery(withSearchQuery)
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
      const query = { ...mainQuery, departmentsIds: { $exists: true, $eq: [] } };
      const items = this._getNCsByQuery(query).fetch();

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
      .filter(lengthOfItems);
  },
  NCsDeleted(withSearchQuery) {
    const query = { ...this._getSearchQuery(withSearchQuery), isDeleted: true };
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
    return (value) => this._findNCForFilter().array;
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
