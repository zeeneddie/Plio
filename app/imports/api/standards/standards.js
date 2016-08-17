import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { StandardsSchema } from './standards-schema.js';
import { CollectionNames } from '../constants.js';
import StandardAuditService from './standard-audit-service.js';


const Standards = new Mongo.Collection(CollectionNames.STANDARDS);
Standards.attachSchema(StandardsSchema);


// hooks

Standards.after.insert(function(userId, doc) {
  if (Meteor.isServer) {
    Meteor.defer(() => StandardAuditService.documentCreated(doc));
  }
});

Standards.after.update(function(userId, doc, fieldNames, modifier, options) {
  if (Meteor.isServer) {
    Meteor.defer(() => StandardAuditService.documentUpdated(doc, this.previous));
  }
});

Standards.after.remove(function(userId, doc) {
  if (Meteor.isServer) {
    Meteor.defer(() => StandardAuditService.documentRemoved(doc, userId));
  }
});


export { Standards };
