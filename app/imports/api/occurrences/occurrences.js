import { Mongo } from 'meteor/mongo';

import { OccurrencesSchema } from './occurrences-schema.js';

if (Meteor.isServer) {
  import OccurrenceAuditService from './server/occurrence-audit-service.js';
}


const Occurrences = new Mongo.Collection('Occurrences');
Occurrences.attachSchema(OccurrencesSchema);


// hooks

Occurrences.after.insert(function(userId, doc) {
  if (Meteor.isServer) {
    Meteor.defer(() => OccurrenceAuditService.documentCreated(doc));
  }
});

Occurrences.after.update(function(userId, doc, fieldNames, modifier, options) {
  if (Meteor.isServer) {
    Meteor.defer(() => OccurrenceAuditService.documentUpdated(doc, this.previous));
  }
});

Occurrences.after.remove(function(userId, doc) {
  if (Meteor.isServer) {
    Meteor.defer(() => OccurrenceAuditService.documentRemoved(doc, userId));
  }
});


export { Occurrences };
