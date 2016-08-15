import { Departments } from '/imports/api/departments/departments.js';
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
        case 'viewedBy':
          this._viewedByChanged(diff);
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

  _notifyChanged(diff) {
    this._prettifyArrayItem(diff, (val) => {
      const user = Meteor.users.findOne({ _id: val });
      return user && user.fullName();
    });

    if (diff.kind === this.constructor._changesTypes.ITEM_REMOVED) {
      this._processRedudantDiffs('notify', diff.index);
    }
  }

  _viewedByChanged(diff) {
    const { kind, item:userId } = diff;

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

  _departmentsChanged(diff) {
    const { ITEM_ADDED, ITEM_REMOVED } = this.constructor._changesTypes;

    const { kind, item:departmentId } = diff;
    let message;

    if (kind === ITEM_ADDED) {
      message = 'Linked to [departmentName] department';
    } else if (kind === ITEM_REMOVED) {
      message = 'Unlinked from [departmentName] department';
    }

    if (!(departmentId && message)) {
      return;
    }

    const department = Departments.findOne({ _id: departmentId });
    const departmentName = (department && department.name) || departmentId;
    message = message.replace('[departmentName]', departmentName);

    this._createLog({
      message,
      field: 'departmentsIds'
    });

    diff.isProcessed = true;

    if (kind === ITEM_REMOVED) {
      this._processRedudantDiffs('departmentsIds', diff.index);
    }
  }

  _filesChanged(diff) {
    const { ITEM_ADDED, ITEM_REMOVED } = this.constructor._changesTypes;

    const { kind, item:file } = diff;
    const { name, url } = file;

    if ((kind === ITEM_ADDED) && !url) {
      diff.isProcessed = true;
      return;
    }

    let message;
    if (kind === ITEM_ADDED) {
      message = name ? `File ${name} uploaded` : 'File uploaded';
    } else if (kind === ITEM_REMOVED) {
      message = name ? `File ${name} removed` : 'File removed';
    }

    this._createLog({ message });

    diff.isProcessed = true;

    if (kind === ITEM_REMOVED) {
      this._processRedudantDiffs('files', diff.index);
    }
  }

  _fileUrlChanged(diff) {
    const { oldValue, newValue } = diff;

    if (!oldValue && newValue) {
      const { name } = _(this._newDoc.files).find(({ url }) => url === newValue) || {};

      this._createLog({
        message: `File ${name} uploaded`
      });

      diff.isProcessed = true;
    }
  }

  _userChanged(diff) {
    this._prettifyValues(diff, (val) => {
      const user = Meteor.users.findOne({ _id: val });
      return user && user.fullNameOrEmail();
    });
  }

  _processRedudantDiffs(field, index) {
    const redudantFieldRe = new RegExp(`^${field}\.${index-1}`);

    _(this._diff).each((diff) => {
      if (redudantFieldRe.test(diff.path.join('.'))) {
        diff.isProcessed = true;
      }
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
      'updatedBy'
    ];
  }

}
