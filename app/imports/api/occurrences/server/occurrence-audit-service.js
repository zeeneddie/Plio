import { CollectionNames } from '../../constants.js';
import AuditService from '../../base-audit-service.js';
import OccurrenceUpdateAudit from '/imports/core/audit/server/OccurrenceUpdateAudit.js';


export default _.extend({}, AuditService, {
  _collection: CollectionNames.OCCURRENCES,

  _updateAuditConstructor: OccurrenceUpdateAudit
});
