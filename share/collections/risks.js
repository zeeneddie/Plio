import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { RisksSchema } from '../schemas/risks-schema.js';
import { CollectionNames } from '../constants.js';
import { WorkItems } from './work-items.js';


const Risks = new Mongo.Collection(CollectionNames.RISKS);
Risks.attachSchema(RisksSchema);


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


export { Risks };
