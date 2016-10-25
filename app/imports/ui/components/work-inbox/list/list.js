import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import invoke from 'lodash.invoke';
import property from 'lodash.property';

import { ActionDocumentTypes, WorkItemsStore } from '/imports/share/constants';
import { WorkItems } from '/imports/share/collections/work-items';
import { WorkInboxFilters } from '/imports/api/constants';
const { TYPES } = WorkItemsStore;
import { findById, extractIds } from '/imports/api/helpers';

Template.WorkInbox_List.viewmodel({
  share: 'search',
  mixin: [
    'search', 'collapsing', 'organization',
    'modal', 'workInbox', 'router',
    'user', 'nonconformity', 'risk',
    'utils', { STATUSES: 'workItemStatus' }
  ],
  onRendered(template) {
    template.autorun((computation) => {
      const workItemId = this.workItemId();
      const {
        result:contains,
        first:defaultDoc,
        array
      } = this._findWorkItemForFilter(workItemId);

      if (!contains) {
        if (defaultDoc) {
          const { _id } = defaultDoc;

          Meteor.setTimeout(() => {
            this.goToWorkItem(_id);
            this.expandCollapsed(_id);
          }, 0);
        } else {
          const routeName = Tracker.nonreactive(() => FlowRouter.getRouteName());
          
          if (routeName !== 'workInbox') {
            Meteor.setTimeout(() => this.goToWorkInbox(), 0);
          }
        }
      }
    });
  },
  _findWorkItemForFilter(_id, filter = this.activeWorkInboxFilterId()) {
    const { my = {}, team = {} } = Object.assign({}, this.items());

    const results = (items) => ({
      result: findById(_id, items),
      first: _.first(items),
      array: items
    });

    switch(filter) {
      case 1:
        return results(my.current);
        break;
      case 2:
        return results(team.current);
        break;
      case 3:
        return results(my.completed);
        break;
      case 4:
        return results(team.completed);
        break;
      case 5:
        return results(my.deleted);
        break;
      case 6:
        return results(team.deleted);
        break;
      default:
        return {};
        break;
    }
  },
  getPendingItems(_query = {}) {
    const linkedDocsIds = ['_getNCsByQuery', '_getRisksByQuery', '_getActionsByQuery']
        .map(prop => extractIds(this[prop]()))
        .reduce((prev, cur) => [...prev, ...cur]);

    const workItems = this._getWorkItemsByQuery({
      ..._query,
      'linkedDoc._id': { $in: linkedDocsIds }
    }).fetch();

    return _(workItems)
      .map(item => ({ linkedDocument: item.getLinkedDoc(), ...item }))
      .filter((item) => {
        const searchQuery = this.searchObject('searchText', [{ name: 'title' }, { name: 'sequentialId' }, { name: 'type' }]);

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
    const sortByFirstName = (array) => {
      const query = {
        _id: {
          $in: [...(() => array.map(property('assigneeId')))()]
        }
      };
      const options = { sort: { 'profile.firstName': 1 } };
      const users = Meteor.users.find(query, options);
      const ids = extractIds(users);
      return ids;
    };

    const current = sortByFirstName(byStatus(getItems(), status => this.STATUSES.IN_PROGRESS().includes(status)));
    const completed = sortByFirstName(byStatus(getItems(), status => this.STATUSES.COMPLETED() === status));
    const deleted = sortByFirstName(byStatus(getItems({ isDeleted: true }), status => true));

    return {
      current,
      completed,
      deleted
    };
  },
  getTeamItems(userId, prop) {
    const { team = {} } = Object.assign({}, invoke(this, 'items', userId));
    return team[prop];
  },
  items(userId) {
    const getInitialItems = query => this.getPendingItems(query);
    const byAssignee = (array, predicate) => array.filter(({ assigneeId }) => predicate(assigneeId));
    const byStatus = (array, predicate) => array.filter(({ status }) => predicate(status));
    const byDeleted = (array, predicate) => array.filter(({ isDeleted }) => predicate(isDeleted));
    const sortItems = array => (
      array.sort(({ targetDate:d1 }, { targetDate:d2 }) => d2 - d1)
    );

    const allItems = [...new Set(getInitialItems({}).concat(getInitialItems({ isDeleted: true })))];
    const myItems = byAssignee(allItems, assigneeId => assigneeId === Meteor.userId());
    const teamItems = byAssignee(allItems, assigneeId => userId ? assigneeId === userId : assigneeId !== Meteor.userId());

    const isInProgress = status => this.STATUSES.IN_PROGRESS().includes(status);
    const isCompleted = status => this.STATUSES.COMPLETED() === status;
    const isDel = bool => isDeleted => bool ? isDeleted : !isDeleted;

    const getObj = (items) => {
      return {
        current: sortItems(byDeleted(byStatus(items, isInProgress), isDel(false))),
        completed: sortItems(byDeleted(byStatus(items, isCompleted), isDel(false))),
        deleted: sortItems(byDeleted(items, isDel(true)))
      };
    };

    return {
      my: getObj(myItems),
      team: getObj(teamItems)
    };
  },
  onSearchInputValue() {
    return (value) => {
      const { my: { current, completed, deleted } = {} } = Object.assign({}, this.items());

      // My current work items
      if (this.isActiveWorkInboxFilter(1)) {
        return current;

      // My completed work items
      } else if (this.isActiveWorkInboxFilter(3)) {
        return completed;

      // My deleted work items
      } else if (this.isActiveWorkInboxFilter(5)) {
        return deleted;
      }

      const sections = ViewModel.find('WorkInbox_SectionItem');
      const ids = this.toArray(sections).map(vm => vm.items && extractIds(vm.items()));
      return _.flatten(ids);
    };
  },
  onModalOpen() {
    return () =>
      this.modal().open({
        _title: 'Add',
        template: 'Actions_ChooseTypeModal',
        variation: 'simple',
      });
  }
});
