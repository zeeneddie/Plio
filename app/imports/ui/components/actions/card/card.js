import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { ActionPlanOptions } from '/imports/api/constants.js';
import { restore, remove } from '/imports/api/actions/methods.js';

Template.Actions_Card_Read.viewmodel({
  mixin: ['organization', 'workInbox', 'user', 'date', 'modal', 'router', 'collapsing', 'actionStatus'],
  action() {
    return this._getActionByQuery({ _id: this._id() });
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
  onOpenEditModalCb() {
    return this.openEditActionModal.bind(this);
  },
  openEditActionModal() {
    const _title = this.getActionTitle();
    this.modal().open({
      _title,
      template: 'Actions_Edit',
      _id: this._id()
    });
  },
  onRestoreCb() {
    return this.restore.bind(this);
  },
  restore({ _id, isDeleted, title, ...args }, cb = () => {}) {
    if (!isDeleted) return;

    const callback = (err) => {
      cb(err, () => {
        const queryParams = this._getQueryParams({ _id, isDeleted, title, ...args })(Meteor.userId());
        FlowRouter.setQueryParams(queryParams);
        Meteor.setTimeout(() => {
          this.goToAction(_id);
          this.expandCollapsed(_id);
        }, 0);
      });
    };

    restore.call({ _id }, callback);
  },
  onDeleteCb() {
    return this.delete.bind(this);
  },
  delete({ _id, title, isDeleted }, cb = () => {}) {
    if (!isDeleted) return;

    const callback = (err) => {
      cb(err, () => {
        const actions = this._getActionsByQuery({});

        if (actions.count() > 0) {
          Meteor.defer(() => {
            this.goToActions();
          });
        }
      });
    };

    remove.call({ _id }, callback);
  }
});
