import { Meteor } from 'meteor/meteor';

import { DocChangesKinds } from './utils/changes-kinds.js';
import DocChangeHandler from './utils/DocChangeHandler.js';


export default Auditor = {

  _auditConfigs: { },

  documentCreated(newDocument, userId, collection) {
    const config = this._auditConfigs[collection];

    new DocChangeHandler(config, DocChangesKinds.DOC_CREATED, {
      newDocument, userId
    }).handleChange();
  },

  documentUpdated(newDocument, oldDocument, collection) {
    const config = this._auditConfigs[collection];

    new DocChangeHandler(config, DocChangesKinds.DOC_UPDATED, {
      newDocument, oldDocument
    }).handleChange();
  },

  documentRemoved(oldDocument, userId, collection) {
    const config = this._auditConfigs[collection];

    new DocChangeHandler(config, DocChangesKinds.DOC_REMOVED, {
      oldDocument, userId
    }).handleChange();
  },

  registerConfig(config) {
    const collection = config.collection;
    const auditor = this;

    collection.after.insert(function(userId, doc) {
      Meteor.isServer && Meteor.defer(
        () => auditor.documentCreated(doc, userId, collection)
      );
    });

    collection.after.update(function(userId, doc, fieldNames, modifier, options) {
      Meteor.isServer && Meteor.defer(
        () => auditor.documentUpdated(doc, this.previous, collection)
      );
    });

    collection.after.remove(function(userId, doc) {
      Meteor.isServer && Meteor.defer(
        () => auditor.documentRemoved(doc, userId, collection)
      );
    });

    this._auditConfigs[collection] = config;
  }

};
