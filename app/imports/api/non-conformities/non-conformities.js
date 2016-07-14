import { Mongo } from 'meteor/mongo';

import { NonConformitiesSchema } from './non-conformities-schema.js';

const NonConformities = new Mongo.Collection('NonConformities');
NonConformities.attachSchema(NonConformitiesSchema);

NonConformities.helpers({
  isAnalysisCompleted() {
    const { status, completedAt, completedBy } = this.analysis;
    return (status === 1) && completedAt && completedBy;
  }
});

export { NonConformities };
