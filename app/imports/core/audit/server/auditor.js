import { Meteor } from 'meteor/meteor';

import { DocChangesKinds } from './utils/changes-kinds.js';
import DocChangeHandler from './utils/DocChangeHandler.js';


export default Auditor = {

  _auditConfigs: { },

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
      Meteor.isServer && Meteor.defer(
        () => auditor.documentCreated(doc, userId, collectionName)
      );
    });

    collection.after.update(function(userId, doc, fieldNames, modifier, options) {
      Meteor.isServer && Meteor.defer(
        () => auditor.documentUpdated(doc, this.previous, collectionName)
      );
    });

    collection.after.remove(function(userId, doc) {
      Meteor.isServer && Meteor.defer(
        () => auditor.documentRemoved(doc, userId, collectionName)
      );
    });

    this._auditConfigs[collectionName] = config;
  }

};
