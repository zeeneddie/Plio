import { Mongo } from 'meteor/mongo';

import { AuditLogSchema } from '../schemas/audit-log-schema.js';


const AuditLogs = new Mongo.Collection('AuditLogs');
AuditLogs.attachSchema(AuditLogSchema);

export { AuditLogs };
