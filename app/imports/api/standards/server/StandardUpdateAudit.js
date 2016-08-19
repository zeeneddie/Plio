import { CollectionNames, StandardStatuses } from '../../constants.js';
import { Departments } from '../../departments/departments.js';
import { StandardsBookSections } from '../../standards-book-sections/standards-book-sections.js';
import DocumentUpdateAudit from '/imports/core/server/audit/DocumentUpdateAudit.js';


export default class StandardUpdateAudit extends DocumentUpdateAudit {

  _buildLogs() {
    _(this._diff).each(diff => {
      if (diff.isProcessed) {
        return;
      }

      switch (diff.field) {
        case 'departmentsIds':
          this._departmentsChanged(diff);
          break;
        case 'owner':
          this._userChanged(diff);
          break;
        case 'sectionId':
          this._sectionChanged(diff);
          break;
        case 'source1':
        case 'source2':
          this._sourceFileChanged(diff);
          break;
        case 'source1.type':
        case 'source2.type':
          this._sourceFileTypeChanged(diff);
          break;
        case 'source1.url':
        case 'source2.url':
          this._sourceFileUrlChanged(diff);
          break;
        case 'status':
          this._statusChanged(diff);
          break;
        case 'typeId':
          this._typeChanged(diff);
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

  _sourceFileChanged(diff) {
    const { FIELD_ADDED, FIELD_REMOVED } = this.constructor._changesTypes;
    const { kind, field } = diff;

    let source;
    if (kind === FIELD_ADDED) {
      source = diff.newValue;

      if (!source.url) {
        diff.isProcessed = true;
        return;
      }
    } else if (kind === FIELD_REMOVED) {
      source = diff.oldValue;

      // ignore situation when 'source2' renamed to 'source1' after 'source1' was removed
      if (field === 'source2') {
        const source1Diff = _(this._diff).find(
          ({ field, kind }) => (field === 'source1') && (kind === FIELD_ADDED)
        );

        if (source1Diff) {
          diff.isProcessed = true;
          source1Diff.isProcessed = true;
          return;
        }
      }
    }

    const { type, name, url } = source;

    const messages = {
      attachment: {
        [FIELD_ADDED]: name ? `Source attachment ${name} uploaded` : 'Source attachment uploaded',
        [FIELD_REMOVED]: name ? `Source attachment ${name} removed` : 'Source attachment removed'
      },
      url: {
        [FIELD_ADDED]: `Source URL added ${url}`,
        [FIELD_REMOVED]: `Source URL removed ${url}`
      },
      video: {
        [FIELD_ADDED]: `Source video added ${url}`,
        [FIELD_REMOVED]: `Source video removed ${url}`
      }
    };

    this._createLog({ message: messages[type][kind] });

    diff.isProcessed = true;
  }

  _sourceFileTypeChanged(diff) {
    const { oldValue, newValue, path } = diff;

    let ignoredFields;
    if (oldValue === 'attachment') {
      ignoredFields = ['name'];
    } else if (newValue === 'attachment') {
      ignoredFields = ['name', 'url'];
    }

    const sourceField = path[0];

    _(ignoredFields).each((ignField) => {
      const ignoredDiff = _(this._diff).find(
        ({ field:diffField }) => diffField === `${sourceField}.${ignField}`
      );

      ignoredDiff && (ignoredDiff.isProcessed = true);
    });
  }

  _sourceFileUrlChanged(diff) {
    const { oldValue, newValue, path } = diff;
    const sourceField = path[0];
    const sourceType = this._newDoc[sourceField]['type'];

    if (!oldValue && newValue && (sourceType === 'attachment')) {
      const fileName = this._newDoc[sourceField]['name'];

      this._createLog({
        message: `Source attachment ${fileName} uploaded`
      });

      diff.isProcessed = true;
    }
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

  static get _fieldLabels() {
    const fieldLabels = {
      approved: 'Approved',
      approvedAt: 'Approved at',
      departmentsIds: 'Departments',
      description: 'Description',
      issueNumber: 'Issue number',
      nestingLevel: 'Nesting level',
      notes: 'Notes',
      owner: 'Owner',
      sectionId: 'Book section',
      source1: 'Source',
      'source1.extension': 'Source extension',
      'source1.type': 'Source type',
      'source1.url': 'Source url',
      'source1.htmlUrl': 'Source html url',
      'source1.name': 'Source name',
      source2: 'Source',
      'source2.extension': 'Source extension',
      'source2.type': 'Source type',
      'source2.url': 'Source url',
      'source2.htmlUrl': 'Source html url',
      'source2.name': 'Source name',
      status: 'Status',
      title: 'Title',
      typeId: 'Type'
    };

    return _(fieldLabels).extend(super._fieldLabels);
  }

  static get _messages() {
    const { FIELD_ADDED, FIELD_CHANGED, FIELD_REMOVED } = this._changesTypes;

    const messages = {
      description: {
        [FIELD_ADDED]: 'Description set',
        [FIELD_CHANGED]: 'Description changed',
        [FIELD_REMOVED]: 'Description removed'
      }
    };

    return _(messages).extend(super._messages);
  }

  static get _ignoredFields() {
    const ignoredFields = [
      'source1.extension',
      'source2.extension',
      'source1.htmlUrl',
      'source2.htmlUrl'
    ];

    return ignoredFields.concat(super._ignoredFields);
  }

  static get _collection() {
    return CollectionNames.STANDARDS;
  }

}
