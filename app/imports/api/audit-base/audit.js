import { AuditLogs } from '../audit/audit-logs.js';

import UpdateAudit from './update-audit.js';


export default {

  _collection: AuditLogs,

  _updateAuditConstructor: UpdateAudit,

  documentCreated(newDocument) {

  },

  documentUpdated(newDocument, oldDocument) {
    const updateAudit = new this._updateAuditConstructor(newDocument, oldDocument);
    const logs = updateAudit.getLogs();
    this._saveLogs(logs);
  },

  documentRemoved(oldDocument, userId) {

  },

  _saveLogs(logs) {
    _(logs).each(log => {
      this._collection.insert(log);
    });
  }

};
