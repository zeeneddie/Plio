import { Meteor } from 'meteor/meteor';

import UpdateAudit from './UpdateAudit.js';


export default class DocumentUpdateAudit extends UpdateAudit {

  _buildLogs() {
    _(this._diff).each(diff => {
      if (diff.isProcessed) {
        return;
      }

      switch (diff.field) {
        case 'isDeleted':
          this._deleteStateChanged(diff);
          break;
        case 'notify':
          this._notifyChanged(diff);
          break;
      }
    });

    super._buildLogs();
  }

  _deleteStateChanged(diff) {
    const deletedAtDiff = _(this._diff).find(({ field }) => field === 'deletedAt');
    const deletedByDiff = _(this._diff).find(({ field }) => field === 'deletedBy');

    if (!(deletedAtDiff && deletedByDiff)) {
      return;
    }

    const { newValue } = diff;
    let message;
    if (newValue === true) {
      message = 'Document was deleted';
    } else if (newValue === false) {
      message = 'Document was restored';
    }

    if (!message) {
      return;
    }

    this._createLog({ message });

    diff.isProcessed = true;
    deletedAtDiff.isProcessed = true;
    deletedByDiff.isProcessed = true;
  }

  _notifyChanged(diff) {
    const { ITEM_ADDED, ITEM_REMOVED } = this.constructor._changesTypes;
    const { field, kind, item:userId } = diff;

    const user = Meteor.users.findOne({ _id: userId });
    const userName = (user && user.fullNameOrEmail()) || userId;

    const messages = {
      [ITEM_ADDED]: `${userName} added to notification list`,
      [ITEM_REMOVED]: `${userName} removed from notification list`
    };

    this._createLog({
      message: messages[kind],
      field
    });

    diff.isProcessed = true;
  }

  _userChanged(diff) {
    this._prettifyValues(diff, (val) => {
      const user = Meteor.users.findOne({ _id: val });
      return user && user.fullNameOrEmail();
    });
  }

  static get _fieldLabels() {
    return {
      createdAt: 'Created at',
      createdBy: 'Created by',
      deletedAt: 'Deleted at',
      deletedBy: 'Deleted by',
      isDeleted: 'Deleted',
      notify: 'Notify',
      organizationId: 'Organization ID',
      updatedAt: 'Updated at',
      updatedBy: 'Updated by',
      viewedBy: 'Viewed by'
    };
  }

  static get _ignoredFields() {
    return [
      'updatedAt',
      'updatedBy',
      'viewedBy'
    ];
  }

}
