import { Mongo } from 'meteor/mongo';

import { CollectionNames } from '../constants.js';
import { AuditLogSchema } from '../schemas/audit-log-schema.js';


const AuditLogs = new Mongo.Collection(CollectionNames.AUDIT_LOGS);
AuditLogs.attachSchema(AuditLogSchema);

export { AuditLogs };
