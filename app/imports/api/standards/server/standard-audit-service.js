import { CollectionNames } from '../../constants.js';
import AuditService from '../../base-audit-service.js';
import StandardUpdateAudit from '/imports/core/audit/server/StandardUpdateAudit.js';


export default _.extend({}, AuditService, {
  _collection: CollectionNames.STANDARDS,

  _updateAuditConstructor: StandardUpdateAudit
});
