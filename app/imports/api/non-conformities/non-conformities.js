import { Mongo } from 'meteor/mongo';

import { NonConformitiesSchema } from './non-conformities-schema.js';
import { Standards } from '../standards/standards.js';


const NonConformities = new Mongo.Collection('NonConformities');
NonConformities.attachSchema(NonConformitiesSchema);

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
  }
});

export { NonConformities };
