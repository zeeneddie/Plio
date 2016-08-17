import { CollectionNames } from '../../constants.js';
import DocumentUpdateAudit from '/imports/core/server/audit/DocumentUpdateAudit.js';


export default class LessonUpdateAudit extends DocumentUpdateAudit {

  _buildLogs() {
    _(this._diff).each(diff => {
      if (diff.isProcessed) {
        return;
      }

      switch (diff.field) {
        case 'owner':
          this._userChanged(diff);
          break;
      }
    });

    super._buildLogs();
  }

  static get _fieldLabels() {
    const fieldLabels = {
      date: 'Creation date',
      documentId: 'Document ID',
      documentType: 'Document type',
      notes: 'Notes',
      owner: 'Owner',
      serialNumber: 'Serial number',
      title: 'Title'
    };

    return _(fieldLabels).extend(super._fieldLabels);
  }

  static get _collection() {
    return CollectionNames.LESSONS;
  }

  static get _messages() {
    const changesTypes = this._changesTypes;

    const messages = {
      notes: {
        [changesTypes.FIELD_ADDED]: 'Notes set',
        [changesTypes.FIELD_CHANGED]: 'Notes changed',
        [changesTypes.FIELD_REMOVED]: 'Notes removed',
      }
    };

    return _(messages).extend(super._messages);
  }

}
