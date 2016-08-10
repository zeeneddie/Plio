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
    const diffValues = _(diff).pick(['addedItem', 'removedItem']);

    _(diffValues).each((val, key) => {
      if (val !== undefined) {
        const user = Meteor.users.findOne({ _id: val });
        const userName = user && user.fullName();
        userName && (diff[key] = userName);
      }
    });
  }

  _viewedByChanged(diff) {
    const { kind, addedItem:userId } = diff;

    if (kind !== this.constructor._changesTypes.ITEM_ADDED) {
      return;
    }

    const user = Meteor.users.findOne({ _id: userId });
    const userName = (user && user.fullNameOrEmail()) || userId;

    this._createLog({
      message: `${userName} viewed document`,
      field: 'viewedBy'
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
      viewedBy: 'Viewed by',
      organizationId: 'Organization ID'
    };
  }

  static get _ignoredFields() {
    return [
      'updatedAt',
      'updatedBy'
    ];
  }

}
