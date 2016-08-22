import { CollectionNames } from '../../constants.js';
import AuditService from '../../base-audit-service.js';
import OccurrenceUpdateAudit from '/imports/core/audit/server/OccurrenceUpdateAudit.js';


export default _.extend({}, AuditService, {
  _collection: CollectionNames.OCCURRENCES,

  _updateAuditConstructor: OccurrenceUpdateAudit,

  _onDocumentCreated(newDocument, userId) {
    const { createdAt, createdBy, nonConformityId } = newDocument;

    this._saveLogs([{
      documentId: nonConformityId,
      collection: CollectionNames.NCS,
      message: 'Occurrence added',
      date: createdAt,
      executor: createdBy
    }]);
  },

  _onDocumentRemoved(oldDocument, userId) {
    const { nonConformityId } = oldDocument;

    this._saveLogs([{
      documentId: nonConformityId,
      collection: CollectionNames.NCS,
      message: 'Occurrence removed',
      date: new Date(),
      executor: userId
    }]);
  }
});
