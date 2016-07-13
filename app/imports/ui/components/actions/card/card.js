import { Template } from 'meteor/templating';

import { ActionPlanOptions } from '/imports/api/constants.js';

Template.Actions_Card_Read.viewmodel({
  mixin: ['organization', 'action', 'user', 'date', 'modal', 'router', 'collapsing', 'actionStatus'],
  action() {
    return this._getActionByQuery({ _id: this.actionId() });
  },
  getActionTitle() {
    return this._getNameByType(this.action() && this.action().type);
  },
  getClassForPlanInPlace(plan) {
    switch(plan) {
      case ActionPlanOptions.YES:
        return 'text-success';
        break;
      case ActionPlanOptions.NO:
        return 'text-danger';
        break;
      case ActionPlanOptions.NOT_NEEDED:
        return 'text-primary';
        break;
      default:
        return 'text-primary';
        break;
    }
  },
  actions() {
    const list = ViewModel.findOne('ActionsList');
    const query = list && list._getQueryForFilter();
    return this._getActionsByQuery(query);
  },
  hasActions() {
    return this.actions().count() > 0;
  },
  onOpenEditModalCb() {
    return this.openEditActionModal.bind(this);
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
