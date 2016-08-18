import { CollectionNames, ProblemTypes } from '../../constants.js';
import AuditService from '/imports/core/server/audit/audit-service.js';
import ActionUpdateAudit from './ActionUpdateAudit.js';


export default _.extend({}, AuditService, {
  _collection: CollectionNames.ACTIONS,

  _updateAuditConstructor: ActionUpdateAudit,

  _onDocumentCreated(newDocument, userId) {
    const { linkedTo, createdAt, createdBy, sequentialId, title } = newDocument;

    const getLinkedDocsIds = (docType) => {
      return _(
        _(linkedTo).filter(({ documentType }) => documentType === docType)
      ).pluck('documentId');
    };

    const NCsIds = getLinkedDocsIds(ProblemTypes.NC);
    const risksIds = getLinkedDocsIds(ProblemTypes.RISK);

    const logs = [];
    const logMessage = `${sequentialId} "${title}" linked`;

    _(NCsIds).each((NCId) => {
      logs.push({
        collection: CollectionNames.NCS,
        message: logMessage,
        documentId: NCId,
        date: createdAt,
        executor: createdBy
      });
    });

    _(risksIds).each((riskId) => {
      logs.push({
        collection: CollectionNames.RISKS,
        message: logMessage,
        documentId: riskId,
        date: createdAt,
        executor: createdBy
      });
    });

    this._saveLogs(logs);
  }
});
