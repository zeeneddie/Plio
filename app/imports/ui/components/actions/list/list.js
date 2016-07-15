import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

Template.ActionsList.viewmodel({
  share: 'search',
  mixin: ['search', 'collapsing', 'organization', 'modal', 'action', 'router', 'user', 'nonconformity', 'risk', 'utils'],
  autorun() {
    if (!this.focused() && !this.animating() && !this.searchText()) {
      const query = this._getQueryForFilter();

      const actions = this._getActionsByQuery(query).fetch();
      const NCs = this._getNCsByQuery(query).fetch();
      const risks = this._getRisksByQuery(query).fetch();

      const contains = actions.concat(NCs, risks).find(({ _id }) => _id === this.actionId());

      if (!contains) {
        const action = this._getActionByQuery({ ...this._getFirstActionQueryForFilter() })   ||
                       this._getNCByQuery({ ...this._getFirstActionQueryForFilter() })       ||
                       this._getRiskByQuery({ ...this._getFirstActionQueryForFilter() });

        if (action) {
          const { _id } = action;
          Meteor.setTimeout(() => {
            this.goToAction(_id);
            this.expandCollapsed(this.actionId());
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
    this.expandCollapsed(this.actionId());
  },
  _getQueryForCurrentFilter([ma, ta, mca, tca]) {
    switch(this.activeActionFilter()) {
      case 'My current actions':
        return ma;
        break;
      case 'Team current actions':
        return ta;
        break;
      case 'My completed actions':
        return mca;
        break;
      case 'Team completed actions':
        return tca;
        break;
      default:
        return {};
        break;
    };
  },
  _getQueryForFilter() {
    const getIds = (array) => array.map(prop => ({ _id: { $in: this[prop]().map(({ _id }) => _id) } }));

    const query = getIds(['myCurrentActions', 'teamCurrentActions', 'myCompletedActions', 'teamCompletedActions']);

    return this._getQueryForCurrentFilter(query);
  },
  _getFirstActionQueryForFilter() {
    const getIds = (array) => array.map(prop => ({ _id: this.toArray(this[prop]()).length > 0 && this[prop]().map(({ _id }) => _id)[0] }));

    const query = getIds(['myCurrentActions', 'teamCurrentActions', 'myCompletedActions', 'teamCompletedActions']);

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
      return this._getActionsByQuery({ ..._query, ...query }, _options).fetch();
    };
  },
  _getPendingProblemsByQuery(_query) {
    const query = { ..._query, ...this._getSearchQuery(), status: { $in: [1, 4, 11] } }; // should be 4, 11
    const NCs = this._getNCsByQuery(query).fetch();
    const risks = this._getRisksByQuery(query).fetch();
    return NCs.concat(risks).map(({ analysis, ...args }) => ({ toBeCompletedBy: analysis.executor, analysis, ...args }));
  },
  _getUniqueAssignees(collection) {
    const userIdsData = collection.map(({ toBeCompletedBy, toBeVerifiedBy }) => [toBeCompletedBy, toBeVerifiedBy]);
    const userIds = Array.from(userIdsData || [])
                           .reduce((prev, cur) => [...prev, ...cur], [])
                           .filter(_id => !!_id && _id !== Meteor.userId());
    return [...new Set(userIds)];
  },
  myCurrentActions() {
    const problems = this._getPendingProblemsByQuery({ 'analysis.executor': Meteor.userId() });
    const actions = this._getActions({})({ $eq: Meteor.userId() }, false);
    return actions.concat(problems).sort(({ createdAt:c1 }, { createdAt:c2 }) => c2 - c1);
  },
  myCompletedActions() {
    return this._getActions({}, { sort: { completedAt: -1 } })({ $eq: Meteor.userId() }, true);
  },
  teamCurrentActions(userId) {
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
  teamCurrentActionsAssignees() {
    return this._getUniqueAssignees(this.teamCurrentActions());
  },
  teamCompletedActions(userId) {
    const userQuery = userId ? { $eq: userId } : { $ne: Meteor.userId() };
    return this._getActions({}, { completedAt: -1 })(userQuery, true);
  },
  teamCompletedActionsAssignees() {
    return this._getUniqueAssignees(this.teamCompletedActions());
  },
  focused: false,
  animating: false,
  expandAllFound() {
    const sections = ViewModel.find('ActionSectionItem');
    const ids = _.flatten(!!sections && sections.map(vm => vm.items && vm.items().map(({ _id }) => _id)));

    const vms = ViewModel.find('ListItem', (viewmodel) => {
      return !!viewmodel.collapsed() && this.findRecursive(viewmodel, ids);
    });

    if (this.isActiveActionFilter('My current actions')) {
      const count = this.myCurrentActions().length;

      this.searchResultsNumber(count);
      return;
    } else if (this.isActiveActionFilter('My completed actions')) {
      const count = this.myCompletedActions().length;

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
    const vms = ViewModel.find('ListItem', vm => !vm.collapsed() && !this.findRecursive(vm, this.actionId()));

    if (this.isActiveActionFilter('My current actions') || this.isActiveActionFilter('My completed actions')) return;

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
    this.expandCollapsed(this.actionId(), () => {
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
