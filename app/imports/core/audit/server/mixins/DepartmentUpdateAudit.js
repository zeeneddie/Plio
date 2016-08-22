import { Departments } from '/imports/api/departments/departments.js';


export default (base) => class extends base {

  _buildLogs() {
    _(this._diff).each(diff => {
      if (diff.isProcessed) {
        return;
      }

      switch (diff.field) {
        case 'departmentsIds':
          this._departmentsChanged(diff);
          break;
      }
    });

    super._buildLogs();
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

  static get _fieldLabels() {
    const fieldLabels = {
      departmentsIds: 'Departments',
    };

    return _(fieldLabels).extend(super._fieldLabels);
  }

}
