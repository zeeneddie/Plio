import { Meteor } from 'meteor/meteor';

import { Changelog } from '/imports/share/collections/server/changelog.js';
import { DocChangesKinds } from '/imports/share/constants.js';


export default AuditManager = {

  _isAuditStarted: false,

  startAudit() {
    this._isAuditStarted = true;
  },

  stopAudit() {
    this._isAuditStarted = false;
  },

  isAuditStarted() {
    return this._isAuditStarted === true;
  },

  documentCreated(newDocument, userId, collectionName) {
    Changelog.insert({
      collection: collectionName,
      changeKind: DocChangesKinds.DOC_CREATED,
      newDocument,
      userId
    });
  },

  documentUpdated(newDocument, oldDocument, userId, collectionName) {
    Changelog.insert({
      collection: collectionName,
      changeKind: DocChangesKinds.DOC_UPDATED,
      newDocument,
      oldDocument,
      userId
    });
  },

  documentRemoved(oldDocument, userId, collectionName) {
    Changelog.insert({
      collection: collectionName,
      changeKind: DocChangesKinds.DOC_REMOVED,
      oldDocument,
      userId
    });
  },

  registerCollection(collection, collectionName) {
    const auditManager = this;

    collection.after.insert(function(userId, doc) {
      Meteor.defer(() => {
        if (auditManager.isAuditStarted()) {
          auditManager.documentCreated(doc, userId, collectionName);
        }
      });
    });

    collection.after.update(function(userId, doc, fieldNames, modifier, options) {
      Meteor.defer(() => {
        if (auditManager.isAuditStarted()) {
          auditManager.documentUpdated(doc, this.previous, userId, collectionName);
        }
      });
    });

    collection.after.remove(function(userId, doc) {
      Meteor.defer(() => {
        if (auditManager.isAuditStarted()) {
          auditManager.documentRemoved(doc, userId, collectionName);
        }
      });
    });
  }

};
