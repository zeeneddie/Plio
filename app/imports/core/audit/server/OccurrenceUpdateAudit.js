import { CollectionNames } from '/imports/api/constants.js';
import Utils from '../../utils.js';

import DocumentUpdateAudit from './DocumentUpdateAudit.js';
import DescriptionUpdateAudit from './mixins/DescriptionUpdateAudit.js';


const base = Utils.inherit(DocumentUpdateAudit, [DescriptionUpdateAudit]);

export default class OccurrenceUpdateAudit extends base {

  _createLog({ message, ...rest }) {
    super._createLog({ message, ...rest });

    const lowerCaseMessage = message[0].toLowerCase() + message.slice(1);

    this._logs.push({
      documentId: this._newDoc.nonConformityId,
      collection: CollectionNames.NCS,
      message: `Occurrence ${lowerCaseMessage}`,
      date: this._updatedAt,
      executor: this._updatedBy
    });
  }

  static get _fieldLabels() {
    const fieldLabels = {
      date: 'Date',
      nonConformityId: 'Non conformity ID',
      sequentialId: 'Sequential ID',
      serialNumber: 'Serial number'
    };

    return _(fieldLabels).extend(super._fieldLabels);
  }

  static get _collection() {
    return CollectionNames.OCCURRENCES;
  }

}
