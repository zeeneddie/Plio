import { Departments } from '/imports/api/departments/departments.js';


export const departmentsUpdateAudit = {

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

};

export const filesUpdateAudit = {

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
  },

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

};

export const usersUpdateAudit = {

  _userChanged(diff) {
    this._prettifyValues(diff, (val) => {
      const user = Meteor.users.findOne({ _id: val });
      return user && user.fullNameOrEmail();
    });
  }

};
