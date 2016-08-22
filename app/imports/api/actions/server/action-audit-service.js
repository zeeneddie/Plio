import { CollectionNames, ProblemTypes } from '../../constants.js';
import AuditService from '../../base-audit-service.js';
import ActionUpdateAudit from '/imports/core/audit/server/ActionUpdateAudit.js';


export default _.extend({}, AuditService, {
  _collection: CollectionNames.ACTIONS,

  _updateAuditConstructor: ActionUpdateAudit,

  _onDocumentCreated(newDocument, userId) {
    const { linkedTo, createdAt, createdBy, sequentialId, title } = newDocument;

    const logs = [];
    const logMessage = `${sequentialId} "${title}" was linked to this document`;

    _(linkedTo).each(({ documentId, documentType }) => {
      const collections = {
        [ProblemTypes.NC]: CollectionNames.NCS,
        [ProblemTypes.RISK]: CollectionNames.RISKS
      };

      logs.push({
        documentId,
        collection: collections[documentType],
        message: logMessage,
        date: createdAt,
        executor: createdBy
      });
    });

    this._saveLogs(logs);
  }
});
