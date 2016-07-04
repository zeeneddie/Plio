import { Template } from 'meteor/templating';

Template.ActionsCard.viewmodel({
  mixin: ['organization', 'action', 'user', 'date', 'modal', 'router', 'collapsing'],
  action() {
    return this._getActionByQuery({ _id: this.actionId() });
  },
  getActionTitle() {
    return this._getNameByType(this.action() && this.action().type);
  },
  actions() {
    const list = ViewModel.findOne('ActionsList');
    const query = list && list._getQueryForFilter();
    return this._getActionsByQuery(query);
  },
  hasActions() {
    return this.actions().count() > 0;
  },
  openEditActionModal() {
    const _title = this.getActionTitle();
    this.modal().open({
      _title,
      template: 'Actions_Edit',
      _id: this.actionId()
    });
  }
});
