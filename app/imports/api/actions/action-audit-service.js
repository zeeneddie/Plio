import AuditService from '/imports/core/audit/audit-service.js';
import ActionUpdateAudit from './ActionUpdateAudit.js';


export default _.extend({}, AuditService, {
  _collection: 'Actions',

  _updateAuditConstructor: ActionUpdateAudit,

  _documentCreatedMessage: 'Action created',

  _documentRemovedMessage: 'Action removed'
});
