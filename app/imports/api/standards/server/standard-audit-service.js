import { CollectionNames } from '../../constants.js';
import AuditService from '/imports/core/server/audit/audit-service.js';
import StandardUpdateAudit from './StandardUpdateAudit.js';


export default _.extend({}, AuditService, {
  _collection: CollectionNames.STANDARDS,

  _updateAuditConstructor: StandardUpdateAudit,

  _documentCreatedMessage: 'Standard created',

  _documentRemovedMessage: 'Standard removed'
});
