import { Meteor } from 'meteor/meteor';

import DocumentDiffer from './document-differ.js';


export default {

  _auditConfigs: { },

  documentCreated(newDocument, userId, collection) {

  },

  documentUpdated(newDocument, oldDocument, collection) {

  },

  documentRemoved(oldDocument, userId, collection) {

  },

  registerConfig(config, collection) {
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
