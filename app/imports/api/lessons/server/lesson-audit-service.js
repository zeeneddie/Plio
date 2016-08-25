import { CollectionNames } from '../../constants.js';
import AuditService from '../../base-audit-service.js';
import LessonUpdateAudit from '/imports/core/audit/server/LessonUpdateAudit.js';


export default _.extend({}, AuditService, {
  _collection: CollectionNames.LESSONS,

  _updateAuditConstructor: LessonUpdateAudit
});
