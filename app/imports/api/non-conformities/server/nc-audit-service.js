import { CollectionNames } from '../../constants.js';
import AuditService from '../../base-audit-service.js';
import NCUpdateAudit from '/imports/core/audit/server/NCUpdateAudit.js';


export default _.extend({}, AuditService, {
  _collection: CollectionNames.NCS,

  _updateAuditConstructor: NCUpdateAudit,

  _onDocumentCreated(newDocument, userId) {
    const { standardsIds, createdAt, createdBy, sequentialId, title } = newDocument;

    const logs = [];
    const logMessage = `${sequentialId} "${title}" was linked to this document`;

    _(standardsIds).forEach((standardId) => {
      logs.push({
        collection: CollectionNames.STANDARDS,
        message: logMessage,
        documentId: standardId,
        date: createdAt,
        executor: createdBy
      });
    });

    this._saveLogs(logs);
  }
});
