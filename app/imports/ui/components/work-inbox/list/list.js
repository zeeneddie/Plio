import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

import { ActionDocumentTypes, WorkItemTypes } from '/imports/api/constants.js';

Template.WorkInbox_List.viewmodel({
  share: 'search',
  mixin: ['search', 'collapsing', 'organization', 'modal', 'workInbox', 'router', 'user', 'nonconformity', 'risk', 'utils'],
  autorun() {
    if (!this.focused() && !this.animating() && !this.searchText()) {
      const query = this._getQueryForFilter();

      const actions = this._getActionsByQuery(query).fetch();
      const NCs = this._getNCsByQuery(query).fetch();
      const risks = this._getRisksByQuery(query).fetch();

      const contains = actions.concat(NCs, risks).find(({ _id }) => _id === this.workItemId());

      if (!contains) {
        const action = this._getActionByQuery({ ...this._getFirstActionQueryForFilter() })   ||
                       this._getNCByQuery({ ...this._getFirstActionQueryForFilter() })       ||
                       this._getRiskByQuery({ ...this._getFirstActionQueryForFilter() });

        if (action) {
          const { _id } = action;
          Meteor.setTimeout(() => {
            this.goToAction(_id);
            this.expandCollapsed(_id);
          }, 0);
        } else {
          Meteor.setTimeout(() => {
            this.goToActions();
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
  _getQueryForCurrentFilter([mwi, twi, mcwi, tcwi, dwi]) {
    switch(this.activeWorkInboxFilter()) {
      case 'My current work items':
        return mwi;
        break;
      case 'Team current work items':
        return twi;
        break;
      case 'My completed work items':
        return mcwi;
        break;
      case 'Team completed work items':
        return tcwi;
        break;
      case 'Deleted work items':
        return { ...dwi, isDeleted: true };
        break;
      default:
        return {};
        break;
    };
  },
  _getQueryForFilter() {
    const getIds = (array) => array.map(prop => ({ _id: { $in: this[prop]().map(({ _id }) => _id) } }));

    const query = getIds(['myCurrent', 'teamCurrent', 'myCompleted', 'teamCompleted', 'deleted']);

    return this._getQueryForCurrentFilter(query);
  },
  _getFirstActionQueryForFilter() {
    const getIds = (array) => array.map(prop => ({ _id: this.toArray(this[prop]()).length > 0 && this[prop]().map(({ _id }) => _id)[0] }));

    const query = getIds(['myCurrent', 'teamCurrent', 'myCompleted', 'teamCompleted', 'deleted']);

    return this._getQueryForCurrentFilter(query);
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
  _getPendingProblemsByQuery(_query = {}) {
    const workItems = this._getWorkItemsByQuery({}).fetch();

    const problemsDocs = ((() => {
      const ids = workItems.map(({ linkedDoc: { _id } = {} }) => _id);
      const query = { _id: { $in: ids }, ..._query, ...this._getSearchQuery() };
      const withDocType = docType => ({ ...args }) => ({ docType, ...args });

      const NCs = this._getNCsByQuery(query).map(withDocType(ActionDocumentTypes.NC));
      const risks = this._getRisksByQuery(query).map(withDocType(ActionDocumentTypes.RISK));
      return NCs.concat(risks);
    })());

    const problemsDocsWithSource = problemsDocs.map(({ _id, ...args }) => {
      const _source = workItems.find(({ linkedDoc: { _id:targetId } = {} }) => _id === targetId);
      return { _id, _source, ...args };
    });

    const problems = problemsDocsWithSource.map(({
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
  _getUniqueAssignees(collection) {
    const userIdsData = collection.map(({ toBeCompletedBy, toBeVerifiedBy }) => [toBeCompletedBy, toBeVerifiedBy]);
    const userIds = Array.from(userIdsData || [])
                           .reduce((prev, cur) => [...prev, ...cur], [])
                           .filter(_id => !!_id && _id !== Meteor.userId());
    return [...new Set(userIds)];
  },
  myCurrent() {
    const problems = this._getPendingProblemsByQuery({ 'analysis.executor': Meteor.userId() });
    const sorted = problems.sort(({ _source: { targetDate:d1 } }, { _source: { targetDate:d2 } }) => d2 - d1);
    return sorted;
    // const actions = this._getActions({})({ $eq: Meteor.userId() }, false);
    // return actions.concat(problems).sort(({ createdAt:c1 }, { createdAt:c2 }) => c2 - c1);
  },
  myCompleted() {
    return this._getActions({}, { sort: { completedAt: -1 } })({ $eq: Meteor.userId() }, true);
  },
  teamCurrent(userId) {
    const problems = ((() => {
      const userQuery = userId ? { $eq: userId } : { $ne: Meteor.userId() };
      const analysisQuery = { 'analysis.executor': { $exists: true, ...userQuery } };
      return this._getPendingProblemsByQuery(analysisQuery);
    })());

    const actions = ((() => {
      const userQuery = userId ? { $eq: userId } : { $ne: Meteor.userId() };
      return this._getActions({})(userQuery, false);
    })());

    return actions.concat(problems).sort(({ createdAt:c1 }, { createdAt:c2 }) => c2 - c1);
  },
  teamCurrentAssignees() {
    return this._getUniqueAssignees(this.teamCurrent());
  },
  teamCompleted(userId) {
    const userQuery = userId ? { $eq: userId } : { $ne: Meteor.userId() };
    return this._getActions({}, { completedAt: -1 })(userQuery, true);
  },
  teamCompletedAssignees() {
    return this._getUniqueAssignees(this.teamCompleted());
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
