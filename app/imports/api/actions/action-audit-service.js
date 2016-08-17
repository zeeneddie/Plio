import { CollectionNames } from '../constants.js';
import AuditService from '/imports/core/audit/audit-service.js';
import ActionUpdateAudit from './ActionUpdateAudit.js';


export default _.extend({}, AuditService, {
  _collection: CollectionNames.ACTIONS,

  _updateAuditConstructor: ActionUpdateAudit,

  _documentCreatedMessage: 'Action created',

  _documentRemovedMessage: 'Action removed'
});
