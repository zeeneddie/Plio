import { AuditLogs } from '/imports/api/audit/audit-logs.js';

import UpdateAudit from './UpdateAudit.js';


export default {

  _collection: '',

  _updateAuditConstructor: UpdateAudit,

  documentCreated(newDocument, userId) {
    const { _id, createdAt=new Date(), createdBy=userId } = newDocument;

    this._saveLogs([{
      collection: this._collection,
      message: 'Document created',
      documentId: _id,
      date: createdAt,
      executor: createdBy
    }]);

    this._onDocumentCreated(newDocument, userId);
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
      message: 'Document removed',
      documentId: _id,
      date: new Date(),
      executor: userId
    }]);

    this._onDocumentRemoved(oldDocument, userId);
  },

  _onDocumentCreated(newDocument, userId) {

  },

  _onDocumentRemoved(oldDocument, userId) {

  },

  _saveLogs(logs) {
    _(logs).each(log => {
      AuditLogs.insert(log);
    });
  }

};
