import { Mongo } from 'meteor/mongo';

import { AuditLogSchema } from './audit-log-schema.js';


const AuditLogs = new Mongo.Collection('AuditLogs');
AuditLogs.attachSchema(AuditLogSchema);

export { AuditLogs };
