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
    return _.every([
      this.isCompleted === false,
      this.isVerified === false
    ]);
  },
  canCompletionBeUndone() {
    const completedAt = this.completedAt;

    if (!_.every([
          this.isCompleted === true,
          this.isVerified === false,
          _.isDate(completedAt)
        ])) {
      return false;
    }

    const undoDeadline = new Date(completedAt.getTime());
    undoDeadline.setHours(undoDeadline.getHours() + ActionUndoTimeInHours);

    return compareDates(undoDeadline, new Date()) === 1;
  },
  canBeVerified() {
    return _.every([
      this.isCompleted === true,
      this.isVerified === false
    ]);
  },
  canVerificationBeUndone() {
    const verifiedAt = this.verifiedAt;

    if (!(this.isVerified === true && _.isDate(verifiedAt))) {
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
    return _.every([
      this.isCompleted === true,
      !!this.completedAt,
      !!this.completedBy
    ]);
  },
  verified() {
    return _.every([
      this.isVerified === true,
      !!this.verifiedAt,
      !!this.verifiedBy
    ]);
  },
  verifiedAsEffective() {
    return this.verified() && (this.isVerifiedAsEffective === true);
  },
  deleted() {
    return _.every([
      this.isDeleted === true,
      !!this.deletedAt,
      !!this.deletedBy
    ]);
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
