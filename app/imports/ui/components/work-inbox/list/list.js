import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

import { ActionDocumentTypes, WorkItemsStore } from '/imports/api/constants.js';
const { TYPES } = WorkItemsStore;

Template.WorkInbox_List.viewmodel({
  share: 'search',
  mixin: [
    'search', 'collapsing', 'organization',
    'modal', 'workInbox', 'router',
    'user', 'nonconformity', 'risk',
    'utils', { STATUSES: 'workItemStatus' }
  ],
  autorun() {
    if (!this.focused() && !this.animating() && !this.searchText()) {
      const items = this._getItemsByFilter() || [];

      const contains = items.find(({ _source: { _id } = {} }) => _id === this.workItemId());

      if (!contains) {
        const { _id, _source: { _id:workItemId } = {} } = items.find((el, i, arr) => arr.length) || {}; // get _id of the first element if it exists

        if (workItemId) {
          Meteor.setTimeout(() => {
            this.goToWorkItem(workItemId);
            this.expandCollapsed(_id);
          }, 0);
        } else {
          Meteor.setTimeout(() => {
            this.goToWorkInbox();
          }, 0)
        }
      }
    }
  },
  onCreated() {
    this.searchText('');
  },
  onRendered() {
    const { linkedDoc: { _id } = {} } = this._getWorkItemByQuery({ _id: this.workItemId() }) || {};
    this.expandCollapsed(_id);
  },
  _getItemsByFilter() {
    const { my = {}, team = {} } = this.items() || {};

    switch(this.activeWorkInboxFilter()) {
      case 'My current work items':
        return my.current;
        break;
      case 'Team current work items':
        return team.current;
        break;
      case 'My completed work items':
        return my.completed;
        break;
      case 'Team completed work items':
        return team.completed;
        break;
      case 'My deleted work items':
        return my.deleted;
        break;
      case 'Team deleted work items':
        return team.deleted;
        break;
      default:
        return {};
        break;
    };
  },
  _getSearchQuery() {
     return this.searchObject('searchText', [{ name: 'title' }, { name: 'sequentialId' }]);
   },
  getPendingItems(_query = {}) {
    const docs = ((() => {
      const workItems = this._getWorkItemsByQuery({ ..._query }).fetch();
      const ids = workItems.map(({ linkedDoc: { _id } = {} }) => _id);
      const query = { _id: { $in: ids }, ...this._getSearchQuery() };
      const withSource = ({ _id, ...args }) => {
        const _source = workItems.find(({ linkedDoc: { _id:targetId } = {} }) => _id === targetId);
        return { _source, _id, ...args };
      };

      const _docs = ['_getNCsByQuery', '_getRisksByQuery', '_getActionsByQuery'].map(prop => this[prop](query).map(withSource))
                                                                                .reduce((prev, cur) => [...prev, ...cur]);
      return _docs;
    })());

    const docsWithPreciselyChosenExecutor = ({
      _source: { type, ...sourceArgs }, analysis = {},
      updateOfStandards = {}, toBeCompletedBy:e3, toBeVerifiedBy:e4, ...args
    }) => {
      const toBeCompletedBy = ((() => {
        const [{ executor:e1 }, { executor:e2 }] = [analysis, updateOfStandards];
        switch(type) {
          case TYPES.COMPLETE_ANALYSIS:
            return e1;
            break;
          case TYPES.COMPLETE_UPDATE_OF_STANDARDS:
            return e2;
            break;
          case TYPES.COMPLETE_ACTION:
            return e3;
            break;
          case TYPES.VERIFY_ACTION:
            return e4;
            break;
          default:
            return undefined;
            break;
        }
      })());

      return { toBeCompletedBy, analysis, updateOfStandards, _source: { type, ...sourceArgs }, ...args };
    };

    const items = docs.map(docsWithPreciselyChosenExecutor);

    return items;
  },
  assignees() {
    const getIds = query => this.getPendingItems(query);
    const byStatus = (array, predicate) => (
      array.filter(({ _source: { assigneeId, status } }) => assigneeId !== Meteor.userId() && predicate(status))
    );
    const extractIds = array => array.map(({ _source: { assigneeId } = {} }) => assigneeId);
    const sortByFirstName = (array) => {
      const query = {
        _id: {
          $in: [...(() => array.map(({ _source: { assigneeId } = {} }) => assigneeId))()]
        }
      };
      const options = { sort: { 'profile.firstName': 1 } };
      const users = Meteor.users.find(query, options);
      const ids = users.map(({ _id }) => _id);
      return ids;
    };

    const current = sortByFirstName(byStatus(getIds(), status => this.STATUSES.IN_PROGRESS().includes(status)));
    const completed = sortByFirstName(byStatus(getIds(), status => this.STATUSES.COMPLETED() === status));
    const deleted = sortByFirstName(byStatus(getIds({ isDeleted: true }), status => true));

    return {
      current,
      completed,
      deleted
    };
  },
  getTeamItems(userId, prop) {
    const { team = {} } = this.items(userId) || {};
    return team[prop];
  },
  items(userId) {
    const getInitialItems = query => this.getPendingItems(query);
    const byAssignee = (array, predicate) => array.filter(({ _source: { assigneeId } = {} }) => predicate(assigneeId));
    const byStatus = (array, predicate) => array.filter(({ _source: { status } = {} }) => predicate(status));
    const byDeleted = (array, predicate) => array.filter(({ _source: { isDeleted } }) => predicate(isDeleted));
    const sortItems = array => (
      array.sort(({ _source: { targetDate:d1 } = {} }, { _source: { targetDate:d2 } = {} }) => d2 - d1)
    );

    const allItems = getInitialItems({}).concat(getInitialItems({ isDeleted: true }));
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
  focused: false,
  animating: false,
  expandAllFound() {
    const sections = ViewModel.find('WorkInbox_SectionItem');
    const ids = _.flatten(!!sections && sections.map(vm => vm.items && vm.items().map(({ _id }) => _id)));

    const vms = ViewModel.find('ListItem', (viewmodel) => {
      return !!viewmodel.collapsed() && this.findRecursive(viewmodel, ids);
    });

    const { my: { current, completed, deleted } = {} } = this.items();

    if (this.isActiveWorkInboxFilter('My current work items')) {
      this.searchResultsNumber(current.length);
      return;
    } else if (this.isActiveWorkInboxFilter('My completed work items')) {
      this.searchResultsNumber(completed.length);
      return;
    } else if (this.isActiveWorkInboxFilter('My deleted work items')) {
      this.searchResultsNumber(deleted.length);
      return;
    }

    this.searchResultsNumber(ids.length);

    if (vms.length > 0) {
      this.animating(true);

      this.expandCollapseItems(vms, {
        expandNotExpandable: true,
        complete: () => this.onAfterExpand()
      });
    }
  },
  expandSelected() {
    const vms = ViewModel.find('ListItem', vm => !vm.collapsed() && !this.findRecursive(vm, this.workItemId()));

    if (this.isActiveWorkInboxFilter('My current work items') || this.isActiveWorkInboxFilter('My completed work items')) return;

    this.animating(true);

    if (vms && vms.length > 0) {
      this.expandCollapseItems(vms, {
        expandNotExpandable: true,
        complete: () => this.expandSelectedAction()
      });
    } else {
      this.expandSelectedAction();
    }
  },
  expandSelectedAction() {
    this.expandCollapsed(this.workItemId(), () => {
      this.onAfterExpand();
    });
  },
  onAfterExpand() {
    this.animating(false);
    Meteor.setTimeout(() => this.focused(true), 500);
  },
  openModal() {
    this.modal().open({
      _title: 'Add',
      template: 'Actions_ChooseTypeModal',
      variation: 'simple',
    });
  }
});
