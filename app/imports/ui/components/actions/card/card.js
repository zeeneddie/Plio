import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import get from 'lodash.get';

import { WorkInboxHelp } from '/imports/api/help-messages.js';
import { ActionPlanOptions } from '/imports/share/constants.js';
import { restore, remove } from '/imports/api/actions/methods';

Template.Actions_Card_Read.viewmodel({
  mixin: ['organization', 'workInbox', 'user', 'date', 'modal', 'router', 'collapsing', 'actionStatus'],
  isReadOnly: false,
  showCard() {
    return this.actions().length;
  },
  action() {
    return this._getActionByQuery({ _id: this._id() });
  },
  getActionTitle() {
    return this._getNameByType(get(this.action(), 'type'));
  },
  getClassForPlanInPlace(plan) {
    switch (plan) {
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
  getVerifiedDateLabel({ isVerifiedAsEffective } = {}) {
    return isVerifiedAsEffective
      ? 'Verified as effective date'
      : 'Assessed as ineffective date';
  },
  actions() {
    const organizationId = this.organizationId();
    return this._getActionsByQuery({ organizationId }).fetch();
  },
  openEditModal() {
    const _title = this.getActionTitle();
    this.modal().open({
      _title,
      helpText: WorkInboxHelp.workInbox,
      template: 'Actions_Edit',
      _id: get(this.action(), '_id'),
    });
  },
  restore({ _id, isDeleted, title }, cb = () => {}) {
    if (!isDeleted) return;

    restore.call({ _id }, cb);
  },
  delete({ _id, title, isDeleted }, cb = () => {}) {
    if (!isDeleted) return;

    remove.call({ _id }, cb);
  },
});
