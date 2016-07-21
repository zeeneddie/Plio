import { Mongo } from 'meteor/mongo';

import { ActionSchema } from './action-schema.js';
import { NonConformities } from '../non-conformities/non-conformities.js';
import { Risks } from '../risks/risks.js';
import {
  ActionUndoTimeInHours, ProblemMagnitudes,
  ProblemTypes, WorkflowTypes
} from '../constants.js';
import { compareDates } from '../helpers.js';


const Actions = new Mongo.Collection('Actions');
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
    return getLinkedDocsIds(this.linkedTo, ProblemTypes.NC);
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
    return isCompleted && isVerified;
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

    const undoDeadline = new Date(completedAt.getTime());
    undoDeadline.setHours(undoDeadline.getHours() + ActionUndoTimeInHours);

    return compareDates(undoDeadline, new Date()) === 1;
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

    const undoDeadline = new Date(verifiedAt.getTime());
    undoDeadline.setHours(undoDeadline.getHours() + ActionUndoTimeInHours);

    return compareDates(undoDeadline, new Date()) === 1;
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
  deleted() {
    const { isDeleted, deletedAt, deletedBy } = this;
    return (isDeleted === true) && deletedAt && deletedBy;
  },
  getWorkflowType() {
    const linkedDocs = this.getLinkedDocuments();

    if (linkedDocs.length === 0) {
      return WorkflowTypes.THREE_STEP;
    }

    const docsByMagnitude = _.groupBy(linkedDocs, doc => doc.magnitude);

    const withHighestMagnitude = docsByMagnitude[ProblemMagnitudes.CRITICAL]
        || docsByMagnitude[ProblemMagnitudes.MAJOR]
        || docsByMagnitude[ProblemMagnitudes.MINOR]
        || [];

    const docsByWorkflowType = _.groupBy(withHighestMagnitude, doc => doc.workflowType);

    const withHighestWorkflow = docsByWorkflowType[WorkflowTypes.SIX_STEP]
        || docsByWorkflowType[WorkflowTypes.THREE_STEP]
        || [];

    return (withHighestWorkflow.length && withHighestWorkflow[0].workflowType)
        || WorkflowTypes.THREE_STEP;
  }
});

export { Actions };
