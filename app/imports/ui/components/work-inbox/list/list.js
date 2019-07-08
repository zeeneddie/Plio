import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import invoke from 'lodash.invoke';
import property from 'lodash.property';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Tracker } from 'meteor/tracker';
import { _ } from 'meteor/underscore';
import curry from 'lodash.curry';

import { WorkInboxFilters, ORDER } from '/imports/api/constants';
import { findById, extractIds, propEqId } from '/imports/api/helpers';
import { getLinkedDoc } from '../../../../api/work-items/helpers';


Template.WorkInbox_List.viewmodel({
  share: ['search', 'workInbox'],
  mixin: [
    'search', 'collapsing', 'organization',
    'modal', 'workInbox', 'router',
    'user', 'nonconformity', 'risk',
    'utils', { STATUSES: 'workItemStatus' },
  ],
  autorun() {
    const list = this.list;

    if (list && !list.focused() && !list.animating() && !list.searchText()) {
      const queriedId = this.queriedWorkItemId();

      if (queriedId) {
        const allItems = this.items();

        const filter = Object.keys(WorkInboxFilters).find((filterId) => {
          const itemsForFilter = this._getWorkItemsForFilter(allItems, parseInt(filterId, 10));
          return !!itemsForFilter.find(propEqId(queriedId));
        });

        let params;
        if (filter) {
          params = { filter };
        }

        Meteor.defer(() => {
          this.goToWorkItem(queriedId, params);
          this.expandCollapsed(queriedId);
        });
      } else {
        const workItemId = this.workItemId();
        const {
          result: contains,
          first: defaultDoc,
        } = this._findWorkItemForFilter(workItemId);

        if (contains) {
          return;
        }

        if (!defaultDoc) {
          const routeName = Tracker.nonreactive(() => FlowRouter.getRouteName());

          if (routeName !== 'workInbox') {
            Meteor.setTimeout(() => this.goToWorkInbox(), 0);
          }
        } else {
          const allItems = this._getWorkItemsByQuery({
            isDeleted: { $in: [true, false] },
          }).fetch();

          if (!workItemId || (workItemId && findById(workItemId, allItems))) {
            const { _id } = defaultDoc;

            Meteor.setTimeout(() => {
              this.goToWorkItem(_id);
              this.expandCollapsed(_id);
            }, 0);
          }
        }
      }
    }
  },
  onRendered() {
    // shared prop
    this.isListRendered(true);
  },
  _findWorkItemForFilter(_id, filter = this.activeWorkInboxFilterId()) {
    const allItems = Object.assign({}, this.items());
    const itemsForFilter = this._getWorkItemsForFilter(allItems, filter);

    const results = items => ({
      result: findById(_id, items),
      first: _.first(items),
      array: items,
    });

    return results(itemsForFilter);
  },
  _getWorkItemsForFilter(items, filter) {
    const { my = {} } = items || {};
    const assignees = this.assignees();

    const getUserItems = typeKey => (
      _.flatten(assignees[typeKey].map(usersId => this.getTeamItems(usersId, typeKey)))
    );

    const teamCurrent = getUserItems('current');
    const teamCompleted = getUserItems('completed');
    const teamDeleted = getUserItems('deleted');

    switch (filter) {
      case 1:
        return my.current;
      case 2:
        return teamCurrent;
      case 3:
        return my.completed;
      case 4:
        return teamCompleted;
      case 5:
        return my.deleted;
      case 6:
        return teamDeleted;
      default:
        return {};
    }
  },
  getActionsSearchQuery() {
    const fields = [{ name: 'title' }, { name: 'sequentialId' }];

    return this.searchObject('searchText', fields, this.isPrecise());
  },
  getPendingItems(_query = {}) {
    const linkedDocsIds = ['_getNCsByQuery', '_getRisksByQuery', '_getActionsByQuery']
      .map(prop => extractIds(this[prop](_query.isDeleted ? { isDeleted: true } : {})))
      .reduce((prev, cur) => [...prev, ...cur]);

    const workItems = this._getWorkItemsByQuery({
      'linkedDoc._id': { $in: linkedDocsIds },
      ..._query,
    }).fetch();

    return _(workItems)
      .map(item => ({ linkedDocument: getLinkedDoc(item.linkedDoc), ...item }))
      .filter((item) => {
        const searchFields = [{ name: 'title' }, { name: 'sequentialId' }, { name: 'type' }];
        const searchQuery = this.searchObject('searchText', searchFields, this.isPrecise());

        if (_.keys(searchQuery).length) {
          const [{ title }, { sequentialId }, { type }] = searchQuery.$or;

          return type.test(item.type) ||
                 title.test(item.linkedDocument.title) ||
                 sequentialId.test(item.linkedDocument.sequentialId);
        }

        return true;
      });
  },
  assignees() {
    const getItems = query => this.getPendingItems(query);
    const byStatus = (array, predicate) => (
      array.filter(({ assigneeId, status }) => assigneeId !== Meteor.userId() && predicate(status))
    );
    const sortByFirstName = (prop, array) => {
      const query = {
        _id: {
          $in: [...(() => array.map(property(prop)))()],
        },
      };
      const options = { sort: { 'profile.firstName': 1 } };
      const users = Meteor.users.find(query, options);
      const ids = extractIds(users);
      return ids;
    };

    const deletedActionsQuery = {
      ...this.getActionsSearchQuery(),
      isDeleted: true,
      deletedBy: { $ne: Meteor.userId() },
    };
    const deletedActions = this._getActionsByQuery(deletedActionsQuery).fetch();

    const current = sortByFirstName(
      'assigneeId',
      byStatus(getItems(), status => this.STATUSES.IN_PROGRESS().includes(status)),
    );
    const completed = sortByFirstName(
      'assigneeId',
      byStatus(getItems(), status => this.STATUSES.COMPLETED() === status),
    );
    const deleted = sortByFirstName('deletedBy', deletedActions);

    return {
      current,
      completed,
      deleted,
    };
  },
  getTeamItems(userId, prop) {
    const { team = {} } = Object.assign({}, invoke(this, 'items', userId));
    return team[prop];
  },
  items(userId) {
    const byProp = curry((prop, predicate, array) => array.filter(item => predicate(item[prop])));
    const byStatus = byProp('status');
    const sortItems = (array, order = ORDER.ASC) => (
      array.sort(({ targetDate: d1 }, { targetDate: d2 }) => (
        order === ORDER.ASC ? d2 - d1 : d1 - d2
      ))
    );

    const isInProgress = status => this.STATUSES.IN_PROGRESS().includes(status);
    const isCompleted = status => this.STATUSES.COMPLETED() === status;
    const getItems = (userQuery) => {
      const workItemsQuery = { assigneeId: userQuery, isDeleted: false };
      const workItems = this.getPendingItems(workItemsQuery);

      const deletedQuery = {
        ...this.getActionsSearchQuery(),
        isDeleted: true,
        deletedBy: userQuery,
      };
      const deletedActions = sortItems(this._getActionsByQuery(deletedQuery).fetch());
      const deletedActionsIds = extractIds(deletedActions);
      const deletedItems = this.getPendingItems({
        'linkedDoc._id': { $in: deletedActionsIds },
        isDeleted: true,
      });
      const deleted = _.sortBy(deletedItems, 'deletedAt').reverse();
      const current = byStatus(isInProgress, sortItems(workItems, ORDER.DESC));
      const completed = byStatus(isCompleted, sortItems(workItems));

      return {
        current,
        completed,
        deleted,
      };
    };

    return {
      my: getItems(Meteor.userId()),
      team: getItems(userId || { $ne: Meteor.userId() }),
    };
  },
  onSearchInputValue() {
    return () => extractIds(this._findWorkItemForFilter().array);
  },
  onAfterSearch() {
    return (searchText, searchResult) => {
      if (searchText && searchResult.length) {
        this.goToWorkItem(searchResult[0]);
      }
    };
  },
  onModalOpen() {
    return () =>
      this.modal().open({
        _title: 'Add',
        template: 'Actions_ChooseTypeModal',
        variation: 'simple',
      });
  },
});
