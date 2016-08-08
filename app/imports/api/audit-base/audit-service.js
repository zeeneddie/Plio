import { AuditLogs } from '../audit/audit-logs.js';

import UpdateAudit from './UpdateAudit.js';


export default {

  _collection: '',

  _updateAuditConstructor: UpdateAudit,

  _documentCreatedMessage: 'Document created',

  _documentRemovedMessage: 'Document removed',

  documentCreated(newDocument, userId) {
    const { _id, createdAt=new Date(), createdBy=userId } = newDocument;

    this._saveLogs([{
      collection: this._collection,
      message: this._documentCreatedMessage,
      documentId: _id,
      changedAt: createdAt,
      changedBy: createdBy
    }]);
  },

  documentUpdated(newDocument, oldDocument) {
    const updateAudit = new this._updateAuditConstructor(newDocument, oldDocument);
    const logs = updateAudit.getLogs();
    this._saveLogs(logs);
  },

  documentRemoved(oldDocument, userId) {
    const { _id } = oldDocument;

    this._saveLogs([{
      collection: this._collection,
      message: this._documentRemovedMessage,
      documentId: _id,
      changedAt: new Date(),
      changedBy: userId
    }]);
  },

  _saveLogs(logs) {
    console.log(logs);
    _(logs).each(log => {
      AuditLogs.insert(log);
    });
  }

};
