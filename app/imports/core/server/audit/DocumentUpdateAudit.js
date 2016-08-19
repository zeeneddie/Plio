import { Meteor } from 'meteor/meteor';

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

  _departmentsChanged(diff) {
    const { ITEM_ADDED, ITEM_REMOVED } = this.constructor._changesTypes;

    const { field, kind, item:departmentId } = diff;
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

    this._createLog({ message, field });

    diff.isProcessed = true;
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
  }

  _fileUrlChanged(diff) {
    const getFileName = (doc, fileUrl) => {
      let name;

      for (let key in doc) {
        if (!doc.hasOwnProperty(key)) continue;

        const val = doc[key];
        if ((key === 'url') && (val === fileUrl)) {
          name = doc['name'];
          break;
        } else if (_(val).isObject()) {
          name = getFileName(val, fileUrl);
          if (name) break;
        }
      }

      return name;
    };

    const { field, oldValue, newValue } = diff;

    if (!oldValue && newValue) {
      const name = getFileName(this._newDoc, newValue);

      this._createLog({
        message: `File ${name} uploaded`,
        field
      });

      diff.isProcessed = true;
    }
  }

  _improvementPlanChanged(diff) {
    const { FIELD_ADDED, FIELD_REMOVED } = this.constructor._changesTypes;

    const { kind, newValue:plan, field } = diff;

    if (kind === FIELD_REMOVED) {
      this._createLog({ message: 'Improvement plan removed', field });
      diff.isProcessed = true;
    }

    if (!((kind === FIELD_ADDED) && _(plan).isObject())) {
      return;
    }

    const { owner, reviewDates, targetDate } = plan;
    const planDesc = [];

    if (owner !== undefined) {
      const ownerDoc = Meteor.users.findOne({ _id: owner });
      const ownerName = (ownerDoc && ownerDoc.fullNameOrEmail()) || owner;
      planDesc.push(`owner - ${ownerName}`);
    }

    if (_(reviewDates).isArray() && reviewDates.length) {
      const dates = _(reviewDates).map(
        ({ date }) => this._getPrettyDate(date)
      ).join(', ');
      planDesc.push(`review dates - ${dates}`);
    }

    if (targetDate !== undefined) {
      const date = this._getPrettyDate(targetDate);
      planDesc.push(`target date for desired outcome - ${date}`);
    }

    let message;
    if (planDesc.length) {
      message = `Improvement plan created: ${planDesc.join(', ')}`;
    } else {
      message = 'Improvement plan created';
    }

    this._createLog({ message });

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

  static get _messages() {
    const { ITEM_ADDED } = this._changesTypes;

    return {
      viewedBy: {
        [ITEM_ADDED]: 'Document viewed',
      }
    };
  }

  static get _ignoredFields() {
    return [
      'updatedAt',
      'updatedBy'
    ];
  }

}
