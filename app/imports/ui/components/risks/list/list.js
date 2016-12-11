import { Template } from 'meteor/templating';
import get from 'lodash.get';
import curry from 'lodash.curry';

import { RiskTypes } from '/imports/share/collections/risk-types.js';
import { Departments } from '/imports/share/collections/departments.js';
import { ProblemsStatuses } from '/imports/share/constants.js';
import {
  extractIds, findById, lengthItems,
  flattenMapItems, inspire, getSortedItems,
  compareRisksByScore, compareStatusesByPriority,
} from '/imports/api/helpers.js';


Template.Risks_List.viewmodel({
  mixin: [
    'organization', 'modal', 'risk', 'problemsStatus',
    'collapsing', 'router', 'utils', {
      counter: 'counter'
    }
  ],
  onCreated() {
    Meteor.defer(() => this.handleRoute());
  },
  handleRoute() {
    const riskId = this.riskId();
    const { result:contains, first:defaultDoc } = this._findRiskForFilter(riskId);

    if (contains) {
      return;
    }

    if (!defaultDoc) {
      Meteor.setTimeout(() => this.goToRisks(), 0);
    } else {
      const allRisks = this._getRisksByQuery().fetch();

      if (!riskId || (riskId && findById(riskId, allRisks))) {
        const { _id } = defaultDoc;

        Meteor.setTimeout(() => {
          this.goToRisk(_id);
          this.expandCollapsed(_id);
        }, 0);
      }
    }
  },
  _findRiskForFilter(_id) {
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
        const types = this.types();
        return resulstsFromItems(types);
        break;
      case 2:
        const statuses = this.statuses();
        return resulstsFromItems(statuses);
        break;
      case 3:
        const departments = this.departments();
        return resulstsFromItems(departments);
        break;
      case 4:
        const deleted = this.deleted();
        return results(_.identity, deleted);
        break;
      default:
        return {};
        break;
    };
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
        items,
        unreadMessagesCount: this._getTotalUnreadMessages(items),
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
        title: 'Uncategorized',
        unreadMessagesCount: this._getTotalUnreadMessages(items),
      };
    })());

    return types
      .map(mapper)
      .concat(uncategorized)
      .filter(lengthItems);
  },
  risksByDepartments() {
    return this.departments().map((dept) => {
      return Object.assign({}, dept, {
        items: getSortedItems(dept.items, compareRisksByScore)
      });
    });
  },
  risksByStatuses() {
    const statuses = getSortedItems(this.statuses(), (statusData1, statusData2) => {
      return compareStatusesByPriority(statusData1.status, statusData2.status);
    });

    return statuses.map((status) => {
      return Object.assign({}, status, {
        items: getSortedItems(status.items, compareRisksByScore)
      });
    });
  },
  risksByTypes() {
    return this.types().map((type) => {
      return Object.assign({}, type, {
        items: getSortedItems(type.items, compareRisksByScore)
      });
    });
  },
  getStatusBadge(status) {
    return `<i class="fa fa-circle margin-right text-${this.getClassByStatus(status)}"></i>`;
  },
  onSearchInputValue() {
    return value => extractIds(this._findRiskForFilter().array);
  },
  _getTotalUnreadMessages(risks) {
    const riskIds = extractIds(risks);
    const totalUnreadMessages = riskIds.reduce((prev, cur) => {
      return prev + this.counter.get('risk-messages-not-viewed-count-' + cur);
    }, 0);

    return totalUnreadMessages;
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
