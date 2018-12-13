import { Mongo } from 'meteor/mongo';
import { _ } from 'meteor/underscore';

import { RisksSchema } from '../schemas/risks-schema.js';
import { CollectionNames, riskScoreTypes } from '../constants.js';
import { WorkItems } from './work-items.js';
import { Standards } from './standards';


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
  },
  getScore() {
    const scores = Array.from(this.scores || []);
    scores.sort((score1, score2) => score2.scoredAt - score1.scoredAt);

    const getScoreByType = type => _(scores).find(s => s.scoreTypeId === type);

    return getScoreByType(riskScoreTypes.residual.id)
      || getScoreByType(riskScoreTypes.inherent.id);
  },
});

Risks.publicFields = {
  organizationId: 1,
  serialNumber: 1,
  sequentialId: 1,
  title: 1,
  typeId: 1,
  scores: 1,
  departmentsIds: 1,
  projectIds: 1,
  status: 1,
  viewedBy: 1,
  createdAt: 1,
  isDeleted: 1,
  deletedAt: 1,
  deletedBy: 1,
};

export { Risks };
