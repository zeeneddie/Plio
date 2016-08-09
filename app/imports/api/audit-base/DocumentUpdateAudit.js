import UpdateAudit from './UpdateAudit.js';


export default class DocumentUpdateAudit extends UpdateAudit {

  _buildLogs() {
    _(this._diff).each(diff => {
      if (diff.isProcessed) {
        return;
      }

      switch (diff.field) {
        case 'notify':
          this._notifyChanged(diff);
          break;
        case 'viewedBy':
          this._viewedByChanged(diff);
          break;
        case 'isDeleted':
          this._deleteStateChanged(diff);
          break;
      }
    });

    super._buildLogs();
  }

  _notifyChanged(diff) {
    const { addedItem, removedItem } = diff;
    const userId = addedItem || removedItem;
    const user = Meteor.users.findOne({ _id: userId });
    const userName = (user && user.fullName()) || userId;

    this._createLog({
      message: `${userName} added to notify list`
    });

    diff.isProcessed = true;
  }

  _viewedByChanged(diff) {
    const { addedItem, removedItem } = diff;
    const userId = addedItem || removedItem;
    const user = Meteor.users.findOne({ _id: userId });
    const userName = (user && user.fullName()) || userId;

    this._createLog({
      message: `${userName} viewed document`
    });

    diff.isProcessed = true;
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
      message = 'Deleted';
    } else if (newValue === false) {
      message = 'Restored';
    }

    if (!message) {
      return;
    }

    this._createLog({ message });

    diff.isProcessed = true;
    deletedAtDiff.isProcessed = true;
    deletedByDiff.isProcessed = true;
  }

  static get _fieldLabels() {
    return {
      createdAt: 'Created at',
      createdBy: 'Created by',
      updatedAt: 'Updated at',
      updatedBy: 'Updated by',
      isDeleted: 'Is deleted',
      deletedAt: 'Deleted at',
      deletedBy: 'Deleted by',
      notify: 'Notify',
      viewedBy: 'Viewed by'
    };
  }

  static get _ignoredFields() {
    return [
      'updatedAt',
      'updatedBy'
    ];
  }

}
