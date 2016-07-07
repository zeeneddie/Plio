import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

Template.ActionsList.viewmodel({
  share: 'search',
  mixin: ['search', 'collapsing', 'organization', 'modal', 'action', 'router', 'user'],
  autorun() {
    if (!this.focused() && !this.animating()) {
      const query = this._getQueryForFilter();

      const contains = this._getActionsByQuery(query).fetch().find(({ _id }) => _id === this.actionId());

      if (!contains) {
        const action = this._getActionByQuery({ ...this._getFirstActionQueryForFilter() });

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
    const getIds = (array) => array.map(prop => ({ _id: this[prop]().count() > 0 && this[prop]().map(({ _id }) => _id)[0] }));

    const query = getIds(['myCurrentActions', 'teamCurrentActions', 'myCompletedActions', 'teamCompletedActions']);

    return this._getQueryForCurrentFilter(query);
  },
  _getSearchQuery() {
     return this.searchObject('searchText', [{ name: 'title' }, { name: 'sequentialId' }]);
   },
  _getActionsQuery(isToBeCompletedByMe = false, isCompleted = false) {
    const userId = Meteor.userId();
    const toBeCompletedBy = isToBeCompletedByMe ? userId : { $ne: userId };
    return { toBeCompletedBy, isCompleted, ...this._getSearchQuery() };
  },
  _getAssigneeQuery(toBeCompletedBy, isCompleted) {
    return { toBeCompletedBy, isCompleted };
  },
  _getCurrentActionsQuery(userId) {
    return { $or: [ { toBeCompletedBy: userId, isCompleted: false }, { toBeVerifiedBy: userId, isVerified: false } ] };
  },
  _getUniqueAssignees(collection) {
    const userIds = collection.map(({ toBeCompletedBy, toBeVerifiedBy }) => [toBeCompletedBy, toBeVerifiedBy]);
    return [...new Set(_.flatten(userIds).filter(_id => !!_id && _id !== Meteor.userId()))];
  },
  myCurrentActions() {
    return this._getActionsByQuery({ ...this._getCurrentActionsQuery(Meteor.userId()) });
  },
  myCompletedActions() {
    return this._getActionsByQuery({ ...this._getActionsQuery(true, true) }, { sort: { completedAt: -1 } });
  },
  teamCurrentActions() {
    const actions = this._getActionsByQuery({ ...this._getCurrentActionsQuery({ $ne: Meteor.userId() }) });
    const userIds = this._getUniqueAssignees(actions);
    userIds.filter(userId => this._getActionsByQuery({ ...this._getCurrentActionsQuery(userId) }).count() > 0);
    return this._getActionsByQuery({ ...this._getCurrentActionsQuery({ $in: userIds }) });
  },
  teamCurrentActionsAssignees() {
    return this._getUniqueAssignees(this.teamCurrentActions());
  },
  teamCompletedActions() {
    return this._getActionsByQuery({ ...this._getActionsQuery(false, true) }, { sort: { completedAt: -1 } });
  },
  teamCompletedActionsAssignees() {
    return this._getUniqueAssignees(this.teamCompletedActions());
  },
  focused: false,
  animating: false,
  expandAllFound() {
    const sections = ViewModel.find('ActionSectionItem');
    const ids = _.flatten(!!sections && sections.map(vm => vm.actions && vm.actions().fetch().map(({ _id }) => _id)));

    const vms = ViewModel.find('ListItem', (viewmodel) => {
      return !!viewmodel.collapsed() && this.findRecursive(viewmodel, ids);
    });

    if (this.isActiveActionFilter('My current actions') || this.isActiveActionFilter('My completed actions')) {
      const count = this._getActionsByQuery({ ...this._getQueryForFilter() }).count();

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
    const vms = ViewModel.find('ListItem', vm => !vm.collapsed());

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
    Meteor.setTimeout(() => this.searchInput.focus(), 0);
  },
  openModal() {
    this.modal().open({
      _title: 'Add',
      template: 'Actions_ChooseTypeModal',
      variation: 'simple',
    });
  }
});
