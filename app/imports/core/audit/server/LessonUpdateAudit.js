import { CollectionNames } from '/imports/api/constants.js';
import Utils from '../../utils.js';

import DocumentUpdateAudit from './DocumentUpdateAudit.js';
import NotesUpdateAudit from './mixins/NotesUpdateAudit.js';
import OwnerUpdateAudit from './mixins/NotesUpdateAudit.js';


const base = Utils.inherit(DocumentUpdateAudit, [
  NotesUpdateAudit, OwnerUpdateAudit
]);

export default class LessonUpdateAudit extends base {

  static get _fieldLabels() {
    const fieldLabels = {
      date: 'Creation date',
      documentId: 'Document ID',
      documentType: 'Document type',
      serialNumber: 'Serial number',
      title: 'Title'
    };

    return _(fieldLabels).extend(super._fieldLabels);
  }

  static get _collection() {
    return CollectionNames.LESSONS;
  }

}
