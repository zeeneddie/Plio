import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

Template.ActionsList.viewmodel({
  share: 'search',
  mixin: ['search', 'collapsing', 'organization', 'modal', 'action', 'router'],
  onCreated() {
    this.searchText('');
  },
  _getActionsQuery(isForMe = false, isCompleted = false) {
    const userId = Meteor.userId();
    const toBeCompletedBy = isForMe ? userId : { $ne: userId };
    return { toBeCompletedBy: Meteor.userId(), isCompleted: false };
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
