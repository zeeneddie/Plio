import { Mongo } from 'meteor/mongo';
import moment from 'moment-timezone';

import { ActionSchema } from '../schemas/action-schema.js';
import { NonConformities } from './non-conformities.js';
import { Risks } from './risks.js';
import { WorkItems } from './work-items.js';
import {
  ActionUndoTimeInHours, ProblemMagnitudes,
  ProblemTypes, WorkflowTypes, CollectionNames
} from '../constants.js';


const Actions = new Mongo.Collection(CollectionNames.ACTIONS);
Actions.attachSchema(ActionSchema);


const getLinkedDocsIds = (linkedDocs, docType) => {
  return _.pluck(
    _.filter(
      linkedDocs,
      ({ documentType }) => documentType === docType
    ),
    'documentId'
  );
};

Actions.helpers({
  getLinkedNCsIds() {
    return getLinkedDocsIds(this.linkedTo, ProblemTypes.NON_CONFORMITY);
  },
  getLinkedNCs() {
    return NonConformities.find({
      _id: {
        $in: this.getLinkedNCsIds()
      }
    }).fetch();
  },
  getLinkedRisksIds() {
    return getLinkedDocsIds(this.linkedTo, ProblemTypes.RISK);
  },
  getLinkedRisks() {
    return Risks.find({
      _id: {
        $in: this.getLinkedRisksIds()
      }
    }).fetch();
  },
  getLinkedDocuments() {
    return this.getLinkedNCs().concat(this.getLinkedRisks());
  },
  canBeCompleted() {
    const { isCompleted, isVerified } = this;
    return (isCompleted === false) && (isVerified === false);
  },
  canCompletionBeUndone() {
    const { isCompleted, isVerified, completedAt } = this;

    if (!_.every([
          isCompleted === true,
          isVerified === false,
          _.isDate(completedAt)
        ])) {
      return false;
    }

    const undoDeadline = moment(completedAt).add(ActionUndoTimeInHours, 'hours');

    return undoDeadline.isAfter(new Date());
  },
  canBeVerified() {
    const { isCompleted, isVerified } = this;
    return (isCompleted === true) && (isVerified === false);
  },
  canVerificationBeUndone() {
    const { isVerified, verifiedAt } = this;

    if (!(isVerified === true && _.isDate(verifiedAt))) {
      return false;
    }

    const undoDeadline = moment(verifiedAt).add(ActionUndoTimeInHours, 'hours');

    return undoDeadline.isAfter(new Date());
  },
  isLinkedToDocument(docId, docType) {
    return !!_.find(this.linkedTo, ({ documentId, documentType }) => {
      return (documentId === docId) && (documentType === docType);
    });
  },
  completed() {
    const { isCompleted, completedAt, completedBy } = this;
    return (isCompleted === true) && completedAt && completedBy;
  },
  verified() {
    const { isVerified, verifiedAt, verifiedBy } = this;
    return (isVerified === true) && verifiedAt && verifiedBy;
  },
  verifiedAsEffective() {
    return this.verified() && (this.isVerifiedAsEffective === true);
  },
  failedVerification() {
    return this.verified() && (this.isVerifiedAsEffective === false);
  },
  deleted() {
    const { isDeleted, deletedAt, deletedBy } = this;
    return (isDeleted === true) && deletedAt && deletedBy;
  },
  getWorkflowType() {
    // Action has 6-step workflow if at least one linked document has 6-step workflow
    const { linkedTo } = this;

    if (!linkedTo || !linkedTo.length) {
      return WorkflowTypes.THREE_STEP;
    }

    const query = {
      isDeleted: false,
      deletedAt: { $exists: false },
      deletedBy: { $exists: false },
      workflowType: WorkflowTypes.SIX_STEP
    };

    const ncQuery = _.extend({ _id: { $in: this.getLinkedNCsIds() } }, query);
    const riskQuery = _.extend({ _id: { $in: this.getLinkedRisksIds() } }, query);

    const sixStepDoc = NonConformities.findOne(ncQuery) || Risks.findOne(riskQuery);

    return sixStepDoc ? WorkflowTypes.SIX_STEP : WorkflowTypes.THREE_STEP;
  },
  getWorkItems() {
    return WorkItems.find({ 'linkedDoc._id': this._id }).fetch();
  },
  getWorkItemsIds() {
    return WorkItems.find({ 'linkedDoc._id': this._id }).map(doc => doc._id);
  },
});

Actions.publicFields = {
  organizationId: 1,
  serialNumber: 1,
  sequentialId: 1,
  title: 1,
  linkedTo: 1,
  type: 1,
  status: 1,
  ownerId: 1,
  isCompleted: 1,
  completionTargetDate: 1,
  toBeCompletedBy: 1,
  viewedBy: 1,
  createdAt: 1,
  isDeleted: 1,
  deletedAt: 1,
  deletedBy: 1,
};

export { Actions };
