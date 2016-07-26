import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

import { ActionDocumentTypes, WorkItemTypes } from '/imports/api/constants.js';
const STATUSES = {
  IN_PROGRESS: [0, 1, 2],
  COMPLETED: 3
};

Template.WorkInbox_List.viewmodel({
  share: 'search',
  mixin: ['search', 'collapsing', 'organization', 'modal', 'workInbox', 'router', 'user', 'nonconformity', 'risk', 'utils'],
  autorun() {
    if (!this.focused() && !this.animating() && !this.searchText()) {
      const items = this._getItemsByFilter() || [];

      const contains = items.find(({ _id }) => _id === this.workItemId());

      if (!contains) {
        const item = items.find((el, i, arr) => arr.length); // get first element if it exists

        if (item) {
          const { _id } = item;
          Meteor.setTimeout(() => {
            this.goToWorkItem(_id);
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
    this.expandCollapsed(this.workItemId());
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
      case 'Deleted work items':
        return null;
        break;
      default:
        return {};
        break;
    };
  },
  _getSearchQuery() {
     return this.searchObject('searchText', [{ name: 'title' }, { name: 'sequentialId' }]);
   },
  _getAssigneeQuery(toBeCompletedBy, isCompleted) {
    return { toBeCompletedBy, isCompleted };
  },
  _getActions(_query, _options) {
    return (userQuery, isDone = false) => {
      const query = {
        $and: [
          { ...this._getSearchQuery() },
          {
            $or: [
              { toBeCompletedBy: { $exists: true, ...userQuery}, isCompleted: isDone },
              { toBeVerifiedBy: { $exists: true, ...userQuery}, isVerified: isDone }
            ]
          }
        ]
      };
      return this._getActionsByQuery({ ..._query, ...query }, _options)
                    .map(({ ...args }) => ({ ...args, _documentType: ActionDocumentTypes.ACTION }));
    };
  },
  getPendingProblems(_query = {}) {
    const workItems = this._getWorkItemsByQuery({}).fetch();

    const problemsDocs = ((() => {
      const ids = workItems.map(({ linkedDoc: { _id } = {} }) => _id);
      const query = { _id: { $in: ids }, ..._query, ...this._getSearchQuery() };
      const withSource = ({ _id, ...args }) => {
        const _source = workItems.find(({ linkedDoc: { _id:targetId } = {} }) => _id === targetId);
        return { _source, _id, ...args };
      };

      const NCs = this._getNCsByQuery(query).map(withSource);
      const risks = this._getRisksByQuery(query).map(withSource);
      return NCs.concat(risks);
    })());

    const problems = problemsDocs.map(({
      _source: { type, ...sourceArgs }, analysis = {},
      updateOfStandards = {}, ...args
    }) => {
      const toBeCompletedBy = ((() => {
        const [{ executor:e1 }, { executor:e2 }] = [analysis, updateOfStandards];
        switch(type) {
          case WorkItemTypes.COMPLETE_ANALYSIS:
            return e1;
            break;
          case WorkItemTypes.COMPLETE_UPDATE_OF_STANDARDS:
            return e2;
            break;
          default:
            return undefined;
            break;
        }
      })());
      return { toBeCompletedBy, analysis, updateOfStandards, _source: { type, ...sourceArgs }, ...args };
    });

    return problems;
  },
  assignees() {
    const getIds = (predicate) => {
      const ids = this.toArray(this._getWorkItemsByQuery({}))
                      .filter(({ assigneeId, status }) => assigneeId !== Meteor.userId() && predicate(status))
                      .map(({ assigneeId }) => assigneeId);
      return [...new Set(ids)];
    };

    const current = getIds(status => STATUSES.IN_PROGRESS.includes(status));
    const completed = getIds(status => status === STATUSES.COMPLETED);

    return {
      current,
      completed
    }
  },
  getTeamItems(userId, prop) {
    const { team = {} } = this.items(userId) || {};
    return team[prop];
  },
  items(userId) {
    const sortItems = array => (
      array.sort(({ _source: { targetDate:d1 } = {} }, { _source: { targetDate:d2 } = {} }) => d2 - d1)
    );
    const getItems = (predicate1) => {
      const items = this.getPendingProblems().filter(({ _source: { assigneeId } = {} }) => predicate1(assigneeId));

      return (predicate2) => sortItems(items.filter(({ _source: { status } }) => predicate2(status)));
    };

    const myItems = getItems(assigneeId => assigneeId === Meteor.userId());
    const teamItems = getItems(assigneeId => userId ? assigneeId === userId : assigneeId !== Meteor.userId());

    const isInProgress = status => STATUSES.IN_PROGRESS.includes(status);
    const isCompleted = status => STATUSES.COMPLETED === status;

    const my = {
      current: myItems(isInProgress),
      completed: myItems(isCompleted)
    };

    const team = {
      current: teamItems(isInProgress),
      completed: teamItems(isCompleted)
    };

    return {
      my,
      team
    }
  },
  deleted() {
    const query = { isDeleted: true, ...this._getSearchQuery() };
    const options = { sort: { deletedAt: -1 } };
    return this._getActionsByQuery(query, options);
  },
  focused: false,
  animating: false,
  expandAllFound() {
    const sections = ViewModel.find('WorkInbox_SectionItem');
    const ids = _.flatten(!!sections && sections.map(vm => vm.items && vm.items().map(({ _id }) => _id)));

    const vms = ViewModel.find('ListItem', (viewmodel) => {
      return !!viewmodel.collapsed() && this.findRecursive(viewmodel, ids);
    });

    if (this.isActiveWorkInboxFilter('My current work items')) {
      const count = this.myCurrent().length;

      this.searchResultsNumber(count);
      return;
    } else if (this.isActiveWorkInboxFilter('My completed work items')) {
      const count = this.myCompleted().length;

      this.searchResultsNumber(count);
      return;
    } else if (this.isActiveWorkInboxFilter('Deleted work items')) {
      const count = this.deleted().count();

      this.searchResultsNumber(count);
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
