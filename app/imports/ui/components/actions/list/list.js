import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

Template.ActionsList.viewmodel({
  share: 'search',
  mixin: ['search', 'collapsing', 'organization', 'modal', 'action', 'router', 'user'],
  onCreated() {
    this.searchText('');
  },
  _getActionsQuery(isToBeVerifiedByMe = false, isCompleted = false) {
    const userId = Meteor.userId();
    const toBeVerifiedBy = isToBeVerifiedByMe ? userId : { $ne: userId };
    return { toBeVerifiedBy, isCompleted };
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
  teamCompletedActions() {
    return this._getActionsByQuery({ ...this._getActionsQuery(false, true) });
  }
});
