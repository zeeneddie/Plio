import { Mongo } from 'meteor/mongo';

import { NonConformitiesSchema } from '../schemas/non-conformities-schema.js';
import { CollectionNames } from '../constants.js';
import { WorkItems } from './work-items.js';
import { Standards } from './standards';


const NonConformities = new Mongo.Collection(CollectionNames.NCS);
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
  },
  deleted() {
    const { isDeleted, deletedAt, deletedBy } = this;
    return (isDeleted === true) && deletedAt && deletedBy;
  },
  getWorkItems() {
    return WorkItems.find({ 'linkedDoc._id': this._id }).fetch();
  },
});

NonConformities.publicFields = {
  organizationId: 1,
  type: 1,
  serialNumber: 1,
  sequentialId: 1,
  title: 1,
  cost: 1,
  ref: 1,
  createdAt: 1,
  magnitude: 1,
  status: 1,
  departmentsIds: 1,
  viewedBy: 1,
  isDeleted: 1,
  deletedAt: 1,
  deletedBy: 1,
};


export { NonConformities };
