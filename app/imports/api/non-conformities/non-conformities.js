import { Mongo } from 'meteor/mongo';

import { NonConformitiesSchema } from './non-conformities-schema.js';
import { CollectionNames } from '../constants.js';

if (Meteor.isServer) {
  import NCAuditService from './server/nc-audit-service.js';
}


const NonConformities = new Mongo.Collection(CollectionNames.NCS);
NonConformities.attachSchema(NonConformitiesSchema);


// helpers

NonConformities.helpers({
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
