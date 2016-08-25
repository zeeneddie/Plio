import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { RisksSchema } from './risks-schema.js';
import { CollectionNames } from '../constants.js';

if (Meteor.isServer) {
  import RiskAuditService from './server/risk-audit-service.js';
}



const Risks = new Mongo.Collection(CollectionNames.RISKS);
Risks.attachSchema(RisksSchema);


// helpers

Risks.helpers({
  isAnalysisCompleted() {
    const { status, completedAt, completedBy } = this.analysis || {};
    return (status === 1) && completedAt && completedBy;
  },
  areStandardsUpdated() {
    const { status, completedAt, completedBy } = this.updateOfStandards || {};
    return (status === 1) && completedAt && completedBy;
  },
  getLinkedStandards() {
    return Standards.find({ _id: { $in: this.standardsIds } }).fetch();
  },
  deleted() {
    const { isDeleted, deletedAt, deletedBy } = this;
    return (isDeleted === true) && deletedAt && deletedBy;
  },
  getWorkItems() {
    return WorkItems.find({ 'linkedDoc._id': this._id }).fetch();
  }
});


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
