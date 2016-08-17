import { CollectionNames } from '../../constants.js';
import DocumentUpdateAudit from '/imports/core/server/audit/DocumentUpdateAudit.js';


export default class OccurrenceUpdateAudit extends DocumentUpdateAudit {

  static get _fieldLabels() {
    const fieldLabels = {
      date: 'Date',
      description: 'Description',
      nonConformityId: 'Non conformity ID',
      sequentialId: 'Sequential ID',
      serialNumber: 'Serial number'
    };

    return _(fieldLabels).extend(super._fieldLabels);
  }

  static get _collection() {
    return CollectionNames.OCCURRENCES;
  }

  static get _messages() {
    const changesTypes = this._changesTypes;

    const messages = {
      description: {
        [changesTypes.FIELD_ADDED]: 'Description set',
        [changesTypes.FIELD_CHANGED]: 'Description changed',
        [changesTypes.FIELD_REMOVED]: 'Description removed',
      }
    };

    return _(messages).extend(super._messages);
  }

}
