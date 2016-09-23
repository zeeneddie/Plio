import { Meteor } from 'meteor/meteor';

import { DocChangesKinds } from './utils/changes-kinds.js';
import DocChangeHandler from './utils/DocChangeHandler.js';


export default Auditor = {

  _auditConfigs: { },

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
    const config = this._auditConfigs[collectionName];

    new DocChangeHandler(config, DocChangesKinds.DOC_CREATED, {
      newDocument, userId
    }).handleChange();
  },

  documentUpdated(newDocument, oldDocument, collectionName) {
    const config = this._auditConfigs[collectionName];

    new DocChangeHandler(config, DocChangesKinds.DOC_UPDATED, {
      newDocument, oldDocument
    }).handleChange();
  },

  documentRemoved(oldDocument, userId, collectionName) {
    const config = this._auditConfigs[collectionName];

    new DocChangeHandler(config, DocChangesKinds.DOC_REMOVED, {
      oldDocument, userId
    }).handleChange();
  },

  registerConfig(config) {
    const { collection, collectionName } = config;
    const auditor = this;

    collection.after.insert(function(userId, doc) {
      Meteor.defer(() => {
        if (auditor.isAuditStarted()) {
          auditor.documentCreated(doc, userId, collectionName);
        }
      });
    });

    collection.after.update(function(userId, doc, fieldNames, modifier, options) {
      Meteor.defer(() => {
        if (auditor.isAuditStarted()) {
          auditor.documentUpdated(doc, this.previous, collectionName);
        }
      });
    });

    collection.after.remove(function(userId, doc) {
      Meteor.defer(() => {
        if (auditor.isAuditStarted()) {
          auditor.documentRemoved(doc, userId, collectionName);
        }
      });
    });

    this._auditConfigs[collectionName] = config;
  }

};
