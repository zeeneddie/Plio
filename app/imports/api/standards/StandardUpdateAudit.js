import { CollectionNames, StandardStatuses } from '../constants.js';
import { Departments } from '../departments/departments.js';
import { StandardsBookSections } from '../standards-book-sections/standards-book-sections.js';
import DocumentUpdateAudit from '../audit-base/DocumentUpdateAudit.js';


export default class StandardUpdateAudit extends DocumentUpdateAudit {

  _buildLogs() {
    _(this._diff).each(diff => {
      if (diff.isProcessed) {
        return;
      }

      switch (diff.field) {
        case 'sectionId':
          this._sectionChanged(diff);
          break;
        case 'typeId':
          this._typeChanged(diff);
          break;
        case 'owner':
          this._userChanged(diff);
          break;
        case 'status':
          this._statusChanged(diff);
          break;
        case 'departmentsIds':
          this._departmentsChanged(diff);
          break;
      }
    });

    super._buildLogs();
  }

  _sectionChanged(diff) {
    this._prettifyValues(diff, (val) => {
      const bookSection = StandardsBookSections.findOne({ _id: val });
      return bookSection && bookSection.title;
    });
  }

  _typeChanged(diff) {
    this._prettifyValues(diff, (val) => {
      const standardType = StandardTypes.findOne({ _id: val });
      return standardType && standardType.name;
    });
  }

  _statusChanged(diff) {
    this._prettifyValues(diff, val => StandardStatuses[val]);
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

  static get _fieldLabels() {
    const fieldLabels = {
      title: 'Title',
      typeId: 'Type',
      sectionId: 'Book section',
      nestingLevel: 'Nesting level',
      owner: 'Owner',
      issueNumber: 'Issue number',
      status: 'Status',
      description: 'Description',
      approved: 'Approved',
      approvedAt: 'Approved at',
      notes: 'Notes',
      departmentsIds: 'Departments',
      source1: 'Source file 1',
      'source1.extension': 'Source file 1 extension',
      'source1.type': 'Source file 1 type',
      'source1.url': 'Source file 1 url',
      'source1.htmlUrl': 'Source file 1 html url',
      'source1.name': 'Source file 1 name',
      source2: 'Source file 2',
      'source2.extension': 'Source file 2 extension',
      'source2.type': 'Source file 2 type',
      'source2.url': 'Source file 2 url',
      'source2.htmlUrl': 'Source file 2 html url',
      'source2.name': 'Source file 2 name'
    };

    return _(fieldLabels).extend(super._fieldLabels);
  }

  static get _messages() {
    const { FIELD_ADDED, FIELD_CHANGED, FIELD_REMOVED } = this._changesTypes;

    const messages = {
      description: {
        [FIELD_ADDED]: 'Description set',
        [FIELD_CHANGED]: 'Description changed',
        [FIELD_REMOVED]: 'Description removed',
      }
    };

    return _(messages).extend(super._messages);
  }

  static get _collection() {
    return CollectionNames.STANDARDS;
  }

}
