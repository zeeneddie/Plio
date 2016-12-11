import { Template } from 'meteor/templating';
import { ViewModel } from 'meteor/manuel:viewmodel';
import { FlowRouter } from 'meteor/kadira:flow-router';
import get from 'lodash.get';
import property from 'lodash.property';
import curry from 'lodash.curry';

import { Occurrences } from '/imports/share/collections/occurrences.js';
import { Departments } from '/imports/share/collections/departments.js';
import { ProblemsStatuses } from '/imports/share/constants.js';
import {
  extractIds, inspire, findById,
  lengthItems, flattenMapItems
} from '/imports/api/helpers.js';


Template.NC_List.viewmodel({
  mixin: [
    'collapsing', 'organization', 'modal', 'magnitude',
    'nonconformity', 'router', 'utils', 'currency', 'problemsStatus', {
      counter: 'counter'
    }
  ],
  onCreated() {
    Meteor.defer(() => this.handleRoute());
  },
  handleRoute() {
    const NCId = this.NCId();
    const { result:contains, first:defaultDoc } = this._findNCForFilter(NCId);

    if (contains) {
      return;
    }

    if (!defaultDoc) {
      Meteor.setTimeout(() => {
        this.goToNCs();
      }, 0);
    } else {
      const allNCs = this._getNCsByQuery().fetch();

      if (!NCId || (NCId && findById(NCId, allNCs))) {
        const { _id } = defaultDoc;

        Meteor.setTimeout(() => {
          this.goToNC(_id);
          this.expandCollapsed(_id);
        }, 0);
      }
    }
  },
  _findNCForFilter(_id) {
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
        const magnitude = this.magnitude();
        return resulstsFromItems(magnitude);
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
    }
  },
  magnitude() {
    const mapper = (m) => {
      const query = { magnitude:m.value, ...this._getSearchQuery() };
      const items = this._getNCsByQuery(query, this._getSearchOptions()).fetch();

      return {
        ...m,
        items,
        unreadMessagesCount: this._getTotalUnreadMessages(items),
      };
    };

    return this._magnitude().map(mapper).filter(lengthItems);
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
  _getTotalUnreadMessages(ncs) {
    const NCIds = extractIds(ncs);
    const totalUnreadMessages = NCIds.reduce((prev, cur) => {
      return prev + this.counter.get('nc-messages-not-viewed-count-' + cur);
    }, 0);

    return totalUnreadMessages;
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
