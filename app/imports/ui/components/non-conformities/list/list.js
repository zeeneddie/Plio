import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import curry from 'lodash.curry';
import { head, identity } from 'ramda';

import { Occurrences } from '/imports/share/collections/occurrences';
import {
  extractIds, findById,
  lengthItems, flattenMapItems,
} from '/imports/api/helpers';
import { sortByType } from '../../../../api/non-conformities/util';
import { NonconformityFilterIndexes } from '../../../../api/constants';

Template.NC_List.viewmodel({
  mixin: [
    'collapsing', 'organization', 'modal', 'magnitude',
    'nonconformity', 'router', 'utils', 'currency', 'problemsStatus', {
      counter: 'counter',
    },
  ],
  onCreated() {
    Meteor.defer(() => this.handleRoute());
  },
  handleRoute() {
    const NCId = this.NCId();
    const { result: contains, first: defaultDoc } = this._findNCForFilter(NCId);

    if (contains) {
      return;
    }

    if (!defaultDoc) {
      Meteor.defer(() => {
        this.goToNCs();
      });
    } else {
      const allNCs = this._getNCsByQuery({
        isDeleted: { $in: [true, false] },
      }).fetch();

      if (!NCId || (NCId && findById(NCId, allNCs))) {
        const { _id } = defaultDoc;

        Meteor.defer(() => {
          this.goToNC(_id);
          this.expandCollapsed(_id);
        });
      }
    }
  },
  _findNCForFilter(_id) {
    const finder = findById(_id);
    const results = curry((transformer, array) => {
      const items = transformer(array);
      return {
        result: finder(items),
        first: head(items),
        array: items,
      };
    });
    const resulstsFromItems = results(flattenMapItems);

    switch (this.activeNCFilterId()) {
      case NonconformityFilterIndexes.MAGNITUDE: {
        const magnitude = this.magnitude();
        return resulstsFromItems(magnitude);
      }
      case NonconformityFilterIndexes.STATUS: {
        const statuses = this.statuses();
        return resulstsFromItems(statuses);
      }
      case NonconformityFilterIndexes.DEPARTMENT: {
        const departments = this.departments();
        return resulstsFromItems(departments);
      }
      case NonconformityFilterIndexes.PROJECT: {
        const projects = this.projects();
        return resulstsFromItems(projects);
      }
      case NonconformityFilterIndexes.DELETED: {
        const deleted = this.deleted();
        return results(identity, deleted);
      }
      default:
        return {};
    }
  },
  magnitude() {
    const mapper = (m) => {
      const query = { magnitude: m.value, ...this._getSearchQuery() };
      const items = this._getNCsByQuery(query, this._getSearchOptions()).fetch();

      return {
        ...m,
        items: sortByType(items),
        unreadMessagesCount: this._getTotalUnreadMessages(items),
      };
    };

    return this._magnitude().map(mapper).filter(lengthItems);
  },
  calculateTotalCost(items) {
    const total = items.reduce((prev, { _id: nonConformityId, cost } = {}) => {
      const occurrences = Occurrences.find({ nonConformityId }).fetch();
      const t = cost * occurrences.length || 0;
      return prev + t;
    }, 0);

    const { currency } = Object.assign({}, this.organization());

    return total ? this.getCurrencySymbol(currency) + this.round(total) : '';
  },
  onSearchInputValue() {
    return () => extractIds(this._findNCForFilter().array);
  },
  onAfterSearch() {
    return (searchText, searchResult) => {
      if (searchText && searchResult.length) {
        this.goToNC(searchResult[0]);
      }
    };
  },
  _getTotalUnreadMessages(ncs) {
    const NCIds = extractIds(ncs);
    const totalUnreadMessages = NCIds.reduce((prev, cur) =>
      prev + this.counter.get(`nc-messages-not-viewed-count-${cur}`), 0);

    return totalUnreadMessages;
  },
  onModalOpen() {
    return () =>
      this.modal().open({
        _title: 'Add',
        template: 'NCs_ChooseTypeModal',
        variation: 'simple',
      });
  },
});
