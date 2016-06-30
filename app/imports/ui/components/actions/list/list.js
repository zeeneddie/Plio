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
    const getIds = (array) => array.map(prop => ({ _id: { $in: this[prop]().fetch().map(({ _id }) => _id) } }));

    const query = getIds(['myCurrentActions', 'teamCurrentActions', 'myCompletedActions', 'teamCompletedActions']);

    return this._getQueryForCurrentFilter(query);
  },
  _getFirstActionQueryForFilter() {
    const getIds = (array) => array.map(prop => ({ _id: this[prop]().count() > 0 && this[prop]().fetch().map(({ _id }) => _id)[0] }));

    const query = getIds(['myCurrentActions', 'teamCurrentActions', 'myCompletedActions', 'teamCompletedActions']);

    return this._getQueryForCurrentFilter(query);
  },
  _getSearchQuery() {
     return this.searchObject('searchText', [{ name: 'title' }, { name: 'sequentialId' }]);
   },
  _getActionsQuery(isToBeVerifiedByMe = false, isCompleted = false) {
    const userId = Meteor.userId();
    const toBeVerifiedBy = isToBeVerifiedByMe ? userId : { $ne: userId };
    return { toBeVerifiedBy, isCompleted, ...this._getSearchQuery() };
  },
  _getUniqueAssignees(prop) {
    const userIds = this[prop]().fetch().map(({ toBeVerifiedBy }) => toBeVerifiedBy);
    return [...new Set(userIds)];
  },
  myCurrentActions() {
    return this._getActionsByQuery({ ...this._getActionsQuery(true, false) })
  },
  myCompletedActions() {
    return this._getActionsByQuery({ ...this._getActionsQuery(true, true) });
  },
  teamCurrentActions() {
    return this._getActionsByQuery({ ...this._getActionsQuery(false, false) });
  },
  teamCurrentActionsAssignees() {
    return this._getUniqueAssignees('teamCurrentActions');
  },
  teamCompletedActions() {
    return this._getActionsByQuery({ ...this._getActionsQuery(false, true) });
  },
  teamCompletedActionsAssignees() {
    return this._getUniqueAssignees('teamCompletedActions');
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
  openAddNCModal() {
    this.modal().open({
      title: 'Non-conformity',
      template: 'CreateNC',
      variation: 'save'
    });
  }
});
