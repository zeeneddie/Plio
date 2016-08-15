import { CollectionNames } from '../constants.js';
import AuditService from '/imports/core/audit/audit-service.js';
import NCUpdateAudit from './NCUpdateAudit.js';


export default _.extend({}, AuditService, {
  _collection: CollectionNames.NCS,

  _updateAuditConstructor: NCUpdateAudit,

  _documentCreatedMessage: 'Non conformity created',

  _documentRemovedMessage: 'Non conformity removed'
});
