import { Mongo } from 'meteor/mongo';

import { RisksSchema } from './risks-schema.js';
import { CollectionNames } from '../constants.js';
import ProblemsHelpers from '../problems/problems-helpers.js';
import RiskAuditService from './risk-audit-service.js';


const Risks = new Mongo.Collection(CollectionNames.RISKS);
Risks.attachSchema(RisksSchema);

Risks.helpers(_.extend({}, ProblemsHelpers));


// hooks

Risks.after.insert(function(userId, doc) {
  if (Meteor.isServer) {
    Meteor.defer(() => RiskAuditService.documentCreated(doc));
  }
});

Risks.after.update(function(userId, doc, fieldNames, modifier, options) {
  if (Meteor.isServer) {
    Meteor.defer(() => RiskAuditService.documentUpdated(doc, this.previous));
  }
});

Risks.after.remove(function(userId, doc) {
  if (Meteor.isServer) {
    Meteor.defer(() => RiskAuditService.documentRemoved(doc, userId));
  }
});


export { Risks };
