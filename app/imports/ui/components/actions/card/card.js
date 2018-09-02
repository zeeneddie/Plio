import { Template } from 'meteor/templating';
import get from 'lodash.get';
import { compose, length, props, reject, isNil } from 'ramda';

import { WorkInboxHelp } from '../../../../api/help-messages.js';
import { ActionPlanOptions } from '../../../../share/constants.js';
import { restore, remove } from '../../../../api/actions/methods';

Template.Actions_Card_Read.viewmodel({
  mixin: [
    'organization',
    'workInbox',
    'user',
    'date',
    'modal',
    'router',
    'collapsing',
    'actionStatus',
  ],
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
      case ActionPlanOptions.NO:
        return 'text-danger';
      case ActionPlanOptions.NOT_NEEDED:
        return 'text-primary';
      default:
        return 'text-primary';
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
  restore({ _id, isDeleted }, cb = () => {}) {
    if (!isDeleted) return;

    restore.call({ _id }, cb);
  },
  delete({ _id, isDeleted }, cb = () => {}) {
    if (!isDeleted) return;

    remove.call({ _id }, cb);
  },
  isCompletionBlock(action) {
    const fields = ['completionComments'];
    if (action.isCompleted) {
      fields.push('completedAt', 'completedBy');
    } else {
      fields.push('completionTargetDate', 'toBeCompletedBy');
    }
    return compose(length, reject(isNil), props(fields))(action);
  },
});
