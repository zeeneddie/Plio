import { CollectionNames } from '../../constants.js';
import AuditService from '/imports/core/server/audit/audit-service.js';
import LessonUpdateAudit from './LessonUpdateAudit.js';


export default _.extend({}, AuditService, {
  _collection: CollectionNames.LESSONS,

  _updateAuditConstructor: LessonUpdateAudit,

  _documentCreatedMessage: 'Lesson learned created',

  _documentRemovedMessage: 'Lesson learned removed'
});
