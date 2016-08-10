import { Mongo } from 'meteor/mongo';

import { NonConformitiesSchema } from './non-conformities-schema.js';
import { CollectionNames } from '../constants.js';
import ProblemsHelpers from '../problems/problems-helpers.js';
import NCAuditService from './nc-audit-service.js';


const NonConformities = new Mongo.Collection(CollectionNames.NCS);
NonConformities.attachSchema(NonConformitiesSchema);

NonConformities.helpers(_.extend({}, ProblemsHelpers));


// hooks

NonConformities.after.insert(function(userId, doc) {
  if (Meteor.isServer) {
    Meteor.defer(() => NCAuditService.documentCreated(doc));
  }
});

NonConformities.after.update(function(userId, doc, fieldNames, modifier, options) {
  if (Meteor.isServer) {
    Meteor.defer(() => NCAuditService.documentUpdated(doc, this.previous));
  }
});

NonConformities.after.remove(function(userId, doc) {
  if (Meteor.isServer) {
    Meteor.defer(() => NCAuditService.documentRemoved(doc, userId));
  }
});


export { NonConformities };
