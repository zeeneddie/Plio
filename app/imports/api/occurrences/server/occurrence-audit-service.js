import { CollectionNames } from '../../constants.js';
import AuditService from '/imports/core/server/audit/audit-service.js';
import OccurrenceUpdateAudit from './OccurrenceUpdateAudit.js';


export default _.extend({}, AuditService, {
  _collection: CollectionNames.OCCURRENCES,

  _updateAuditConstructor: OccurrenceUpdateAudit
});
